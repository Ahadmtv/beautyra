"use client";

import { useActionState, useEffect, useState } from "react";
import { InputAdornment } from "@mui/material";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SERVICE_CATEGORY_OPTIONS, t } from "@/config/messages.fa";
import type { Service } from "@/lib/api/types";
import { numberFormatFa, toAsciiDigits } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";
import {
  saveProviderServiceAction,
  type ProviderServiceActionState,
} from "@/lib/provider/service-actions";

const initialState: ProviderServiceActionState = {};

type ProviderServiceFormProps = {
  service?: Service;
  formId: string;
  onCancel: () => void;
  onDirtyChange: (dirty: boolean) => void;
};

type NumericErrors = {
  duration?: string;
  price?: string;
  buffer?: string;
};

export function ProviderServiceForm({ service, formId, onCancel, onDirtyChange }: ProviderServiceFormProps) {
  const [state, formAction, pending] = useActionState(saveProviderServiceAction, initialState);
  const [duration, setDuration] = useState(numberFormatFa(service?.duration_minutes ?? 30));
  const [price, setPrice] = useState(numberFormatFa(service?.price_irr ?? 0));
  const [buffer, setBuffer] = useState(numberFormatFa(service?.buffer_minutes ?? 0));
  const [errors, setErrors] = useState<NumericErrors>({});
  const { showToast } = useToast();
  const parsedPrice = parseInteger(price);
  const pricePreview = parsedPrice === null ? undefined : t("provider.services.tomanPreview", { amount: formatTomanFromRial(parsedPrice) });

  useEffect(() => {
    if (state.message) showToast(state.message, "error");
  }, [state.message, showToast]);

  return (
    <form
      id={formId}
      action={formAction}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      onChange={() => onDirtyChange(true)}
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
      <input type="hidden" name="duration_minutes" value={normalizeIntegerInput(duration)} />
      <input type="hidden" name="price_irr" value={normalizeIntegerInput(price)} />
      <input type="hidden" name="buffer_minutes" value={normalizeIntegerInput(buffer)} />
      <Input
        id={`service-name-${service?.id ?? "new"}`}
        name="name"
        label={t("provider.services.name")}
        defaultValue={service?.name ?? ""}
        minLength={1}
        maxLength={160}
        required
        topLabel
        className="md:col-span-2"
      />
      <Select
        id={`service-category-${service?.id ?? "new"}`}
        name="category"
        label={t("provider.services.category")}
        options={SERVICE_CATEGORY_OPTIONS}
        placeholder={t("provider.services.categoryPlaceholder")}
        defaultValue={service?.category ?? ""}
        required
        topLabel
      />
      <Input
        id={`service-duration-${service?.id ?? "new"}`}
        label={t("provider.services.duration")}
        type="text"
        inputMode="numeric"
        dir="ltr"
        value={duration}
        onChange={(event) => setDuration(event.target.value)}
        error={errors.duration}
        required
        topLabel
      />
      <Input
        id={`service-price-${service?.id ?? "new"}`}
        label={t("provider.services.price")}
        type="text"
        inputMode="numeric"
        dir="ltr"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        error={errors.price}
        hint={pricePreview}
        required
        topLabel
        endAdornment={<InputAdornment position="end" sx={{ color: "#617472", fontSize: 12 }}>{t("provider.services.rialSuffix")}</InputAdornment>}
      />
      <Input
        id={`service-buffer-${service?.id ?? "new"}`}
        label={t("provider.services.buffer")}
        type="text"
        inputMode="numeric"
        dir="ltr"
        value={buffer}
        onChange={(event) => setBuffer(event.target.value)}
        error={errors.buffer}
        hint={t("provider.services.bufferHint")}
        required
        topLabel
      />
      <Textarea
        id={`service-description-${service?.id ?? "new"}`}
        name="description"
        label={t("provider.services.description")}
        defaultValue={service?.description ?? ""}
        rows={4}
        topLabel
        className="md:col-span-2"
      />
      {!service && (
        <label className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-text md:col-span-2">
          <input name="is_active" type="checkbox" defaultChecked className="size-4 accent-primary" />
          {t("provider.services.active")}
        </label>
      )}
      {state.message && <p role="alert" className="text-sm text-danger md:col-span-2">{state.message}</p>}
      <div className="sticky bottom-0 z-10 -mx-6 mt-2 flex flex-wrap justify-end gap-2 border-t border-border bg-white/95 px-6 py-4 backdrop-blur-sm md:col-span-2">
        <Button type="button" variant="ghost" onClick={onCancel}>{t("provider.services.cancel")}</Button>
        <Button type="submit" loading={pending}>{t("provider.services.save")}</Button>
      </div>
    </form>
  );
}

function parseInteger(value: string): number | null {
  const normalized = toAsciiDigits(value.trim());
  if (!/^(?:\d+|\d{1,3}(?:[٬,]\d{3})+)$/.test(normalized)) return null;
  const parsed = Number(normalized.replace(/[٬,]/g, ""));
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function normalizeIntegerInput(value: string): string {
  return toAsciiDigits(value.replace(/[٬,]/g, "").trim());
}
