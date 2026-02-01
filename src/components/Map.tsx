"use client";

import React, { useRef, useState, useEffect } from "react";
import Map, { GeolocateControl, NavigationControl, ScaleControl, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { AlertCircle, MapPin } from "lucide-react";
import { getSpots, Spot } from "@/app/actions";
import { cn } from "@/lib/utils";
import { SpotDialog } from "@/components/SpotDialog";
import { ConsentGate } from "@/components/CookieConsent";
import { useLanguage } from "@/lib/i18n";
import { Loader2 } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { supabase } from "@/lib/supabase";


import { AddSpotButton } from "@/components/AddSpotButton";
import { AddSpotDialog } from "@/components/AddSpotDialog";

export default function EfoilMap() {
    const { t } = useLanguage();
    const mapRef = useRef(null);
    // Initialize directly to avoid flicker
    const [token, setToken] = useState<string>(process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "");
    const [spots, setSpots] = useState<Spot[]>([]);
    const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Add Spot State
    const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
    const [newSpotLocation, setNewSpotLocation] = useState<[number, number] | null>(null);
    const [isSelectingLocation, setIsSelectingLocation] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        parking: false,
        charging: false,
        food: false,
        verified: false
    });

    useEffect(() => {
        // Check for token on mount
        const envToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (envToken) {
            setToken(envToken);
        }

        // Fetch spots from Supabase
        async function loadSpots() {
            // Fetch directly from DB
            const { data, error } = await supabase.from('spots').select('*');
            if (data && !error) {
                const mappedSpots: Spot[] = data.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    status: s.status, // Uses UPPERCASE directly if DB enum is correct, or map it? DB Init Schema uses 'ALLOWED', 'TOLERATED' (uppercase) in ENUM definition line 27.
                    location: {
                        type: 'Point',
                        coordinates: [s.lng, s.lat] // Using the new lat/lng columns we added
                    },
                    createdAt: s.created_at,
                    attributes: {
                        parking: s.attributes?.parking,
                        charging: s.attributes?.has_charging || s.attributes?.charging, // handle both just in case
                        food: s.attributes?.food || s.attributes?.has_food
                    }
                }));
                setSpots(mappedSpots);
                setFilteredSpots(mappedSpots);
            }
        }
        loadSpots();
    }, []);

    // Filter Logic
    useEffect(() => {
        let res = spots;
        if (filters.status !== 'all') {
            res = res.filter(s => s.status === filters.status.toUpperCase());
        }
        if (filters.parking) res = res.filter(s => s.attributes?.parking);
        if (filters.charging) res = res.filter(s => s.attributes?.charging);

        setFilteredSpots(res);
    }, [filters, spots]);


    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-gray-900 text-gray-100">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Mapbox Token Missing</h2>
                <p className="max-w-md text-gray-400">
                    Please add <code className="bg-gray-800 px-2 py-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code> file to load the map.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <ConsentGate
                fallback={
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/90 text-center p-6">
                        <div className="max-w-md space-y-4">
                            <h3 className="text-2xl font-bold text-white">{t('consent.map_blocked')}</h3>
                            <p className="text-gray-300">{t('consent.map_blocked_text')}</p>
                            <button
                                onClick={() => {
                                    localStorage.setItem("efoilmap-consent", "true");
                                    window.dispatchEvent(new Event('efoilmap-consent-change'));
                                }}
                                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                            >
                                {t('consent.accept_map')}
                            </button>
                        </div>
                    </div>
                }
            >
                <Map
                    ref={mapRef}
                    mapboxAccessToken={token}
                    initialViewState={{
                        longitude: 6.0839, // Aachen
                        latitude: 50.7753,
                        zoom: 12,
                    }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    attributionControl={false}
                    cursor={isSelectingLocation ? 'crosshair' : 'auto'}
                    onLoad={(e) => {
                        // Force water to be a visible blue
                        if (e.target.getLayer('water')) {
                            e.target.setPaintProperty('water', 'fill-color', '#3bb2d0'); // Standard bright mapbox blue
                        }
                    }}
                    onClick={(e) => {
                        if (isSelectingLocation) {
                            setNewSpotLocation([e.lngLat.lng, e.lngLat.lat]);
                            setIsSelectingLocation(false);
                            setIsAddSpotOpen(true);
                        }
                    }}
                >
                    <GeolocateControl position="bottom-right" />
                    <NavigationControl position="bottom-right" />
                    <ScaleControl />

                    {/* Controls Overlay (Search & Filter) */}
                    <div className="absolute top-4 left-0 right-0 z-10 flex flex-col items-center gap-3 px-4 pointer-events-none">
                        <SearchBox />
                        <FilterBar filters={filters} setFilters={setFilters} />
                    </div>

                    {/* Add Spot Button Overlay - Bottom Center */}
                    <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none gap-4">
                        {isSelectingLocation && (
                            <div className="bg-background/90 backdrop-blur border border-primary px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4">
                                <span className="text-sm font-bold text-primary">👇 Click map to set location</span>
                            </div>
                        )}
                        <div className="pointer-events-auto">
                            <AddSpotButton
                                onClick={() => setIsSelectingLocation(!isSelectingLocation)}
                                className={isSelectingLocation ? "opacity-20 hover:opacity-100 transition-opacity" : ""}
                            />
                        </div>
                    </div>

                    {/* Spot Markers */}
                    {filteredSpots.map((spot) => (
                        <Marker
                            key={spot.id}
                            longitude={spot.location.coordinates[0]}
                            latitude={spot.location.coordinates[1]}
                            anchor="bottom"
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                setSelectedSpot(spot);
                                setIsDrawerOpen(true);
                            }}
                        >
                            <div className="group relative flex flex-col items-center justify-center transition-transform hover:scale-110 cursor-pointer">
                                {/* Pin Icon with Dynamic Color */}
                                <MapPin
                                    className={cn(
                                        "w-8 h-8 fill-current drop-shadow-lg",
                                        spot.status === "ALLOWED" && "text-[var(--status-allowed)]",
                                        spot.status === "TOLERATED" && "text-[var(--status-tolerated)]",
                                        spot.status === "FORBIDDEN" && "text-[var(--status-forbidden)]",
                                        spot.status === "UNCLEAR" && "text-gray-400"
                                    )}
                                    fill="currentColor"
                                />
                            </div>
                        </Marker>
                    ))}
                </Map>
            </ConsentGate>

            <SpotDialog
                spot={selectedSpot}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onEdit={() => {
                    setIsDrawerOpen(false);
                    setIsAddSpotOpen(true);
                    // Logic to handle edit mode - AddSpotDialog will see selectedSpot if we pass it, 
                    // but AddSpotDialog currently uses 'newSpotLocation'. We need to pass the *data* separately.
                    // Actually, let's just make AddSpotDialog accept 'initialData' which we added.
                    // But we need to pass it.
                }}
            />

            <AddSpotDialog
                open={isAddSpotOpen}
                onClose={() => {
                    setIsAddSpotOpen(false);
                    // Reset selected spot when closing if we were editing? 
                    // No, allow map to persist state.
                    if (!isSelectingLocation) setSelectedSpot(null); // Clear selection if done
                }}
                location={newSpotLocation || (selectedSpot?.location.coordinates as [number, number])}
                initialData={isAddSpotOpen && selectedSpot && !newSpotLocation ? selectedSpot : null} // Rough logic: if open and spot selected but NO new location set, assume edit.
                onSuccess={(updatedSpot) => {
                    if (updatedSpot) {
                        setSpots(prev => {
                            const exists = prev.find(s => s.id === updatedSpot.id);
                            if (exists) {
                                return prev.map(s => s.id === updatedSpot.id ? updatedSpot : s);
                            }
                            return [...prev, updatedSpot];
                        });

                        // If we are editing, keep it selected and re-open drawer
                        if (selectedSpot && selectedSpot.id === updatedSpot.id) {
                            setSelectedSpot(updatedSpot);
                            setIsDrawerOpen(true); // Re-open the drawer to show updated info
                        }
                    } else {
                        // Fallback if no data returned
                        window.location.reload();
                    }
                    setIsAddSpotOpen(false);
                }}
            />
        </div>
    );
}
