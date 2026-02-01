"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries } from './dictionaries';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    // Load from localStorage or detection on mount
    useEffect(() => {
        const saved = localStorage.getItem('efoilmap-lang') as Locale;
        if (saved && dictionaries[saved]) {
            setLocaleState(saved);
            return;
        }

        // Auto-detect
        const browserLang = navigator.language.split('-')[0] as Locale;
        if (dictionaries[browserLang]) {
            setLocaleState(browserLang);
        }
    }, []);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem('efoilmap-lang', l);
        document.documentElement.lang = l;
    };

    // Helper to get nested keys like "common.agree"
    const t = (path: string) => {
        const keys = path.split('.');
        let current: any = dictionaries[locale];

        for (const k of keys) {
            if (current[k] === undefined) {
                // Fallback to EN
                current = dictionaries['en'];
                let fallback: any = dictionaries['en'];
                for (const fbK of keys) fallback = fallback?.[fbK];
                return fallback || path;
            }
            current = current[k];
        }
        return current as string;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
