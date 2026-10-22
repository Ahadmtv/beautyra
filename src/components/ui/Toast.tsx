"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { t } from "@/config/messages.fa";
import {
  appendToast,
  toastDurationMs,
  type ToastItem,
  type ToastTone,
} from "@/components/ui/toast-model";

export type { ToastTone } from "@/components/ui/toast-model";

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

const toastToneClasses: Record<ToastTone, string> = {
  default: "bg-text",
  success: "bg-emerald-700",
  error: "bg-danger",
  info: "bg-sky-700",
  warning: "bg-amber-700",
};

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toastDurationMs(toast.tone));
    return () => clearTimeout(timer);
  }, [toast.id, toast.tone, onDismiss]);

  const urgent = toast.tone === "error" || toast.tone === "warning";

  return (
    <div
      role={urgent ? "alert" : "status"}
      className={[
        "pointer-events-auto flex items-center gap-3 rounded-md px-4 py-3 text-sm text-white shadow-md",
        toastToneClasses[toast.tone],
      ].join(" ")}
    >
      <span className="min-w-0 flex-1 break-words">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={t("common.close")}
        className="shrink-0 rounded-sm px-1 text-lg leading-none text-white/80 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = "default") => {
    if (!message.trim()) return;
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => appendToast(current, { id, message, tone }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <ToastView key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
