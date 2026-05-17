import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";
import { dictionaries, Locale } from "@/lib/dictionaries";
import { getSpots } from "@/app/actions";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const lang = resolvedSearchParams.lang || "en";
  
  const locale = ['en', 'de', 'es', 'fr'].includes(lang) ? lang : 'en';
  const dict = dictionaries[locale as Locale];
  
  const spots = await getSpots();
  const spot = spots.find(s => s.slug === slug);
  
  let title = dict.meta.title;
  let description = dict.meta.description;
  
  if (spot) {
    title = `${spot.name} - eFoilMap`;
    description = spot.attributes?.description || dict.meta.description;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.efoilmap.com/spots/${slug}`,
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
