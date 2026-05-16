"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

export function CookieBanner() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [hasConsent, setHasConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("efoilmap-consent");
        if (consent === "true") {
            setHasConsent(true);
            setIsVisible(false);
        } else if (consent === "false") {
            setIsRejected(true);
            setIsVisible(true);
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
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-red-950/90 backdrop-blur border-t border-red-900 shadow-2xl">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <p className="text-sm text-red-200 font-medium text-center sm:text-left">
                        {t('consent.rejected_warning') || "The application requires functional cookies to display the map and your location. Limited functionality available."}
                    </p>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 text-sm font-bold bg-white text-red-950 rounded-full shadow-lg hover:bg-red-100 transition-all whitespace-nowrap"
                    >
                        {t('common.agree') || "Accept Cookies"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border shadow-2xl">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-foreground space-y-1">
                    <h3 className="font-bold">{t('consent.title')}</h3>
                    <p>{t('consent.text')}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleReject}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t('common.reject')}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all"
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
