"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useActiveSeason, useCreateSeason, useSeasons } from "@/lib/hooks/useSeasons";

const seasonSchema = z.object({
  name: z.string().min(1, "El nombre de la temporada es requerido"),
});

type SeasonForm = z.infer<typeof seasonSchema>;

export default function SeasonsPage() {
  const { data: seasons, isLoading } = useSeasons();
  const { data: activeSeason } = useActiveSeason();
  const createSeason = useCreateSeason();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SeasonForm>({
    resolver: zodResolver(seasonSchema),
  });

  const onSubmit = async (data: SeasonForm) => {
    try {
      await createSeason.mutateAsync({ name: data.name });
      reset();
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) {
      return "En curso";
    }
    return new Date(dateStr).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Cargando temporadas..." />
      </div>
    );
  }

  const pastSeasons = seasons?.filter((s) => !s.is_active) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestionar Temporadas</h1>
        <p className="text-default-500">
          Administra las temporadas del leaderboard
        </p>
      </div>

      {/* Active Season Card */}
      {activeSeason && (
        <Card className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <Chip color="success" variant="dot" size="sm">
                Activa
              </Chip>
              <h2 className="text-xl font-bold">{activeSeason.name}</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-default-500 text-sm">Fecha de inicio</p>
                <p className="font-medium">{formatDate(activeSeason.start_date)}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm">Estado</p>
                <p className="font-medium text-success">En curso</p>
              </div>
            </div>
            <Button color="warning" variant="flat" onPress={onOpen}>
              Finalizar y Crear Nueva Temporada
            </Button>
          </CardBody>
        </Card>
      )}

      {!activeSeason && (
        <Card>
          <CardBody className="text-center py-8">
            <p className="text-default-500 mb-4">No hay temporada activa</p>
            <Button color="primary" onPress={onOpen}>
              Crear Nueva Temporada
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Past Seasons */}
      {pastSeasons.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Temporadas Anteriores</h2>
          <Table aria-label="Temporadas anteriores">
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>INICIO</TableColumn>
              <TableColumn>FIN</TableColumn>
            </TableHeader>
            <TableBody>
              {pastSeasons.map((season) => (
                <TableRow key={season.id}>
                  <TableCell>
                    <span className="font-medium">{season.name}</span>
                  </TableCell>
                  <TableCell>{formatDate(season.start_date)}</TableCell>
                  <TableCell>{formatDate(season.end_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal Nueva Temporada */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onModalClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                {activeSeason
                  ? "Finalizar Temporada y Crear Nueva"
                  : "Crear Nueva Temporada"}
              </ModalHeader>
              <ModalBody>
                {activeSeason && (
                  <div className="bg-warning-50 dark:bg-warning-900/20 p-3 rounded-lg mb-4">
                    <p className="text-warning-700 dark:text-warning-400 text-sm">
                      La temporada actual ({activeSeason.name}) será finalizada.
                      Todos los participantes comenzarán con 0 puntos en la
                      nueva temporada. El historial se conservará.
                    </p>
                  </div>
                )}
                <Input
                  {...register("name")}
                  label="Nombre de la temporada"
                  placeholder="Ej: Temporada 2 - Marzo 2026"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  isDisabled={createSeason.isPending}
                />
                {createSeason.isError && (
                  <p className="text-danger text-sm">
                    Error al crear la temporada
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onModalClose}
                  isDisabled={createSeason.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color={activeSeason ? "warning" : "primary"}
                  isLoading={createSeason.isPending}
                >
                  {activeSeason ? "Finalizar y Crear" : "Crear Temporada"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
