import { apiFetch } from "./client";
import type { AvailabilityResponse } from "./types";

// Availability is per-user and changes with bookings, so it is requested only from dynamic routes and never cached.
export function getProviderAvailability(
  providerId: number,
  serviceId: number,
  date: string,
): Promise<AvailabilityResponse> {
  const query = new URLSearchParams({ service_id: String(serviceId), date });
  return apiFetch<AvailabilityResponse>(`/api/v1/providers/${providerId}/availability`, { query });
}
