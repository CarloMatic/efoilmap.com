"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, User, MapPin, Calendar, Loader2, Star, Heart, Trash2, ThumbsUp } from "lucide-react";
import { 
    getUserProfileData, 
    UserProfileData, 
    Spot, 
    toggleLikeProfile, 
    rateProfile, 
    deleteProfileReview, 
    replyToProfileReview, 
    deleteProfileReviewReply 
} from "@/app/actions";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface UserProfileDialogProps {
    profileId: string | null;
    open: boolean;
    onClose: () => void;
    onSelectSpot: (spot: Spot, tab?: string) => void;
}

export function UserProfileDialog({ profileId, open, onClose, onSelectSpot }: UserProfileDialogProps) {
    const { locale } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserProfileData | null>(null);
    const [activeTab, setActiveTab] = useState<"spots" | "visits" | "reviews">("spots");

    const [liking, setLiking] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
    const [newReplyText, setNewReplyText] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        if (open && profileId) {
            setLoading(true);
            getUserProfileData(profileId)
                .then((res) => {
                    setData(res);
                    if (res && user) {
                        const existingReview = res.reviews.find(r => r.author_id === user.id);
                        if (existingReview) {
                            setRating(existingReview.rating);
                            setComment(existingReview.comment);
                        } else {
                            setRating(5);
                            setComment("");
                        }
                    }
                })
                .catch((err) => {
                    console.error("Error loading user profile:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setData(null);
        }
    }, [open, profileId, refetchTrigger, user]);

    const handleLike = async () => {
        if (!user) {
            alert(locale === 'de' ? 'Bitte logge dich ein, um Profile zu liken.' : 'Please sign in to like profiles.');
            return;
        }
        if (liking || !profileId) return;
        setLiking(true);
        try {
            const res = await toggleLikeProfile(profileId);
            if (res.success) {
                setRefetchTrigger(prev => prev + 1);
            } else {
                console.error("Failed to like profile:", res.error);
            }
        } catch (err) {
            console.error("Failed to like profile:", err);
        } finally {
            setLiking(false);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert(locale === 'de' ? 'Bitte logge dich ein, um eine Bewertung abzugeben.' : 'Please sign in to rate this user.');
            return;
        }
        if (!profileId || user.id === profileId) return;
        if (!comment.trim()) return;
        setSubmittingReview(true);
        try {
            const res = await rateProfile(profileId, rating, comment);
            if (res.success) {
                setRefetchTrigger(prev => prev + 1);
            } else {
                alert(res.error || "Failed to post review");
            }
        } catch (err) {
            console.error("Review submission failed:", err);
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!window.confirm(locale === 'de' ? 'Möchtest du diese Bewertung wirklich löschen?' : 'Are you sure you want to delete this review?')) return;
        try {
            const res = await deleteProfileReview(reviewId);
            if (res.success) {
                setRefetchTrigger(prev => prev + 1);
            } else {
                alert(res.error || "Failed to delete review");
            }
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };

    const handleReplySubmit = async (e: React.FormEvent, reviewId: string) => {
        e.preventDefault();
        if (!newReplyText.trim()) return;
        setSubmittingReply(true);
        try {
            const res = await replyToProfileReview(reviewId, newReplyText);
            if (res.success) {
                setNewReplyText("");
                setActiveReplyBoxId(null);
                setRefetchTrigger(prev => prev + 1);
            } else {
                alert(res.error || "Failed to submit reply");
            }
        } catch (err) {
            console.error("Failed to submit reply:", err);
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleDeleteReply = async (replyId: string) => {
        if (!window.confirm(locale === 'de' ? 'Möchtest du diese Antwort wirklich löschen?' : 'Are you sure you want to delete this reply?')) return;
        try {
            const res = await deleteProfileReviewReply(replyId);
            if (res.success) {
                setRefetchTrigger(prev => prev + 1);
            } else {
                alert(res.error || "Failed to delete reply");
            }
        } catch (err) {
            console.error("Failed to delete reply:", err);
        }
    };

    if (!open || !profileId) return null;

    const averageRating = data?.reviews && data.reviews.length > 0
        ? data.reviews.reduce((acc, r) => acc + r.rating, 0) / data.reviews.length
        : 0;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-gray-950/95 border border-white/15 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                
                {/* Header Close Trigger */}
                <div className="flex justify-end p-4 pb-0">
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-xs italic">{locale === 'de' ? 'Profil wird geladen...' : 'Loading profile...'}</p>
                    </div>
                ) : data ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Upper Profile Box */}
                        <div className="px-8 pb-6 flex flex-col items-center text-center border-b border-white/5">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/50 bg-gray-900 shadow-xl shadow-blue-500/10 mb-4 relative flex items-center justify-center">
                                {data.profile.avatar_url ? (
                                    <Image 
                                        src={data.profile.avatar_url} 
                                        alt={data.profile.username} 
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-600" />
                                )}
                            </div>

                            {/* Name & Date */}
                            <h2 className="text-2xl font-bold text-white tracking-tight">@{data.profile.username}</h2>
                            <p className="text-[10px] text-gray-500 mt-1">
                                {locale === 'de' ? 'Mitglied seit' : 'Member since'}:{" "}
                                {new Date(data.profile.created_at).toLocaleDateString()}
                            </p>

                            {/* Like & Ratings Header Widget */}
                            <div className="flex items-center gap-2.5 mt-3 flex-wrap justify-center">
                                <button
                                    onClick={handleLike}
                                    disabled={liking}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50",
                                        data.hasLiked 
                                            ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" 
                                            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <Heart className={cn("w-3.5 h-3.5 transition-transform", data.hasLiked ? "fill-current scale-110" : "")} />
                                    {data.likesCount} {data.likesCount === 1 ? 'Like' : 'Likes'}
                                </button>

                                {averageRating > 0 && (
                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        {averageRating.toFixed(1)} ({data.reviews.length})
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            {data.profile.bio && (
                                <p className="text-xs text-gray-300 leading-relaxed italic bg-white/2 border border-white/5 p-3 rounded-2xl mt-4 w-full text-center">
                                    &ldquo;{data.profile.bio}&rdquo;
                                </p>
                            )}

                            {/* Mini Stats Summary */}
                            <div className="grid grid-cols-3 gap-3 mt-6 w-full">
                                <div className="bg-white/3 border border-white/5 py-2 px-2.5 rounded-2xl flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-blue-400">{data.spots.length}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                                        Spots
                                    </span>
                                </div>
                                <div className="bg-white/3 border border-white/5 py-2 px-2.5 rounded-2xl flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-green-400">{data.visits.length}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                                        {locale === 'de' ? 'Termine' : 'Visits'}
                                    </span>
                                </div>
                                <div className="bg-white/3 border border-white/5 py-2 px-2.5 rounded-2xl flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-red-400">{data.likesCount}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                                        Likes
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex px-4 pt-4 border-b border-white/5">
                            <button
                                onClick={() => setActiveTab("spots")}
                                className={cn(
                                    "flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                                    activeTab === "spots" 
                                        ? "border-blue-500 text-white" 
                                        : "border-transparent text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                Spots
                            </button>
                            <button
                                onClick={() => setActiveTab("visits")}
                                className={cn(
                                    "flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                                    activeTab === "visits" 
                                        ? "border-green-500 text-white" 
                                        : "border-transparent text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                {locale === 'de' ? 'Termine' : 'Visits'}
                            </button>
                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={cn(
                                    "flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                                    activeTab === "reviews" 
                                        ? "border-yellow-500 text-white" 
                                        : "border-transparent text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <Star className="w-3.5 h-3.5" />
                                {locale === 'de' ? 'Bewertungen' : 'Reviews'}
                            </button>
                        </div>

                        {/* Tab Contents Scrollable list */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTab === "spots" && (
                                <div className="space-y-2">
                                    {data.spots.length > 0 ? (
                                        data.spots.map((spot) => (
                                            <button
                                                key={spot.id}
                                                onClick={() => {
                                                    onSelectSpot(spot);
                                                    onClose();
                                                }}
                                                className="w-full text-left p-3.5 bg-white/5 border border-white/5 hover:border-blue-500/30 rounded-2xl flex items-center justify-between gap-3 group transition-all duration-150 cursor-pointer"
                                            >
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                                        {spot.name}
                                                    </h4>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase inline-block mt-1",
                                                        spot.status === "ALLOWED" && "text-green-400",
                                                        spot.status === "TOLERATED" && "text-yellow-400",
                                                        spot.status === "FORBIDDEN" && "text-red-400",
                                                        spot.status === "UNCLEAR" && "text-gray-400"
                                                    )}>
                                                        {spot.status}
                                                    </span>
                                                </div>
                                                {spot.average_rating ? (
                                                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold shrink-0">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {spot.average_rating.toFixed(1)}
                                                    </div>
                                                ) : null}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-xs text-center text-gray-500 italic py-8">
                                            {locale === 'de' 
                                                ? 'Noch keine Spots beigetragen' 
                                                : 'No spots contributed yet'}
                                        </p>
                                    )}
                                </div>
                            )}

                            {activeTab === "visits" && (
                                <div className="space-y-2">
                                    {data.visits.length > 0 ? (
                                        data.visits.map((visit) => (
                                            <button
                                                key={visit.id}
                                                onClick={() => {
                                                    const s = data.spots.find(sp => sp.id === visit.spot_id) || {
                                                        id: visit.spot_id,
                                                        name: visit.spot_name,
                                                        status: "ALLOWED",
                                                        location: { type: "Point", coordinates: [0, 0] },
                                                        attributes: {}
                                                    } as Spot;
                                                    onSelectSpot(s, "visits");
                                                    onClose();
                                                }}
                                                className="w-full text-left p-3.5 bg-white/5 border border-white/5 hover:border-green-500/30 rounded-2xl flex flex-col gap-2 group transition-all duration-150 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="text-xs font-bold text-white group-hover:text-green-400 transition-colors truncate">
                                                        {visit.spot_name}
                                                    </h4>
                                                    <span className="text-[9px] text-green-400 font-extrabold uppercase shrink-0">
                                                        {visit.visit_date}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 leading-normal line-clamp-2 italic">
                                                    &ldquo;{visit.description}&rdquo;
                                                </p>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-xs text-center text-gray-500 italic py-8">
                                            {locale === 'de' 
                                                ? 'Keine geplanten Verabredungen' 
                                                : 'No planned visits scheduled'}
                                        </p>
                                    )}
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-4">
                                    {/* Rating Form */}
                                    {user && user.id !== profileId && (
                                        <form onSubmit={handleReviewSubmit} className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3">
                                            <h4 className="text-xs font-bold text-gray-200">
                                                {locale === 'de' ? 'Dieses Profil bewerten' : 'Rate this user'}
                                            </h4>
                                            
                                            {/* Star Selector */}
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "w-6 h-6 transition-colors",
                                                                rating >= star ? "fill-yellow-400 text-yellow-500" : "text-white/20 hover:text-yellow-200"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Review Comment Box */}
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder={locale === 'de' ? 'Schreibe einen Kommentar...' : 'Write a review/comment...'}
                                                required
                                                rows={2}
                                                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white resize-none focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                                            />

                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                                            >
                                                {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                                                {data.reviews.some(r => r.author_id === user.id) 
                                                    ? (locale === 'de' ? 'Bewertung aktualisieren' : 'Update Review') 
                                                    : (locale === 'de' ? 'Bewertung abgeben' : 'Post Review')}
                                            </button>
                                        </form>
                                    )}

                                    {!user && (
                                        <div className="bg-white/2 border border-white/5 p-4 rounded-2xl text-center text-xs text-muted-foreground">
                                            {locale === 'de' ? 'Bitte logge dich ein, um diesen User zu bewerten.' : 'Please sign in to rate this user.'}
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    <div className="space-y-3">
                                        {data.reviews.length > 0 ? (
                                            data.reviews.map((rev) => {
                                                const hasReply = !!rev.reply;
                                                const canDeleteReview = user && (
                                                    user.id === rev.author_id || 
                                                    user.id === profileId || 
                                                    user.email === 'callematic@gmail.com'
                                                );

                                                return (
                                                    <div key={rev.id} className="bg-white/2 border border-white/5 p-4 rounded-2xl space-y-3 flex flex-col">
                                                        
                                                        {/* Review Header */}
                                                        <div className="flex items-start justify-between gap-3 min-w-0">
                                                            <div className="flex items-start gap-2.5 min-w-0">
                                                                <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-900 border border-white/10 shrink-0 flex items-center justify-center relative">
                                                                    {rev.profiles?.avatar_url ? (
                                                                        <Image 
                                                                            src={rev.profiles.avatar_url} 
                                                                            alt={rev.profiles.username || "eFoiler"} 
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    ) : (
                                                                        <User className="w-3.5 h-3.5 text-gray-500" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="text-xs font-bold text-white truncate">
                                                                            @{rev.profiles?.username || "eFoiler"}
                                                                        </span>
                                                                        <span className="text-[8px] text-gray-500">
                                                                            {new Date(rev.created_at).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    {/* Star Display */}
                                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <Star
                                                                                key={star}
                                                                                className={cn(
                                                                                    "w-3 h-3 fill-current",
                                                                                    rev.rating >= star ? "text-yellow-400" : "text-white/10"
                                                                                )}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {canDeleteReview && (
                                                                <button
                                                                    onClick={() => handleDeleteReview(rev.id)}
                                                                    className="p-1 hover:bg-white/5 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Comment text */}
                                                        <p className="text-xs text-gray-200 mt-1 leading-relaxed break-words pl-0.5">
                                                            {rev.comment}
                                                        </p>

                                                        {/* Indented Reply */}
                                                        {hasReply && (
                                                            <div className="pl-4 border-l-2 border-yellow-500/30 space-y-2 mt-1 bg-white/2 p-2.5 rounded-r-xl">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-900 border border-white/10 shrink-0 flex items-center justify-center relative">
                                                                            {rev.reply?.profiles?.avatar_url ? (
                                                                                <Image 
                                                                                    src={rev.reply.profiles.avatar_url} 
                                                                                    alt={rev.reply.profiles.username || "eFoiler"} 
                                                                                    fill
                                                                                    className="object-cover"
                                                                                />
                                                                            ) : (
                                                                                <User className="w-2.5 h-2.5 text-gray-500" />
                                                                            )}
                                                                        </div>
                                                                        <span className="text-[10px] font-bold text-yellow-400">
                                                                            {locale === 'de' ? 'Antwort von' : 'Reply from'} @{rev.reply?.profiles?.username || "eFoiler"}
                                                                        </span>
                                                                    </div>

                                                                    {user && (user.id === rev.reply?.author_id || user.id === profileId || user.email === 'callematic@gmail.com') && (
                                                                        <button
                                                                            onClick={() => handleDeleteReply(rev.reply!.id)}
                                                                            className="p-1 hover:bg-white/5 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <p className="text-[11px] text-gray-300 break-words italic leading-relaxed">
                                                                    &ldquo;{rev.reply?.reply}&rdquo;
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Write Reply Box */}
                                                        {user && user.id === profileId && !hasReply && (
                                                            <div className="pt-2 border-t border-white/5">
                                                                {activeReplyBoxId === rev.id ? (
                                                                    <form 
                                                                        onSubmit={(e) => handleReplySubmit(e, rev.id)}
                                                                        className="flex gap-2 w-full"
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            value={newReplyText}
                                                                            onChange={(e) => setNewReplyText(e.target.value)}
                                                                            placeholder={locale === 'de' ? 'Antworte auf diese Bewertung...' : 'Reply to this review...'}
                                                                            required
                                                                            disabled={submittingReply}
                                                                            className="flex-1 bg-white/3 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-yellow-500/50 focus:outline-none"
                                                                        />
                                                                        <button
                                                                            type="submit"
                                                                            disabled={submittingReply}
                                                                            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                                                        >
                                                                            {submittingReply ? <Loader2 className="w-3 animate-spin" /> : (locale === 'de' ? 'Antworten' : 'Reply')}
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setActiveReplyBoxId(null);
                                                                                setNewReplyText("");
                                                                            }}
                                                                            className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] transition-colors cursor-pointer"
                                                                        >
                                                                            X
                                                                        </button>
                                                                    </form>
                                                                ) : (
                                                                    <div className="flex justify-end">
                                                                        <button
                                                                            onClick={() => setActiveReplyBoxId(rev.id)}
                                                                            className="text-[10px] text-yellow-500/80 hover:text-yellow-400 font-bold transition-colors cursor-pointer flex items-center gap-1 border-none bg-transparent p-0"
                                                                        >
                                                                            💬 {locale === 'de' ? 'Antworten' : 'Reply'}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-center text-gray-500 italic py-8">
                                                {locale === 'de' 
                                                    ? 'Noch keine Bewertungen auf diesem Profil. Schreibe die erste!' 
                                                    : 'No reviews on this profile yet. Write the first one!'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-xs text-red-400 italic">
                        {locale === 'de' ? 'Fehler beim Laden des Profils' : 'Error loading profile info'}
                    </div>
                )}
            </div>
        </div>
    );
}
