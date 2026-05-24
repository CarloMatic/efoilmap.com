"use client";

import dynamic from "next/dynamic";
const EfoilMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground font-medium">Loading Map Experience...</div>
});
import Logo from "@/components/Logo";
import { CookieBanner } from "@/components/CookieConsent";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Footer } from "@/components/Footer";
import IntroModal from "@/components/IntroModal";

import { useLanguage } from "@/lib/i18n";

import { Suspense } from "react";

export default function HomeClient() {
  const { t } = useLanguage();
  return (
    <main className="w-full h-full relative flex flex-col">
      <IntroModal />
      {/* Header - Top Bar (Not Overlay) */}
      <header className="w-full bg-background border-b border-border z-[101] shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-auto" />
              <span className="px-1.5 py-0.5 text-[9px] font-black tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded uppercase select-none">
                Beta
              </span>
            </div>
            <h1 className="hidden md:inline-block text-sm font-medium text-muted-foreground whitespace-nowrap">
              {t('hero.slogan')}
            </h1>
          </div>

          {/* Lang Switcher - Pushed to right */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative w-full overflow-hidden">
        <Suspense fallback={<div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">Loading Map...</div>}>
          <EfoilMap />
        </Suspense>
      </div>

      <CookieBanner />
      <Footer />
    </main>
  );
}
