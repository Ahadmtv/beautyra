"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/components/ui/Toast";
import { resolveActionFeedback } from "@/components/ui/toast-model";

type ActionFeedbackOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useActionFeedback(
  state: { message?: string; success?: boolean },
  options: ActionFeedbackOptions = {},
): void {
  const { showToast } = useToast();
  const lastState = useRef<typeof state | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (lastState.current === state) return;

    const feedback = resolveActionFeedback(state);
    if (!feedback) return;

    lastState.current = state;
    showToast(feedback.message, feedback.tone);

    if (feedback.tone === "success") {
      optionsRef.current.onSuccess?.();
    } else {
      optionsRef.current.onError?.();
    }
  }, [state, showToast]);
}
