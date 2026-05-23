"use client";

import { useLanguage } from '@/lib/i18n';
import { Filter, BatteryCharging, ParkingSquare, Utensils } from 'lucide-react';

// Simple cn utility if not exists (checked imports, but to be safe)
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export type FilterState = {
    status: 'allowed' | 'tolerated' | 'unclear' | 'all';
    parking: boolean;
    charging: boolean;
    food: boolean;
};

interface FilterBarProps {
    filters: FilterState;
    setFilters: (f: FilterState | ((prev: FilterState) => FilterState)) => void;
}

export function FilterBar({ filters, setFilters }: FilterBarProps) {
    const { t } = useLanguage();

    const toggleFilter = (key: keyof FilterState) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleStatus = () => {
        setFilters(prev => ({
            ...prev,
            status: prev.status === 'all' ? 'allowed' : 
                    prev.status === 'allowed' ? 'tolerated' : 
                    prev.status === 'tolerated' ? 'unclear' : 'all'
        }));
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 pointer-events-auto max-w-full">
            {/* Status Filter */}
            <button
                onClick={toggleStatus}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-primary transition-colors whitespace-nowrap shadow-sm bg-primary text-primary-foreground cursor-pointer"
            >
                <Filter className="w-3.5 h-3.5" />
                <span>
                    {filters.status === 'all' ? t('filters.all_spots') :
                        filters.status === 'allowed' ? t('filters.allowed_spots') :
                        filters.status === 'tolerated' ? t('filters.tolerated_spots') :
                        t('filters.unclear_spots')}
                </span>
            </button>


            {/* Parking */}
            <button
                onClick={() => toggleFilter('parking')}
                className={classNames(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm cursor-pointer",
                    filters.parking
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/80 backdrop-blur-md border-white/10 text-muted-foreground hover:bg-background"
                )}
            >
                <ParkingSquare className="w-3.5 h-3.5" />
                <span>{t('filters.parking') || 'Parking'}</span>
            </button>

            {/* Charging */}
            <button
                onClick={() => toggleFilter('charging')}
                className={classNames(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm cursor-pointer",
                    filters.charging
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/80 backdrop-blur-md border-white/10 text-muted-foreground hover:bg-background"
                )}
            >
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>{t('filters.charging') || 'Charging'}</span>
            </button>

            {/* Food */}
            <button
                onClick={() => toggleFilter('food')}
                className={classNames(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm cursor-pointer",
                    filters.food
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/80 backdrop-blur-md border-white/10 text-muted-foreground hover:bg-background"
                )}
            >
                <Utensils className="w-3.5 h-3.5" />
                <span>{t('filters.food') || 'Food'}</span>
            </button>
        </div>
    );
}
