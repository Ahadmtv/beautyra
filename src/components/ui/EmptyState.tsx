import type { ReactNode } from "react";
import { t } from "@/config/messages.fa";

type EmptyStateProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function EmptyState({
  title = t("empty.title"),
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      {description && <p className="text-sm text-text-muted">{description}</p>}
      {children}
    </div>
  );
}
