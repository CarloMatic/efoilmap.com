"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import Logo from "./Logo";
import { Waves } from "lucide-react";

export default function IntroModal() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem("efoilmap-intro-dismissed");
        if (!dismissed) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem("efoilmap-intro-dismissed", "true");
        setTimeout(() => setIsVisible(false), 0);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all">
            <div className="max-w-md w-full bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Full width teaser banner image */}
                <div className="w-full h-56 relative shrink-0">
                    <img 
                        src="/teaser.jpg" 
                        alt="eFoil community" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/30 via-transparent to-transparent" />
                </div>

                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tight text-foreground">
                            {t('intro.title')}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {t('intro.text')}
                        </p>
                    </div>
                    
                    <div className="flex flex-col w-full gap-4 pt-2">
                        <button
                            onClick={handleDismiss}
                            className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xl group cursor-pointer"
                        >
                            <Waves className="w-7 h-7 group-hover:animate-pulse" />
                            {t('intro.cta')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
