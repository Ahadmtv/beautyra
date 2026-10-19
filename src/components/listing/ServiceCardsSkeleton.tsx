import { t } from "@/config/messages.fa";
import { Skeleton } from "@/components/ui/Skeleton";

const CARD_COUNT = 4;

export function ServiceCardsSkeleton() {
  return (
    <div aria-busy="true" className="grid gap-4 sm:grid-cols-2">
      <span className="sr-only">{t("common.loading")}</span>
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <div key={index} className="flex gap-4 rounded-md border border-border bg-white p-4">
          <Skeleton className="h-[100px] w-[77px] shrink-0" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="mt-auto h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
