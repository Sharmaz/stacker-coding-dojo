"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

interface AdminStats {
  totalParticipants: number;
  totalExercises: number;
  activeSeasonName: string | null;
  totalPointsThisSeason: number;
}

async function fetchAdminStats(): Promise<AdminStats> {
  const supabase = createClient();

  const [participantsRes, exercisesRes, seasonRes, pointsRes] =
    await Promise.all([
      supabase.from("participants").select("id", { count: "exact", head: true }),
      supabase
        .from("exercise_submissions")
        .select("id", { count: "exact", head: true }),
      supabase.from("seasons").select("name").eq("is_active", true).single(),
      supabase.from("season_scores").select("points"),
    ]);

  const totalPoints =
    pointsRes.data?.reduce((sum, row) => sum + (row.points || 0), 0) || 0;

  return {
    totalParticipants: participantsRes.count || 0,
    totalExercises: exercisesRes.count || 0,
    activeSeasonName: seasonRes.data?.name || null,
    totalPointsThisSeason: totalPoints,
  };
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
  });
}
