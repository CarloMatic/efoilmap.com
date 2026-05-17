"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { generateSlug } from "@/lib/utils";

export interface Spot {
    id: string;
    name: string;
    slug?: string; // Human-readable URL identifier
    status: "ALLOWED" | "TOLERATED" | "FORBIDDEN" | "UNCLEAR";
    location: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };
    attributes: {
        parking?: boolean;
        parking_distance?: "<10m" | "<50m" | "<100m" | ">100m";
        charging?: boolean;
        food?: boolean;
        verified?: boolean;
        description?: string;
    };
    source_locale?: string;
    createdAt?: string;
    average_rating?: number;
    rating_count?: number;
}

export async function getSpots(): Promise<Spot[]> {
    const supabase = await createClient();
    try {
        // Try fetching with source_locale first
        let { data, error } = await supabase
            .from("spots")
            .select(`
                id, name, status, attributes, created_at, lat, lng,
                average_rating, rating_count, source_locale
            `);

        // If source_locale is missing, try without it
        if (error && error.message.includes("source_locale")) {
            console.warn("DB Schema out of sync: source_locale missing. Fetching basic data.");
            const basicFetch = await supabase
                .from("spots")
                .select(`
                    id, name, status, attributes, created_at, lat, lng,
                    average_rating, rating_count
                `);
            data = basicFetch.data as any[];
            error = basicFetch.error;
        }

        if (error) {
            console.warn("Supabase Fetch Error:", error.message);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        return (data || []).map((d: Record<string, any>) => {
            const s: Spot = {
                id: d.id,
                name: d.name,
                status: d.status,
                location: {
                    type: "Point",
                    coordinates: [d.lng, d.lat]
                },
                attributes: d.attributes,
                source_locale: d.source_locale,
                createdAt: d.created_at,
                average_rating: d.average_rating,
                rating_count: d.rating_count
            };
            s.slug = generateSlug(s);
            return s;
        });
    } catch (err) {
        console.warn("Fetch Exception:", err);
        return [];
    }
}

export async function updateSpot(spotId: string, data: Partial<Spot>, token?: string) {
    const supabase = await createClient();
    
    // Auth Check: Try token first, then getSession
    let user = null;
    let authError = null;
    
    if (token) {
        const res = await supabase.auth.getUser(token);
        user = res.data.user;
        authError = res.error;
    }
    
    if (!user) {
        // Fallback to cookies
        const res = await supabase.auth.getUser();
        user = res.data.user;
        if (!authError && res.error) authError = res.error;
    }
    
    if (!user) {
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user || null;
    }
    if (!user) return { success: false, error: "Unauthorized: Please sign in first." };

    // DB Client: Use token explicitly for RLS
    const dbClient = token ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    ) : supabase;

    try {
        const dbData: Record<string, unknown> = {};
        if (data.name) dbData.name = data.name;
        if (data.status) dbData.status = data.status;
        if (data.attributes) dbData.attributes = data.attributes;

        const { error } = await dbClient
            .from("spots")
            .update(dbData)
            .eq("id", spotId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch {
        return { success: false, error: "Update failed" };
    }
}

function getMockSpots(): Spot[] {
    return [
        {
            id: "1",
            name: "Rursee Example",
            status: "TOLERATED",
            location: { type: "Point", coordinates: [6.38, 50.60] }, // Near Aachen
            attributes: { parking: true },
        },
        {
            id: "2",
            name: "Forbidden Zone",
            status: "FORBIDDEN",
            location: { type: "Point", coordinates: [6.1, 50.8] },
            attributes: {},
        },
        {
            id: "3",
            name: "Official E-Foil Harbor",
            status: "ALLOWED",
            location: { type: "Point", coordinates: [6.05, 50.75] },
            attributes: { charging: true },
        },
    ];
}

export async function createSpot(spotData: Omit<Spot, "id" | "createdAt">, token?: string) {
    const supabase = await createClient();

    // Auth Check: Try token first, then getUser, then getSession
    let user = null;
    let authError = null;

    if (token) {
        const res = await supabase.auth.getUser(token);
        user = res.data.user;
        authError = res.error;
    }

    if (!user) {
        // Fallback to cookies
        console.warn("Server Auth: Token missing or invalid, falling back to cookies...");
        const res = await supabase.auth.getUser();
        user = res.data.user;
        if (!authError && res.error) authError = res.error;
    }
    
    if (!user) {
        console.warn("Server Auth: getUser failed, trying getSession fallback...");
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user || null;
    }
    
    if (!user) {
        console.warn("Unauthorized Attempt: No user found in cookies after multiple checks.");
        if (authError) console.error("Last Auth Error:", authError);
        return { success: false, error: "Unauthorized: Please sign in to add spots." };
    }

    // DB Client: Use token explicitly for RLS
    const dbClient = token ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    ) : supabase;

    try {
        const dbData: Record<string, any> = {
            name: spotData.name,
            status: spotData.status,
            lat: spotData.location.coordinates[1],
            lng: spotData.location.coordinates[0],
            attributes: spotData.attributes,
            user_id: user.id
        };

        // Try inserting with new columns
        const { data, error } = await dbClient
            .from("spots")
            .insert([{ ...dbData, source_locale: spotData.source_locale || 'en' }])
            .select()
            .single();

        if (error) {
            // If error is due to missing columns, fallback to basic insert
            if (error.message.includes("column")) {
                console.warn("DB Schema fallback: inserting without source_locale/user_id");
                const basic = await dbClient.from("spots").insert([dbData]).select().single();
                if (basic.error) throw basic.error;
                return { success: true, data: formatSpot(basic.data) };
            }
            throw error;
        }

        return { success: true, data: formatSpot(data) };
    } catch (error: any) {
        console.error("Create Spot Exception:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
}

function formatSpot(data: any): Spot {
    const s: Spot = {
        id: data.id,
        name: data.name,
        status: data.status,
        location: {
            type: "Point",
            coordinates: [data.lng, data.lat]
        },
        attributes: data.attributes,
        source_locale: data.source_locale,
        createdAt: data.created_at
    };
    s.slug = generateSlug(s);
    return s;
}

export async function verifySpot(spotId: string, rating?: number, comment?: string, token?: string) {
    const supabase = await createClient();

    // Auth Check: Try token first, then getSession
    let user = null;
    let authError = null;
    
    if (token) {
        const res = await supabase.auth.getUser(token);
        user = res.data.user;
        authError = res.error;
    }
    
    if (!user) {
        // Fallback to cookies
        const res = await supabase.auth.getUser();
        user = res.data.user;
        if (!authError && res.error) authError = res.error;
    }
    
    if (!user) {
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user || null;
    }
    if (!user) return { success: false, error: "Unauthorized: Please sign in to verify spots." };

    // DB Client: Use token explicitly for RLS
    const dbClient = token ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    ) : supabase;

    try {
        const payload: Record<string, unknown> = { 
            spot_id: spotId,
            user_id: user.id
        };
        if (rating) payload.rating = rating;
        if (comment) payload.comment = comment;

        // Check if user already verified this spot
        const { data: existing } = await dbClient
            .from("spot_verifications")
            .select("id")
            .eq("spot_id", spotId)
            .eq("user_id", user.id)
            .single();

        let error;

        if (existing) {
            // Update existing review
            const res = await dbClient
                .from("spot_verifications")
                .update(payload)
                .eq("id", existing.id);
            error = res.error;
        } else {
            // Insert new review
            const res = await dbClient
                .from("spot_verifications")
                .insert([payload])
                .select()
                .single();
            error = res.error;
        }

        if (error) {
            // Fallback: If foreign key constraint fails, try inserting without user_id
            if (error.message.includes("foreign key constraint")) {
                console.warn("DB FK Schema fallback: inserting without user_id");
                delete payload.user_id;
                const fallbackRes = await dbClient.from("spot_verifications").insert([payload]).select().single();
                if (fallbackRes.error) {
                    console.error("Fallback Verification Error:", fallbackRes.error);
                    return { success: false, error: fallbackRes.error.message };
                }
                return { success: true };
            }
            console.error("Verification Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Verify Exception:", error);
        return { success: false, error: "Network error" };
    }
}
