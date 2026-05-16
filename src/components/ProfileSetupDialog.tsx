import { useState, useEffect } from "react";
import { X, User, Loader2, Sparkles, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n";

export function ProfileSetupDialog() {
    const { user, profile, updateProfile } = useAuth();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();
    const { t } = useLanguage();

    useEffect(() => {
        // Show dialog if user is logged in but has no username
        if (user && profile && !profile.username) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [user, profile]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        
        setLoading(true);
        try {
            const trimmed = username.trim();
            if (!trimmed) throw new Error("Username is required");

            const { error } = await updateProfile({ username: trimmed });
            if (error) throw error;
            
            showToast(t('auth.welcome_back_toast') || "Profile updated!", "success");
            // Manually close first to be responsive
            setOpen(false);
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-gray-900 border border-white/20 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            {t('auth.one_last_step') || "Fast geschafft!"}
                        </h2>
                        <p className="text-sm text-gray-400 mt-2">
                            {t('auth.choose_username_desc') || "Wähle einen Benutzernamen, unter dem du in der Community bekannt sein möchtest."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                                {t('auth.username') || "Benutzername"}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="z.B. FoilMaster"
                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !username.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 border border-blue-400/30"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            {t('common.agree') || "Fertigstellen"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
