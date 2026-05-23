import { describe, test, expect } from "vitest";
import { generateSlug } from "@/lib/utils";

describe("generateSlug utility", () => {
    test("should correctly slugify standard alphanumeric spot names", () => {
        const spot = {
            id: "1234567890abcdef",
            name: "Rursee Example"
        };
        const slug = generateSlug(spot);
        expect(slug).toBe("rursee-example-efoil-spot-12345678");
    });

    test("should clean up and replace special characters and extra spaces", () => {
        const spot = {
            id: "abcdef1234567890",
            name: " Harbor & Lake !!! "
        };
        const slug = generateSlug(spot);
        expect(slug).toBe("harbor-lake-efoil-spot-abcdef12");
    });

    test("should handle numbers and lowercase letters correctly", () => {
        const spot = {
            id: "9876543210fedcba",
            name: "Aachen eFoil 2026"
        };
        const slug = generateSlug(spot);
        expect(slug).toBe("aachen-efoil-2026-efoil-spot-98765432");
    });
});
