"use client";

import { Card, CardBody } from "@heroui/react";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex flex-row items-center gap-4 p-4">
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-default-500 text-sm">{title}</span>
          <span className="text-2xl font-bold">{value}</span>
          {description && (
            <span className="text-default-400 text-xs">{description}</span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
