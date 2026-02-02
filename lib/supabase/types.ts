export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Participant {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SeasonScore {
  id: string;
  participant_id: string;
  season_id: string;
  total_points: number;
  exercises_completed: number;
  updated_at: string;
}

export interface ExerciseSubmission {
  id: string;
  participant_id: string;
  season_id: string;
  exercise_name: string;
  difficulty: Difficulty;
  points_awarded: number;
  notes: string | null;
  completed_at: string;
}

export interface DifficultyPoints {
  difficulty: Difficulty;
  base_points: number;
  description: string;
}

// View types
export interface LeaderboardEntry {
  position: number;
  participant_id: string;
  participant_name: string;
  avatar_url: string | null;
  total_points: number;
  exercises_completed: number;
  last_activity: string;
  season_name: string;
  season_id: string;
}

export interface ExerciseHistory {
  id: string;
  participant_name: string;
  season_name: string;
  exercise_name: string;
  difficulty: Difficulty;
  points_awarded: number;
  notes: string | null;
  completed_at: string;
}
