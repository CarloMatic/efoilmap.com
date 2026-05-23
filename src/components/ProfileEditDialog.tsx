import { useState, useRef, useEffect } from "react";
import { X, User, Loader2, Camera, Check, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { compressImage } from "@/lib/image-utils";

interface ProfileEditDialogProps {
    open: boolean;
    onClose: () => void;
}

export function ProfileEditDialog({ open, onClose }: ProfileEditDialogProps) {
    const { user, profile, updateProfile, signOut } = useAuth();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();
    const { t } = useLanguage();

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "");
            setBio(profile.bio || "");
        }
    }, [profile, open]);

    if (!open || !user) return null;

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Compress Image (Avatars are 400px)
            const compressedBlob = await compressImage(file, 400);
            const filePath = `${user.id}/${Date.now()}.webp`;

            // 2. Delete old avatar if exists
            if (profile?.avatar_url) {
                try {
                    const oldPath = profile.avatar_url.split('/public/avatars/')[1];
                    if (oldPath) {
                        await supabase.storage.from('avatars').remove([oldPath]);
                    }
                } catch (e) {
                    console.warn("Could not delete old avatar:", e);
                }
            }

            // 3. Upload new compressed image
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, compressedBlob, {
                    contentType: 'image/webp',
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            await updateProfile({ avatar_url: publicUrl });
            showToast(t('auth.avatar_updated'), "success");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            showToast(message, "error");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!user) return;

        setUploading(true);
        try {
            // 1. Delete old avatar if exists
            if (profile?.avatar_url) {
                try {
                    const oldPath = profile.avatar_url.split('/public/avatars/')[1];
                    if (oldPath) {
                        await supabase.storage.from('avatars').remove([oldPath]);
                    }
                } catch (e) {
                    console.warn("Could not delete old avatar:", e);
                }
            }

            // 2. Set avatar_url to null in DB
            const { error } = await updateProfile({ avatar_url: null });
            if (error) throw error;

            showToast("Profilbild gelöscht", "success");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            showToast(message, "error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await updateProfile({ 
                username: username.trim(),
                bio: bio.trim()
            });
            if (error) throw error;
            showToast(t('auth.profile_updated'), "success");
            onClose();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={onClose} />

            <div className="relative w-full max-w-md bg-gray-900 border border-white/20 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-400" />
                            {t('common.profile')}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/50 bg-gray-800">
                                {profile?.avatar_url ? (
                                    <Image 
                                        src={profile.avatar_url} 
                                        alt="Avatar" 
                                        width={96} 
                                        height={96} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-all scale-90 group-hover:scale-100 cursor-pointer"
                                title="Bild ändern"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            {profile?.avatar_url && (
                                <button 
                                    type="button"
                                    onClick={handleDeleteAvatar}
                                    className="absolute bottom-0 left-0 p-2 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-500 transition-all scale-90 group-hover:scale-100 cursor-pointer"
                                    title="Bild löschen"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleAvatarUpload} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-3">{t('auth.avatar_desc')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">{t('auth.username')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">{t('auth.bio')}</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    placeholder={t('auth.bio_placeholder')}
                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => { signOut(); onClose(); }}
                                className="flex-1 bg-white/5 hover:bg-red-500/10 text-red-400 font-semibold py-4 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                {t('common.logout')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-blue-400/30"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                {t('common.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
