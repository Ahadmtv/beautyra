export type ToastTone = "default" | "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

const TOAST_DURATIONS_MS: Record<ToastTone, number> = {
  default: 4000,
  success: 4000,
  info: 4500,
  warning: 6000,
  error: 6000,
};

export function toastDurationMs(tone: ToastTone): number {
  return TOAST_DURATIONS_MS[tone];
}

export function appendToast(toasts: ToastItem[], next: ToastItem): ToastItem[] {
  const isDuplicate = toasts.some(
    (toast) => toast.message === next.message && toast.tone === next.tone,
  );
  return isDuplicate ? toasts : [...toasts, next];
}

export type ActionFeedback = {
  message: string;
  tone: Extract<ToastTone, "success" | "error">;
};

export function resolveActionFeedback(state: {
  message?: string;
  success?: boolean;
}): ActionFeedback | null {
  if (!state.message) return null;
  return {
    message: state.message,
    tone: state.success ? "success" : "error",
  };
}
