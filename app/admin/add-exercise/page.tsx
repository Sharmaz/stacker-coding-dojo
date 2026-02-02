"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DIFFICULTY_POINTS, useCreateExercise } from "@/lib/hooks/useExercises";
import { useParticipants } from "@/lib/hooks/useParticipants";
import type { Difficulty } from "@/lib/supabase/types";

const exerciseSchema = z.object({
  participant_id: z.string().min(1, "Selecciona un participante"),
  exercise_name: z.string().min(1, "El nombre del ejercicio es requerido"),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    error: "Selecciona una dificultad",
  }),
  points_awarded: z.number().positive("Los puntos deben ser mayores a 0"),
  notes: z.string().optional(),
});

type ExerciseForm = z.infer<typeof exerciseSchema>;

export default function AddExercisePage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { data: participants, isLoading: loadingParticipants } =
    useParticipants();
  const createExercise = useCreateExercise();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExerciseForm>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      points_awarded: 500,
      difficulty: "Easy",
    },
  });

  const handleDifficultyChange = (value: string) => {
    setValue("points_awarded", DIFFICULTY_POINTS[value as Difficulty]);
  };

  const onSubmit = async (data: ExerciseForm) => {
    setSuccess(false);
    try {
      await createExercise.mutateAsync({
        participant_id: data.participant_id,
        exercise_name: data.exercise_name,
        difficulty: data.difficulty as Difficulty,
        points_awarded: data.points_awarded,
        notes: data.notes || null,
      });
      setSuccess(true);
      reset({
        participant_id: "",
        exercise_name: "",
        difficulty: "Easy",
        points_awarded: 500,
        notes: "",
      });
    } catch {
      // Error handled by mutation
    }
  };

  if (loadingParticipants) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Cargando participantes..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold">Registrar Ejercicio Completado</h1>
          <p className="text-default-500 text-sm">
            Otorga puntos a un participante por completar un ejercicio
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Controller
              name="participant_id"
              control={control}
              render={({ field }) => (
                <Select
                  label="Participante"
                  placeholder="Selecciona un participante"
                  isInvalid={!!errors.participant_id}
                  errorMessage={errors.participant_id?.message}
                  isDisabled={createExercise.isPending}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    field.onChange(selected?.toString() || "");
                  }}
                >
                  {(participants || []).map((p) => (
                    <SelectItem key={p.id}>{p.name}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <Input
              {...register("exercise_name")}
              label="Nombre del Ejercicio"
              placeholder="Ej: Two Sum, Merge Sort, Binary Search"
              isInvalid={!!errors.exercise_name}
              errorMessage={errors.exercise_name?.message}
              isDisabled={createExercise.isPending}
            />

            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Dificultad"
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleDifficultyChange(value);
                  }}
                  isInvalid={!!errors.difficulty}
                  errorMessage={errors.difficulty?.message}
                  isDisabled={createExercise.isPending}
                >
                  <Radio value="Easy">
                    <span className="flex items-center gap-2">
                      Easy
                      <span className="text-default-400 text-sm">
                        (500 puntos)
                      </span>
                    </span>
                  </Radio>
                  <Radio value="Medium">
                    <span className="flex items-center gap-2">
                      Medium
                      <span className="text-default-400 text-sm">
                        (1,000 puntos)
                      </span>
                    </span>
                  </Radio>
                  <Radio value="Hard">
                    <span className="flex items-center gap-2">
                      Hard
                      <span className="text-default-400 text-sm">
                        (2,000 puntos)
                      </span>
                    </span>
                  </Radio>
                </RadioGroup>
              )}
            />

            <Input
              {...register("points_awarded", { valueAsNumber: true })}
              type="number"
              label="Puntos a Otorgar"
              description="Se autocompleta según la dificultad, pero puedes editarlo"
              isInvalid={!!errors.points_awarded}
              errorMessage={errors.points_awarded?.message}
              isDisabled={createExercise.isPending}
            />

            <Textarea
              {...register("notes")}
              label="Notas (opcional)"
              placeholder="Ej: Solución muy limpia, O(n) complexity"
              isDisabled={createExercise.isPending}
            />

            {createExercise.isError && (
              <p className="text-danger text-sm text-center">
                {createExercise.error instanceof Error
                  ? createExercise.error.message
                  : "Error al registrar el ejercicio"}
              </p>
            )}

            {success && (
              <div className="bg-success-50 text-success-700 p-3 rounded-lg text-center text-sm">
                Ejercicio registrado exitosamente
              </div>
            )}

            <div className="flex gap-3 justify-end mt-2">
              <Button
                type="button"
                variant="flat"
                onPress={() => router.back()}
                isDisabled={createExercise.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={createExercise.isPending}
              >
                Registrar
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
