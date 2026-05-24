import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";
import { dictionaries, Locale, SUPPORTED_LOCALES } from "@/lib/dictionaries";
import { getSpots } from "@/app/actions";

interface PageProps {
  searchParams: Promise<{ lang?: string; spot?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang || "en";
  const spotId = resolvedSearchParams.spot;
  
  let title = "";
  let description = "";
  
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(lang) ? lang as Locale : 'en';
  const dict = dictionaries[locale as Locale];
  
  if (spotId) {
    // If a specific spot is shared via ID, fetch it
    const spots = await getSpots();
    const spot = spots.find(s => s.id === spotId);
    if (spot) {
      title = `${spot.name} - eFoilMap`;
      description = spot.attributes?.description || dict.meta.description;
    }
  }
  
  if (!title) {
    title = dict.meta.title;
    description = dict.meta.description;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.efoilmap.com",
      siteName: "eFoilMap",
      images: ["https://www.efoilmap.com/teaser.jpg"],
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.efoilmap.com/teaser.jpg"],
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
