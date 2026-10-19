import { t } from "@/config/messages.fa";

export function BookingScheduleSkeleton() {
  return (
    <section
      aria-busy="true"
      className="flex flex-col gap-6 rounded-md border border-border bg-white p-4 md:p-6"
    >
      <p className="sr-only" role="status">
        {t("booking.loading")}
      </p>
      <div className="h-6 w-32 animate-pulse rounded-sm bg-surface" />
      <div className="grid grid-cols-7 gap-1" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
    </section>
  );
}
