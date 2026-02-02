"use client";

import {
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useState } from "react";
import { useExerciseHistory } from "@/lib/hooks/useExerciseHistory";
import { useParticipants } from "@/lib/hooks/useParticipants";
import { useSeasons } from "@/lib/hooks/useSeasons";
import type { Difficulty } from "@/lib/supabase/types";

const difficultyColors: Record<Difficulty, "success" | "warning" | "danger"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

export default function HistoryPage() {
  const [filters, setFilters] = useState({
    participantId: "",
    seasonId: "",
    difficulty: "",
    search: "",
  });

  const { data: history, isLoading } = useExerciseHistory({
    participantId: filters.participantId || undefined,
    seasonId: filters.seasonId || undefined,
    difficulty: filters.difficulty || undefined,
    search: filters.search || undefined,
  });

  const { data: participants } = useParticipants();
  const { data: seasons } = useSeasons();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hoy";
    }
    if (diffDays === 1) {
      return "Ayer";
    }
    if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    }
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial de Ejercicios</h1>
        <p className="text-default-500">
          Todos los ejercicios registrados en el sistema
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Participante"
          placeholder="Todos"
          selectedKeys={filters.participantId ? [filters.participantId] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            setFilters((f) => ({
              ...f,
              participantId: selected?.toString() || "",
            }));
          }}
        >
          {(participants || []).map((p) => (
            <SelectItem key={p.id}>{p.name}</SelectItem>
          ))}
        </Select>

        <Select
          label="Temporada"
          placeholder="Todas"
          selectedKeys={filters.seasonId ? [filters.seasonId] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            setFilters((f) => ({
              ...f,
              seasonId: selected?.toString() || "",
            }));
          }}
        >
          {(seasons || []).map((s) => (
            <SelectItem key={s.id}>
              {s.name} {s.is_active ? "(Activa)" : ""}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Dificultad"
          placeholder="Todas"
          selectedKeys={filters.difficulty ? [filters.difficulty] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            setFilters((f) => ({
              ...f,
              difficulty: selected?.toString() || "",
            }));
          }}
        >
          <SelectItem key="Easy">Easy</SelectItem>
          <SelectItem key="Medium">Medium</SelectItem>
          <SelectItem key="Hard">Hard</SelectItem>
        </Select>

        <Input
          label="Buscar ejercicio"
          placeholder="Nombre del ejercicio..."
          value={filters.search}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, search: value }))
          }
          isClearable
          onClear={() => setFilters((f) => ({ ...f, search: "" }))}
        />
      </div>

      {/* Results count */}
      <p className="text-default-500 text-sm">
        {history?.length || 0} ejercicios encontrados
      </p>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" label="Cargando historial..." />
        </div>
      ) : (
        <Table aria-label="Historial de ejercicios">
          <TableHeader>
            <TableColumn>FECHA</TableColumn>
            <TableColumn>PARTICIPANTE</TableColumn>
            <TableColumn>EJERCICIO</TableColumn>
            <TableColumn>DIFICULTAD</TableColumn>
            <TableColumn>PUNTOS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No se encontraron ejercicios">
            {(history || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="text-default-500">
                    {formatDate(item.completed_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{item.participant_name}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <span>{item.exercise_name}</span>
                    {item.notes && (
                      <p className="text-default-400 text-xs truncate max-w-[200px]">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={difficultyColors[item.difficulty as Difficulty]}
                    variant="flat"
                  >
                    {item.difficulty}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {item.points_awarded.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
