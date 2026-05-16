"use client";

import { Drawer } from "vaul";
import { X, BatteryCharging } from "lucide-react";
import { Spot } from "@/app/actions";
import { cn } from "@/lib/utils";

interface SpotDrawerProps {
    spot: Spot | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SpotDrawer({ spot, open, onOpenChange }: SpotDrawerProps) {
    if (!spot) return null;

    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <Drawer.Content className="bg-[var(--card)] flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none border-t border-[var(--border)]">
                    {/* Draggable Handle */}
                    <div className="p-4 bg-[var(--card)] rounded-t-[10px] flex-shrink-0">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-[var(--muted-foreground)] mb-6" />

                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                                    {spot.name}
                                </h2>
                                <div className="flex items-center mt-2 gap-2">
                                    <span
                                        className={cn(
                                            "px-2 py-0.5 rounded-full text-xs font-medium uppercase border",
                                            spot.status === "ALLOWED" && "bg-green-500/10 text-green-500 border-green-500/20",
                                            spot.status === "TOLERATED" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                            spot.status === "FORBIDDEN" && "bg-red-500/10 text-red-500 border-red-500/20",
                                            spot.status === "UNCLEAR" && "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                        )}
                                    >
                                        {spot.status}
                                    </span>
                                    {/* Distance (Mock) */}
                                    <span className="text-xs text-[var(--muted-foreground)]">2.5 km away</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-2 bg-[var(--secondary)] rounded-full text-[var(--muted-foreground)] hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-6">

                        {/* Core Info */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
                                <span className="text-xs text-[var(--muted-foreground)] block mb-1">Entry</span>
                                <span className="font-semibold text-sm">Sandy Beach</span>
                            </div>
                            <div className="bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
                                <span className="text-xs text-[var(--muted-foreground)] block mb-1">Parking</span>
                                <span className="font-semibold text-sm">Close (&lt; 50m)</span>
                            </div>
                        </div>

                        {/* Infrastructure */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-[var(--muted-foreground)] mb-3 tracking-wider">
                                Infrastructure
                            </h3>
                            <div className="space-y-2">
                                {spot.attributes?.charging ? (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                                        <BatteryCharging className="w-5 h-5 text-green-500" />
                                        <div>
                                            <div className="text-sm font-medium">Charging Available</div>
                                            <div className="text-xs text-[var(--muted-foreground)]">Standard 230V Schuko</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] opacity-50">
                                        <BatteryCharging className="w-5 h-5 text-gray-500" />
                                        <span className="text-sm">No Charging</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description / Tips */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-[var(--muted-foreground)] mb-3 tracking-wider">
                                Rider Tips
                            </h3>
                            <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border)] text-sm leading-relaxed text-[var(--foreground)]">
                                <p>
                                    &quot;Super chill spot. Locals are friendly but keep distance from the swimming area buoys. Best status is during sunset.&quot;
                                </p>
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-500 font-bold">M</div>
                                    <span className="text-xs text-[var(--muted-foreground)]">Verified by Max • 2 days ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer (Placeholder) */}
                        <div className="pb-8">
                            <button className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold rounded-lg shadow-lg shadow-cyan-500/20">
                                I was here (Confirm Spot)
                            </button>
                        </div>

                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
