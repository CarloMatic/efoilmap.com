"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Bell, MessageSquare, Star, X, User as UserIcon, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage, useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Spot, getLastReadNotifications, updateLastReadNotifications } from "@/app/actions";
import { generateSlug } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const likedSpotText: Record<string, string> = {
    de: "hat deinen Spot geliked! ❤️",
    en: "liked your spot! ❤️",
    es: "le gustó tu spot! ❤️",
    fr: "a aimé ton spot! ❤️",
    it: "ha messo mi piace al tuo spot! ❤️",
    pt: "gostou do teu spot! ❤️",
    nl: "vond je spot leuk! ❤️",
    pl: "polubił Twój spot! ❤️",
    sv: "gillade din spot! ❤️"
};

interface NotificationCenterProps {
    user: any;
    onSelectSpot: (spot: Spot) => void;
    onViewProfile?: (profileId: string) => void;
}

interface NotificationItem {
    id: string;
    type: "spot_comment" | "visit_comment" | "spot_like" | "spot_question" | "spot_answer";
    spotId: string;
    spotName: string;
    visitId?: string;
    comment: string;
    createdAt: string;
    username: string;
    avatarUrl?: string;
    likerId?: string;
}

export function NotificationCenter({ user, onSelectSpot, onViewProfile }: NotificationCenterProps) {
    const { locale } = useLanguage();
    const { profile } = useAuth();
    const isAiTranslationEnabled = profile ? (profile as any).ai_translation_enabled !== false : true;
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const loadNotifications = async () => {
        if (!user) return;

        try {
            // 1. Fetch user's contributed spots
            const { data: mySpots } = await supabase
                .from("spots")
                .select("id, name")
                .eq("user_id", user.id);

            const mySpotIds = mySpots?.map(s => s.id) || [];
            const mySpotsMap = new Map(mySpots?.map(s => [s.id, s.name]) || []);

            // 2. Fetch comments on these spots by others
            let spotComments: any[] = [];
            if (mySpotIds.length > 0) {
                const { data } = await supabase
                    .from("spot_verifications")
                    .select("id, spot_id, comment, created_at, user_id, profiles(username, avatar_url)")
                    .in("spot_id", mySpotIds)
                    .neq("user_id", user.id);
                spotComments = data || [];
            }

            // 3. Fetch visits joined by current user
            const { data: joinedVisits } = await supabase
                .from("visit_participants")
                .select("visit_id")
                .eq("user_id", user.id)
                .eq("status", "JOINED");

            const joinedVisitIds = joinedVisits?.map(v => v.visit_id) || [];

            // 4. Fetch comments on these visits by others
            let visitComments: any[] = [];
            if (joinedVisitIds.length > 0) {
                const { data } = await supabase
                    .from("visit_comments")
                    .select("id, visit_id, comment, created_at, user_id, spot_visits(spot_id, visit_date, spots(name)), profiles(username, avatar_url)")
                    .in("visit_id", joinedVisitIds)
                    .neq("user_id", user.id);
                visitComments = data || [];
            }

            // 4.5. Fetch likes on these spots by others
            let spotLikes: any[] = [];
            if (mySpotIds.length > 0) {
                const { data } = await supabase
                    .from("spot_likes")
                    .select("id, spot_id, created_at, user_id, profiles(username, avatar_url)")
                    .in("spot_id", mySpotIds)
                    .neq("user_id", user.id);
                spotLikes = data || [];
            }

            // 4.6. Fetch questions on these spots by others
            let spotQuestions: any[] = [];
            if (mySpotIds.length > 0) {
                const { data } = await supabase
                    .from("spot_questions")
                    .select("id, spot_id, question, created_at, user_id, spots(name), profiles(username, avatar_url)")
                    .in("spot_id", mySpotIds)
                    .neq("user_id", user.id);
                spotQuestions = data || [];
            }

            // 4.7. Fetch answers to user's questions by others
            const { data: myQuestions } = await supabase
                .from("spot_questions")
                .select("id, question, spot_id")
                .eq("user_id", user.id);

            const myQuestionIds = myQuestions?.map(q => q.id) || [];
            let spotAnswers: any[] = [];
            if (myQuestionIds.length > 0) {
                const { data } = await supabase
                    .from("spot_answers")
                    .select("id, question_id, answer, created_at, user_id, spot_questions(spot_id, question, spots(name)), profiles(username, avatar_url)")
                    .in("question_id", myQuestionIds)
                    .neq("user_id", user.id);
                spotAnswers = data || [];
            }

            // 5. Combine and map to NotificationItem format
            const items: NotificationItem[] = [];

            spotLikes.forEach(c => {
                const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
                items.push({
                    id: c.id,
                    type: "spot_like",
                    spotId: c.spot_id,
                    spotName: mySpotsMap.get(c.spot_id) || "Spot",
                    comment: "",
                    createdAt: c.created_at,
                    username: prof?.username || "eFoiler",
                    avatarUrl: prof?.avatar_url,
                    likerId: c.user_id
                });
            });

            spotComments.forEach(c => {
                if (c.comment && c.comment.trim()) {
                    const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
                    items.push({
                        id: c.id,
                        type: "spot_comment",
                        spotId: c.spot_id,
                        spotName: mySpotsMap.get(c.spot_id) || "Spot",
                        comment: c.comment,
                        createdAt: c.created_at,
                        username: prof?.username || "eFoiler",
                        avatarUrl: prof?.avatar_url,
                        likerId: c.user_id
                    });
                }
            });

            visitComments.forEach(c => {
                if (c.comment && c.comment.trim()) {
                    const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
                    const visit = Array.isArray(c.spot_visits) ? c.spot_visits[0] : c.spot_visits;
                    const spot = visit?.spots ? (Array.isArray(visit.spots) ? visit.spots[0] : visit.spots) : null;
                    items.push({
                        id: c.id,
                        type: "visit_comment",
                        spotId: visit?.spot_id || "",
                        spotName: spot?.name || "Spot",
                        visitId: c.visit_id,
                        comment: c.comment,
                        createdAt: c.created_at,
                        username: prof?.username || "eFoiler",
                        avatarUrl: prof?.avatar_url,
                        likerId: c.user_id
                    });
                }
            });

            spotQuestions.forEach(c => {
                if (c.question && c.question.trim()) {
                    const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
                    const spot = Array.isArray(c.spots) ? c.spots[0] : c.spots;
                    items.push({
                        id: c.id,
                        type: "spot_question",
                        spotId: c.spot_id,
                        spotName: spot?.name || mySpotsMap.get(c.spot_id) || "Spot",
                        comment: c.question,
                        createdAt: c.created_at,
                        username: prof?.username || "eFoiler",
                        avatarUrl: prof?.avatar_url,
                        likerId: c.user_id
                    });
                }
            });

            spotAnswers.forEach(c => {
                if (c.answer && c.answer.trim()) {
                    const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
                    const quest = Array.isArray(c.spot_questions) ? c.spot_questions[0] : c.spot_questions;
                    const spot = quest?.spots ? (Array.isArray(quest.spots) ? quest.spots[0] : quest.spots) : null;
                    items.push({
                        id: c.id,
                        type: "spot_answer",
                        spotId: quest?.spot_id || "",
                        spotName: spot?.name || "Spot",
                        comment: c.answer,
                        createdAt: c.created_at,
                        username: prof?.username || "eFoiler",
                        avatarUrl: prof?.avatar_url,
                        likerId: c.user_id
                    });
                }
            });

            // Sort by date descending
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(items);

            // 6. Calculate unread count based on last opened timestamp from DB + LocalStorage fallback
            let lastOpened = null;
            try {
                const res = await getLastReadNotifications();
                if (res && res.success) {
                    lastOpened = res.data;
                }
            } catch (e) {
                console.warn("DB getLastReadNotifications failed, using local storage:", e);
            }

            if (typeof window !== "undefined") {
                const localLastOpened = localStorage.getItem(`last_read_notifications_at_${user.id}`);
                if (localLastOpened && (!lastOpened || new Date(localLastOpened).getTime() > new Date(lastOpened).getTime())) {
                    lastOpened = localLastOpened;
                }
            }

            if (lastOpened) {
                const count = items.filter(item => new Date(item.createdAt).getTime() > new Date(lastOpened!).getTime()).length;
                setUnreadCount(count);
            } else {
                setUnreadCount(items.length);
            }

        } catch (err) {
            console.error("Load notifications error:", err);
        }
    };

    const handleOpenToggle = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        if (nextState && user) {
            // Update last opened timestamp in DB & LocalStorage fallbacks
            if (typeof window !== "undefined") {
                localStorage.setItem(`last_read_notifications_at_${user.id}`, new Date().toISOString());
            }
            updateLastReadNotifications();
            setUnreadCount(0);
        }
    };

    const handleNotificationClick = async (notif: NotificationItem) => {
        try {
            // 1. Update query params for deep linking using Next.js router
            const params = new URLSearchParams(searchParams.toString());
            if (notif.visitId) {
                params.set("visit", notif.visitId);
                params.set("tab", "visits");
            } else {
                params.delete("visit");
                params.delete("tab");
            }
            // Update URL synchronously so onSelectSpot (which calls pushState) sees the new params
            window.history.replaceState(null, '', `${pathname}?${params.toString()}`);

            // 2. Fetch full spot details
            const { data: spotData } = await supabase
                .from("spots")
                .select(`
                    id, name, status, attributes, created_at, lat, lng,
                    average_rating, rating_count, source_locale, user_id, created_by,
                    spot_visits(id, visit_date, visit_time)
                `)
                .eq("id", notif.spotId)
                .single();

            if (spotData) {
                const s: Spot = {
                    id: spotData.id,
                    name: spotData.name,
                    status: spotData.status as any,
                    location: { type: "Point", coordinates: [spotData.lng, spotData.lat] },
                    attributes: spotData.attributes as any,
                    spot_visits: spotData.spot_visits as any,
                    user_id: spotData.user_id,
                    created_by: spotData.created_by
                };
                s.slug = generateSlug(s);

                // 3. Select the spot to open it in SpotDialog
                onSelectSpot(s);
                setIsOpen(false);
            }
        } catch (err) {
            console.error("Open spot from notification error:", err);
        }
    };

    useEffect(() => {
        if (user) {
            loadNotifications();
            // Poll every 30 seconds for live notification count updates
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative shrink-0">
            {/* Bell Icon Trigger */}
            <button
                onClick={handleOpenToggle}
                className={cn(
                    "w-10 h-10 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-xl cursor-pointer relative hover:border-blue-500/50",
                    isOpen && "border-blue-500 text-white bg-gray-800"
                )}
            >
                <Bell className={cn("w-5 h-5", unreadCount > 0 && "animate-wiggle text-blue-400")} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-gray-950 animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown Container */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-gray-950/95 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {locale === "de" ? "Benachrichtigungen" : "Notifications"}
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className="w-full text-left p-3.5 hover:bg-white/5 flex gap-3 transition-colors duration-150 group border-none cursor-pointer focus:outline-none"
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                                        {notif.avatarUrl ? (
                                            <Image src={notif.avatarUrl} alt="Avatar" fill className="object-cover" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>

                                    {/* Contents */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <span 
                                                onClick={(e) => {
                                                    if (notif.likerId && onViewProfile) {
                                                        e.stopPropagation();
                                                        onViewProfile(notif.likerId);
                                                    }
                                                }}
                                                className={cn(
                                                    "text-xs font-bold text-gray-300 truncate",
                                                    notif.likerId && onViewProfile && "hover:text-blue-400 hover:underline cursor-pointer"
                                                )}
                                            >
                                                @{notif.username}
                                            </span>
                                            <span className="text-[9px] text-gray-500 shrink-0">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {notif.type === "spot_like" ? (
                                            <p className="text-[11px] text-gray-300 leading-normal font-semibold mb-1.5 flex items-center gap-1">
                                                {likedSpotText[locale] || likedSpotText['en']}
                                            </p>
                                        ) : (
                                            <p className="text-[11px] text-gray-300 leading-normal line-clamp-2 italic mb-1.5">
                                                <NotificationComment text={notif.comment} targetLang={locale} enabled={isAiTranslationEnabled} />
                                            </p>
                                        )}

                                        <div className="flex items-center gap-1">
                                            {notif.type === "spot_like" ? (
                                                <Heart className="w-3 h-3 text-red-500 fill-red-500/20 shrink-0 animate-pulse" />
                                            ) : notif.type === "spot_comment" ? (
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500/20 shrink-0" />
                                            ) : notif.type === "spot_question" ? (
                                                <MessageSquare className="w-3 h-3 text-green-400 shrink-0" />
                                            ) : notif.type === "spot_answer" ? (
                                                <MessageSquare className="w-3 h-3 text-purple-400 shrink-0" />
                                            ) : (
                                                <MessageSquare className="w-3 h-3 text-blue-400 shrink-0" />
                                            )}
                                            <span className="text-[9px] text-blue-400 font-extrabold truncate">
                                                {notif.type === "spot_like"
                                                    ? (locale === "de" ? `Gefällt mir: ${notif.spotName}` : `Like: ${notif.spotName}`)
                                                    : notif.type === "spot_comment"
                                                        ? (locale === "de" ? `Spot: ${notif.spotName}` : `Spot: ${notif.spotName}`)
                                                        : notif.type === "spot_question"
                                                            ? (locale === "de" ? `Spot-Kommentar: ${notif.spotName}` : `Spot Comment: ${notif.spotName}`)
                                                            : notif.type === "spot_answer"
                                                                ? (locale === "de" ? `Spot-Antwort: ${notif.spotName}` : `Spot Reply: ${notif.spotName}`)
                                                                : (locale === "de" ? `Termin: ${notif.spotName}` : `Visit: ${notif.spotName}`)}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-gray-500 italic">
                                {locale === "de"
                                    ? "Keine Benachrichtigungen vorhanden"
                                    : "No notifications found"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

interface NotificationCommentProps {
    text: string;
    targetLang: string;
    enabled: boolean;
}

function NotificationComment({ text, targetLang, enabled }: NotificationCommentProps) {
    const { translatedText } = useTranslate(text, targetLang, enabled);
    return <>&ldquo;{translatedText}&rdquo;</>;
}
