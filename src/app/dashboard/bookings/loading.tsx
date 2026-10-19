import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/config/messages.fa";

export default function BookingsLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="sr-only">{t("dashboard.bookings.loading")}</h1>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full sm:w-72" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
    </main>
  );
}
