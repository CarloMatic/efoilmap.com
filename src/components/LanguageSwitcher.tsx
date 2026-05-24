"use client";

import { useLanguage } from "@/lib/i18n";
import { dictionaries, Locale } from "@/lib/dictionaries";
import { useState } from "react";

const flagEmojis: Record<Locale, string> = {
    en: "🇬🇧",
    de: "🇩🇪",
    es: "🇪🇸",
    fr: "🇫🇷",
    it: "🇮🇹",
    pt: "🇵🇹",
    nl: "🇳🇱",
    pl: "🇵🇱",
    sv: "🇸🇪"
};

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-background/50 backdrop-blur border border-white/10 rounded-full text-xs font-medium hover:bg-background/80 transition-colors"
            >
                <span className="text-sm select-none" role="img" aria-label={locale}>
                    {flagEmojis[locale]}
                </span>
                <span className="uppercase">{locale}</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 pt-2 w-36 z-50">
                    <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden">
                        {(Object.keys(dictionaries) as Locale[]).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setLocale(lang);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between ${locale === lang ? 'text-primary font-bold' : 'text-foreground'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-sm select-none" role="img" aria-label={dictionaries[lang].meta.label}>
                                        {flagEmojis[lang]}
                                    </span>
                                    <span>{dictionaries[lang].meta.label}</span>
                                </span>
                                {locale === lang && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
