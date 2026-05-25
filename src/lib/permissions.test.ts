import { describe, test, expect } from "vitest";
import { GOOGLE_MAPS_TIP, MOVE_ON_MAP_BTN, MOVE_POSITION_TIP } from "@/components/AddSpotDialog";
import { editSpotText } from "@/components/SpotDialog";
import { likedSpotText } from "@/components/NotificationCenter";

// Simple emulation of the isCreator logic in AddSpotDialog.tsx & SpotDialog.tsx
function checkSpotEditPermission(
    user: { id: string; email: string } | null,
    spot: { user_id: string; created_by?: string } | null
): boolean {
    if (!user || !spot) return false;
    const isAdmin = user.email === "callematic@gmail.com";
    return spot.user_id === user.id || spot.created_by === user.id || isAdmin;
}

describe("Spot Edit & Move Permissions", () => {
    const creatorUser = { id: "user-123", email: "creator@example.com" };
    const normalUser = { id: "user-456", email: "visitor@example.com" };
    const adminUser = { id: "user-999", email: "callematic@gmail.com" };

    const mySpot = { user_id: "user-123", created_by: "user-123" };
    const anotherSpot = { user_id: "user-789", created_by: "user-789" };

    test("should allow the original spot creator to edit and move the spot", () => {
        const allowed = checkSpotEditPermission(creatorUser, mySpot);
        expect(allowed).toBe(true);
    });

    test("should prevent an unauthorized regular user from editing another creator's spot", () => {
        const allowed = checkSpotEditPermission(normalUser, anotherSpot);
        expect(allowed).toBe(false);
    });

    test("should allow the administrator callematic@gmail.com to edit and move any spot", () => {
        const allowed = checkSpotEditPermission(adminUser, anotherSpot);
        expect(allowed).toBe(true);
    });

    test("should deny permissions if user is not logged in", () => {
        const allowed = checkSpotEditPermission(null, mySpot);
        expect(allowed).toBe(false);
    });
});

describe("Spot Dialog Translation Coverages (9 Platform Languages)", () => {
    const requiredLocales = ["de", "en", "es", "fr", "it", "pt", "nl", "pl", "sv"];

    test("GOOGLE_MAPS_TIP dictionary covers all 9 languages and has non-empty values", () => {
        requiredLocales.forEach((locale) => {
            expect(GOOGLE_MAPS_TIP[locale]).toBeDefined();
            expect(typeof GOOGLE_MAPS_TIP[locale]).toBe("string");
            expect(GOOGLE_MAPS_TIP[locale].length).toBeGreaterThan(0);
        });
    });

    test("MOVE_ON_MAP_BTN dictionary covers all 9 languages and has non-empty values", () => {
        requiredLocales.forEach((locale) => {
            expect(MOVE_ON_MAP_BTN[locale]).toBeDefined();
            expect(typeof MOVE_ON_MAP_BTN[locale]).toBe("string");
            expect(MOVE_ON_MAP_BTN[locale].length).toBeGreaterThan(0);
        });
    });

    test("MOVE_POSITION_TIP dictionary covers all 9 languages and has non-empty values", () => {
        requiredLocales.forEach((locale) => {
            expect(MOVE_POSITION_TIP[locale]).toBeDefined();
            expect(typeof MOVE_POSITION_TIP[locale]).toBe("string");
            expect(MOVE_POSITION_TIP[locale].length).toBeGreaterThan(0);
        });
    });

    test("editSpotText dictionary covers all 9 languages and has non-empty values", () => {
        requiredLocales.forEach((locale) => {
            expect(editSpotText[locale]).toBeDefined();
            expect(typeof editSpotText[locale]).toBe("string");
            expect(editSpotText[locale].length).toBeGreaterThan(0);
        });
    });

    test("likedSpotText dictionary covers all 9 languages and has non-empty values", () => {
        requiredLocales.forEach((locale) => {
            expect(likedSpotText[locale]).toBeDefined();
            expect(typeof likedSpotText[locale]).toBe("string");
            expect(likedSpotText[locale].length).toBeGreaterThan(0);
        });
    });
});
