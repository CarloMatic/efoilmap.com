"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Camera, Store } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { createSpot, updateSpot, Spot } from "@/app/actions";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

export const GOOGLE_MAPS_TIP: Record<string, string> = {
    de: "Tipp: Du findest Breiten- und Längengrad z.B. in der URL von Google Maps (z.B. @50.638,6.385).",
    en: "Tip: You can find latitude & longitude in the URL of Google Maps (e.g. @50.638,6.385).",
    es: "Consejo: Puedes encontrar la latitud y longitud en la URL de Google Maps (por ejemplo, @50.638,6.385).",
    fr: "Astuce : Tu trouves la latitude et la longitude dans l'URL de Google Maps (par ex. @50.638,6.385).",
    it: "Suggerimento: Puoi trovare latitudine e longitudine nell'URL di Google Maps (es. @50.638,6.385).",
    pt: "Dica: Podes encontrar a latitude e longitude no URL do Google Maps (ex: @50.638,6.385).",
    nl: "Tip: Je vindt de breedte- en lengtegraad in de URL van Google Maps (bijv. @50.638,6.385).",
    pl: "Wskazówka: Szerokość i długość geograficzną znajdziesz np. w adresie URL Google Maps (np. @50.638,6.385).",
    sv: "Tips: Du hittar latitud och longitud i URL-adressen för Google Maps (t.ex. @50.638,6.385)."
};

export const MOVE_ON_MAP_BTN: Record<string, string> = {
    de: "Spot auf Karte verschieben",
    en: "Move Spot on Map",
    es: "Mover punto en el mapa",
    fr: "Déplacer le spot sur la carte",
    it: "Sposta lo spot sulla mappa",
    pt: "Mover o spot no mapa",
    nl: "Spot op kaart verplaatsen",
    pl: "Przesuń spot na mapie",
    sv: "Flytta spotten på kartan"
};

export const MOVE_POSITION_TIP: Record<string, string> = {
    de: "Tipp: Klicke auf den Button oben und wähle die neue Position direkt durch einen Klick auf der Karte aus.",
    en: "Tip: Click the button above and select the new position directly by clicking on the map.",
    es: "Consejo: Haz clic en el botón de arriba y selecciona la nueva posición directamente haciendo clic en el mapa.",
    fr: "Astuce : Clique sur le bouton ci-dessus et choisis la neue position directement en cliquant sur la carte.",
    it: "Suggerimento: Clicca sul pulsante sopra e seleziona la nuova posizione direttamente cliccando sulla mappa.",
    pt: "Dica: Clica no botão acima e seleciona a nova posição diretamente clicando no mapa.",
    nl: "Tip: Klik op de knop hierboven en kies de neue positie direct door op de kaart te klikken.",
    pl: "Wskazówka: Kliknij przycisk powyżej i wybierz nową pozycję bezpośrednio klikając na mapie.",
    sv: "Tips: Klicka på knappen ovan och välj den nya positionen direkt genom kartklick."
};

interface AddSpotDialogProps {
    open: boolean;
    onClose: () => void;
    location: [number, number] | null;
    initialData?: Spot | null;
    onSuccess: (spot?: Spot) => void;
    isMovingPosition?: boolean;
    onInitiateMove?: () => void;
}

export function AddSpotDialog({ open, onClose, location, initialData, onSuccess, isMovingPosition = false, onInitiateMove }: AddSpotDialogProps) {
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
        rental: boolean;
        description?: string;
        website?: string;
    }>({
        parking: false,
        charging: false,
        food: false,
        rental: false,
        website: ""
    });

    const [showWebsiteField, setShowWebsiteField] = useState(false);

    // Coordinate States for Creators
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    // New: Photo Upload State
    const [files, setFiles] = useState<File[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<{ id: string; url: string }[]>([]);

    const isAdmin = user?.email === 'callematic@gmail.com';
    const isCreator = !!(user && initialData && (initialData.user_id === user.id || initialData.created_by === user.id || isAdmin));

    // Reset function
    const resetForm = () => {
        setName("");
        setStatus("UNCLEAR");
        setAttributes({ parking: false, charging: false, food: false, rental: false, website: "" });
        setShowWebsiteField(false);
        setFiles([]);
        setExistingPhotos([]);
        setLat("");
        setLng("");
    };

    // Load initial data for edit mode
    useEffect(() => {
        if (open) {
            if (initialData) {
                setName(initialData.name);
                setStatus(initialData.status);
                setLat(initialData.location.coordinates[1].toString());
                setLng(initialData.location.coordinates[0].toString());
                setAttributes({
                    parking: !!initialData.attributes?.parking,
                    parking_distance: initialData.attributes?.parking_distance,
                    charging: !!initialData.attributes?.charging,
                    food: !!initialData.attributes?.food,
                    rental: !!initialData.attributes?.rental,
                    description: initialData.attributes?.description || "",
                    website: initialData.attributes?.website || "",
                });
                setShowWebsiteField(!!initialData.attributes?.website);
                setFiles([]); // Don't load existing photos here, only for new uploads
                supabase.from('spot_photos')
                    .select('id, url')
                    .eq('spot_id', initialData.id)
                    .then(({ data }) => {
                        if (data) setExistingPhotos(data);
                    });
            } else {
                resetForm();
            }
        }
    }, [open, initialData]);

    useEffect(() => {
        if (open && location) {
            setLat(location[1].toString());
            setLng(location[0].toString());
        }
    }, [location, open]);

    if (!open) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingPhoto = async (photoId: string, photoUrl: string) => {
        setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
        const { error: dbError } = await supabase
            .from('spot_photos')
            .delete()
            .eq('id', photoId);
            
        if (dbError) {
            console.error("Failed to delete photo from DB:", dbError);
            return;
        }

        try {
            const parts = photoUrl.split('/public/spots/');
            if (parts.length > 1) {
                const storagePath = decodeURIComponent(parts[1]);
                await supabase.storage.from('spots').remove([storagePath]);
            }
        } catch (storageErr) {
            console.error("Failed to delete photo from storage:", storageErr);
        }
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
                const updatedCoords: [number, number] = [parseFloat(lng), parseFloat(lat)];
                const res = await updateSpot(initialData.id, {
                    name,
                    status,
                    attributes,
                    location: isCreator ? {
                        type: "Point",
                        coordinates: updatedCoords
                    } : undefined
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
                        name,
                        status,
                        attributes,
                        location: isCreator ? {
                            type: "Point",
                            coordinates: updatedCoords
                        } : initialData.location
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
        <div className={cn("fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4", isMovingPosition && "hidden")}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full sm:max-w-md bg-card border-x border-t sm:border border-border rounded-t-2xl sm:rounded-xl shadow-2xl p-6 animate-in slide-in-from-bottom-10 sm:zoom-in-95 sm:fade-in flex flex-col max-h-[92dvh] sm:max-h-[90vh]">
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

                        {/* Creator Coordinates Editor */}
                        {initialData && isCreator && (
                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                                        <span>📍</span> {locale === 'de' ? 'Position' : 'Position'}
                                    </h3>
                                    <span className="text-[10px] font-mono text-gray-400">
                                        {lat ? parseFloat(lat).toFixed(6) : "0.000000"}, {lng ? parseFloat(lng).toFixed(6) : "0.000000"}
                                    </span>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={onInitiateMove}
                                    className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-300 hover:text-blue-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                >
                                    <span>📍</span> {MOVE_ON_MAP_BTN[locale] || MOVE_ON_MAP_BTN['en']}
                                </button>
                                
                                <p className="text-[9px] text-blue-300/60 leading-relaxed italic text-center">
                                    💡 {MOVE_POSITION_TIP[locale] || MOVE_POSITION_TIP['en']}
                                </p>
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

                        {/* Description Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">{t('forms.description')}</label>
                            <textarea
                                value={attributes.description || ""}
                                onChange={(e) => setAttributes({ ...attributes, description: e.target.value })}
                                placeholder={t('forms.description_placeholder')}
                                rows={2}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
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
                                                s === "FORBIDDEN" ? t('forms.forbidden') : t('forms.unclear')}
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
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={attributes.rental}
                                        onChange={(e) => setAttributes({ ...attributes, rental: e.target.checked })}
                                        className="rounded border-input text-primary focus:ring-primary"
                                    />
                                    <Store className="w-4 h-4 text-purple-500" /> {t('filters.rental')}
                                </label>
                            </div>
                        </div>

                        {/* Website Input Section */}
                        <div className="space-y-2 pt-2 border-t">
                            {!showWebsiteField ? (
                                <button
                                    type="button"
                                    onClick={() => setShowWebsiteField(true)}
                                    className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline py-1 cursor-pointer"
                                >
                                    🌐 {t('forms.add_website')}
                                </button>
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium">🌐 {t('forms.website')}</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowWebsiteField(false);
                                                setAttributes({ ...attributes, website: "" });
                                            }}
                                            className="text-xs text-red-500 hover:underline cursor-pointer"
                                        >
                                            {t('common.remove')}
                                        </button>
                                    </div>
                                    <input
                                        type="url"
                                        value={attributes.website || ""}
                                        onChange={(e) => setAttributes({ ...attributes, website: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Photo Section */}
                        <div className="space-y-2 pt-2 border-t">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Camera className="w-4 h-4" /> {t('forms.add_photo')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {/* Render existing photos with small X */}
                                {existingPhotos.map((photo) => (
                                    <div key={photo.id} className="relative w-16 h-16 rounded overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photo.url} alt="Existing spot photo" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => deleteExistingPhoto(photo.id, photo.url)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 cursor-pointer hover:bg-red-600 transition-colors"
                                            title="Delete photo"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Render new files */}
                                {files.map((file, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={URL.createObjectURL(file)} alt={`Upload preview ${i}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 cursor-pointer hover:bg-red-600 transition-colors"
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
