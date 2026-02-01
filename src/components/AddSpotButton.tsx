import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AddSpotButtonProps {
    onClick: () => void;
    className?: string;
}

export function AddSpotButton({ onClick, className }: AddSpotButtonProps) {
    const { t } = useLanguage();

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform font-bold",
                className
            )}
        >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t('add_spot')}</span>
        </button>
    );
}
