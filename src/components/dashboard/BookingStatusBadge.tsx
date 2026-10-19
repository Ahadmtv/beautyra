import { t } from "@/config/messages.fa";
import type { Booking } from "@/lib/api/types";

const statusLabels = {
  confirmed: "dashboard.bookings.status.confirmed",
  in_progress: "dashboard.bookings.status.in_progress",
  completed: "dashboard.bookings.status.completed",
  cancelled: "dashboard.bookings.status.cancelled",
  expired: "dashboard.bookings.status.expired",
} as const;

const statusClasses = {
  confirmed: "border-blue-200 bg-blue-50 text-blue-800",
  in_progress: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-green-200 bg-green-50 text-green-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  expired: "border-gray-200 bg-gray-100 text-gray-700",
} as const;

export function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-sm border px-2 py-1 text-xs font-medium ${statusClasses[status]}`}>
      {t(statusLabels[status])}
    </span>
  );
}
