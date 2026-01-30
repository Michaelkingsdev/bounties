"use client";

import { useLeaderboard } from "@/hooks/use-leaderboard";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { LeaderboardFilters } from "@/components/leaderboard/leaderboard-filters";
import { UserRankSidebar } from "@/components/leaderboard/user-rank-sidebar";
import { LeaderboardFilters as FiltersType, ReputationTier } from "@/types/leaderboard";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LeaderboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize filters from URL
    const initialTimeframe = (searchParams.get("timeframe") as FiltersType["timeframe"]) || "ALL_TIME";
    const initialTier = (searchParams.get("tier") as ReputationTier) || undefined;

    const [filters, setFilters] = useState<FiltersType>({
        timeframe: initialTimeframe,
        tier: initialTier,
        tags: [],
    });

    // Fake current user ID for demo purposes
    // In a real app this would come from auth context
    const currentUserId = "user-1";

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useLeaderboard(filters, 20);

    // Sync filters to URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.timeframe !== "ALL_TIME") params.set("timeframe", filters.timeframe);
        if (filters.tier) params.set("tier", filters.tier);

        router.replace(`/leaderboard?${params.toString()}`, { scroll: false });
    }, [filters, router]);

    // Flatten infinite query data
    const entries = data?.pages.flatMap((page) => page.entries) || [];

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Hero Header */}
            <div className="border-b border-border/40">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                        Leaderboard
                    </h1>
                    <p className="text-lg text-white max-w-2xl">
                        Recognizing the top contributors in the ecosystem.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content - Table */}
                    <div className="lg:col-span-3 space-y-6">
                        <LeaderboardFilters
                            filters={filters}
                            onFilterChange={setFilters}
                        />

                        <LeaderboardTable
                            entries={entries}
                            isLoading={isLoading}
                            hasNextPage={hasNextPage || false}
                            isFetchingNextPage={isFetchingNextPage}
                            onLoadMore={() => fetchNextPage()}
                            currentUserId={currentUserId}
                        />
                    </div>

                    {/* Sidebar - User Rank */}
                    <div className="lg:col-span-1">
                        <UserRankSidebar userId={currentUserId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
