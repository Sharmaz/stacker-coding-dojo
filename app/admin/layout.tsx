"use client";

import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Registrar Ejercicio", href: "/admin/add-exercise" },
  { label: "Participantes", href: "/admin/participants" },
  { label: "Historial", href: "/admin/history" },
  { label: "Temporadas", href: "/admin/seasons" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-default-50 to-default-100 dark:from-default-900 dark:to-black">
      <Navbar maxWidth="xl" isBordered>
        <NavbarBrand>
          <Link href="/admin" className="font-bold text-inherit">
            Coding Dojo Admin
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.href} isActive={pathname === item.href}>
              <Link
                href={item.href}
                color={pathname === item.href ? "primary" : "foreground"}
                size="sm"
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              onPress={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className="container mx-auto px-4 py-8 max-w-6xl">{children}</main>
    </div>
  );
}
