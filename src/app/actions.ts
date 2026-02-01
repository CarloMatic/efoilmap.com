"use server";

import { supabase } from "@/lib/supabase";

export interface Spot {
    id: string;
    name: string;
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
    };
    createdAt?: string;
    average_rating?: number;
    rating_count?: number;
}

export async function getSpots(bounds?: any): Promise<Spot[]> {
    try {
        // Fetch spots with verifications to calc rating
        const { data, error } = await supabase
            .from("spots")
            .select(`
                id, name, status, location, attributes, created_at,
                spot_verifications (rating)
            `);

        if (error) {
            console.error("Supabase Error:", error);
            return getMockSpots();
        }

        if (!data || data.length === 0) {
            return getMockSpots();
        }

        return data.map((d: any) => {
            const ratings = d.spot_verifications?.map((v: any) => v.rating).filter((r: any) => r);
            const avg = ratings.length > 0 ? ratings.reduce((a: any, b: any) => a + b, 0) / ratings.length : 0;

            return {
                ...d,
                // fix geojson if raw
                location: typeof d.location === 'string' ? JSON.parse(d.location) : d.location,
                average_rating: avg,
                rating_count: ratings.length
            };
        }) as any;
    } catch (e) {
        console.error("Fetch Error:", e);
        return getMockSpots();
    }
}

// ... createSpot ...

export async function updateSpot(spotId: string, data: Partial<Spot>) {
    try {
        const dbData: any = {};
        if (data.name) dbData.name = data.name;
        if (data.status) dbData.status = data.status;
        if (data.attributes) dbData.attributes = data.attributes;

        // Location update logic could go here if needed

        const { error } = await supabase
            .from("spots")
            .update(dbData)
            .eq("id", spotId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch (e) {
        return { success: false, error: "Update failed" };
    }
}

// ... verifySpot ...

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

export async function createSpot(spotData: Omit<Spot, "id" | "createdAt">) {
    try {
        const dbData = {
            name: spotData.name,
            status: spotData.status,
            lat: spotData.location.coordinates[1],
            lng: spotData.location.coordinates[0],
            attributes: spotData.attributes
        };

        const { data, error } = await supabase
            .from("spots")
            .insert([dbData])
            .select()
            .single();

        if (error) {
            console.error("Create Spot Error:", error);
            return { success: false, error: error.message };
        }

        // Format the return data to match the Spot interface (Map.tsx expects this structure)
        const newSpot: Spot = {
            id: data.id,
            name: data.name,
            status: data.status,
            location: {
                type: "Point",
                coordinates: [data.lng, data.lat]
            },
            attributes: data.attributes,
            createdAt: data.created_at
        };

        return { success: true, data: newSpot };
    } catch (e) {
        console.error("Create Spot Exception:", e);
        return { success: false, error: "Unknown error" };
    }
}

export async function verifySpot(spotId: string, rating?: number, comment?: string) {
    try {
        const payload: any = { spot_id: spotId };
        if (rating) payload.rating = rating;
        if (comment) payload.comment = comment;

        const { data, error } = await supabase
            .from("spot_verifications")
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error("Verification Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        console.error("Verify Exception:", e);
        return { success: false, error: "Network error" };
    }
}
