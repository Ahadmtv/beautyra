import { apiFetch } from "./client";
import type { Booking, BookingCreateInput, BookingPage } from "./types";

export function createBooking(input: BookingCreateInput, idempotencyKey: string): Promise<Booking> {
  return apiFetch<Booking>("/api/v1/bookings", {
    method: "POST",
    body: input,
    auth: true,
    idempotencyKey,
  });
}

export function getCustomerBookings(cursor?: number): Promise<BookingPage> {
  const query = new URLSearchParams({ limit: "50" });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  return apiFetch<BookingPage>("/api/v1/bookings", {
    auth: true,
    cache: "no-store",
    query,
  });
}

export function getBooking(bookingId: number): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/bookings/${bookingId}`, { auth: true, cache: "no-store" });
}

export function cancelBooking(bookingId: number): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/bookings/${bookingId}/cancel`, {
    method: "POST",
    auth: true,
    cache: "no-store",
  });
}
