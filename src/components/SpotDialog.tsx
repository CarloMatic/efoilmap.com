"use client";

import { X, BatteryCharging, Utensils, Car, Camera, ThumbsUp, Loader2, Star, Edit } from "lucide-react";
import { Spot } from "@/app/actions";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n";
import { verifySpot } from "@/app/actions";
import { supabase } from "@/lib/supabase";

interface SpotDialogProps {
    spot: Spot | null;
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
}


export function SpotDialog({ spot, open, onClose, onEdit }: SpotDialogProps) {
    const [verifying, setVerifying] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [uploading, setUploading] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);

    const { showToast } = useToast();
    const { t } = useLanguage();

    // Reset state when opening a new spot
    useEffect(() => {
        if (open && spot) {
            setRating(0);
            setComment("");
            setVerifying(false);
            setUploading(false);
            setPhotos([]); // Clear first so we don't show old photos
            setReviews([]);
        }
    }, [open, spot?.id]); // Depend on open too so it resets when re-opening? Or just spot id.

    // Fetch photos and reviews on open
    useEffect(() => {
        if (open && spot) {
            supabase.from('spot_photos')
                .select('url')
                .eq('spot_id', spot.id)
                .order('created_at', { ascending: false })
                .then(({ data }) => {
                    if (data) setPhotos(data.map(d => d.url));
                });

            supabase.from('spot_verifications')
                .select('id, rating, comment, created_at')
                .eq('spot_id', spot.id)
                .not('comment', 'is', null) // Only fetch if has comment (or rating?)
                .neq('comment', '') // Only non-empty comments
                .order('created_at', { ascending: false })
                .then(({ data }) => {
                    if (data) setReviews(data);
                });
        }
    }, [open, spot]);

    if (!open || !spot) return null;

    const handleVerify = async () => {
        if (rating === 0) {
            showToast("Please provide a star rating to confirm.", "error");
            return;
        }

        setVerifying(true);
        try {
            const res = await verifySpot(spot.id, rating, comment);
            if (res.success) {
                showToast("Spot confirmed! Thank you.");

                // Optimistic UI Update for Review
                if (comment) {
                    setReviews(prev => [{
                        id: 'temp-' + Date.now(),
                        rating,
                        comment,
                        created_at: new Date().toISOString()
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
        } catch (e) {
            console.error(e);
        } finally {
            setVerifying(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileName = `${spot.id}/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage
                .from('spots')
                .upload(fileName, file);

            if (error) {
                showToast("Upload failed: " + error.message, "error");
            } else {

                // Add reference to spot_photos table
                const publicUrl = supabase.storage.from('spots').getPublicUrl(fileName).data.publicUrl;

                await supabase.from('spot_photos').insert({
                    spot_id: spot.id,
                    url: publicUrl
                });

                // Optimistic update
                setPhotos(prev => [publicUrl, ...prev]);
                showToast("Photo uploaded successfully!");
            }
        } catch (e) {
            showToast("Upload error.", "error");
        } finally {
            setUploading(false);
        }
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
                <div className="p-4 border-b flex items-start justify-between bg-muted/30">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold tracking-tight">{spot.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {/* Status and Rating Row */}
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-bold uppercase border",
                                spot.status === "ALLOWED" && "bg-green-500/10 text-green-500 border-green-500/20",
                                spot.status === "TOLERATED" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                spot.status === "FORBIDDEN" && "bg-red-500/10 text-red-500 border-red-500/20",
                                spot.status === "UNCLEAR" && "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            )}>
                                {spot.status === "ALLOWED" ? t('forms.allowed') :
                                    spot.status === "TOLERATED" ? t('forms.tolerated') :
                                        spot.status === "FORBIDDEN" ? t('forms.forbidden') : "Unclear"}
                            </span>
                            {spot.average_rating ? (
                                <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                                    <Star className="w-3 h-3 fill-current" />
                                    {spot.average_rating.toFixed(1)} <span className="text-muted-foreground font-normal">({spot.rating_count})</span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Suggest Edit Link - Top Right */}
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors hover:underline mr-4"
                    >
                        <Edit className="w-3 h-3" />
                        {t('forms.suggest_edit')}
                    </button>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

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
                                        <img src={url} alt="Spot" className="w-full h-full object-cover" />
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
                            <div className="space-y-3">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="p-3 bg-muted/30 rounded-lg border text-sm">
                                        <div className="flex items-center gap-1 mb-1 text-yellow-500 text-xs">
                                            {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                            <span className="text-muted-foreground ml-auto">{new Date(rev.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-foreground/90">{rev.comment}</p>
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
                            {t('forms.post_review')}
                        </button>
                    </div>

                </div>

            </div>
        </div >
    );
}
