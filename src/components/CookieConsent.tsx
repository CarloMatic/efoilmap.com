"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";

export function CookieBanner() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [hasConsent, setHasConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("efoilmap-consent");
        if (consent === "true") {
            setTimeout(() => {
                setHasConsent(true);
                setIsVisible(false);
            }, 0);
        } else if (consent === "false") {
            setTimeout(() => {
                setIsRejected(true);
                setIsVisible(true);
            }, 0);
        } else if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        }

        const handleConsentChange = () => {
            const currentConsent = localStorage.getItem("efoilmap-consent");
            if (currentConsent === "true") {
                setHasConsent(true);
                setIsVisible(false);
                setIsRejected(false);
            } else if (currentConsent === "false") {
                setHasConsent(false);
                setIsRejected(true);
                setIsVisible(true);
            }
        };

        window.addEventListener('efoilmap-consent-change', handleConsentChange);
        return () => window.removeEventListener('efoilmap-consent-change', handleConsentChange);
    }, []);

    const handleAccept = () => {
        localStorage.setItem("efoilmap-consent", "true");
        setHasConsent(true);
        setIsVisible(false);
        setIsRejected(false);
        window.dispatchEvent(new Event('efoilmap-consent-change'));
    };

    const handleReject = () => {
        localStorage.setItem("efoilmap-consent", "false");
        setHasConsent(false);
        setIsRejected(true);
        window.dispatchEvent(new Event('efoilmap-consent-change'));
    };

    if (hasConsent || !isVisible) return null;

    if (isRejected) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-[9999] p-6 bg-red-955/95 backdrop-blur-xl border-t border-red-900 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="space-y-2 text-center md:text-left flex-1 pr-0 md:pr-6">
                        <p className="text-sm text-red-200 font-medium leading-relaxed">
                            {t('consent.rejected_warning') || "The application requires functional cookies to display the map and your location. Limited functionality available."}
                        </p>
                        <div className="flex justify-center md:justify-start gap-3 text-xs text-red-300/80">
                            <Link href="/privacy" className="hover:underline hover:text-white transition-colors">
                                {t('consent.privacy_link') || "Privacy Policy"}
                            </Link>
                            <span>•</span>
                            <Link href="/imprint" className="hover:underline hover:text-white transition-colors">
                                {t('consent.imprint_link') || "Imprint"}
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 whitespace-nowrap shrink-0 w-full md:w-auto">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-red-200 hover:text-white border border-red-200/20 rounded-xl transition-all cursor-pointer text-center active:scale-[0.98]"
                        >
                            {t('consent.leave') || "Weg hier"}
                        </button>
                        <button
                            onClick={handleAccept}
                            className="w-full sm:w-auto px-8 py-3 text-sm font-bold bg-white text-red-950 rounded-xl shadow-lg hover:bg-red-100 transition-all cursor-pointer text-center active:scale-[0.98]"
                        >
                            {t('common.agree') || "Accept Cookies"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-6 bg-background/98 backdrop-blur-xl border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="text-sm text-foreground space-y-2 text-center md:text-left flex-1 pr-0 md:pr-6">
                    <h3 className="font-bold text-base">{t('consent.title')}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t('consent.text')}</p>
                    <div className="flex justify-center md:justify-start gap-3 text-xs text-muted-foreground">
                        <Link href="/privacy" className="hover:underline hover:text-foreground transition-colors">
                            {t('consent.privacy_link') || "Privacy Policy"}
                        </Link>
                        <span>•</span>
                        <Link href="/imprint" className="hover:underline hover:text-foreground transition-colors">
                            {t('consent.imprint_link') || "Imprint"}
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                    <button
                        onClick={handleReject}
                        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all cursor-pointer text-center active:scale-[0.98]"
                    >
                        {t('common.reject')}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="w-full sm:w-auto px-8 py-3 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg hover:bg-primary/90 transition-all cursor-pointer text-center active:scale-[0.98]"
                    >
                        {t('common.agree')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ConsentGate({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
    const [hasConsent, setHasConsent] = useState<boolean | null>(null);

    useEffect(() => {
        const checkConsent = () => {
            const consent = localStorage.getItem("efoilmap-consent");
            setHasConsent(consent === "true");
        };

        checkConsent();

        window.addEventListener('storage', checkConsent);
        // Custom event for same-window updates
        window.addEventListener('efoilmap-consent-change', checkConsent);

        return () => {
            window.removeEventListener('storage', checkConsent);
            window.removeEventListener('efoilmap-consent-change', checkConsent);
        };
    }, []);

    if (hasConsent === null) return null; // Loading state (or render fallback?)

    if (hasConsent === false) {
        return fallback;
    }

    return <>{children}</>;
}
