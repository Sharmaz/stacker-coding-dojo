"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Season } from "@/lib/supabase/types";

export function useSeasons() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["seasons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) {throw error;}
      return data as Season[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useActiveSeason() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["seasons", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) {throw error;}
      return data as Season;
    },
    staleTime: 5 * 60 * 1000,
  });
}

interface CreateSeasonData {
  name: string;
}

export function useCreateSeason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSeasonData) => {
      const supabase = createClient();

      // First, deactivate current active season
      await supabase
        .from("seasons")
        .update({ is_active: false, end_date: new Date().toISOString() })
        .eq("is_active", true);

      // Create new active season
      const { data: season, error } = await supabase
        .from("seasons")
        .insert({
          name: data.name,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      return season;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      queryClient.invalidateQueries({ queryKey: ["seasons", "active"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
