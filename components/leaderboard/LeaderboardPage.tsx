"use client";

import { Card, CardBody, CardHeader, Chip, Link } from "@heroui/react";
import { useState } from "react";
import { useRealtimeLeaderboard } from "@/lib/hooks/useLeaderboard";
import { useActiveSeason } from "@/lib/hooks/useSeasons";
import { LeaderboardTable } from "./LeaderboardTable";
import { SeasonSelector } from "./SeasonSelector";

export function LeaderboardPage() {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(
    undefined
  );
  const { data: activeSeason } = useActiveSeason();
  const seasonId = selectedSeasonId || activeSeason?.id;
  const { data, isLoading, dataUpdatedAt } = useRealtimeLeaderboard(seasonId);

  const lastUpdate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-default-50 to-default-100 dark:from-default-900 dark:to-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                🏆 Leaderboard
              </h1>
              {activeSeason && (
                <p className="text-default-500 text-sm">
                  {activeSeason.name}
                </p>
              )}
            </div>
            <SeasonSelector
              selectedSeasonId={selectedSeasonId}
              onSeasonChange={setSelectedSeasonId}
            />
          </CardHeader>
          <CardBody>
            <LeaderboardTable data={data} isLoading={isLoading} />

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-default-200">
              <div className="flex items-center gap-2">
                {lastUpdate && (
                  <Chip size="sm" variant="flat" color="default">
                    Actualizado: {lastUpdate}
                  </Chip>
                )}
                <Chip size="sm" variant="dot" color="success">
                  Tiempo real
                </Chip>
              </div>
              <Link href="/login" size="sm" color="primary">
                Admin →
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
