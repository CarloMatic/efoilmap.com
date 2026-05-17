"use client";

import { X, BatteryCharging, Utensils, Car, Camera, ThumbsUp, Loader2, Star, Share2, Sparkles, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { Spot } from "@/app/actions";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n";
import { verifySpot } from "@/app/actions";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { compressImage } from "@/lib/image-utils";

interface SpotDialogProps {
    spot: Spot | null;
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
}
interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
        bio: string | null;
    };
}


export function SpotDialog({ spot, open, onClose, onEdit }: SpotDialogProps) {
    const [verifying, setVerifying] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [uploading, setUploading] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [hasExistingReview, setHasExistingReview] = useState(false);

    const { user, profile } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { showToast } = useToast();
    const { t, locale } = useLanguage();

    // Reset state when opening a new spot
    useEffect(() => {
        if (open && spot) {
            const timer = setTimeout(() => {
                setRating(0);
                setComment("");
                setVerifying(false);
                setUploading(false);
                setPhotos([]); // Clear first so we don't show old photos
                setReviews([]);
                setHasExistingReview(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, spot?.id]); // Reset only on spot change or when opened

    // Fetch photos and reviews on open
    useEffect(() => {
        if (open && spot) {
            supabase.from('spot_photos')
                .select('url')
                .eq('spot_id', spot.id)
                .order('created_at', { ascending: false })
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Fetch Photos Error:", error);
                    }
                    if (data) setPhotos(data.map(d => d.url));
                });

            supabase.from('spot_verifications')
                .select('id, user_id, rating, comment, created_at, profiles(username, avatar_url, bio)')
                .eq('spot_id', spot.id)
                .order('created_at', { ascending: false })
                .then(({ data }) => {
                    if (data) {
                        let userReview: any = null;

                        const mapped: Review[] = data
                            .filter(d => {
                                if (user && d.user_id === user.id) {
                                    userReview = d;
                                    return false; // Hide own review from community list
                                }
                                // Only show community reviews that have a comment
                                return d.comment && d.comment.trim() !== "";
                            })
                            .map((d) => ({
                                id: d.id,
                                rating: d.rating,
                                comment: d.comment,
                                created_at: d.created_at,
                                profiles: Array.isArray(d.profiles) ? d.profiles[0] : d.profiles
                            }));

                        if (userReview) {
                            setRating(userReview.rating || 0);
                            setComment(userReview.comment || "");
                            setHasExistingReview(true);
                        }

                        setReviews(mapped);
                    }
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, spot?.id, user?.id]);

    if (!open || !spot) return null;

    const handleVerify = async () => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        if (rating === 0) {
            showToast("Please provide a star rating to confirm.", "error");
            return;
        }

        setVerifying(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await verifySpot(spot.id, rating, comment, session?.access_token);
            if (res.success) {
                showToast("Spot confirmed! Thank you.");

                // Optimistic UI Update for Review
                if (comment) {
                    setReviews(prev => [{
                        id: 'temp-' + Date.now(),
                        rating,
                        comment,
                        created_at: new Date().toISOString(),
                        profiles: {
                            username: profile?.username || user?.email?.split('@')[0] || "User",
                            avatar_url: profile?.avatar_url || null,
                            bio: profile?.bio || null
                        }
                    }, ...prev]);
                }

                // Clear input
                setRating(0);
                setComment("");

                // Do NOT close dialog, let user see it added? No, usually we close or show success state.
                // User said "Confirm Spot doesn't add review". So we should show it.
                // onClose(); 
            } else {
                showToast("Verification failed: " + res.error, "error");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setVerifying(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Compress Image (Spots use default 1200px)
            const compressedBlob = await compressImage(file);
            const fileName = `${spot.id}/${Date.now()}-${file.name.split('.')[0]}.webp`;
            const { error } = await supabase.storage
                .from('spots')
                .upload(fileName, compressedBlob, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (error) {
                showToast("Upload failed: " + error.message, "error");
            } else {

                // Add reference to spot_photos table
                const publicUrl = supabase.storage.from('spots').getPublicUrl(fileName).data.publicUrl;

                const { error: insertError } = await supabase.from('spot_photos').insert({
                    spot_id: spot.id,
                    url: publicUrl
                });

                if (insertError) {
                    console.error("Database Insert Error (spot_photos):", insertError);
                    showToast("Database error: " + insertError.message, "error");
                } else {
                    // Optimistic update
                    setPhotos(prev => [publicUrl, ...prev]);
                    showToast("Photo uploaded successfully!");
                }
            }
        } catch {
            showToast("Upload error.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast(t('common.link_copied') || "Link copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="p-4 border-b flex flex-col gap-3 bg-muted/30">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <h2 className="text-xl font-bold tracking-tight leading-tight">{spot.name}</h2>
                            {/* AI Translation Badge */}
                            {spot.source_locale && spot.source_locale !== locale && (
                                <p className="text-[10px] text-muted-foreground italic mt-0.5">
                                    {t('ugc.ai_translated')}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                {/* Status and Rating Row */}
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border whitespace-nowrap",
                                    spot.status === "ALLOWED" && "bg-green-500/10 text-green-500 border-green-500/20",
                                    spot.status === "TOLERATED" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                    spot.status === "FORBIDDEN" && "bg-red-500/10 text-red-500 border-red-500/20",
                                    spot.status === "UNCLEAR" && "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                )}>
                                    {spot.status === "ALLOWED" ? t('forms.allowed') :
                                        spot.status === "TOLERATED" ? t('forms.tolerated') :
                                            spot.status === "FORBIDDEN" ? t('forms.forbidden') : t('forms.unclear')}
                                </span>
                                {spot.average_rating ? (
                                    <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                                        <Star className="w-3 h-3 fill-current" />
                                        {spot.average_rating.toFixed(1)} <span className="text-muted-foreground font-normal">({spot.rating_count})</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1 -mr-1 rounded-full hover:bg-muted transition-colors shrink-0"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-2 py-1.5 rounded-md"
                            title="Share this spot"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            {t('common.share') || "Share"}
                        </button>

                        {spot.attributes?.website && (
                            <a
                                href={spot.attributes.website.startsWith('http') ? spot.attributes.website : `https://${spot.attributes.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-2 py-1.5 rounded-md cursor-pointer"
                                title="Visit website"
                            >
                                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    {t('forms.website')}
                                </span>
                            </a>
                        )}

                        <button
                            onClick={() => {
                                if (!user) {
                                    setIsAuthOpen(true);
                                    return;
                                }
                                onEdit();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-gray-300 transition-all active:scale-95 ml-auto"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            {t('forms.suggest_edit')}
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Description Section */}
                    {spot.attributes?.description && (
                        <div className="text-sm text-foreground/90 whitespace-pre-line bg-muted/10 p-3 rounded-lg border border-border/50">
                            {spot.attributes.description}
                        </div>
                    )}

                    {/* Amenities Section - Plain Text/Icons (No borders) */}
                    {(spot.attributes?.parking || spot.attributes?.charging || spot.attributes?.food) && (
                        <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
                            {spot.attributes.parking && (
                                <span className="flex items-center gap-1.5">
                                    <Car className="w-4 h-4 text-blue-500" />
                                    {t('filters.parking')} {spot.attributes.parking_distance ? <span className="text-xs text-muted-foreground">({spot.attributes.parking_distance})</span> : null}
                                </span>
                            )}
                            {spot.attributes.charging && (
                                <span className="flex items-center gap-1.5">
                                    <BatteryCharging className="w-4 h-4 text-green-500" /> {t('filters.charging')}
                                </span>
                            )}
                            {spot.attributes.food && (
                                <span className="flex items-center gap-1.5">
                                    <Utensils className="w-4 h-4 text-orange-500" /> {t('filters.food')}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Photos Section */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                                {t('forms.photo_upload')}
                            </h3>
                            <label className="inline-flex items-center gap-1 px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded text-xs font-medium cursor-pointer transition-colors">
                                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                                {t('forms.add_photo')}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        {photos.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {photos.map((url, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`Spot photo ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-muted-foreground italic p-4 text-center border border-dashed border-border rounded-lg">
                                {t('forms.no_photos')}
                            </div>
                        )}
                    </div>

                    {/* Recent Reviews List */}
                    {reviews.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 tracking-wider">{t('forms.community_reviews')}</h3>
                            <div className="space-y-4">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="p-4 bg-muted/20 rounded-2xl border border-border/50 transition-all hover:bg-muted/30 group">
                                        <div className="flex items-start gap-3 mb-2">
                                            {/* Avatar with Bio Popover */}
                                            <div className="relative group/avatar">
                                                <div 
                                                    className="w-10 h-10 rounded-full bg-gray-800 border border-border/50 overflow-hidden flex-shrink-0 cursor-help hover:ring-2 hover:ring-blue-500/30 transition-all relative"
                                                >
                                                    {rev.profiles?.avatar_url ? (
                                                        <Image 
                                                            src={rev.profiles.avatar_url} 
                                                            alt={rev.profiles.username || "User"} 
                                                            width={40} 
                                                            height={40} 
                                                            sizes="40px"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                            <UserIcon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Tooltip */}
                                                {rev.profiles?.bio && (
                                                    <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-gray-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all z-50 text-xs text-gray-300 pointer-events-none">
                                                        <p className="font-bold text-white mb-1">{rev.profiles.username}</p>
                                                        {rev.profiles.bio}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-sm font-bold text-foreground truncate">
                                                        {rev.profiles?.username || 'User'}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                        {new Date(rev.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={cn(
                                                                "w-3 h-3",
                                                                i < rev.rating ? "fill-current" : "text-gray-600"
                                                            )} 
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-foreground/90 leading-relaxed italic">
                                                    "{rev.comment}"
                                                </p>
                                                {rev.profiles?.bio && (
                                                    <p className="text-[10px] text-blue-400/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {/* This helps prompt hover but isn't required anymore since tooltip handles it. Left for extra UX */}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Verification Form */}
                    <div className="bg-muted/20 p-4 rounded-xl border border-border">
                        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 tracking-wider">{t('forms.review_title')}</h3>
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8 transition-colors",
                                            rating >= star ? "fill-yellow-400 text-yellow-500" : "text-input hover:text-yellow-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t('forms.review_placeholder')}
                            className="w-full p-3 rounded-lg bg-background border border-input text-sm resize-none focus:ring-2 focus:ring-primary focus:outline-none h-20 mb-3"
                        />

                        <button
                            onClick={handleVerify}
                            disabled={verifying}
                            className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                            {hasExistingReview ? (t('forms.update_review') || "Update Review") : (t('forms.post_review') || "Post Review")}
                        </button>
                    </div>

                </div>

            </div>

            <AuthDialog 
                open={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
            />
        </div>
    );
}
