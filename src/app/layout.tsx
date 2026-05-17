import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/ui/Toast";

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

export const metadata: Metadata = {
  title: "efoilmap.com | The community for eFoilers",
  description: "Find legal e-foil spots near you. Community driven map.",
  openGraph: {
    title: "efoilmap.com | The community for eFoilers",
    description: "Find legal e-foil spots near you. Community driven map.",
    url: "https://efoilmap.com",
    siteName: "eFoilMap",
    images: [
      {
        url: "https://efoilmap.com/og-image.jpg", // We should add a real image later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "efoilmap.com | The community for eFoilers",
    description: "Find legal e-foil spots near you. Community driven map.",
    images: ["https://efoilmap.com/og-image.jpg"],
  },
};

import { cookies, headers } from "next/headers";

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
      if (['en', 'de', 'es', 'fr'].includes(preferred)) {
        locale = preferred;
      }
    }
  }
  if (!locale) {
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
              "description": "Find legal e-foil spots near you. Community driven map.",
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
