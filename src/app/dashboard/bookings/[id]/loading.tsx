import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/config/messages.fa";

export default function BookingDetailLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="sr-only">{t("dashboard.bookings.loading")}</h1>
      <Skeleton className="mb-5 h-5 w-32" />
      <section className="flex flex-col gap-6 rounded-md border border-border bg-white p-4 md:p-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      </section>
    </main>
  );
}
