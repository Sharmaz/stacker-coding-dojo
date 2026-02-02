"use client";

import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { useAdminStats } from "@/lib/hooks/useAdminStats";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Cargando estadísticas..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-default-500">
          Bienvenido al panel de administración del Coding Dojo
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Participantes"
          value={stats?.totalParticipants || 0}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Ejercicios Registrados"
          value={stats?.totalExercises || 0}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          }
        />
        <StatCard
          title="Temporada Activa"
          value={stats?.activeSeasonName || "Sin temporada"}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Puntos Totales"
          value={stats?.totalPointsThisSeason.toLocaleString() || 0}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Acciones Rápidas</h2>
          </CardHeader>
          <CardBody className="gap-3">
            <Button
              as={Link}
              href="/admin/add-exercise"
              color="primary"
              className="justify-start"
              startContent={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Registrar Ejercicio Completado
            </Button>
            <Button
              as={Link}
              href="/admin/participants"
              variant="flat"
              className="justify-start"
              startContent={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              }
            >
              Gestionar Participantes
            </Button>
            <Button
              as={Link}
              href="/admin/history"
              variant="flat"
              className="justify-start"
              startContent={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            >
              Ver Historial
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Información</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-default-500">Dificultad Fácil</span>
                <span className="font-medium">500 puntos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Dificultad Media</span>
                <span className="font-medium">1,000 puntos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Dificultad Difícil</span>
                <span className="font-medium">2,000 puntos</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
