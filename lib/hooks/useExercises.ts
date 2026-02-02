"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Difficulty } from "@/lib/supabase/types";

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  Easy: 500,
  Medium: 1000,
  Hard: 2000,
};

interface CreateExerciseData {
  participant_id: string;
  exercise_name: string;
  difficulty: Difficulty;
  points_awarded: number;
  notes?: string | null;
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExerciseData) => {
      const supabase = createClient();

      // Get active season
      const { data: season, error: seasonError } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (seasonError || !season) {
        throw new Error("No hay una temporada activa");
      }

      const { data: exercise, error } = await supabase
        .from("exercise_submissions")
        .insert({
          ...data,
          season_id: season.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      return exercise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["exercise-history"] });
    },
  });
}
