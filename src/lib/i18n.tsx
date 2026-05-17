"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries } from './dictionaries';
import { supabase } from './supabase';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    // Sync document attributes (title, lang) client-side whenever locale changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.lang = locale;
            document.title = dictionaries[locale].meta.title;
        }
    }, [locale]);

    // Load from localStorage or detection on mount
    useEffect(() => {
        let target: Locale | null = null;
        const saved = localStorage.getItem('efoilmap-lang') as Locale;

        if (saved && dictionaries[saved]) {
            target = saved;
        } else {
            // Auto-detect
            const browserLang = navigator.language.split('-')[0] as Locale;
            if (dictionaries[browserLang]) {
                target = browserLang;
            }
        }

        if (target && target !== locale) {
            const timer = setTimeout(() => setLocaleState(target), 0);
            return () => clearTimeout(timer);
        }
    }, [locale]);

    // Listen to Auth State to pull locale from user metadata
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user?.user_metadata?.locale) {
                const userLocale = data.session.user.user_metadata.locale as Locale;
                if (dictionaries[userLocale] && userLocale !== locale) {
                    setLocale(userLocale, false); // Don't trigger another save
                }
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.user_metadata?.locale) {
                const userLocale = session.user.user_metadata.locale as Locale;
                if (dictionaries[userLocale] && userLocale !== locale) {
                    setLocale(userLocale, false);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [locale]);

    const setLocale = async (l: Locale, saveToCloud = true) => {
        setLocaleState(l);
        localStorage.setItem('efoilmap-lang', l);
        // Set cookie for server-side detection
        document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = l;

        if (saveToCloud) {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                await supabase.auth.updateUser({
                    data: { locale: l }
                });
            }
        }
    };

    // Helper to get nested keys like "common.agree"
    const t = (path: string) => {
        const keys = path.split('.');
        let current: unknown = dictionaries[locale];

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = (current as Record<string, unknown>)[k];
            } else {
                // Fallback to EN
                let fallback: unknown = dictionaries['en'];
                for (const fbK of keys) {
                    if (fallback && typeof fallback === 'object' && fbK in fallback) {
                        fallback = (fallback as Record<string, unknown>)[fbK];
                    } else {
                        return path;
                    }
                }
                return typeof fallback === 'string' ? fallback : path;
            }
        }
        return typeof current === 'string' ? current : path;
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
