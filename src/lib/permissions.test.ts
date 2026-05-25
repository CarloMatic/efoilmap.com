import { describe, test, expect } from "vitest";
import { GOOGLE_MAPS_TIP, MOVE_ON_MAP_BTN, MOVE_POSITION_TIP } from "@/components/AddSpotDialog";
import { editSpotText, noCommentsText, commentsHeaderText, commentPlaceholderText, commentButtonText, commentSignInPrompt, replyPlaceholderText, replyButtonText } from "@/components/SpotDialog";
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

    test("noCommentsText dictionary covers all 9 languages and has non-empty values", () => {
        requiredLocales.forEach((locale) => {
            expect(noCommentsText[locale]).toBeDefined();
            expect(typeof noCommentsText[locale]).toBe("string");
            expect(noCommentsText[locale].length).toBeGreaterThan(0);
        });
    });

    test("noCommentsText has the exact user-requested phrasing for German empty state", () => {
        expect(noCommentsText["de"]).toBe("Noch keine Kommentare oder Fragen zu diesem Spot. Stell das erste Kommentar oder die erste Frage!");
    });

    test("commentsHeaderText, commentPlaceholderText, commentButtonText, commentSignInPrompt, replyPlaceholderText, replyButtonText cover all 9 languages and have non-empty values", () => {
        requiredLocales.forEach((locale) => {
            expect(commentsHeaderText[locale]).toBeDefined();
            expect(typeof commentsHeaderText[locale]).toBe("string");
            expect(commentsHeaderText[locale].length).toBeGreaterThan(0);

            expect(commentPlaceholderText[locale]).toBeDefined();
            expect(typeof commentPlaceholderText[locale]).toBe("string");
            expect(commentPlaceholderText[locale].length).toBeGreaterThan(0);

            expect(commentButtonText[locale]).toBeDefined();
            expect(typeof commentButtonText[locale]).toBe("string");
            expect(commentButtonText[locale].length).toBeGreaterThan(0);

            expect(commentSignInPrompt[locale]).toBeDefined();
            expect(typeof commentSignInPrompt[locale]).toBe("string");
            expect(commentSignInPrompt[locale].length).toBeGreaterThan(0);

            expect(replyPlaceholderText[locale]).toBeDefined();
            expect(typeof replyPlaceholderText[locale]).toBe("string");
            expect(replyPlaceholderText[locale].length).toBeGreaterThan(0);

            expect(replyButtonText[locale]).toBeDefined();
            expect(typeof replyButtonText[locale]).toBe("string");
            expect(replyButtonText[locale].length).toBeGreaterThan(0);
        });
    });
});
