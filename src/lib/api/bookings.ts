import { apiFetch } from "./client";
import type { Booking, BookingCreateInput } from "./types";

export function createBooking(input: BookingCreateInput, idempotencyKey: string): Promise<Booking> {
  return apiFetch<Booking>("/api/v1/bookings", {
    method: "POST",
    body: input,
    auth: true,
    idempotencyKey,
  });
}

export function getBooking(bookingId: number): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/bookings/${bookingId}`, { auth: true });
}
