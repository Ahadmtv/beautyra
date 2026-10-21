"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { t } from "@/config/messages.fa";
import { Button } from "./Button";
import { useNativeDialog } from "./use-native-dialog";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: "default" | "wide";
};

export function Modal({ open, onClose, title, children, footer, className, size = "default" }: ModalProps) {
  const titleId = useId();
  const { ref, handleBackdropClick } = useNativeDialog(open, onClose);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className={`m-auto max-h-[90dvh] ${size === "wide" ? "w-[min(94vw,48rem)]" : "w-[min(92vw,28rem)]"} overflow-hidden rounded-lg bg-white p-0 text-text backdrop:bg-black/40 ${className ?? ""}`}
    >
      <div className="flex max-h-[90dvh] flex-col gap-4 p-6">
        <div className="flex shrink-0 items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="md" onClick={onClose} aria-label={t("common.close")}>
            ×
          </Button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="flex shrink-0 flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </dialog>
  );
}
