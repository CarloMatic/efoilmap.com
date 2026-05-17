import { useState, useRef } from "react";
import { X, Mail, Loader2, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n";

interface AuthDialogProps {
    open: boolean;
    onClose: () => void;
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const lastSentRef = useRef<number>(0);
    
    const { showToast } = useToast();
    const { t, locale } = useLanguage();

    if (!open) return null;

    const getLocalizedError = (error: any) => {
        const msg = error.message?.toLowerCase() || "";
        if (msg.includes("rate limit exceeded")) return t('auth.error_rate_limit');
        return t('auth.error_generic') || error.message;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastSentRef.current < 60000) {
            showToast(t('auth.wait_60s'), "error");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: { locale }
                }
            });
            if (error) throw error;
            lastSentRef.current = Date.now();
            showToast(t('auth.magic_link_sent'), "success");
            onClose();
        } catch (error) {
            showToast(getLocalizedError(error), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" 
                onClick={onClose} 
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-gray-900 border border-white/20 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 backdrop-blur-xl">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-400" />
                                {t('auth.welcome')}
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                {t('auth.magic_link_desc')}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 border border-blue-400/30"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {t('auth.send_login_link')}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                            {t('auth.magic_hint')}
                            <br />
                            <Link href="/privacy" className="underline hover:text-gray-300 ml-1">{t('auth.privacy_policy')}</Link>
                            {" • "}
                            <Link href="/community-rules" className="underline hover:text-gray-300">{t('auth.community_rules')}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
