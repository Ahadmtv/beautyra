"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { t } from "@/config/messages.fa";
import type { Service } from "@/lib/api/types";
import {
  mutateProviderServiceAction,
  type ProviderServiceActionState,
} from "@/lib/provider/service-actions";

const initialState: ProviderServiceActionState = {};

export function ProviderServiceActions({ service }: { service: Service }) {
  const [toggleState, toggleAction, togglePending] = useActionState(mutateProviderServiceAction, initialState);
  const [deactivateState, deactivateAction, deactivatePending] = useActionState(mutateProviderServiceAction, initialState);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={toggleAction}>
        <input type="hidden" name="service_id" value={service.id} />
        <input type="hidden" name="intent" value="toggle" />
        <input type="hidden" name="is_active" value={String(service.is_active)} />
        <Button type="submit" variant="outline" loading={togglePending}>
          {t("provider.services.toggle")}
        </Button>
      </form>
      {service.is_active && (
        <form action={deactivateAction}>
          <input type="hidden" name="service_id" value={service.id} />
          <input type="hidden" name="intent" value="deactivate" />
          <Button type="submit" variant="outline" loading={deactivatePending}>
            {t("provider.services.deactivate")}
          </Button>
        </form>
      )}
      {service.is_active && <p className="w-full text-xs text-text-muted">{t("provider.services.deactivateNote")}</p>}
      {(toggleState.message ?? deactivateState.message) && (
        <p role="alert" className="text-sm text-danger">
          {toggleState.message ?? deactivateState.message}
        </p>
      )}
    </div>
  );
}
