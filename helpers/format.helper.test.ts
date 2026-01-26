import { describe, it, expect } from "vitest";
import {
    formatCurrency,
    formatTimestamp,
    formatAddress,
    formatRole,
    formatText,
    formatAmount,
    formatPercentage,
    formatFileSize,
    formatDate,
    formatDuration,
    formatTimeAgo,
    slugify,
    truncate,
} from "./format.helper";

describe("formatHelper", () => {
    describe("formatCurrency", () => {
        it("should format currency correctly", () => {
            expect(formatCurrency(100, "$")).toBe("$ 100.00");
            expect(formatCurrency(1234.56, "€")).toBe("€ 1234.56");
        });
    });

    describe("formatTimestamp", () => {
        it("should format timestamp correctly", () => {
            const ts = { _seconds: 1764163725, _nanoseconds: 0 };
            expect(formatTimestamp(ts)).not.toBe("-");
        });

        it("should return '-' for undefined timestamp", () => {
            expect(formatTimestamp(undefined)).toBe("-");
        });
    });

    describe("formatAddress", () => {
        it("should truncate long address", () => {
            const address = "0x1234567890abcdef1234567890abcdef";
            expect(formatAddress(address)).toBe("0x12345678...cdef");
        });
    });

    describe("formatRole", () => {
        it("should format camelCase role to readable text", () => {
            expect(formatRole("adminUser")).toBe("Admin User");
            expect(formatRole("superAdmin")).toBe("Super Admin");
            expect(formatRole("user")).toBe("User");
        });
    });

    describe("formatText", () => {
        it("should capitalize first letter", () => {
            expect(formatText("hello")).toBe("Hello");
            expect(formatText("hello world")).toBe("Hello world");
        });
    });

    // New Helpers

    describe("formatAmount", () => {
        it("should format large numbers with suffixes", () => {
            expect(formatAmount(1500)).toBe("1.5K");
            expect(formatAmount(2500000)).toBe("2.5M");
            expect(formatAmount(1000000000)).toBe("1B");
        });

        it("should not format small numbers", () => {
            expect(formatAmount(999)).toBe("999");
        });

        it("should remove trailing zeros", () => {
            expect(formatAmount(1000)).toBe("1K"); // Not 1.0K
        });
    });

    describe("formatPercentage", () => {
        it("should format percentage with default decimals", () => {
            expect(formatPercentage(0.156)).toBe("15.6%");
        });

        it("should format percentage with custom decimals", () => {
            expect(formatPercentage(0.5, 0)).toBe("50%");
        });

        it("should remove trailing .0", () => {
            expect(formatPercentage(0.5)).toBe("50%"); // 50.0% -> 50%
        });
    });

    describe("formatFileSize", () => {
        it("should format bytes to readable size", () => {
            expect(formatFileSize(0)).toBe("0 Bytes");
            expect(formatFileSize(1024)).toBe("1 KB");
            expect(formatFileSize(1048576)).toBe("1 MB");
        });
    });

    describe("formatDate", () => {
        it("should format date with short option (default)", () => {
            const date = new Date("2026-01-25T12:00:00");
            expect(formatDate(date)).toContain("Jan 25, 2026");
        });

        it("should format date with long option", () => {
            const date = new Date("2026-01-25T12:00:00");
            expect(formatDate(date, "long")).toBe("January 25, 2026");
        });

        it("should handle invalid dates", () => {
            expect(formatDate("invalid-date")).toBe("Invalid Date");
        });
    });

    describe("formatDuration", () => {
        it("should format seconds to duration string", () => {
            expect(formatDuration(9000)).toBe("2h 30m");
            expect(formatDuration(125)).toBe("2m 5s");
            expect(formatDuration(59)).toBe("59s");
        });
    });

    describe("formatTimeAgo", () => {
        it("should format relative time", () => {
            const now = new Date();
            const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
            expect(formatTimeAgo(fiveMinsAgo)).toBe("5 minutes ago");
        });

        it("should use 'seconds ago' for very recent times", () => {
            const now = new Date();
            const fewSecsAgo = new Date(now.getTime() - 5 * 1000);
            expect(formatTimeAgo(fewSecsAgo)).toBe("5 seconds ago");
        });
    });

    describe("slugify", () => {
        it("should convert text to url-friendly slug", () => {
            expect(slugify("Hello World!")).toBe("hello-world");
            expect(slugify("This is a Test")).toBe("this-is-a-test");
            expect(slugify("  Spaces  ")).toBe("spaces");
        });
    });

    describe("truncate", () => {
        it("should truncate text correctly", () => {
            expect(truncate("Long text...", 10)).toBe("Long te...");
        });

        it("should not truncate if text is shorter than length", () => {
            expect(truncate("Short", 10)).toBe("Short");
        });
    });
});
