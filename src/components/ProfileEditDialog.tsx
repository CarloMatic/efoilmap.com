import { useState, useRef, useEffect } from "react";
import { X, User, Loader2, Camera, Check, MessageSquare, LogOut, Bookmark, MapPin, Star, Bell, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { compressImage } from "@/lib/image-utils";
import { getUserBookmarks, Spot } from "@/app/actions";
import { cn } from "@/lib/utils";

interface ProfileEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectSpot?: (spot: Spot) => void;
}

const toggleTranslations: Record<string, { title: string; desc: string }> = {
  de: {
    title: "Neue Termine an gespeicherten Spots",
    desc: "E-Mail erhalten, wenn jemand einen neuen Termin an einem Spot plant, den du gespeichert oder bewertet hast."
  },
  en: {
    title: "New appointments at saved spots",
    desc: "Receive an email when someone plans a new appointment at a spot you saved or rated."
  },
  es: {
    title: "Nuevos compromisos en spots guardados",
    desc: "Recibir un correo electrónico cuando alguien planee una nueva cita en un spot que hayas guardado o valorado."
  },
  fr: {
    title: "Nouveaux rendez-vous sur les spots enregistrés",
    desc: "Recevoir un e-mail quand quelqu'un planifie un nouveau rendez-vous sur un spot que tu as enregistré ou évalué."
  },
  it: {
    title: "Nuovi appuntamenti nei spot salvati",
    desc: "Ricevi un'e-mail quando qualcuno pianifica un nuovo appuntamento in uno spot che hai salvato o valutato."
  },
  pt: {
    title: "Novos compromissos em spots guardados",
    desc: "Receber um e-mail quando alguém planejar um novo compromisso em um spot que você guardou ou classificou."
  },
  nl: {
    title: "Nieuwe afspraken op bewaarde spots",
    desc: "Ontvang een e-mail wanneer iemand een nieuwe afspraak plant op een spot die je hebt opgeslagen of beoordeeld."
  },
  pl: {
    title: "Nowe terminy na zapisanych spotach",
    desc: "Otrzymuj e-mail, gdy ktoś zaplanuje nowy termin na spocie, który zapisałeś lub oceniłeś."
  },
  sv: {
    title: "Nya tider på sparade spots",
    desc: "Få ett e-postmeddelande när någon planerar en ny tid på en spot som du har sparat eller betygsatt."
  }
};

const settingsSavedText: Record<string, string> = {
  de: "Einstellungen gespeichert!",
  en: "Settings saved successfully!",
  es: "¡Ajustes guardados con éxito!",
  fr: "Paramètres enregistrés avec succès !",
  it: "Impostazioni salvate con successo!",
  pt: "Configurações salvas com sucesso!",
  nl: "Instellingen succesvol opgeslagen!",
  pl: "Ustawienia zapisane pomyślnie!",
  sv: "Inställningarna har sparats!"
};

export function ProfileEditDialog({ open, onClose, onSelectSpot }: ProfileEditDialogProps) {
    const { user, profile, updateProfile, signOut } = useAuth();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();
    const { t, locale } = useLanguage();

    const [bookmarks, setBookmarks] = useState<Spot[]>([]);
    const [bookmarksLoading, setBookmarksLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "settings" | "bookmarks">("profile");

    const [emailPrefVisits, setEmailPrefVisits] = useState(true);
    const [emailPrefQuestions, setEmailPrefQuestions] = useState(true);
    const [emailPrefAppointments, setEmailPrefAppointments] = useState(true);
    const [aiTranslationEnabled, setAiTranslationEnabled] = useState(true);
    const [notificationLocale, setNotificationLocale] = useState("de");

    const loadBookmarks = async () => {
        if (!user) return;
        setBookmarksLoading(true);
        try {
            const list = await getUserBookmarks();
            setBookmarks(list);
        } catch (e) {
            console.error("Load bookmarks error:", e);
        } finally {
            setBookmarksLoading(false);
        }
    };

    useEffect(() => {
        if (open && user) {
            loadBookmarks();
        }
    }, [open, user]);

    useEffect(() => {
        window.addEventListener("reload-bookmarks", loadBookmarks);
        return () => window.removeEventListener("reload-bookmarks", loadBookmarks);
    }, []);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "");
            setBio(profile.bio || "");
            setEmailPrefVisits((profile as any).email_pref_visits !== false);
            setEmailPrefQuestions((profile as any).email_pref_questions !== false);
            setEmailPrefAppointments((profile as any).email_pref_appointments !== false);
            setAiTranslationEnabled((profile as any).ai_translation_enabled !== false);
            setNotificationLocale((profile as any).locale || locale || "de");
        }
    }, [profile, open, locale]);

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

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await updateProfile({ 
                email_pref_visits: emailPrefVisits,
                email_pref_questions: emailPrefQuestions,
                email_pref_appointments: emailPrefAppointments,
                ai_translation_enabled: aiTranslationEnabled,
                locale: notificationLocale
            } as any);
            if (error) throw error;
            showToast(settingsSavedText[locale] || settingsSavedText.en, "success");
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
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-400" />
                            {t('common.profile')}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs Switcher */}
                    <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none focus:outline-none",
                                activeTab === "profile"
                                    ? "bg-blue-600 text-white shadow-lg font-extrabold"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            <User className="w-3.5 h-3.5" />
                            {locale === 'de' ? 'Profil' : 'Profile'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("bookmarks")}
                            className={cn(
                                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none focus:outline-none",
                                activeTab === "bookmarks"
                                    ? "bg-blue-600 text-white shadow-lg font-extrabold"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            <Bookmark className="w-3.5 h-3.5" />
                            {locale === 'de' ? 'Merkliste' : 'Saved'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("settings")}
                            className={cn(
                                "px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border-none focus:outline-none shrink-0",
                                activeTab === "settings"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                            title={locale === 'de' ? 'Einstellungen' : 'Settings'}
                        >
                            <Settings className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {activeTab === "profile" ? (
                        <>
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-6">
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

                            {/* Form */}
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
                                        className="flex-1 bg-white/5 hover:bg-red-500/10 text-red-400 font-semibold px-4 py-3 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        {t('common.logout')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || uploading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-blue-400/30 cursor-pointer"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        {t('common.save')}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : activeTab === "settings" ? (
                        <>
                            {/* Email Preferences and Language Settings Form */}
                            <form onSubmit={handleSaveSettings} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                                        {locale === 'de' ? 'E-Mail-Sprache' : 'Email Language'}
                                    </label>
                                    <select
                                        value={notificationLocale}
                                        onChange={(e) => setNotificationLocale(e.target.value)}
                                        className="w-full bg-white/5 border border-white/20 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="de" className="bg-gray-900 text-white">Deutsch</option>
                                        <option value="en" className="bg-gray-900 text-white">English</option>
                                        <option value="es" className="bg-gray-900 text-white">Español</option>
                                        <option value="fr" className="bg-gray-900 text-white">Français</option>
                                        <option value="it" className="bg-gray-900 text-white">Italiano</option>
                                        <option value="pt" className="bg-gray-900 text-white">Português</option>
                                        <option value="nl" className="bg-gray-900 text-white">Nederlands</option>
                                        <option value="pl" className="bg-gray-900 text-white">Polski</option>
                                        <option value="sv" className="bg-gray-900 text-white">Svenska</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                                        {locale === 'de' ? 'Benachrichtigungen' : 'Notifications'}
                                    </label>
                                    
                                    {/* Visits comments toggle */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all duration-150">
                                        <div className="flex-1 pr-4">
                                            <h4 className="text-sm font-semibold text-white">
                                                {locale === 'de' ? 'Termine & Mitfahrer' : 'Sessions & Riders'}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                                                {locale === 'de' 
                                                    ? 'E-Mail erhalten, wenn sich ein Rider für deinen geplanten eFoil-Termin einträgt.' 
                                                    : 'Receive an email when a rider signs up for your planned eFoil session.'}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input 
                                                type="checkbox" 
                                                checked={emailPrefVisits} 
                                                onChange={(e) => setEmailPrefVisits(e.target.checked)} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* Spot comments toggle */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all duration-150">
                                        <div className="flex-1 pr-4">
                                            <h4 className="text-sm font-semibold text-white">
                                                {locale === 'de' ? 'Spot-Kommentare' : 'Spot Comments'}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                                                {locale === 'de' 
                                                    ? 'E-Mail erhalten, wenn jemand einen Kommentar oder eine Frage zu deinem Spot hinterlässt.' 
                                                    : 'Receive an email when someone leaves a comment or asks a question about a spot you contributed.'}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input 
                                                type="checkbox" 
                                                checked={emailPrefQuestions} 
                                                onChange={(e) => setEmailPrefQuestions(e.target.checked)} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* Spot appointments toggle */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all duration-150">
                                        <div className="flex-1 pr-4">
                                            <h4 className="text-sm font-semibold text-white">
                                                {(toggleTranslations[locale] || toggleTranslations.en).title}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                                                {(toggleTranslations[locale] || toggleTranslations.en).desc}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input 
                                                type="checkbox" 
                                                checked={emailPrefAppointments} 
                                                onChange={(e) => setEmailPrefAppointments(e.target.checked)} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* AI Translation toggle */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all duration-150">
                                        <div className="flex-1 pr-4">
                                            <h4 className="text-sm font-semibold text-white">
                                                {locale === 'de' ? 'AI-Übersetzung' : 'AI Translation'}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                                                {locale === 'de' 
                                                    ? 'Spot-Beschreibungen, Kommentare und Antworten automatisch in deine Sprache übersetzen.' 
                                                    : 'Automatically translate spot descriptions, comments, and replies into your language.'}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input 
                                                type="checkbox" 
                                                checked={aiTranslationEnabled} 
                                                onChange={(e) => setAiTranslationEnabled(e.target.checked)} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { signOut(); onClose(); }}
                                        className="flex-1 bg-white/5 hover:bg-red-500/10 text-red-400 font-semibold px-4 py-3 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        {t('common.logout')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-blue-400/30 cursor-pointer"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        {t('common.save')}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Saved Spots (Merkliste) */
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                            {bookmarksLoading ? (
                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                    <span className="text-xs italic">{locale === 'de' ? 'Lädt Merkliste...' : 'Loading saved list...'}</span>
                                </div>
                            ) : bookmarks.length > 0 ? (
                                <div className="space-y-2">
                                    {bookmarks.map((spot) => (
                                        <button
                                            key={spot.id}
                                            onClick={() => {
                                                onSelectSpot?.(spot);
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
                                            <div className="flex items-center gap-2 shrink-0">
                                                {spot.average_rating ? (
                                                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {spot.average_rating.toFixed(1)}
                                                    </div>
                                                ) : null}
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center text-xs text-gray-500 italic">
                                    {locale === 'de' 
                                        ? 'Noch keine Spots in deiner Merkliste.' 
                                        : 'No spots saved in your bookmark list.'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
