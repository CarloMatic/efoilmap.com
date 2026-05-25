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
    keywords: ["efoil", "electric hydrofoil", "jetboard", "efoil map", "efoil spots", "water sports", "surfboard", "e-surfboard", "hydrofoiling", "jetboarding", "surfing"],
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

export default async function Page() {
  let spots: any[] = [];
  try {
    spots = await getSpots();
  } catch (err) {
    console.error("Error fetching spots for homepage SEO:", err);
  }

  return (
    <>
      <HomeClient />
      
      {/* Hidden SEO Link Directory for Search Engine Crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h2>eFoil Spots Directory</h2>
        <ul>
          {spots.map((spot) => (
            <li key={spot.id}>
              <a href={`/spots/${spot.slug || spot.id}`}>{spot.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
