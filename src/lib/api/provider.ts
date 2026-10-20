import { apiFetch } from "./client";
import type {
  Booking,
  BookingPage,
  ProviderProfile,
  ProviderProfileInput,
  Service,
  ServiceInput,
  ServicePage,
  ServicePatch,
  TimeOff,
  TimeOffInput,
  TimeOffPage,
  WorkingInterval,
} from "./types";

function pageQuery(cursor?: number): URLSearchParams {
  const query = new URLSearchParams({ limit: "50" });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  return query;
}

export function getProviderProfile(): Promise<ProviderProfile> {
  return apiFetch<ProviderProfile>("/api/v1/provider/profile", { auth: true, cache: "no-store" });
}

export function saveProviderProfile(input: ProviderProfileInput): Promise<ProviderProfile> {
  return apiFetch<ProviderProfile>("/api/v1/provider/profile", {
    method: "PUT",
    body: input,
    auth: true,
    cache: "no-store",
  });
}

export function getProviderServices(cursor?: number): Promise<ServicePage> {
  return apiFetch<ServicePage>("/api/v1/provider/services", {
    auth: true,
    cache: "no-store",
    query: pageQuery(cursor),
  });
}

export function createProviderService(input: ServiceInput): Promise<Service> {
  return apiFetch<Service>("/api/v1/provider/services", {
    method: "POST",
    body: input,
    auth: true,
    cache: "no-store",
  });
}

export function updateProviderService(serviceId: number, input: ServicePatch): Promise<Service> {
  return apiFetch<Service>(`/api/v1/provider/services/${serviceId}`, {
    method: "PATCH",
    body: input,
    auth: true,
    cache: "no-store",
  });
}

export function deactivateProviderService(serviceId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/provider/services/${serviceId}`, {
    method: "DELETE",
    auth: true,
    cache: "no-store",
  });
}

export function getWorkingHours(): Promise<{ intervals: WorkingInterval[] }> {
  return apiFetch<{ intervals: WorkingInterval[] }>("/api/v1/provider/working-hours", {
    auth: true,
    cache: "no-store",
  });
}

export function saveWorkingHours(intervals: WorkingInterval[]): Promise<{ intervals: WorkingInterval[] }> {
  return apiFetch<{ intervals: WorkingInterval[] }>("/api/v1/provider/working-hours", {
    method: "PUT",
    body: { intervals },
    auth: true,
    cache: "no-store",
  });
}

export function getProviderTimeOff(cursor?: number): Promise<TimeOffPage> {
  return apiFetch<TimeOffPage>("/api/v1/provider/time-off", {
    auth: true,
    cache: "no-store",
    query: pageQuery(cursor),
  });
}

export function createProviderTimeOff(input: TimeOffInput): Promise<TimeOff> {
  return apiFetch<TimeOff>("/api/v1/provider/time-off", {
    method: "POST",
    body: input,
    auth: true,
    cache: "no-store",
  });
}

export function getProviderBookings(cursor?: number): Promise<BookingPage> {
  return apiFetch<BookingPage>("/api/v1/provider/bookings", {
    auth: true,
    cache: "no-store",
    query: pageQuery(cursor),
  });
}

export function startProviderBooking(bookingId: number): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/provider/bookings/${bookingId}/start`, {
    method: "POST",
    auth: true,
    cache: "no-store",
  });
}

export function requestProviderCompletion(bookingId: number): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/provider/bookings/${bookingId}/request-completion`, {
    method: "POST",
    auth: true,
    cache: "no-store",
  });
}

export function cancelProviderBooking(bookingId: number): Promise<Booking> {
  return apiFetch<Booking>(`/api/v1/provider/bookings/${bookingId}/cancel`, {
    method: "POST",
    auth: true,
    cache: "no-store",
  });
}
