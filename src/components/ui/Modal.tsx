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
};

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const titleId = useId();
  const { ref, handleBackdropClick } = useNativeDialog(open, onClose);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className="m-auto w-[min(92vw,28rem)] rounded-lg bg-white p-0 text-text backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="md" onClick={onClose} aria-label={t("common.close")}>
            ×
          </Button>
        </div>
        <div>{children}</div>
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </dialog>
  );
}
