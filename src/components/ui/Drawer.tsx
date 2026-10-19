"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { t } from "@/config/messages.fa";
import { Button } from "./Button";
import { useNativeDialog } from "./use-native-dialog";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  const titleId = useId();
  const { ref, handleBackdropClick } = useNativeDialog(open, onClose);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className="inset-y-0 start-0 m-0 h-dvh max-h-none w-[min(85vw,20rem)] max-w-none bg-white p-0 text-text backdrop:bg-black/40"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="md" onClick={onClose} aria-label={t("common.close")}>
            ×
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer && <div className="border-t border-border p-4">{footer}</div>}
      </div>
    </dialog>
  );
}
