import { t, type MessageKey } from "@/config/messages.fa";
import type { Booking } from "@/lib/api/types";

const statusLabels: Record<Booking["status"], MessageKey> = {
  pending_payment: "dashboard.bookings.status.pending_payment",
  confirmed: "dashboard.bookings.status.confirmed",
  in_progress: "dashboard.bookings.status.in_progress",
  completion_pending: "dashboard.bookings.status.completion_pending",
  disputed: "dashboard.bookings.status.disputed",
  completed: "dashboard.bookings.status.completed",
  cancelled: "dashboard.bookings.status.cancelled",
  expired: "dashboard.bookings.status.expired",
};

const statusClasses: Record<Booking["status"], string> = {
  pending_payment: "border-yellow-200 bg-yellow-50 text-yellow-800",
  confirmed: "border-blue-200 bg-blue-50 text-blue-800",
  in_progress: "border-amber-200 bg-amber-50 text-amber-800",
  completion_pending: "border-violet-200 bg-violet-50 text-violet-800",
  disputed: "border-orange-200 bg-orange-50 text-orange-800",
  completed: "border-green-200 bg-green-50 text-green-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  expired: "border-gray-200 bg-gray-100 text-gray-700",
};

export function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-sm border px-2 py-1 text-xs font-medium ${statusClasses[status]}`}>
      {t(statusLabels[status])}
    </span>
  );
}
