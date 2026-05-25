import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";
import { dictionaries, Locale, SUPPORTED_LOCALES } from "@/lib/dictionaries";
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
  
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(lang) ? lang as Locale : 'en';
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
    keywords: ["efoil", "electric hydrofoil", "jetboard", "efoil map", "efoil spots", "water sports", "surfboard", "e-surfboard", "hydrofoiling", "jetboarding", "surfing"],
    openGraph: {
      title,
      description,
      url: `https://www.efoilmap.com/spots/${slug}`,
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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  let spots: any[] = [];
  let spot = null;
  
  try {
    spots = await getSpots();
    spot = spots.find(s => s.slug === slug);
  } catch (err) {
    console.error("Error fetching spots for spot page SEO:", err);
  }

  // Create JSON-LD Place Structured Data
  const jsonLd = spot ? {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": spot.name,
    "description": spot.attributes?.description || `${spot.name} eFoil spot`,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": spot.location.coordinates[1],
      "longitude": spot.location.coordinates[0]
    },
    "url": `https://www.efoilmap.com/spots/${slug}`,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "status",
        "value": spot.status
      },
      {
        "@type": "PropertyValue",
        "name": "parking",
        "value": !!spot.attributes?.parking
      },
      {
        "@type": "PropertyValue",
        "name": "charging",
        "value": !!spot.attributes?.charging
      },
      {
        "@type": "PropertyValue",
        "name": "food",
        "value": !!spot.attributes?.food
      },
      {
        "@type": "PropertyValue",
        "name": "rental",
        "value": !!spot.attributes?.rental
      }
    ]
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <HomeClient />
      
      {/* Hidden SEO Link Directory for Search Engine Crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h2>eFoil Spots Directory</h2>
        <ul>
          {spots.map((s) => (
            <li key={s.id}>
              <a href={`/spots/${s.slug || s.id}`}>{s.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
