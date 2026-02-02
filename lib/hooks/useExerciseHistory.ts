"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ExerciseHistory } from "@/lib/supabase/types";

interface HistoryFilters {
  participantId?: string;
  seasonId?: string;
  difficulty?: string;
  search?: string;
}

async function fetchExerciseHistory(
  filters: HistoryFilters
): Promise<ExerciseHistory[]> {
  const supabase = createClient();

  // Query from exercise_submissions with joins instead of view
  // since view might not exist yet
  let query = supabase
    .from("exercise_submissions")
    .select(
      `
      id,
      exercise_name,
      difficulty,
      points_awarded,
      notes,
      completed_at,
      participants!inner(name),
      seasons!inner(name)
    `
    )
    .order("completed_at", { ascending: false });

  if (filters.participantId) {
    query = query.eq("participant_id", filters.participantId);
  }

  if (filters.seasonId) {
    query = query.eq("season_id", filters.seasonId);
  }

  if (filters.difficulty) {
    query = query.eq("difficulty", filters.difficulty);
  }

  if (filters.search) {
    query = query.ilike("exercise_name", `%${filters.search}%`);
  }

  const { data, error } = await query.limit(100);

  if (error) {
    throw error;
  }

  // Transform to match ExerciseHistory type
  return (data || []).map((item) => ({
    id: item.id,
    participant_name: (item.participants as { name: string }).name,
    season_name: (item.seasons as { name: string }).name,
    exercise_name: item.exercise_name,
    difficulty: item.difficulty,
    points_awarded: item.points_awarded,
    notes: item.notes,
    completed_at: item.completed_at,
  }));
}

export function useExerciseHistory(filters: HistoryFilters = {}) {
  return useQuery({
    queryKey: ["exercise-history", filters],
    queryFn: () => fetchExerciseHistory(filters),
  });
}
