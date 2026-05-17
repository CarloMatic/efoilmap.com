"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="absolute bottom-0 left-0 right-0 z-[101] pointer-events-auto bg-transparent p-2 flex justify-end items-end">
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
                <span>© 2026 efoilmap.com</span>
            </div>
        </footer>
    );
}
