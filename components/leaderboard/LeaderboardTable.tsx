"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Spinner,
} from "@heroui/react";
import { PositionBadge } from "./PositionBadge";
import type { LeaderboardEntry } from "@/lib/supabase/types";

interface LeaderboardTableProps {
  data: LeaderboardEntry[] | undefined;
  isLoading: boolean;
}

export function LeaderboardTable({ data, isLoading }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" label="Cargando leaderboard..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-default-500">
        No hay participantes en esta temporada todavía.
      </div>
    );
  }

  return (
    <Table aria-label="Leaderboard de programación" isStriped>
      <TableHeader>
        <TableColumn className="w-16 text-center">POS</TableColumn>
        <TableColumn>PARTICIPANTE</TableColumn>
        <TableColumn className="text-right">PUNTOS</TableColumn>
        <TableColumn className="text-right">EJERCICIOS</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
          <TableRow key={entry.participant_id}>
            <TableCell className="text-center">
              <PositionBadge position={entry.position} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar
                  src={entry.avatar_url || undefined}
                  name={entry.participant_name}
                  size="sm"
                />
                <span className="font-medium">{entry.participant_name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <span className="font-bold text-lg">
                {entry.total_points.toLocaleString()}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <span className="text-default-500">
                {entry.exercises_completed}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
