"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Participant } from "@/lib/supabase/types";

async function fetchParticipants(): Promise<Participant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }
  return data;
}

export function useParticipants() {
  return useQuery({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
  });
}

interface CreateParticipantData {
  name: string;
  avatar_url?: string | null;
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateParticipantData) => {
      const supabase = createClient();
      const { data: participant, error } = await supabase
        .from("participants")
        .insert(data)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return participant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
