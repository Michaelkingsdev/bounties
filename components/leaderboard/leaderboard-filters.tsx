"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    LeaderboardFilters as FiltersType,
    LeaderboardTimeframe,
    ReputationTier
} from "@/types/leaderboard";
import { FilterX } from "lucide-react";

interface LeaderboardFiltersProps {
    filters: FiltersType;
    onFilterChange: (filters: FiltersType) => void;
}

const TIMEFRAMES: { value: LeaderboardTimeframe; label: string }[] = [
    { value: "ALL_TIME", label: "All Time" },
    { value: "THIS_MONTH", label: "This Month" },
    { value: "THIS_WEEK", label: "This Week" },
];

const TIERS: { value: ReputationTier; label: string }[] = [
    { value: "LEGEND", label: "Legend" },
    { value: "EXPERT", label: "Expert" },
    { value: "ESTABLISHED", label: "Established" },
    { value: "CONTRIBUTOR", label: "Contributor" },
    { value: "NEWCOMER", label: "Newcomer" },
];

export function LeaderboardFilters({ filters, onFilterChange }: LeaderboardFiltersProps) {
    const updateFilter = (key: keyof FiltersType, value: unknown) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            timeframe: "ALL_TIME",
            tier: undefined,
            tags: [],
        });
    };

    const hasActiveFilters = filters.timeframe !== "ALL_TIME" || filters.tier || (filters.tags?.length || 0) > 0;

    return (
        <div className="flex flex-wrap items-center gap-3 text-white">
            {/* Timeframe Select */}
            <Select
                value={filters.timeframe}
                onValueChange={(val) => updateFilter("timeframe", val as LeaderboardTimeframe)}
            >
                <SelectTrigger className="w-[140px] bg-background border-border/50">
                    <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                    {TIMEFRAMES.map((tf) => (
                        <SelectItem key={tf.value} value={tf.value}>
                            {tf.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Tier Select */}
            <Select
                value={filters.tier || "all"}
                onValueChange={(val) => updateFilter("tier", val === "all" ? undefined : (val as ReputationTier))}
            >
                <SelectTrigger className="w-[140px] bg-background-card border-border/50">
                    <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    {TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Clear Button */}
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground h-9 px-2.5"
                >
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>
    );
}
