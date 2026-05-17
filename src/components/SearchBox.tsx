"use client";

import { useState, useCallback } from 'react';
import { useMap } from 'react-map-gl/mapbox';
import { Search, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Spot } from '@/app/actions';

// We'll use a simple fetch to Mapbox Geocoding API for custom UI control
// instead of the heavy default UI control
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface GeocodingFeature {
    id: string;
    text: string;
    place_name: string;
    center: [number, number];
    isLocalSpot?: boolean;
    spotData?: Spot;
}

interface SearchBoxProps {
    spots: Spot[];
    onSelectSpot: (spot: Spot) => void;
}

export function SearchBox({ spots, onSelectSpot }: SearchBoxProps) {
    const { current: map } = useMap(); // Get map instance
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GeocodingFeature[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = useCallback(async (q: string) => {
        setQuery(q);
        if (q.length < 3) {
            setResults([]);
            return;
        }

        try {
            const localMatches: GeocodingFeature[] = spots
                .filter(s => s.name.toLowerCase().includes(q.toLowerCase()))
                .slice(0, 3)
                .map(s => ({
                    id: s.id,
                    text: s.name,
                    place_name: "eFoil Spot",
                    center: [s.location.coordinates[0], s.location.coordinates[1]],
                    isLocalSpot: true,
                    spotData: s
                }));

            const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&types=place,locality,address&limit=5`
            );
            const data = await res.json();
            setResults([...localMatches, ...(data.features || [])]);
            setIsOpen(true);
        } catch (e) {
            console.error("Geocoding error:", e);
        }
    }, [spots]);

    const handleSelect = (feature: GeocodingFeature) => {
        if (!map) return;

        if (feature.isLocalSpot && feature.spotData) {
            onSelectSpot(feature.spotData);
            setQuery(''); // Clear so it looks clean after selection
        } else {
            const [lng, lat] = feature.center;
            map.flyTo({
                center: [lng, lat],
                zoom: 12,
                essential: true
            });
            setQuery(feature.place_name);
        }

        setIsOpen(false);
        setResults([]);
    };

    return (
        <div className="relative w-full max-w-sm mx-auto pointer-events-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-border/50 rounded-full leading-5 bg-background/90 backdrop-blur-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-lg transition-shadow"
                    placeholder={t('search.placeholder') || "Search location..."}
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                />
            </div>

            {isOpen && results.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-card rounded-md shadow-lg max-h-60 overflow-auto py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {results.map((feature) => (
                        <li
                            key={feature.id}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-muted text-foreground ${feature.isLocalSpot ? 'bg-blue-500/5 hover:bg-blue-500/10' : ''}`}
                            onClick={() => handleSelect(feature)}
                        >
                            <span className="flex items-center gap-2 truncate font-medium">
                                {feature.isLocalSpot && <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                {feature.text}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                                {feature.place_name}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
