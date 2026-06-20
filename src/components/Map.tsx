"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Map, { GeolocateControl, NavigationControl, ScaleControl, Marker } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { AlertCircle, MapPin, Layers } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";
import { getSpots, Spot } from "@/app/actions";
import { cn } from "@/lib/utils";
import { SpotDialog } from "@/components/SpotDialog";
import { ConsentGate } from "@/components/CookieConsent";
import { useLanguage } from "@/lib/i18n";
import { User as UserIcon } from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { useToast } from "@/components/ui/Toast";

import { AddSpotButton } from "@/components/AddSpotButton";
import { AddSpotDialog } from "@/components/AddSpotDialog";
import { ProfileSetupDialog } from "@/components/ProfileSetupDialog";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import { NotificationCenter } from "@/components/NotificationCenter";
import { UserProfileDialog } from "@/components/UserProfileDialog";

export default function EfoilMap() {
    const { user, profile } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Map view / styles switcher state
    const [mapStyle, setMapStyle] = useState<string>("mapbox://styles/mapbox/light-v11");
    const [isStylesMenuOpen, setIsStylesMenuOpen] = useState(false);

    const mapStyleOptions = useMemo(() => [
        {
            id: "light",
            name: { de: "Hell", en: "Light", es: "Claro", fr: "Clair", it: "Chiaro", pt: "Claro", nl: "Licht", pl: "Jasny", sv: "Ljus" },
            url: "mapbox://styles/mapbox/light-v11"
        },
        {
            id: "dark",
            name: { de: "Dunkel", en: "Dark", es: "Oscuro", fr: "Sombre", it: "Scuro", pt: "Escuro", nl: "Donker", pl: "Ciemny", sv: "Mörk" },
            url: "mapbox://styles/mapbox/dark-v11"
        },
        {
            id: "satellite",
            name: { de: "Satellit", en: "Satellite", es: "Satélite", fr: "Satellite", it: "Satellite", pt: "Satélite", nl: "Satelliet", pl: "Satelita", sv: "Satellit" },
            url: "mapbox://styles/mapbox/satellite-streets-v12"
        },
        {
            id: "outdoors",
            name: { de: "Gelände", en: "Outdoors", es: "Exterior", fr: "Plein air", it: "All'aperto", pt: "Ao ar livre", nl: "Buiten", pl: "Teren", sv: "Terräng" },
            url: "mapbox://styles/mapbox/outdoors-v12"
        }
    ], []);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

    const handleViewProfile = (profileId: string) => {
        setSelectedProfileId(profileId);
        setIsUserProfileOpen(true);
    };

    const { t, locale } = useLanguage();
    const { showToast } = useToast();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const mapRef = useRef<MapRef>(null);
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
    const [isMovingSpotPosition, setIsMovingSpotPosition] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        parking: false,
        charging: false,
        food: false,
        rental: false
    });

    // derived geolocation ref to ensure geolocation only centers once on start
    const hasGeolocatedRef = useRef(false);

    // Derived state for filtering - replaces useEffect and extra state
    // Moved here to be after 'filters' definition
    const filteredSpots = useMemo(() => {
        let res = spots;
        if (filters.status !== 'all') {
            if (filters.status === 'not_forbidden') {
                res = res.filter(s => s.status !== 'FORBIDDEN');
            } else {
                res = res.filter(s => s.status === filters.status.toUpperCase());
            }
        }
        if (filters.parking) res = res.filter(s => s.attributes?.parking);
        if (filters.charging) res = res.filter(s => s.attributes?.charging);
        if (filters.food) res = res.filter(s => s.attributes?.food);
        if (filters.rental) res = res.filter(s => s.attributes?.rental);
        
        // Date Range Filtering
        if (filters.startDate || filters.endDate) {
            res = res.filter(s => {
                const visits = s.spot_visits || [];
                return visits.some(v => {
                    const vDate = v.visit_date; // YYYY-MM-DD format
                    if (filters.startDate && vDate < filters.startDate) return false;
                    if (filters.endDate && vDate > filters.endDate) return false;
                    return true;
                });
            });
        }
        
        return res;
    }, [spots, filters]);

    // Close all overlays/drawers when custom reset event is dispatched
    useEffect(() => {
        const handleCloseAll = () => {
            setIsDrawerOpen(false);
            setSelectedSpot(null);
            setIsAddSpotOpen(false);
            setIsAuthOpen(false);
            setIsProfileOpen(false);
            setIsSelectingLocation(false);
            setIsMovingSpotPosition(false);
        };
        window.addEventListener('close-all-overlays', handleCloseAll);
        return () => window.removeEventListener('close-all-overlays', handleCloseAll);
    }, []);

    // Load Spots on Mount & custom reload event
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
        window.addEventListener('reload-spots', loadSpots);
        return () => window.removeEventListener('reload-spots', loadSpots);
    }, []);

    // Intercept hash fragment authentication errors (e.g., otp_expired)
    useEffect(() => {
        const handleHashError = () => {
            const hash = typeof window !== 'undefined' ? window.location.hash : '';
            if (hash && hash.includes("error=")) {
                // Parse hash parameters (e.g., #error=access_denied&error_code=otp_expired)
                const params = new URLSearchParams(hash.substring(1));
                const errorCode = params.get("error_code");
                const errorDesc = params.get("error_description");
                
                if (errorCode === "otp_expired") {
                    showToast(
                        t("auth.error_otp_expired"),
                        "error",
                        10000
                    );
                } else if (errorDesc) {
                    showToast(decodeURIComponent(errorDesc).replace(/\+/g, ' '), "error", 10000);
                }
                
                // Clean hash from URL bar to prevent duplicate messages
                window.history.replaceState(null, "", window.location.pathname + window.location.search);
            }
        };
        
        handleHashError();
    }, [showToast, t]);

    // Geolocation only after consent
    useEffect(() => {
        const checkAndGeolocate = () => {
            const hasConsent = localStorage.getItem("efoilmap-consent") === "true";
            if (hasConsent && navigator.geolocation && !hasGeolocatedRef.current && !searchParams.get('spot')) {
                hasGeolocatedRef.current = true;
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { longitude, latitude } = position.coords;
                        mapRef.current?.flyTo({
                            center: [longitude, latitude],
                            zoom: 12,
                            duration: 2000
                        });
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

    // Deep Linking: Settings Drawer
    useEffect(() => {
        if (searchParams.get('settings') === 'true') {
            setIsProfileOpen(true);
            const params = new URLSearchParams(window.location.search);
            params.delete('settings');
            const query = params.toString() ? `?${params.toString()}` : '';
            window.history.replaceState(null, '', `${window.location.pathname}${query}`);
        }
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
                    mapRef.current?.flyTo({
                        center: [spot.location.coordinates[0], spot.location.coordinates[1]],
                        zoom: 14
                    });
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [searchParams, pathname, spots, selectedSpot]);

    const handleSpotSelect = (spot: Spot) => {
        setSelectedSpot(spot);
        setIsDrawerOpen(true);
        
        // Immediate smooth flyTo
        mapRef.current?.flyTo({
            center: [spot.location.coordinates[0], spot.location.coordinates[1]],
            zoom: 14,
            duration: 1500,
            essential: true
        });

        const params = new URLSearchParams(window.location.search);
        if (spot.slug) {
            const query = params.toString() ? `?${params.toString()}` : '';
            window.history.pushState(null, '', `/spots/${spot.slug}${query}`);
        } else {
            params.set('spot', spot.id.toString());
            window.history.pushState(null, '', `/?${params.toString()}`);
        }
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedSpot(null);
        
        const params = new URLSearchParams(window.location.search);
        params.delete('spot');
        const query = params.toString() ? `?${params.toString()}` : '';
        window.history.pushState(null, '', `/${query}`);
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
                    mapStyle={mapStyle}
                    attributionControl={false}
                    cursor={(isSelectingLocation || isMovingSpotPosition) ? 'crosshair' : 'auto'}
                    onLoad={(e) => {
                        // Force water to be a visible blue if the layer exists in the active style
                        try {
                            if (e.target.getStyle() && e.target.getLayer('water')) {
                                e.target.setPaintProperty('water', 'fill-color', '#3bb2d0'); // Standard bright mapbox blue
                            }
                        } catch (err) {
                            console.warn("Water fill color could not be applied for this style:", err);
                        }
                    }}
                    onClick={(e) => {
                        if (isSelectingLocation) {
                            setNewSpotLocation([e.lngLat.lng, e.lngLat.lat]);
                            setIsSelectingLocation(false);
                            setIsAddSpotOpen(true);
                        } else if (isMovingSpotPosition) {
                            setNewSpotLocation([e.lngLat.lng, e.lngLat.lat]);
                        }
                    }}
                >
                    <GeolocateControl position="bottom-right" />
                    <NavigationControl position="bottom-right" />
                    <ScaleControl />

                    {/* Floating Map Style Selector */}
                    <div className="absolute bottom-14 left-2.5 z-10 flex flex-col-reverse items-start gap-2 pointer-events-auto">
                        <button
                            type="button"
                            onClick={() => setIsStylesMenuOpen(!isStylesMenuOpen)}
                            className="w-10 h-10 rounded-full bg-gray-900/90 hover:bg-gray-900 border border-white/20 flex items-center justify-center text-white shadow-xl hover:border-blue-400/50 transition-all active:scale-95 cursor-pointer"
                            title={locale === 'de' ? 'Kartenansicht ändern' : 'Change Map View'}
                        >
                            <Layers className="w-5 h-5 text-gray-300 hover:text-blue-400 transition-colors" />
                        </button>

                        {isStylesMenuOpen && (
                            <div className="flex flex-col bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 shadow-2xl gap-1.5 min-w-[130px] animate-in slide-in-from-bottom-4 fade-in duration-200">
                                <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-wider px-2 mb-1">
                                    {locale === 'de' ? 'Ansicht' : 'Map View'}
                                </h4>
                                {mapStyleOptions.map((opt) => {
                                    const active = mapStyle === opt.url;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                setMapStyle(opt.url);
                                                setIsStylesMenuOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between",
                                                active 
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            <span>{opt.name[locale as keyof typeof opt.name] || opt.name.en}</span>
                                            {active && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Controls Overlay (Search & Filter) */}
                    <div className="absolute top-4 left-0 right-0 z-10 flex flex-col items-center gap-3 px-4 pointer-events-none">
                        <div className="w-full flex justify-between items-center pointer-events-auto gap-2">
                            {/* Left Spacer for balance */}
                            <div className="flex-1 hidden md:block" /> 

                            {/* Search Box - Center */}
                            <SearchBox 
                                spots={spots} 
                                onSelectSpot={handleSpotSelect} 
                                onSelectLocation={(center) => {
                                    mapRef.current?.flyTo({
                                        center: center,
                                        zoom: 12,
                                        duration: 1500,
                                        essential: true
                                    });
                                }}
                            />

                            {/* Auth / Profile - Right */}
                            <div className="flex-1 flex justify-end shrink-0 gap-3">
                                {user && (
                                    <NotificationCenter 
                                        user={user} 
                                        onSelectSpot={handleSpotSelect} 
                                        onViewProfile={handleViewProfile}
                                    />
                                )}
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
                        
                        <div className="w-full flex flex-col items-center gap-1.5">
                            <div className="w-full max-w-md px-1.5 text-center pointer-events-auto animate-in fade-in duration-300">
                                <span className="text-[10px] uppercase font-black text-black tracking-widest">
                                    {t('filters.title')}
                                </span>
                            </div>
                            <FilterBar filters={filters} setFilters={setFilters} />
                        </div>
                    </div>

                    {/* Add Spot Button Overlay - Bottom Center */}
                    <div className="absolute bottom-16 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-none gap-4">
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
                    {filteredSpots.map((spot) => {
                        // Hide original marker of the spot we are currently moving
                        if (isMovingSpotPosition && selectedSpot && spot.id === selectedSpot.id) return null;
                        
                        return (
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
                                    
                                    {/* Future Events Count Badge */}
                                    {(() => {
                                        const count = (() => {
                                            if (!spot.spot_visits) return 0;
                                            const todayStr = new Date().toISOString().split('T')[0];
                                            return spot.spot_visits.filter(v => v.visit_date >= todayStr).length;
                                        })();
                                        if (count === 0) return null;
                                        return (
                                            <div className="absolute -top-2.5 -right-2.5 bg-blue-600 border border-white/20 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-in zoom-in-50">
                                                {count}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </Marker>
                        );
                    })}

                    {/* Moving Spot Position Preview Marker */}
                    {isMovingSpotPosition && (newSpotLocation || selectedSpot) && (
                        <Marker
                            longitude={newSpotLocation ? newSpotLocation[0] : selectedSpot!.location.coordinates[0]}
                            latitude={newSpotLocation ? newSpotLocation[1] : selectedSpot!.location.coordinates[1]}
                            anchor="bottom"
                        >
                            <div className="relative flex flex-col items-center justify-center scale-110">
                                <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping pointer-events-none" />
                                <MapPin className="w-9 h-9 text-blue-500 fill-blue-500/20 drop-shadow-xl animate-bounce" />
                            </div>
                        </Marker>
                    )}
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
                onViewProfile={handleViewProfile}
            />

            <AddSpotDialog
                open={isAddSpotOpen}
                onClose={() => {
                    setIsAddSpotOpen(false);
                    if (!isSelectingLocation && !isMovingSpotPosition) setSelectedSpot(null); // Clear selection if done
                }}
                isMovingPosition={isMovingSpotPosition}
                onInitiateMove={() => {
                    setIsMovingSpotPosition(true);
                }}
                location={newSpotLocation || (selectedSpot?.location.coordinates as [number, number])}
                initialData={isAddSpotOpen && selectedSpot && !isSelectingLocation ? selectedSpot : null}
                onSuccess={(updatedSpot, isDeleted = false) => {
                    if (isDeleted && selectedSpot) {
                        setSpots(prev => prev.filter(s => s.id !== selectedSpot.id));
                        setSelectedSpot(null);
                        setIsDrawerOpen(false);
                    } else if (updatedSpot) {
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
                    setNewSpotLocation(null);
                }}
            />

            {/* Moving Spot Control Overlay Panel */}
            {isMovingSpotPosition && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 w-full max-w-sm px-4 animate-in slide-in-from-bottom-8 duration-300 pointer-events-auto">
                    <div className="w-full bg-gray-900/90 backdrop-blur-md border border-blue-500/30 rounded-2xl p-4 shadow-2xl flex flex-col items-center gap-3 text-center">
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse">📍</span>
                            <p className="text-xs font-bold text-gray-200">
                                {locale === 'de' 
                                    ? "Klicke auf die Karte, um die neue Position festzulegen" 
                                    : "Click on the map to set the new position"}
                            </p>
                        </div>
                        
                        {(newSpotLocation || selectedSpot) && (
                            <p className="text-[10px] font-mono text-blue-400">
                                {newSpotLocation ? newSpotLocation[1].toFixed(6) : selectedSpot!.location.coordinates[1].toFixed(6)}, {newSpotLocation ? newSpotLocation[0].toFixed(6) : selectedSpot!.location.coordinates[0].toFixed(6)}
                            </p>
                        )}

                        <div className="flex gap-2 w-full mt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setNewSpotLocation(null);
                                    setIsMovingSpotPosition(false);
                                }}
                                className="flex-1 py-2 text-xs font-bold text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                {locale === 'de' ? "Abbrechen" : "Cancel"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMovingSpotPosition(false);
                                    showToast(
                                        locale === 'de' ? "Position temporär aktualisiert! Speichere den Spot, um es dauerhaft zu machen." : "Position temporarily updated! Save the spot to make it permanent.",
                                        "success"
                                    );
                                }}
                                className="flex-1 py-2 text-xs font-black text-white bg-blue-600 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                {locale === 'de' ? "Position speichern" : "Save Position"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AuthDialog 
                open={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
            />

            <ProfileSetupDialog />

            <ProfileEditDialog 
                open={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                onSelectSpot={(spot) => {
                    handleSpotSelect(spot);
                    setIsProfileOpen(false);
                }}
            />

            <UserProfileDialog
                profileId={selectedProfileId}
                open={isUserProfileOpen}
                onClose={() => {
                    setIsUserProfileOpen(false);
                    setSelectedProfileId(null);
                }}
                onSelectSpot={(spot, tab) => {
                    if (tab === "visits") {
                        // Deep link to visits tab
                        const params = new URLSearchParams(window.location.search);
                        params.set("tab", "visits");
                        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
                    }
                    handleSpotSelect(spot);
                }}
            />
        </div>
    );
}
