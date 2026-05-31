"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { ObfuscatedEmail } from "@/components/ui/ObfuscatedEmail";

interface FooterProps {
    isStatic?: boolean;
}

export function Footer({ isStatic = false }: FooterProps) {
    const { t } = useLanguage();

    if (isStatic) {
        return (
            <footer className="w-full py-6 mt-12 border-t border-border flex justify-center items-center bg-card/20 backdrop-blur-md">
                <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                    <Link href="/imprint" className="hover:text-foreground transition-colors">
                        {t('nav.imprint')}
                    </Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        {t('nav.privacy')}
                    </Link>
                    <span>•</span>
                    <Link href="/community-rules" className="hover:text-foreground transition-colors">
                        {t('auth.community_rules')}
                    </Link>
                    <span>•</span>
                    <ObfuscatedEmail 
                        email="hi@efoilmap.com" 
                        subject="Feedback eFoilMap" 
                        className="hover:text-foreground transition-colors font-bold text-blue-500"
                    >
                        Feedback
                    </ObfuscatedEmail>
                </div>
            </footer>
        );
    }

    return (
        <footer className="absolute bottom-0 left-0 right-0 z-40 pointer-events-auto bg-transparent p-2 flex justify-end items-end">
            <div className="bg-background/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-t-lg rounded-bl-lg text-[10px] flex gap-3 text-muted-foreground shadow-lg">
                <Link href="/imprint" className="hover:text-foreground transition-colors">
                    {t('nav.imprint')}
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                    {t('nav.privacy')}
                </Link>
                <span>•</span>
                <Link href="/community-rules" className="hover:text-foreground transition-colors">
                    {t('auth.community_rules')}
                </Link>
                <span>•</span>
                <ObfuscatedEmail 
                    email="hi@efoilmap.com" 
                    subject="Feedback eFoilMap" 
                    className="hover:text-foreground transition-colors font-bold text-blue-500"
                >
                    Feedback
                </ObfuscatedEmail>
            </div>
        </footer>
    );
}

