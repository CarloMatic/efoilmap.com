"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Camera } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { createSpot, updateSpot, Spot } from "@/app/actions";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/image-utils";

interface AddSpotDialogProps {
    open: boolean;
    onClose: () => void;
    location: [number, number] | null;
    initialData?: Spot | null;
    onSuccess: (spot?: Spot) => void;
}

export function AddSpotDialog({ open, onClose, location, initialData, onSuccess }: AddSpotDialogProps) {
    const { user } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { t, locale } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"ALLOWED" | "TOLERATED" | "FORBIDDEN" | "UNCLEAR">("UNCLEAR");
    const [attributes, setAttributes] = useState<{
        parking: boolean;
        parking_distance?: "<10m" | "<50m" | "<100m" | ">100m";
        charging: boolean;
        food: boolean;
    }>({
        parking: false,
        charging: false,
        food: false
    });

    // New: Photo Upload State
    const [files, setFiles] = useState<File[]>([]);

    // Reset function
    const resetForm = () => {
        setName("");
        setStatus("UNCLEAR");
        setAttributes({ parking: false, charging: false, food: false });
        setFiles([]);
    };

    // Load initial data for edit mode
    useEffect(() => {
        if (open) {
            if (initialData) {
                setName(initialData.name);
                setStatus(initialData.status);
                setAttributes({
                    parking: !!initialData.attributes?.parking,
                    parking_distance: initialData.attributes?.parking_distance,
                    charging: !!initialData.attributes?.charging,
                    food: !!initialData.attributes?.food,
                });
                setFiles([]); // Don't load existing photos here, only for new uploads
            } else {
                resetForm();
            }
        }
    }, [open, initialData]);

    if (!open) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadPhotos = async (spotId: string) => {
        if (files.length === 0) return { success: true };

        for (const file of files) {
            // Compress Image (Spots use default 1200px)
            const compressedBlob = await compressImage(file);
            const fileName = `${spotId}/${Date.now()}-${file.name.split('.')[0]}.webp`;
            
            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('spots')
                .upload(fileName, compressedBlob, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (uploadError) {
                console.error(`Storage Upload Error (Spot: ${spotId}):`, uploadError);
                return { success: false, error: `Upload failed for spot ${spotId}: ${uploadError.message}` };
            }

            // 2. Get Public URL
            const publicUrl = supabase.storage.from('spots').getPublicUrl(fileName).data.publicUrl;

            // 3. Insert into Database
            const { error: insertError } = await supabase.from('spot_photos').insert({
                spot_id: spotId,
                url: publicUrl
            });

            if (insertError) {
                console.error("Database Insert Error (spot_photos):", insertError);
                return { success: false, error: `Database error: ${insertError.message}` };
            }
        }
        return { success: true };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        setLoading(true);
        setError(null);

        try {
            if (initialData) {
                // UPDATE MODE
                const { data: { session } } = await supabase.auth.getSession();
                const res = await updateSpot(initialData.id, {
                    name,
                    status,
                    attributes
                }, session?.access_token);
                if (res.success) {
                    const uploadRes = await uploadPhotos(initialData.id); // Upload photos if any
                    if (!uploadRes.success) {
                        setError(uploadRes.error || "Photo upload failed");
                        setLoading(false);
                        return;
                    }
                    onSuccess({
                        ...initialData,
                        name, status, attributes
                    });
                    onClose();
                } else {
                    setError(res.error || "Failed to update");
                }
            } else {
                // CREATE MODE
                if (!location) return;
                const { data: { session } } = await supabase.auth.getSession();
                const res = await createSpot({
                    name,
                    status,
                    location: {
                        type: "Point",
                        coordinates: location
                    },
                    attributes,
                    source_locale: locale
                }, session?.access_token);
                if (res.success && res.data) {
                    const uploadRes = await uploadPhotos(res.data.id); // Upload photos to new spot
                    if (!uploadRes.success) {
                        setError(uploadRes.error || "Photo upload failed");
                        setLoading(false);
                        return;
                    }
                    onSuccess(res.data);
                    onClose();
                } else {
                    setError(res.error || "Failed to save");
                }
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setLoading(false);
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
            <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 animate-in zoom-in-95 fade-in flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">
                    {initialData ? t('forms.update') : t('add_spot')}
                </h2>

                {!location && !initialData ? (
                    <p className="text-muted-foreground">{t('consent.map_blocked')}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
                        {/* Location Preview */}
                        {!initialData && location && (
                            <div className="p-3 bg-muted/50 rounded-lg text-xs font-mono text-muted-foreground">
                                📍 {location[1].toFixed(6)}, {location[0].toFixed(6)}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">{t('forms.name')}</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Sunny Bay Beach"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Status Select */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">{t('forms.status')}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(["ALLOWED", "TOLERATED", "FORBIDDEN", "UNCLEAR"] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStatus(s)}
                                        className={`px-3 py-2 text-xs font-bold rounded-md border transition-all ${status === s
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background text-muted-foreground border-input hover:border-primary/50"
                                            }`}
                                    >
                                        {s === "ALLOWED" ? t('forms.allowed') :
                                            s === "TOLERATED" ? t('forms.tolerated') :
                                                s === "FORBIDDEN" ? t('forms.forbidden') : "Unclear"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">{t('forms.amenities')}</label>

                            {/* Parking Group */}
                            <div className="flex flex-col gap-2 p-2 border rounded-lg bg-muted/20">
                                <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                                    <input
                                        type="checkbox"
                                        checked={attributes.parking}
                                        onChange={(e) => setAttributes({ ...attributes, parking: e.target.checked })}
                                        className="rounded border-input text-primary focus:ring-primary"
                                    />
                                    🅿️ {t('filters.parking')}
                                </label>

                                {attributes.parking && (
                                    <div className="ml-6 flex flex-wrap gap-2">
                                        {(["<10m", "<50m", "<100m", ">100m"] as const).map(dist => (
                                            <button
                                                key={dist}
                                                type="button"
                                                onClick={() => setAttributes({ ...attributes, parking_distance: dist })}
                                                className={`px-2 py-1 text-[10px] rounded border ${attributes.parking_distance === dist
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background border-input hover:bg-muted"
                                                    }`}
                                            >
                                                {dist}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Other Amenities */}
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={attributes.charging}
                                        onChange={(e) => setAttributes({ ...attributes, charging: e.target.checked })}
                                        className="rounded border-input text-primary focus:ring-primary"
                                    />
                                    ⚡ {t('filters.charging')}
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={attributes.food}
                                        onChange={(e) => setAttributes({ ...attributes, food: e.target.checked })}
                                        className="rounded border-input text-primary focus:ring-primary"
                                    />
                                    🍔 {t('filters.food')}
                                </label>
                            </div>
                        </div>

                        {/* New: Photo Upload Section */}
                        <div className="space-y-2 pt-2 border-t">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Camera className="w-4 h-4" /> {t('forms.add_photo')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {files.map((file, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={URL.createObjectURL(file)} alt={`Upload preview ${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-16 h-16 flex items-center justify-center border border-dashed rounded cursor-pointer hover:bg-muted/50">
                                    <span className="text-2xl text-muted-foreground">+</span>
                                    <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 flex justify-end gap-3 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                            >
                                {t('common.close')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-md shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? t('forms.creating') : (initialData ? t('forms.update') : t('forms.save'))}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <AuthDialog 
                open={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
            />
        </div>
    );
}
