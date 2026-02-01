"use client";

import EfoilMap from "@/components/Map";
import Logo from "@/components/Logo";
import { CookieBanner } from "@/components/CookieConsent";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Footer } from "@/components/Footer";

import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="w-full h-full relative flex flex-col">
      {/* Header - Top Bar (Not Overlay) */}
      <header className="w-full bg-background border-b border-border z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4">
            <Logo className="h-8 w-auto" />
            <span className="hidden md:inline-block text-sm font-medium text-muted-foreground whitespace-nowrap">
              {t('hero.slogan')}
            </span>
          </div>

          {/* Lang Switcher - Pushed to right */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative w-full overflow-hidden">
        <EfoilMap />
      </div>

      <CookieBanner />
      <Footer />
    </main>
  );
}
