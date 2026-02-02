"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError("Credenciales inválidas");
      setIsLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-default-50 to-default-100 dark:from-default-900 dark:to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-default-500 text-sm">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              {...register("email")}
              type="email"
              label="Email"
              placeholder="admin@ejemplo.com"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              isDisabled={isLoading}
            />
            <Input
              {...register("password")}
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              isDisabled={isLoading}
            />
            {error && (
              <p className="text-danger text-sm text-center">{error}</p>
            )}
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="mt-2"
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
