import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/Toast";
import { dictionaries, Locale, SUPPORTED_LOCALES } from "@/lib/dictionaries";
import { cookies, headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value;

  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if ((SUPPORTED_LOCALES as readonly string[]).includes(preferred)) {
        locale = preferred;
      }
    }
  }
  if (!locale || !(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    locale = 'en';
  }

  const dict = dictionaries[locale as Locale];
  const title = dict.meta.title;
  const description = dict.meta.description;

  return {
    title,
    description,
    keywords: ["efoil", "electric hydrofoil", "jetboard", "efoil map", "efoil spots", "water sports", "surfboard", "e-surfboard", "hydrofoiling", "jetboarding", "surfing"],
    openGraph: {
      title,
      description,
      url: "https://www.efoilmap.com",
      siteName: "eFoilMap",
      images: [
        {
          url: "https://www.efoilmap.com/teaser.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: (() => {
        const ogLocales: Record<string, string> = {
          de: 'de_DE',
          es: 'es_ES',
          fr: 'fr_FR',
          it: 'it_IT',
          pt: 'pt_PT',
          nl: 'nl_NL',
          pl: 'pl_PL',
          sv: 'sv_SE'
        };
        return ogLocales[locale] || 'en_US';
      })(),
      type: "website",
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/favicon.svg",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.efoilmap.com/teaser.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value;

  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if ((SUPPORTED_LOCALES as readonly string[]).includes(preferred)) {
        locale = preferred;
      }
    }
  }
  if (!locale || !(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    locale = 'en';
  }

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100dvh] w-screen overflow-hidden bg-background text-foreground`}
      >
        <LanguageProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "eFoilMap",
              "applicationCategory": "MapApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Find legal e-foil, electric hydrofoil, and jetboard spots near you. Community-driven interactive map.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "120"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
