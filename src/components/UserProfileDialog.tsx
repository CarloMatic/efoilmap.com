"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, User, MapPin, Calendar, Loader2, Star } from "lucide-react";
import { getUserProfileData, UserProfileData, Spot } from "@/app/actions";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface UserProfileDialogProps {
    profileId: string | null;
    open: boolean;
    onClose: () => void;
    onSelectSpot: (spot: Spot, tab?: string) => void;
}

export function UserProfileDialog({ profileId, open, onClose, onSelectSpot }: UserProfileDialogProps) {
    const { locale, t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserProfileData | null>(null);
    const [activeTab, setActiveTab] = useState<"spots" | "visits">("spots");

    useEffect(() => {
        if (open && profileId) {
            setLoading(true);
            getUserProfileData(profileId)
                .then((res) => {
                    setData(res);
                })
                .catch((err) => {
                    console.error("Error loading user profile:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setData(null);
        }
    }, [open, profileId]);

    if (!open || !profileId) return null;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-gray-950/95 border border-white/15 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                
                {/* Header Close Trigger */}
                <div className="flex justify-end p-4 pb-0">
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-xs italic">{locale === 'de' ? 'Profil wird geladen...' : 'Loading profile...'}</p>
                    </div>
                ) : data ? (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Upper Profile Box */}
                        <div className="px-8 pb-6 flex flex-col items-center text-center border-b border-white/5">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/50 bg-gray-900 shadow-xl shadow-blue-500/10 mb-4 relative flex items-center justify-center">
                                {data.profile.avatar_url ? (
                                    <Image 
                                        src={data.profile.avatar_url} 
                                        alt={data.profile.username} 
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-600" />
                                )}
                            </div>

                            {/* Name & Date */}
                            <h2 className="text-2xl font-bold text-white tracking-tight">@{data.profile.username}</h2>
                            <p className="text-[10px] text-gray-500 mt-1">
                                {locale === 'de' ? 'Mitglied seit' : 'Member since'}:{" "}
                                {new Date(data.profile.created_at).toLocaleDateString()}
                            </p>

                            {/* Bio */}
                            {data.profile.bio && (
                                <p className="text-xs text-gray-300 leading-relaxed italic bg-white/2 border border-white/5 p-3 rounded-2xl mt-4 w-full text-center">
                                    &ldquo;{data.profile.bio}&rdquo;
                                </p>
                            )}

                            {/* Mini Stats Summary */}
                            <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                                <div className="bg-white/3 border border-white/5 py-2 px-3 rounded-2xl flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-blue-400">{data.spots.length}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                                        {locale === 'de' ? 'Spots' : 'Spots'}
                                    </span>
                                </div>
                                <div className="bg-white/3 border border-white/5 py-2 px-3 rounded-2xl flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-green-400">{data.visits.length}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                                        {locale === 'de' ? 'Termine' : 'Visits'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex px-4 pt-4 border-b border-white/5">
                            <button
                                onClick={() => setActiveTab("spots")}
                                className={cn(
                                    "flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                                    activeTab === "spots" 
                                        ? "border-blue-500 text-white" 
                                        : "border-transparent text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                {locale === 'de' ? 'Spots' : 'Spots'}
                            </button>
                            <button
                                onClick={() => setActiveTab("visits")}
                                className={cn(
                                    "flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                                    activeTab === "visits" 
                                        ? "border-green-500 text-white" 
                                        : "border-transparent text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                {locale === 'de' ? 'Geplante Termine' : 'Planned Visits'}
                            </button>
                        </div>

                        {/* Tab Contents Scrollable list */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTab === "spots" ? (
                                <div className="space-y-2">
                                    {data.spots.length > 0 ? (
                                        data.spots.map((spot) => (
                                            <button
                                                key={spot.id}
                                                onClick={() => {
                                                    onSelectSpot(spot);
                                                    onClose();
                                                }}
                                                className="w-full text-left p-3.5 bg-white/5 border border-white/5 hover:border-blue-500/30 rounded-2xl flex items-center justify-between gap-3 group transition-all duration-150 cursor-pointer"
                                            >
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                                        {spot.name}
                                                    </h4>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase inline-block mt-1",
                                                        spot.status === "ALLOWED" && "text-green-400",
                                                        spot.status === "TOLERATED" && "text-yellow-400",
                                                        spot.status === "FORBIDDEN" && "text-red-400",
                                                        spot.status === "UNCLEAR" && "text-gray-400"
                                                    )}>
                                                        {spot.status}
                                                    </span>
                                                </div>
                                                {spot.average_rating ? (
                                                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold shrink-0">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {spot.average_rating.toFixed(1)}
                                                    </div>
                                                ) : null}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-xs text-center text-gray-500 italic py-8">
                                            {locale === 'de' 
                                                ? 'Noch keine Spots beigetragen' 
                                                : 'No spots contributed yet'}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {data.visits.length > 0 ? (
                                        data.visits.map((visit) => (
                                            <button
                                                key={visit.id}
                                                onClick={() => {
                                                    const s = data.spots.find(sp => sp.id === visit.spot_id) || {
                                                        id: visit.spot_id,
                                                        name: visit.spot_name,
                                                        status: "ALLOWED",
                                                        location: { type: "Point", coordinates: [0, 0] },
                                                        attributes: {}
                                                    } as Spot;
                                                    onSelectSpot(s, "visits");
                                                    onClose();
                                                }}
                                                className="w-full text-left p-3.5 bg-white/5 border border-white/5 hover:border-green-500/30 rounded-2xl flex flex-col gap-2 group transition-all duration-150 cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="text-xs font-bold text-white group-hover:text-green-400 transition-colors truncate">
                                                        {visit.spot_name}
                                                    </h4>
                                                    <span className="text-[9px] text-green-400 font-extrabold uppercase shrink-0">
                                                        {visit.visit_date}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 leading-normal line-clamp-2 italic">
                                                    &ldquo;{visit.description}&rdquo;
                                                </p>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-xs text-center text-gray-500 italic py-8">
                                            {locale === 'de' 
                                                ? 'Keine geplanten Verabredungen' 
                                                : 'No planned visits scheduled'}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-xs text-red-400 italic">
                        {locale === 'de' ? 'Fehler beim Laden des Profils' : 'Error loading profile info'}
                    </div>
                )}
            </div>
        </div>
    );
}
