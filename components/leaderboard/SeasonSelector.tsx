"use client";

import { Select, SelectItem } from "@heroui/react";
import { useSeasons } from "@/lib/hooks/useSeasons";
import type { Season } from "@/lib/supabase/types";

interface SeasonSelectorProps {
  selectedSeasonId: string | undefined;
  onSeasonChange: (seasonId: string | undefined) => void;
}

export function SeasonSelector({
  selectedSeasonId,
  onSeasonChange,
}: SeasonSelectorProps) {
  const { data: seasons, isLoading } = useSeasons();

  if (isLoading) {
    return (
      <Select
        label="Temporada"
        placeholder="Cargando..."
        isDisabled
        className="max-w-xs"
      >
        <SelectItem key="loading">Cargando...</SelectItem>
      </Select>
    );
  }

  const activeSeason = seasons?.find((s) => s.is_active);

  return (
    <Select
      label="Temporada"
      placeholder="Selecciona una temporada"
      selectedKeys={selectedSeasonId ? [selectedSeasonId] : activeSeason ? [activeSeason.id] : []}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string | undefined;
        onSeasonChange(selected);
      }}
      className="max-w-xs"
    >
      {(seasons || []).map((season: Season) => (
        <SelectItem key={season.id} textValue={season.name}>
          {season.name} {season.is_active && "(Activa)"}
        </SelectItem>
      ))}
    </Select>
  );
}
