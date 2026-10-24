"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { PAYMENT_GATEWAY_MINIMUM_IRR } from "@/config/booking";
import { canAttemptWalletPayment } from "@/lib/booking/wallet-payment";
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
  // Zarinpal rejects amounts below the gateway minimum, so the gateway option
  // is offered only for payable prices; free services are booked instantly via
  // the wallet method without touching the gateway.
  const gatewayAllowed = priceIrr >= PAYMENT_GATEWAY_MINIMUM_IRR;
  // The balance shown here was fetched server-side just before this render, so
  // when it is known and cannot cover the price a wallet payment would fail
  // predictably on the backend; block the action instead of sending a request.
  // An unknown balance (null) stays selectable — the backend remains the
  // authority when the frontend cannot establish insufficiency.
  const walletKnownInsufficient =
    priceIrr > 0 &&
    walletAvailableIrr !== null &&
    !canAttemptWalletPayment(walletAvailableIrr, priceIrr);
  const walletCovers =
    priceIrr === 0 || (walletAvailableIrr !== null && walletAvailableIrr >= priceIrr);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "zarinpal">(
    !gatewayAllowed || walletCovers ? "wallet" : "zarinpal",
  );
  const walletBlocked = paymentMethod === "wallet" && walletKnownInsufficient;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="starts_at" value={startAt} />
      <input type="hidden" name="idempotency_key" value={idempotencyKey} />
      <input type="hidden" name="payment_idempotency_key" value={paymentIdempotencyKey} />

      <fieldset className="flex flex-col gap-3 rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-text">
          {t("booking.confirm.paymentMethod")}
        </legend>
        <label
          className={`flex items-start gap-2 text-sm ${walletKnownInsufficient ? "cursor-not-allowed text-text-muted" : "cursor-pointer text-text"}`}
        >
          <input
            type="radio"
            name="payment_method"
            value="wallet"
            checked={paymentMethod === "wallet"}
            onChange={() => setPaymentMethod("wallet")}
            disabled={walletKnownInsufficient}
            className="mt-1 accent-primary"
          />
          <span className="flex flex-col gap-1">
            <span>{t("booking.confirm.payWallet")}</span>
            {walletAvailableIrr !== null && (
              <span className="text-xs text-text-muted">
                {t("booking.confirm.walletAvailable", {
                  amount: formatTomanFromRial(walletAvailableIrr),
                })}
              </span>
            )}
          </span>
        </label>
        <label
          className={`flex items-start gap-2 text-sm ${gatewayAllowed ? "cursor-pointer text-text" : "cursor-not-allowed text-text-muted"}`}
        >
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
        {!gatewayAllowed && (
          <p className="text-xs text-text-muted">{t("booking.confirm.gatewayMinimum")}</p>
        )}
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

      {paymentMethod === "zarinpal" && (
        <p className="text-xs text-text-muted">{t("booking.confirm.gatewayNote")}</p>
      )}
      <SubmitButton paymentMethod={paymentMethod} walletBlocked={walletBlocked} />
    </form>
  );
}

function SubmitButton({
  paymentMethod,
  walletBlocked,
}: {
  paymentMethod: "wallet" | "zarinpal";
  walletBlocked: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      loading={pending}
      disabled={pending || walletBlocked}
      className="w-full md:w-auto"
    >
      {paymentMethod === "wallet" ? t("booking.confirm.submitWallet") : t("booking.confirm.submit")}
    </Button>
  );
}
