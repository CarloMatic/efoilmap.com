import { MetadataRoute } from 'next';
import { getSpots } from '@/app/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.efoilmap.com';
    let spotUrls: MetadataRoute.Sitemap = [];

    try {
        const spots = await getSpots();
        spotUrls = spots.map(spot => ({
            url: `${baseUrl}/spots/${spot.slug || spot.id}`,
            lastModified: spot.createdAt ? new Date(spot.createdAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (err) {
        console.error("Error fetching spots for sitemap:", err);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/imprint`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/community-rules`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...spotUrls
    ];
}

