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
        rental?: boolean;
        verified?: boolean;
        description?: string;
        website?: string;
    };
    source_locale?: string;
    createdAt?: string;
    average_rating?: number;
    rating_count?: number;
    spot_visits?: { id: string; visit_date: string; visit_time: string; }[];
}

export interface DbSpot {
    id: string;
    name: string;
    status: Spot['status'];
    lng: number;
    lat: number;
    attributes: Spot['attributes'];
    source_locale?: string;
    created_at: string;
    average_rating?: number;
    rating_count?: number;
}

interface DbSpotWithVisits extends DbSpot {
    spot_visits?: { id: string; visit_date: string; visit_time: string; }[];
}

export async function getSpots(): Promise<Spot[]> {
    const supabase = await createClient();
    try {
        // Try fetching with source_locale and spot_visits first
        let fetchRes = await supabase
            .from("spots")
            .select(`
                id, name, status, attributes, created_at, lat, lng,
                average_rating, rating_count, source_locale,
                spot_visits(id, visit_date, visit_time)
            `);
        let data = fetchRes.data as DbSpotWithVisits[] | null;
        let error = fetchRes.error;

        // Graceful fallback if spot_visits table does not exist yet
        if (error && (error.message.includes("spot_visits") || error.message.includes("relation"))) {
            console.warn("DB Schema fallback: spot_visits table not created yet. Fetching without visits.");
            fetchRes = await supabase
                .from("spots")
                .select(`
                    id, name, status, attributes, created_at, lat, lng,
                    average_rating, rating_count, source_locale
                `);
            data = fetchRes.data as DbSpotWithVisits[] | null;
            error = fetchRes.error;
        }

        // If source_locale is missing, try without it
        if (error && error.message.includes("source_locale")) {
            console.warn("DB Schema out of sync: source_locale missing. Fetching basic data.");
            const basicFetch = await supabase
                .from("spots")
                .select(`
                    id, name, status, attributes, created_at, lat, lng,
                    average_rating, rating_count
                `);
            data = basicFetch.data as DbSpotWithVisits[] | null;
            error = basicFetch.error;
        }

        if (error) {
            console.warn("Supabase Fetch Error:", error.message);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        const todayStr = new Date().toISOString().split('T')[0];

        return (data || []).map((d: DbSpotWithVisits) => {
            const activeVisits = (d.spot_visits || []).filter(v => v.visit_date >= todayStr);
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
                rating_count: d.rating_count,
                spot_visits: activeVisits
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
        const dbData: Record<string, unknown> = {
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
                return { success: true, data: formatSpot(basic.data as DbSpot) };
            }
            throw error;
        }

        return { success: true, data: formatSpot(data as DbSpot) };
    } catch (error) {
        console.error("Create Spot Exception:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: message };
    }
}

function formatSpot(data: DbSpot): Spot {
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

export async function createSpotVisit(visit: {
    spot_id: string;
    visit_date: string;
    visit_time: string;
    description: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const { data, error } = await supabase
        .from("spot_visits")
        .insert([{
            spot_id: visit.spot_id,
            user_id: user.id,
            visit_date: visit.visit_date,
            visit_time: visit.visit_time,
            description: visit.description
        }])
        .select()
        .single();
        
    if (error) {
        console.error("Create Spot Visit Error:", error);
        return { success: false, error: error.message };
    }
    
    try {
        await supabase
            .from("visit_participants")
            .insert([{
                visit_id: data.id,
                user_id: user.id,
                status: 'JOINED'
            }]);
    } catch (partErr) {
        console.warn("Could not auto-join creator (migration not run yet):", partErr);
    }
    
    return { success: true, data };
}

export async function addVisitComment(comment: {
    visit_id: string;
    comment: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    // 1. Insert the comment
    const { data: newComment, error } = await supabase
        .from("visit_comments")
        .insert([{
            visit_id: comment.visit_id,
            user_id: user.id,
            comment: comment.comment
        }])
        .select()
        .single();
        
    if (error) {
        console.error("Create Visit Comment Error:", error);
        return { success: false, error: error.message };
    }
    
    try {
        // 2. Fetch the related visit and spot details
        const { data: visitData } = await supabase
            .from("spot_visits")
            .select(`
                id, visit_date, visit_time, user_id, spot_id,
                spots(name)
            `)
            .eq("id", comment.visit_id)
            .single();
            
        if (visitData && visitData.user_id !== user.id) {
            // Check if this is the FIRST comment from another user on this event
            const { count } = await supabase
                .from("visit_comments")
                .select("id", { count: "exact", head: true })
                .eq("visit_id", comment.visit_id)
                .neq("user_id", visitData.user_id)
                .neq("id", newComment.id); // exclude the current one
                
            if (count === 0) {
                // This is the first reply from a third party! Trigger email!
                // Fetch creator's email via secure database RPC function
                const { data: creatorEmail } = await supabase
                    .rpc("get_profile_email", { profile_id: visitData.user_id });
                
                // Fetch commenter's username
                const { data: commenterProfile } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("id", user.id)
                    .single();
                
                const { sendVisitNotificationEmail } = await import("@/lib/email");
                
                await sendVisitNotificationEmail({
                    creatorEmail: creatorEmail || "carlo@efoilmap.com",
                    visitorUsername: commenterProfile?.username || "eFoiler",
                    spotName: (visitData?.spots as unknown as { name: string } | null)?.name || "Spot",
                    eventDate: visitData.visit_date,
                    eventTime: visitData.visit_time,
                    commentText: comment.comment,
                    spotId: visitData.spot_id || "",
                    visitId: visitData.id
                });
            }
        }
    } catch (emailErr) {
        console.error("Simulated Email notification error:", emailErr);
    }
    
    return { success: true, data: newComment };
}

export async function joinOrCancelVisit(visitId: string, status: 'JOINED' | 'CANCELLED') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const { data: existing, error: checkError } = await supabase
        .from("visit_participants")
        .select("id")
        .eq("visit_id", visitId)
        .eq("user_id", user.id)
        .maybeSingle();
        
    if (checkError) {
        console.error("Check participant error:", checkError);
        return { success: false, error: checkError.message };
    }
    
    if (existing) {
        const { error: updateError } = await supabase
            .from("visit_participants")
            .update({ status })
            .eq("id", existing.id);
            
        if (updateError) {
            console.error("Update participant error:", updateError);
            return { success: false, error: updateError.message };
        }
    } else {
        const { error: insertError } = await supabase
            .from("visit_participants")
            .insert([{
                visit_id: visitId,
                user_id: user.id,
                status
            }]);
            
        if (insertError) {
            console.error("Insert participant error:", insertError);
            return { success: false, error: insertError.message };
        }
    }
    
    return { success: true };
}

export async function deleteSpotVisit(visitId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const { error } = await supabase
        .from("spot_visits")
        .delete()
        .eq("id", visitId)
        .eq("user_id", user.id);
        
    if (error) {
        console.error("Delete spot visit error:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function updateVisitComment(commentId: string, commentText: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const { error } = await supabase
        .from("visit_comments")
        .update({ comment: commentText })
        .eq("id", commentId)
        .eq("user_id", user.id);
        
    if (error) {
        console.error("Update visit comment error:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function deleteVisitComment(commentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const isAdmin = user.email === 'callematic@gmail.com';
    
    let query = supabase.from("visit_comments").delete().eq("id", commentId);
    
    if (!isAdmin) {
        query = query.eq("user_id", user.id);
    }
    
    const { error } = await query;
        
    if (error) {
        console.error("Delete visit comment error:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function updateSpotReview(reviewId: string, rating: number, comment: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const { error } = await supabase
        .from("spot_verifications")
        .update({ rating, comment })
        .eq("id", reviewId)
        .eq("user_id", user.id);
        
    if (error) {
        console.error("Update spot review error:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function deleteSpotReview(reviewId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const isAdmin = user.email === 'callematic@gmail.com';
    
    let query = supabase.from("spot_verifications").delete().eq("id", reviewId);
    
    if (!isAdmin) {
        query = query.eq("user_id", user.id);
    }
    
    const { error } = await query;
        
    if (error) {
        console.error("Delete spot review error:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function updateLastReadNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, error: "Not authenticated" };
    
    const { error } = await supabase
        .from("profiles")
        .update({ last_read_notifications_at: new Date().toISOString() })
        .eq("id", user.id);
        
    if (error) {
        console.error("Update last read notifications error:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function getLastReadNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, data: null };
    
    const { data, error } = await supabase
        .from("profiles")
        .select("last_read_notifications_at")
        .eq("id", user.id)
        .single();
        
    if (error) {
        console.error("Get last read notifications error:", error);
        return { success: false, data: null };
    }
    
    return { success: true, data: data.last_read_notifications_at };
}
