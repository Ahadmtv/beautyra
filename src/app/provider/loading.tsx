import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/config/messages.fa";

export default function ProviderLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="sr-only">{t("provider.bookings.loading")}</h1>
      <Skeleton className="mb-6 h-8 w-56" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    </main>
  );
}
