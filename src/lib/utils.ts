import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateSlug(spot: { id: string; name: string }): string {
    const cleanName = spot.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '');   // Trim hyphens
    
    // Add keywords for SEO: name + "efoil-spot" + id
    return `${cleanName}-efoil-spot-${spot.id.substring(0, 8)}`;
}
