"use client";

import { useQuery } from "@tanstack/react-query";
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
