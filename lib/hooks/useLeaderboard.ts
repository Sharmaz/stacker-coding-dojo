"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/lib/supabase/types";

export function useLeaderboard(seasonId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["leaderboard", seasonId],
    queryFn: async () => {
      let query = supabase.from("current_leaderboard").select("*");

      if (seasonId) {
        query = query.eq("season_id", seasonId);
      }

      const { data, error } = await query.order("position", { ascending: true });

      if (error) {throw error;}
      return data as LeaderboardEntry[];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useRealtimeLeaderboard(seasonId?: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const query = useLeaderboard(seasonId);

  useEffect(() => {
    const channel = supabase
      .channel("leaderboard_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "season_scores",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  return query;
}
