"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Map, { GeolocateControl, NavigationControl, ScaleControl, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { AlertCircle, MapPin } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getSpots, Spot } from "@/app/actions";
import { cn } from "@/lib/utils";
import { SpotDialog } from "@/components/SpotDialog";
import { ConsentGate } from "@/components/CookieConsent";
import { useLanguage } from "@/lib/i18n";
import { User as UserIcon, LogOut } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";

import { AddSpotButton } from "@/components/AddSpotButton";
import { AddSpotDialog } from "@/components/AddSpotDialog";
import { ProfileSetupDialog } from "@/components/ProfileSetupDialog";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";

export default function EfoilMap() {
    const { user, profile, signOut } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const mapRef = useRef(null);
    // Initialize directly to avoid flicker
    // Initialize directly to avoid flicker
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    const [spots, setSpots] = useState<Spot[]>([]);

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

    // Derived state for filtering - replaces useEffect and extra state
    // Moved here to be after 'filters' definition
    const filteredSpots = useMemo(() => {
        let res = spots;
        if (filters.status !== 'all') {
            res = res.filter(s => s.status === filters.status.toUpperCase());
        }
        if (filters.parking) res = res.filter(s => s.attributes?.parking);
        if (filters.charging) res = res.filter(s => s.attributes?.charging);
        return res;
    }, [spots, filters]);

    // Load Spots on Mount
    useEffect(() => {
        async function loadSpots() {
            try {
                const data = await getSpots();
                setSpots(data);
            } catch (err) {
                console.error("Error loading spots:", err);
            }
        }
        loadSpots();
    }, []);

    // Geolocation only after consent
    useEffect(() => {
        const checkAndGeolocate = () => {
            const hasConsent = localStorage.getItem("efoilmap-consent") === "true";
            if (hasConsent && navigator.geolocation && !searchParams.get('spot')) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { longitude, latitude } = position.coords;
                        if (mapRef.current) {
                            (mapRef.current as any).flyTo({
                                center: [longitude, latitude],
                                zoom: 12,
                                duration: 2000
                            });
                        }
                    },
                    (error) => {
                        console.warn("Geolocation permission denied or error:", error);
                    },
                    { enableHighAccuracy: true }
                );
            }
        };

        // Check on mount
        checkAndGeolocate();

        // Listen for consent changes
        window.addEventListener('efoilmap-consent-change', checkAndGeolocate);
        return () => {
            window.removeEventListener('efoilmap-consent-change', checkAndGeolocate);
        };
    }, [searchParams]);

    // Deep Linking: Sync URL with Selected Spot
    useEffect(() => {
        const spotId = searchParams.get('spot');
        const pathSlug = pathname.startsWith('/spots/') ? pathname.split('/spots/')[1] : null;

        if ((spotId || pathSlug) && spots.length > 0 && !selectedSpot) {
            const spot = spots.find(s => s.id === spotId || s.slug === pathSlug);
            if (spot) {
                const timer = setTimeout(() => {
                    setSelectedSpot(spot);
                    setIsDrawerOpen(true);
                    // Fly to location
                    if (mapRef.current) {
                        (mapRef.current as any).flyTo({
                            center: [spot.location.coordinates[0], spot.location.coordinates[1]],
                            zoom: 14
                        });
                    }
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [searchParams, pathname, spots, selectedSpot]);

    const handleSpotSelect = (spot: Spot) => {
        setSelectedSpot(spot);
        setIsDrawerOpen(true);
        
        // Immediate smooth flyTo
        if (mapRef.current) {
            (mapRef.current as any).flyTo({
                center: [spot.location.coordinates[0], spot.location.coordinates[1]],
                zoom: 14,
                duration: 1500,
                essential: true
            });
        }

        if (spot.slug) {
            window.history.pushState(null, '', `/spots/${spot.slug}`);
        } else {
            window.history.pushState(null, '', `/?spot=${spot.id}`);
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedSpot(null);
        window.history.pushState(null, '', '/');
    };

    // Filter Logic moved to useMemo


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
                                    window.location.reload();
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
                        <div className="w-full flex justify-between items-start pointer-events-auto">
                            {/* Left Spacer for balance */}
                            <div className="flex-1 hidden md:block" /> 

                            {/* Search Box - Center */}
                            <SearchBox />

                            {/* Auth / Profile - Right */}
                            <div className="flex-1 flex justify-end">
                                {user ? (
                                    <button 
                                        onClick={() => setIsProfileOpen(true)}
                                        className="w-10 h-10 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white shadow-xl overflow-hidden ring-2 ring-white/5 group hover:border-blue-400/50 transition-all active:scale-95 relative"
                                    >
                                        {profile?.avatar_url ? (
                                            <Image 
                                                src={profile.avatar_url} 
                                                alt="Profile" 
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform" 
                                            />
                                        ) : (
                                            <UserIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsAuthOpen(true)}
                                        className="w-10 h-10 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white shadow-xl hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        <UserIcon className="w-5 h-5 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
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
                                onClick={() => {
                                    if (!user) {
                                        setIsAuthOpen(true);
                                        return;
                                    }
                                    setIsSelectingLocation(!isSelectingLocation);
                                }}
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
                                handleSpotSelect(spot);
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
                onClose={handleDrawerClose}
                onEdit={() => {
                    setIsDrawerOpen(false);
                    setIsAddSpotOpen(true);
                    setNewSpotLocation(null);
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

            <AuthDialog 
                open={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
            />

            <ProfileSetupDialog />

            <ProfileEditDialog 
                open={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </div>
    );
}
