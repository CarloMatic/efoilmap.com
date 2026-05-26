"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries, SUPPORTED_LOCALES } from './dictionaries';
import { supabase } from './supabase';

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    const setLocale = async (l: Locale, saveToCloud = true) => {
        setLocaleState(l);
        localStorage.setItem('efoilmap-lang', l);
        // Set cookie for server-side detection
        document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = l;

        // Update URL query parameter
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('lang') !== l) {
                params.set('lang', l);
                const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
                window.history.pushState(null, '', newUrl);
            }
        }

        if (saveToCloud) {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                await supabase.auth.updateUser({
                    data: { locale: l }
                });
            }
        }
    };

    // Sync document attributes (title, lang) client-side whenever locale changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.lang = locale;
            document.title = dictionaries[locale].meta.title;
        }
    }, [locale]);

    // Load from URL, or default to 'en' if not present in URL
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang') as Locale;

        let target: Locale = 'en'; // Default to 'en' if nothing in link

        if (urlLang && dictionaries[urlLang]) {
            target = urlLang;
        }

        if (target !== locale) {
            setTimeout(() => {
                setLocaleState(target);
            }, 0);
        }

        // Synchronize cookies & localStorage
        localStorage.setItem('efoilmap-lang', target);
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = target;

        // Ensure the URL always has the lang parameter
        if (params.get('lang') !== target) {
            params.set('lang', target);
            const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
            window.history.replaceState(null, '', newUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

export function useTranslate(text: string | undefined, targetLang: string, enabled = true) {
    const [translatedText, setTranslatedText] = useState<string>('');
    const [isTranslated, setIsTranslated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;

        // Synchronously reset translation states to prevent old text from briefly displaying
        setTranslatedText('');
        setIsTranslated(false);

        if (!enabled || !text || !text.trim()) {
            return;
        }

        const target = (SUPPORTED_LOCALES as readonly string[]).includes(targetLang) ? targetLang : 'en';
        const sl = 'auto';

        setTimeout(() => {
            if (active) setLoading(true);
        }, 0);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (!active) return;
                if (data && data[0] && Array.isArray(data[0])) {
                    const translated = data[0].map((x: unknown) => Array.isArray(x) ? String(x[0]) : '').join('');
                    if (translated.toLowerCase().trim() !== text.toLowerCase().trim()) {
                        setTranslatedText(translated);
                        setIsTranslated(true);
                    } else {
                        setTranslatedText(text);
                        setIsTranslated(false);
                    }
                } else {
                    setTranslatedText(text);
                    setIsTranslated(false);
                }
            })
            .catch(err => {
                if (!active) return;
                console.error("Translation Error:", err);
                setTranslatedText(text);
                setIsTranslated(false);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [text, targetLang, enabled]);

    return { translatedText: translatedText || text || '', isTranslated, loading };
}
