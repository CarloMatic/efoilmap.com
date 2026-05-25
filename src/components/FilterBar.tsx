"use client";

import { useLanguage } from '@/lib/i18n';
import { Filter, BatteryCharging, ParkingSquare, Utensils, Calendar, X, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export type FilterState = {
    status: 'allowed' | 'tolerated' | 'unclear' | 'not_forbidden' | 'all';
    parking: boolean;
    charging: boolean;
    food: boolean;
    rental: boolean;
    startDate?: string;
    endDate?: string;
};

interface FilterBarProps {
    filters: FilterState;
    setFilters: (f: FilterState | ((prev: FilterState) => FilterState)) => void;
}

const monthNames: Record<string, string[]> = {
    de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

const weekdays: Record<string, string[]> = {
    de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
};

export function FilterBar({ filters, setFilters }: FilterBarProps) {
    const { t, locale } = useLanguage();
    const [showDates, setShowDates] = useState(false);
    const [viewMonth, setViewMonth] = useState<Date>(() => new Date());

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDates(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleFilter = (key: keyof FilterState) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleStatus = () => {
        setFilters(prev => ({
            ...prev,
            status: prev.status === 'all' ? 'allowed' : 
                    prev.status === 'allowed' ? 'tolerated' : 
                    prev.status === 'tolerated' ? 'unclear' : 
                    prev.status === 'unclear' ? 'not_forbidden' : 'all'
        }));
    };

    const handleDayClick = (dateStr: string) => {
        if (!filters.startDate || (filters.startDate && filters.endDate)) {
            // Set as start date, clear end date
            setFilters(prev => ({ ...prev, startDate: dateStr, endDate: undefined }));
        } else {
            // We have startDate but no endDate
            if (dateStr < filters.startDate) {
                // If clicked day is before startDate, make it the new startDate
                setFilters(prev => ({ ...prev, startDate: dateStr, endDate: undefined }));
            } else {
                // Set as endDate
                setFilters(prev => ({ ...prev, endDate: dateStr }));
                setShowDates(false);
            }
        }
    };

    const getDaysInMonth = (y: number, m: number) => {
        return new Date(y, m + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (y: number, m: number) => {
        const day = new Date(y, m, 1).getDay();
        return day === 0 ? 6 : day - 1; // Mon is 0, Sun is 6
    };

    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const offsetArray = Array.from({ length: firstDayIndex }, (_, i) => i);

    return (
        <div ref={containerRef} className="flex flex-col items-center gap-2 w-full max-w-3xl pointer-events-auto">
            {/* Primary Horizontal Filter Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full">
                {/* Status Filter */}
                <button
                    onClick={toggleStatus}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-primary transition-colors whitespace-nowrap shadow-sm bg-primary text-primary-foreground cursor-pointer shrink-0"
                >
                    <Filter className="w-3.5 h-3.5" />
                    <span>
                        {filters.status === 'all' ? t('filters.all_spots') :
                            filters.status === 'allowed' ? t('filters.allowed_spots') :
                            filters.status === 'tolerated' ? t('filters.tolerated_spots') :
                            filters.status === 'unclear' ? t('filters.unclear_spots') :
                            t('filters.not_forbidden_spots')}
                    </span>
                </button>

                {/* Date Range Toggle */}
                <button
                    onClick={() => setShowDates(!showDates)}
                    className={classNames(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shadow-sm cursor-pointer shrink-0",
                        filters.startDate || filters.endDate
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-background/80 backdrop-blur-md border-white/10 text-muted-foreground hover:bg-background"
                    )}
                >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                        {filters.startDate || filters.endDate 
                            ? `${filters.startDate || ''}${filters.endDate ? ` ${locale === 'de' ? 'bis' : 'to'} ${filters.endDate}` : ''}` 
                            : (locale === 'de' ? 'Zeitraum' : 'Date Range')}
                    </span>
                </button>

                {/* Parking */}
                <button
                    onClick={() => toggleFilter('parking')}
                    className={classNames(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm cursor-pointer shrink-0",
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
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm cursor-pointer shrink-0",
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
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm cursor-pointer shrink-0",
                        filters.food
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background/80 backdrop-blur-md border-white/10 text-muted-foreground hover:bg-background"
                    )}
                >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>{t('filters.food') || 'Food'}</span>
                </button>

                {/* Rental */}
                <button
                    onClick={() => toggleFilter('rental')}
                    className={classNames(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shadow-sm cursor-pointer shrink-0",
                        filters.rental
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background/80 backdrop-blur-md border-white/10 text-muted-foreground hover:bg-background"
                    )}
                >
                    <Store className="w-3.5 h-3.5" />
                    <span>{t('filters.rental') || 'Rental'}</span>
                </button>
            </div>

            {/* Collapsible Custom Calendar for Date Range */}
            {showDates && (
                <div className="bg-gray-950/95 backdrop-blur border border-white/15 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 w-full max-w-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-400" />
                            {locale === 'de' ? 'Zeitraum filtern' : 'Filter by Date Range'}
                        </span>
                        
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                                className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold text-white uppercase min-w-[80px] text-center">
                                {locale === 'de' 
                                    ? `${monthNames.de[month]} ${year}` 
                                    : `${monthNames.en[month]} ${year}`}
                            </span>
                            <button 
                                onClick={() => setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                                className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 gap-1 text-center mt-1">
                        {(weekdays[locale] || weekdays.en).map(day => (
                            <span key={day} className="text-[9px] uppercase font-black text-gray-500">{day}</span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Offset days */}
                        {offsetArray.map(i => (
                            <div key={`offset-${i}`} className="aspect-square" />
                        ))}

                        {/* Actual Days */}
                        {daysArray.map(d => {
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const todayStr = new Date().toISOString().split('T')[0];
                            const isPast = dateStr < todayStr;
                            
                            const isStart = dateStr === filters.startDate;
                            const isEnd = dateStr === filters.endDate;
                            const inRange = !!(filters.startDate && filters.endDate && dateStr > filters.startDate && dateStr < filters.endDate);
                            
                            return (
                                <button
                                    key={`filter-day-${d}`}
                                    disabled={isPast}
                                    onClick={() => handleDayClick(dateStr)}
                                    className={classNames(
                                        "aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all relative border",
                                        isPast 
                                            ? "opacity-20 cursor-not-allowed text-gray-600 border-transparent bg-transparent" 
                                            : "cursor-pointer hover:scale-105 active:scale-95",
                                        isStart || isEnd
                                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20 z-10"
                                            : inRange
                                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                                : !isPast ? "bg-white/5 border-transparent text-gray-300 hover:bg-white/10" : ""
                                    )}
                                >
                                    <span>{d}</span>
                                    {isStart && filters.endDate && (
                                        <span className="absolute -right-0.5 w-1 h-full bg-blue-500/20 -z-10 rounded-r-none" />
                                    )}
                                    {isEnd && filters.startDate && (
                                        <span className="absolute -left-0.5 w-1 h-full bg-blue-500/20 -z-10 rounded-l-none" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer / Reset button */}
                    {(filters.startDate || filters.endDate) && (
                        <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-1">
                            <span className="text-[10px] text-gray-400">
                                {filters.startDate && `${filters.startDate}`} 
                                {filters.endDate && ` → ${filters.endDate}`}
                            </span>
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, startDate: undefined, endDate: undefined }))}
                                className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-gray-300 transition-colors cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                                {locale === 'de' ? 'Zurücksetzen' : 'Reset'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
