"use client";

import {
  Button,
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useCreateParticipant,
  useDeleteParticipant,
  useParticipants,
} from "@/lib/hooks/useParticipants";
import type { Participant } from "@/lib/supabase/types";

const participantSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  avatar_url: z.string().url("URL inválida").optional().or(z.literal("")),
});

type ParticipantForm = z.infer<typeof participantSchema>;

export default function ParticipantsPage() {
  const { data: participants, isLoading } = useParticipants();
  const createParticipant = useCreateParticipant();
  const deleteParticipant = useDeleteParticipant();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
  });

  const onSubmit = async (data: ParticipantForm) => {
    try {
      await createParticipant.mutateAsync({
        name: data.name,
        avatar_url: data.avatar_url || null,
      });
      reset();
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const handleDeleteClick = (participant: Participant) => {
    setDeleteTarget(participant);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteParticipant.mutateAsync(deleteTarget.id);
        onDeleteClose();
        setDeleteTarget(null);
      } catch {
        // Error handled by mutation
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Cargando participantes..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Participantes</h1>
          <p className="text-default-500">
            Gestiona los participantes del Coding Dojo
          </p>
        </div>
        <Button color="primary" onPress={onOpen} startContent={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Agregar Participante
        </Button>
      </div>

      <Table aria-label="Tabla de participantes">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>FECHA DE REGISTRO</TableColumn>
          <TableColumn width={120}>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay participantes registrados">
          {(participants || []).map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{participant.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(participant.created_at).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => handleDeleteClick(participant)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Agregar */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onModalClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>Agregar Participante</ModalHeader>
              <ModalBody>
                <Input
                  {...register("name")}
                  label="Nombre"
                  placeholder="Nombre del participante"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  isDisabled={createParticipant.isPending}
                />
                <Input
                  {...register("avatar_url")}
                  label="URL del Avatar (opcional)"
                  placeholder="https://..."
                  isInvalid={!!errors.avatar_url}
                  errorMessage={errors.avatar_url?.message}
                  isDisabled={createParticipant.isPending}
                />
                {createParticipant.isError && (
                  <p className="text-danger text-sm">
                    Error al crear participante
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onModalClose}
                  isDisabled={createParticipant.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={createParticipant.isPending}
                >
                  Agregar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Confirmar Eliminar */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onModalClose) => (
            <>
              <ModalHeader>Confirmar Eliminación</ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar a{" "}
                  <strong>{deleteTarget?.name}</strong>?
                </p>
                <p className="text-default-500 text-sm">
                  Esta acción eliminará también todo su historial de ejercicios.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onModalClose}
                  isDisabled={deleteParticipant.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={confirmDelete}
                  isLoading={deleteParticipant.isPending}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
