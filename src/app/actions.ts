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
    user_id?: string;
    created_by?: string;
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
    user_id?: string;
    created_by?: string;
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
                average_rating, rating_count, source_locale, user_id, created_by,
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
                    average_rating, rating_count, source_locale, user_id, created_by
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
                    average_rating, rating_count, user_id, created_by
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
                spot_visits: activeVisits,
                user_id: d.user_id,
                created_by: d.created_by
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

    // Server-side security check: Only creator or admin can update
    const isAdmin = user.email === 'callematic@gmail.com';
    const { data: existingSpot, error: fetchError } = await dbClient
        .from("spots")
        .select("user_id, created_by")
        .eq("id", spotId)
        .maybeSingle();

    if (fetchError || !existingSpot) {
        return { success: false, error: "Spot not found or error retrieving details." };
    }

    const isCreator = existingSpot.user_id === user.id || existingSpot.created_by === user.id || isAdmin;
    if (!isCreator) {
        return { success: false, error: "Unauthorized: Only the spot creator or an admin can edit this spot." };
    }

    try {
        const dbData: Record<string, unknown> = {};
        if (data.name) dbData.name = data.name;
        if (data.status) dbData.status = data.status;
        if (data.attributes) dbData.attributes = data.attributes;
        if (data.location) {
            dbData.lng = data.location.coordinates[0];
            dbData.lat = data.location.coordinates[1];
        }

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

export async function deleteSpot(spotId: string, token?: string) {
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

    // Server-side security check: Only creator or admin can delete
    const isAdmin = user.email === 'callematic@gmail.com';
    const { data: existingSpot, error: fetchError } = await dbClient
        .from("spots")
        .select("user_id, created_by")
        .eq("id", spotId)
        .maybeSingle();

    if (fetchError || !existingSpot) {
        return { success: false, error: "Spot not found or error retrieving details." };
    }

    const isCreator = existingSpot.user_id === user.id || existingSpot.created_by === user.id || isAdmin;
    if (!isCreator) {
        return { success: false, error: "Unauthorized: Only the spot creator or an admin can delete this spot." };
    }

    try {
        const { error } = await dbClient
            .from("spots")
            .delete()
            .eq("id", spotId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    } catch {
        return { success: false, error: "Deletion failed" };
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
            user_id: user.id,
            created_by: user.id
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
        createdAt: data.created_at,
        user_id: data.user_id,
        created_by: data.created_by
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
                // Fetch creator's email and preferences
                const { data: creatorProfile } = await supabase
                    .from("profiles")
                    .select("email_pref_visits")
                    .eq("id", visitData.user_id)
                    .single();

                if (creatorProfile?.email_pref_visits !== false) {
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

// 5. Spot Likes Server Actions
export async function toggleLikeSpot(spotId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized: Please sign in to like spots." };

    try {
        // Check if already liked
        const { data: existingLike, error: fetchErr } = await supabase
            .from("spot_likes")
            .select("id")
            .eq("spot_id", spotId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existingLike) {
            // Unlike
            const { error: deleteErr } = await supabase
                .from("spot_likes")
                .delete()
                .eq("id", existingLike.id);
            if (deleteErr) throw deleteErr;
            return { success: true, action: "unliked" };
        } else {
            // Like
            const { error: insertErr } = await supabase
                .from("spot_likes")
                .insert([{ spot_id: spotId, user_id: user.id }]);
            if (insertErr) throw insertErr;
            return { success: true, action: "liked" };
        }
    } catch (err) {
        console.error("Toggle like error:", err);
        return { success: false, error: err instanceof Error ? err.message : "Unknown database error" };
    }
}

export async function getSpotLikesCount(spotId: string): Promise<number> {
    const supabase = await createClient();
    try {
        const { count, error } = await supabase
            .from("spot_likes")
            .select("id", { count: "exact", head: true })
            .eq("spot_id", spotId);

        if (error) throw error;
        return count || 0;
    } catch (err) {
        console.error("Get spot likes count error:", err);
        return 0;
    }
}

export async function getSpotLikeStatus(spotId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
        const { data, error } = await supabase
            .from("spot_likes")
            .select("id")
            .eq("spot_id", spotId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (error) throw error;
        return !!data;
    } catch (err) {
        console.error("Get spot like status error:", err);
        return false;
    }
}


// 6. Spot Bookmarks Server Actions (Merkliste)
export async function toggleBookmarkSpot(spotId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized: Please sign in to save spots." };

    try {
        // Check if already bookmarked
        const { data: existingBookmark, error: fetchErr } = await supabase
            .from("spot_bookmarks")
            .select("id")
            .eq("spot_id", spotId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existingBookmark) {
            // Unbookmark
            const { error: deleteErr } = await supabase
                .from("spot_bookmarks")
                .delete()
                .eq("id", existingBookmark.id);
            if (deleteErr) throw deleteErr;
            return { success: true, action: "unbookmarked" };
        } else {
            // Bookmark
            const { error: insertErr } = await supabase
                .from("spot_bookmarks")
                .insert([{ spot_id: spotId, user_id: user.id }]);
            if (insertErr) throw insertErr;
            return { success: true, action: "bookmarked" };
        }
    } catch (err) {
        console.error("Toggle bookmark error:", err);
        return { success: false, error: err instanceof Error ? err.message : "Unknown database error" };
    }
}

export async function getUserBookmarks(): Promise<Spot[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
        const { data, error } = await supabase
            .from("spot_bookmarks")
            .select(`
                spot_id,
                spots(
                    id, name, status, attributes, created_at, lat, lng,
                    average_rating, rating_count, source_locale
                )
            `)
            .eq("user_id", user.id);

        if (error) throw error;
        if (!data) return [];

        const todayStr = new Date().toISOString().split('T')[0];

        return data
            .map((item: any) => {
                const s = item.spots;
                if (!s) return null;
                const spot: Spot = {
                    id: s.id,
                    name: s.name,
                    status: s.status,
                    location: {
                        type: "Point",
                        coordinates: [s.lng, s.lat]
                    },
                    attributes: s.attributes,
                    source_locale: s.source_locale,
                    createdAt: s.created_at,
                    average_rating: s.average_rating,
                    rating_count: s.rating_count
                };
                spot.slug = generateSlug(spot);
                return spot;
            })
            .filter((s): s is Spot => s !== null);
    } catch (err) {
        console.error("Get user bookmarks error:", err);
        return [];
    }
}


// 7. Clickable User Profile Server Action
export interface ProfileReviewReply {
    id: string;
    review_id: string;
    author_id: string;
    reply: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
    };
}

export interface ProfileReview {
    id: string;
    target_profile_id: string;
    author_id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
    };
    reply?: ProfileReviewReply | null;
}

export interface UserProfileData {
    profile: {
        id: string;
        username: string;
        avatar_url: string | null;
        bio: string | null;
        created_at: string;
        locale?: string;
        email_pref_visits?: boolean;
        email_pref_questions?: boolean;
        ai_translation_enabled?: boolean;
    };
    spots: Spot[];
    visits: {
        id: string;
        spot_id: string;
        spot_name: string;
        visit_date: string;
        visit_time: string;
        description: string;
    }[];
    likesCount: number;
    hasLiked: boolean;
    reviews: ProfileReview[];
}

export async function getUserProfileData(profileId: string): Promise<UserProfileData | null> {
    const supabase = await createClient();
    try {
        // 1. Get profile details
        const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("id, username, avatar_url, bio, created_at, locale, email_pref_visits, email_pref_questions, ai_translation_enabled")
            .eq("id", profileId)
            .maybeSingle();

        if (profileErr || !profile) {
            console.error("Error fetching user profile:", profileErr);
            return null;
        }

        // 2. Get spots contributed by this user (check both created_by and user_id fallback)
        const { data: spotsData, error: spotsErr } = await supabase
            .from("spots")
            .select(`
                id, name, status, attributes, created_at, lat, lng,
                average_rating, rating_count, source_locale
            `)
            .or(`created_by.eq.${profileId},user_id.eq.${profileId}`);

        const spots: Spot[] = [];
        if (spotsData && !spotsErr) {
            spotsData.forEach((s: any) => {
                const spot: Spot = {
                    id: s.id,
                    name: s.name,
                    status: s.status,
                    location: {
                        type: "Point",
                        coordinates: [s.lng, s.lat]
                    },
                    attributes: s.attributes,
                    source_locale: s.source_locale,
                    createdAt: s.created_at,
                    average_rating: s.average_rating,
                    rating_count: s.rating_count
                };
                spot.slug = generateSlug(spot);
                spots.push(spot);
            });
        }

        // 3. Get upcoming visits planned by this user
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: visitsData, error: visitsErr } = await supabase
            .from("spot_visits")
            .select(`
                id, spot_id, visit_date, visit_time, description,
                spots(name)
            `)
            .eq("user_id", profileId)
            .gte("visit_date", todayStr)
            .order("visit_date", { ascending: true });

        const visits = (visitsData || [])
            .map((v: any) => {
                const sName = v.spots ? (Array.isArray(v.spots) ? v.spots[0]?.name : v.spots?.name) : "Spot";
                return {
                    id: v.id,
                    spot_id: v.spot_id,
                    spot_name: sName || "Spot",
                    visit_date: v.visit_date,
                    visit_time: v.visit_time,
                    description: v.description
                };
            });

        // 4. Get profile likes count and liked status for current user
        const { count: likesCount, error: likesErr } = await supabase
            .from("profile_likes")
            .select("*", { count: "exact", head: true })
            .eq("target_profile_id", profileId);

        let hasLiked = false;
        const authUserRes = await supabase.auth.getUser();
        if (authUserRes.data.user) {
            const currentUser = authUserRes.data.user;
            const { data: likeData } = await supabase
                .from("profile_likes")
                .select("id")
                .eq("target_profile_id", profileId)
                .eq("liker_id", currentUser.id)
                .maybeSingle();
            if (likeData) hasLiked = true;
        }

        // 5. Get profile reviews and replies
        const { data: reviewsData, error: reviewsErr } = await supabase
            .from("profile_reviews")
            .select(`
                id, target_profile_id, author_id, rating, comment, created_at,
                profiles:author_id(username, avatar_url)
            `)
            .eq("target_profile_id", profileId)
            .order("created_at", { ascending: false });

        const reviews: ProfileReview[] = [];
        if (reviewsData && !reviewsErr) {
            const reviewIds = reviewsData.map(r => r.id);
            let repliesData: any[] = [];
            if (reviewIds.length > 0) {
                const { data: repData } = await supabase
                    .from("profile_review_replies")
                    .select(`
                        id, review_id, author_id, reply, created_at,
                        profiles:author_id(username, avatar_url)
                    `)
                    .in("review_id", reviewIds);
                repliesData = repData || [];
            }

            reviewsData.forEach((r: any) => {
                const authorProfile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
                const replyObj = repliesData.find(rep => rep.review_id === r.id);
                const replyProfiles = replyObj ? (Array.isArray(replyObj.profiles) ? replyObj.profiles[0] : replyObj.profiles) : null;

                reviews.push({
                    id: r.id,
                    target_profile_id: r.target_profile_id,
                    author_id: r.author_id,
                    rating: r.rating,
                    comment: r.comment,
                    created_at: r.created_at,
                    profiles: authorProfile,
                    reply: replyObj ? {
                        id: replyObj.id,
                        review_id: replyObj.review_id,
                        author_id: replyObj.author_id,
                        reply: replyObj.reply,
                        created_at: replyObj.created_at,
                        profiles: replyProfiles
                    } : null
                });
            });
        }

        return {
            profile: {
                id: profile.id,
                username: profile.username || "eFoiler",
                avatar_url: profile.avatar_url,
                bio: profile.bio,
                created_at: profile.created_at,
                locale: profile.locale,
                email_pref_visits: profile.email_pref_visits,
                email_pref_questions: profile.email_pref_questions
            },
            spots,
            visits,
            likesCount: likesCount || 0,
            hasLiked,
            reviews
        };
    } catch (err) {
        console.error("getUserProfileData exception:", err);
        return null;
    }
}

export interface SpotAnswer {
    id: string;
    question_id: string;
    user_id: string;
    answer: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
    };
    likesCount?: number;
    isLiked?: boolean;
}

export interface SpotQuestion {
    id: string;
    spot_id: string;
    user_id: string;
    question: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
    };
    answers?: SpotAnswer[];
    likesCount?: number;
    isLiked?: boolean;
}

export async function createSpotQuestion(spotId: string, question: string, token?: string) {
    const supabase = await createClient();
    let user = null;
    if (token) {
        const res = await supabase.auth.getUser(token);
        user = res.data.user;
    }
    if (!user) {
        const res = await supabase.auth.getUser();
        user = res.data.user;
    }
    if (!user) {
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user || null;
    }
    if (!user) return { success: false, error: "Unauthorized" };

    const dbClient = token ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    ) : supabase;

    try {
        const { data, error } = await dbClient
            .from("spot_questions")
            .insert([{ spot_id: spotId, user_id: user.id, question }])
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        // Send Email Notification to spot creator asynchronously
        try {
            const { data: spot } = await dbClient
                .from("spots")
                .select("id, name, created_by, user_id")
                .eq("id", spotId)
                .single();

            const creatorId = spot?.created_by || spot?.user_id;

            if (creatorId && creatorId !== user.id) {
                const { data: creatorProfile } = await dbClient
                    .from("profiles")
                    .select("locale, email_pref_questions")
                    .eq("id", creatorId)
                    .single();

                if (creatorProfile?.email_pref_questions !== false) {
                    const { data: creatorEmail } = await dbClient
                        .rpc("get_profile_email", { profile_id: creatorId });

                    if (creatorEmail) {
                        const { data: askerProfile } = await dbClient
                            .from("profiles")
                            .select("username")
                            .eq("id", user.id)
                            .single();

                        const { sendQuestionNotificationEmail } = await import("@/lib/email");
                        await sendQuestionNotificationEmail({
                            creatorEmail,
                            askerUsername: askerProfile?.username || "eFoiler",
                            spotName: spot.name,
                            questionText: question,
                            spotId: spot.id,
                            creatorLang: creatorProfile?.locale || "de"
                        });
                    }
                }
            }
        } catch (emailErr) {
            console.error("Failed to send spot question email:", emailErr);
        }

        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message || "Exception occurred" };
    }
}

export async function createSpotAnswer(questionId: string, answer: string, token?: string) {
    const supabase = await createClient();
    let user = null;
    if (token) {
        const res = await supabase.auth.getUser(token);
        user = res.data.user;
    }
    if (!user) {
        const res = await supabase.auth.getUser();
        user = res.data.user;
    }
    if (!user) {
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user || null;
    }
    if (!user) return { success: false, error: "Unauthorized" };

    const dbClient = token ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    ) : supabase;

    try {
        const { data, error } = await dbClient
            .from("spot_answers")
            .insert([{ question_id: questionId, user_id: user.id, answer }])
            .select()
            .single();

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message || "Exception occurred" };
    }
}

export async function getSpotQuestionsAndAnswers(spotId: string): Promise<SpotQuestion[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    try {
        // Try fetching questions with likes
        let qRes: any = await supabase
            .from("spot_questions")
            .select(`
                id, spot_id, user_id, question, created_at,
                profiles(username, avatar_url),
                spot_question_likes(id, user_id)
            `)
            .eq("spot_id", spotId)
            .order("created_at", { ascending: false });

        let qErr = qRes.error;
        let qData = qRes.data;

        // Fallback if likes relation doesn't exist
        if (qErr && (qErr.message.includes("spot_question_likes") || qErr.message.includes("relation"))) {
            console.warn("DB schema sync: spot_question_likes missing. Falling back.");
            qRes = await supabase
                .from("spot_questions")
                .select(`
                    id, spot_id, user_id, question, created_at,
                    profiles(username, avatar_url)
                `)
                .eq("spot_id", spotId)
                .order("created_at", { ascending: false });
            qErr = qRes.error;
            qData = qRes.data;
        }

        if (qErr) throw qErr;
        if (!qData || qData.length === 0) return [];

        const questions: SpotQuestion[] = qData.map((q: any) => {
            const likesList = q.spot_question_likes || [];
            return {
                id: q.id,
                spot_id: q.spot_id,
                user_id: q.user_id,
                question: q.question,
                created_at: q.created_at,
                profiles: Array.isArray(q.profiles) ? q.profiles[0] : q.profiles,
                answers: [],
                likesCount: likesList.length,
                isLiked: userId ? likesList.some((l: any) => l.user_id === userId) : false
            };
        });

        const qIds = questions.map(q => q.id);

        // Try fetching answers with likes
        let aRes: any = await supabase
            .from("spot_answers")
            .select(`
                id, question_id, user_id, answer, created_at,
                profiles(username, avatar_url),
                spot_answer_likes(id, user_id)
            `)
            .in("question_id", qIds)
            .order("created_at", { ascending: true });

        let aErr = aRes.error;
        let aData = aRes.data;

        // Fallback if likes relation doesn't exist
        if (aErr && (aErr.message.includes("spot_answer_likes") || aErr.message.includes("relation"))) {
            console.warn("DB schema sync: spot_answer_likes missing. Falling back.");
            aRes = await supabase
                .from("spot_answers")
                .select(`
                    id, question_id, user_id, answer, created_at,
                    profiles(username, avatar_url)
                `)
                .in("question_id", qIds)
                .order("created_at", { ascending: true });
            aErr = aRes.error;
            aData = aRes.data;
        }

        if (aErr) throw aErr;

        if (aData) {
            aData.forEach((ans: any) => {
                const q = questions.find(q => q.id === ans.question_id);
                if (q) {
                    const likesList = ans.spot_answer_likes || [];
                    q.answers = q.answers || [];
                    q.answers.push({
                        id: ans.id,
                        question_id: ans.question_id,
                        user_id: ans.user_id,
                        answer: ans.answer,
                        created_at: ans.created_at,
                        profiles: Array.isArray(ans.profiles) ? ans.profiles[0] : ans.profiles,
                        likesCount: likesList.length,
                        isLiked: userId ? likesList.some((l: any) => l.user_id === userId) : false
                    });
                }
            });
        }

        return questions;
    } catch (e) {
        console.error("getSpotQuestionsAndAnswers failed:", e);
        return [];
    }
}

export async function toggleLikeProfile(targetProfileId: string): Promise<{ success: boolean; error?: string; liked?: boolean }> {
    const supabase = await createClient();
    const authRes = await supabase.auth.getUser();
    const user = authRes.data.user;
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const { data: existingLike } = await supabase
            .from("profile_likes")
            .select("id")
            .eq("target_profile_id", targetProfileId)
            .eq("liker_id", user.id)
            .maybeSingle();

        if (existingLike) {
            const { error } = await supabase
                .from("profile_likes")
                .delete()
                .eq("id", existingLike.id);
            if (error) throw error;
            return { success: true, liked: false };
        } else {
            const { error } = await supabase
                .from("profile_likes")
                .insert([{ target_profile_id: targetProfileId, liker_id: user.id }]);
            if (error) throw error;
            return { success: true, liked: true };
        }
    } catch (e: any) {
        console.error("toggleLikeProfile failed:", e);
        return { success: false, error: e.message || "Exception occurred" };
    }
}

export async function rateProfile(targetProfileId: string, rating: number, comment: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const authRes = await supabase.auth.getUser();
    const user = authRes.data.user;
    if (!user) return { success: false, error: "Unauthorized" };
    if (user.id === targetProfileId) return { success: false, error: "You cannot review your own profile!" };

    try {
        const { error } = await supabase
            .from("profile_reviews")
            .upsert({
                target_profile_id: targetProfileId,
                author_id: user.id,
                rating,
                comment
            }, {
                onConflict: "target_profile_id,author_id"
            });

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("rateProfile failed:", e);
        return { success: false, error: e.message || "Exception occurred" };
    }
}

export async function deleteProfileReview(reviewId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const authRes = await supabase.auth.getUser();
    const user = authRes.data.user;
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const { data: review, error: getErr } = await supabase
            .from("profile_reviews")
            .select("author_id, target_profile_id")
            .eq("id", reviewId)
            .maybeSingle();

        if (getErr || !review) return { success: false, error: "Review not found" };

        const isAdmin = user.email === 'callematic@gmail.com';
        if (review.author_id !== user.id && review.target_profile_id !== user.id && !isAdmin) {
            return { success: false, error: "Unauthorized to delete this review" };
        }

        const { error } = await supabase
            .from("profile_reviews")
            .delete()
            .eq("id", reviewId);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("deleteProfileReview failed:", e);
        return { success: false, error: e.message || "Exception occurred" };
    }
}

export async function replyToProfileReview(reviewId: string, reply: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const authRes = await supabase.auth.getUser();
    const user = authRes.data.user;
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const { data: review } = await supabase
            .from("profile_reviews")
            .select("target_profile_id")
            .eq("id", reviewId)
            .maybeSingle();

        if (!review) return { success: false, error: "Review not found" };
        if (review.target_profile_id !== user.id) {
            return { success: false, error: "Only the profile owner can reply to reviews left on their profile!" };
        }

        const { error } = await supabase
            .from("profile_review_replies")
            .upsert({
                review_id: reviewId,
                author_id: user.id,
                reply
            }, {
                onConflict: "review_id"
            });

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("replyToProfileReview failed:", e);
        return { success: false, error: e.message || "Exception occurred" };
    }
}

export async function deleteProfileReviewReply(replyId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const authRes = await supabase.auth.getUser();
    const user = authRes.data.user;
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const { data: reply, error: getErr } = await supabase
            .from("profile_review_replies")
            .select("author_id, review_id")
            .eq("id", replyId)
            .maybeSingle();

        if (getErr || !reply) return { success: false, error: "Reply not found" };

        let reviewTargetProfileId = null;
        if (reply.review_id) {
            const { data: review } = await supabase
                .from("profile_reviews")
                .select("target_profile_id")
                .eq("id", reply.review_id)
                .maybeSingle();
            reviewTargetProfileId = review?.target_profile_id;
        }

        const isAdmin = user.email === 'callematic@gmail.com';
        if (reply.author_id !== user.id && reviewTargetProfileId !== user.id && !isAdmin) {
            return { success: false, error: "Unauthorized to delete this reply" };
        }

        const { error } = await supabase
            .from("profile_review_replies")
            .delete()
            .eq("id", replyId);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("deleteProfileReviewReply failed:", e);
        return { success: false, error: e.message || "Exception occurred" };
    }
}

export async function toggleLikeQuestion(questionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized: Please sign in to like comments." };

    try {
        const { data: existingLike, error: fetchErr } = await supabase
            .from("spot_question_likes")
            .select("id")
            .eq("question_id", questionId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existingLike) {
            const { error: deleteErr } = await supabase
                .from("spot_question_likes")
                .delete()
                .eq("id", existingLike.id);
            if (deleteErr) throw deleteErr;
            return { success: true, action: "unliked" };
        } else {
            const { error: insertErr } = await supabase
                .from("spot_question_likes")
                .insert([{ question_id: questionId, user_id: user.id }]);
            if (insertErr) throw insertErr;
            return { success: true, action: "liked" };
        }
    } catch (err: any) {
        console.error("Toggle comment like error:", err);
        return { success: false, error: err.message };
    }
}

export async function toggleLikeAnswer(answerId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized: Please sign in to like replies." };

    try {
        const { data: existingLike, error: fetchErr } = await supabase
            .from("spot_answer_likes")
            .select("id")
            .eq("answer_id", answerId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existingLike) {
            const { error: deleteErr } = await supabase
                .from("spot_answer_likes")
                .delete()
                .eq("id", existingLike.id);
            if (deleteErr) throw deleteErr;
            return { success: true, action: "unliked" };
        } else {
            const { error: insertErr } = await supabase
                .from("spot_answer_likes")
                .insert([{ answer_id: answerId, user_id: user.id }]);
            if (insertErr) throw insertErr;
            return { success: true, action: "liked" };
        }
    } catch (err: any) {
        console.error("Toggle reply like error:", err);
        return { success: false, error: err.message };
    }
}

