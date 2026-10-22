"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { PAYMENT_GATEWAY_MINIMUM_IRR } from "@/config/booking";
import { t } from "@/config/messages.fa";
import { type BookingFormState, createBookingAction } from "@/lib/booking/actions";
import { formatTomanFromRial } from "@/lib/format/money";

type BookingConfirmFormProps = {
  serviceId: number;
  date: string;
  startAt: string;
  priceIrr: number;
  walletAvailableIrr: number | null;
  idempotencyKey: string;
  paymentIdempotencyKey: string;
};

const initialState: BookingFormState = {};

export function BookingConfirmForm({
  serviceId,
  date,
  startAt,
  priceIrr,
  walletAvailableIrr,
  idempotencyKey,
  paymentIdempotencyKey,
}: BookingConfirmFormProps) {
  const [state, formAction] = useActionState(createBookingAction, initialState);
  useActionFeedback(state);
  const gatewayAllowed = priceIrr === 0 || priceIrr >= PAYMENT_GATEWAY_MINIMUM_IRR;
  const walletCovers = walletAvailableIrr !== null && walletAvailableIrr >= priceIrr;
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "zarinpal">(
    !gatewayAllowed || walletCovers ? "wallet" : "zarinpal",
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="starts_at" value={startAt} />
      <input type="hidden" name="idempotency_key" value={idempotencyKey} />
      <input type="hidden" name="payment_idempotency_key" value={paymentIdempotencyKey} />

      <fieldset className="flex flex-col gap-3 rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-text">{t("booking.confirm.paymentMethod")}</legend>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-text">
          <input
            type="radio"
            name="payment_method"
            value="wallet"
            checked={paymentMethod === "wallet"}
            onChange={() => setPaymentMethod("wallet")}
            className="mt-1 accent-primary"
          />
          <span className="flex flex-col gap-1">
            <span>{t("booking.confirm.payWallet")}</span>
            {walletAvailableIrr !== null && (
              <span className="text-xs text-text-muted">
                {t("booking.confirm.walletAvailable", { amount: formatTomanFromRial(walletAvailableIrr) })}
              </span>
            )}
          </span>
        </label>
        <label className={`flex items-start gap-2 text-sm ${gatewayAllowed ? "cursor-pointer text-text" : "cursor-not-allowed text-text-muted"}`}>
          <input
            type="radio"
            name="payment_method"
            value="zarinpal"
            checked={paymentMethod === "zarinpal"}
            onChange={() => setPaymentMethod("zarinpal")}
            disabled={!gatewayAllowed}
            className="mt-1 accent-primary"
          />
          <span>{t("booking.confirm.payGateway")}</span>
        </label>
        {!gatewayAllowed && <p className="text-xs text-text-muted">{t("booking.confirm.gatewayMinimum")}</p>}
        {paymentMethod === "wallet" && !walletCovers && (
          <p className="text-xs text-danger">
            {t("booking.confirm.insufficientWallet")}{" "}
            <Link href="/wallet/charge" className="font-medium text-primary underline">
              {t("booking.confirm.charge")}
            </Link>
          </p>
        )}
      </fieldset>

      {state.message && (
        <div className="flex flex-col items-start gap-3 rounded-md bg-surface p-4 text-sm text-text">
          <Link
            href={`/book/${serviceId}?date=${date}`}
            className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("booking.confirm.backToTime")}
          </Link>
        </div>
      )}

      {paymentMethod === "zarinpal" && <p className="text-xs text-text-muted">{t("booking.confirm.gatewayNote")}</p>}
      <SubmitButton paymentMethod={paymentMethod} />
    </form>
  );
}

function SubmitButton({ paymentMethod }: { paymentMethod: "wallet" | "zarinpal" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={pending} className="w-full md:w-auto">
      {paymentMethod === "wallet" ? t("booking.confirm.submitWallet") : t("booking.confirm.submit")}
    </Button>
  );
}
