import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";
import { dictionaries, Locale } from "@/lib/dictionaries";
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
  
  const locale = ['en', 'de', 'es', 'fr'].includes(lang) ? lang : 'en';
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
      locale: locale === 'de' ? 'de_DE' : locale === 'es' ? 'es_ES' : locale === 'fr' ? 'fr_FR' : 'en_US',
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
