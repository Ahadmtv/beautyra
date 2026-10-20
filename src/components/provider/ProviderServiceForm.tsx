"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { t } from "@/config/messages.fa";
import type { Service } from "@/lib/api/types";
import { numberFormatFa, toAsciiDigits } from "@/lib/format/digits";
import {
  saveProviderServiceAction,
  type ProviderServiceActionState,
} from "@/lib/provider/service-actions";

const initialState: ProviderServiceActionState = {};

type ProviderServiceFormProps = {
  service?: Service;
  submitLabel: string;
};

type NumericErrors = {
  duration?: string;
  price?: string;
  buffer?: string;
};

export function ProviderServiceForm({ service, submitLabel }: ProviderServiceFormProps) {
  const [state, formAction, pending] = useActionState(saveProviderServiceAction, initialState);
  const [duration, setDuration] = useState(numberFormatFa(service?.duration_minutes ?? 30));
  const [price, setPrice] = useState(numberFormatFa(service?.price_irr ?? 0));
  const [buffer, setBuffer] = useState(numberFormatFa(service?.buffer_minutes ?? 0));
  const [errors, setErrors] = useState<NumericErrors>({});

  return (
    <form
      action={formAction}
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => {
        const durationValue = parseInteger(duration);
        const priceValue = parseInteger(price);
        const bufferValue = parseInteger(buffer);
        const nextErrors: NumericErrors = {};
        if (durationValue === null || durationValue < 1 || durationValue > 1440) {
          nextErrors.duration = t("provider.services.durationError");
        }
        if (priceValue === null || priceValue < 0) {
          nextErrors.price = t("provider.services.priceError");
        }
        if (bufferValue === null || bufferValue < 0 || bufferValue > 1440) {
          nextErrors.buffer = t("provider.services.bufferError");
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) event.preventDefault();
      }}
    >
      <input type="hidden" name="service_id" value={service?.id ?? ""} />
      <Input
        id={`service-name-${service?.id ?? "new"}`}
        name="name"
        label={t("provider.services.name")}
        defaultValue={service?.name ?? ""}
        minLength={1}
        maxLength={160}
        required
      />
      <Textarea
        id={`service-description-${service?.id ?? "new"}`}
        name="description"
        label={t("provider.services.description")}
        defaultValue={service?.description ?? ""}
        className="sm:col-span-2"
      />
      <Input
        id={`service-duration-${service?.id ?? "new"}`}
        name="duration_minutes"
        label={t("provider.services.duration")}
        type="text"
        inputMode="numeric"
        value={duration}
        onChange={(event) => setDuration(event.target.value)}
        error={errors.duration}
        required
      />
      <Input
        id={`service-price-${service?.id ?? "new"}`}
        name="price_irr"
        label={t("provider.services.price")}
        type="text"
        inputMode="numeric"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        error={errors.price}
        required
      />
      <Input
        id={`service-buffer-${service?.id ?? "new"}`}
        name="buffer_minutes"
        label={t("provider.services.buffer")}
        type="text"
        inputMode="numeric"
        value={buffer}
        onChange={(event) => setBuffer(event.target.value)}
        error={errors.buffer}
        required
      />
      {!service && (
        <label className="inline-flex items-center gap-2 text-sm text-text">
          <input name="is_active" type="checkbox" defaultChecked className="size-4 accent-primary" />
          {t("provider.services.active")}
        </label>
      )}
      {state.message && <p role="alert" className="text-sm text-danger sm:col-span-2">{state.message}</p>}
      <Button type="submit" loading={pending} className="w-fit sm:col-span-2">
        {submitLabel}
      </Button>
    </form>
  );
}

function parseInteger(value: string): number | null {
  const normalized = toAsciiDigits(value.trim());
  if (!/^\d+$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : null;
}
