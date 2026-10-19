import { t } from "@/config/messages.fa";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/layout/FilterBar";

export default function HomePage() {
  return (
    <>
      <FilterBar />
      <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
          <aside className="order-2 md:order-1">
            <h2 className="mb-3 text-base font-semibold">{t("home.specialties")}</h2>
          </aside>
          <section className="order-1 md:order-2">
            <h1 className="sr-only">{t("home.title")}</h1>
            <EmptyState description={t("home.placeholder")} />
          </section>
        </div>
      </main>
    </>
  );
}
