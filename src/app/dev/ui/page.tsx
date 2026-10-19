import { notFound } from "next/navigation";
import { t } from "@/config/messages.fa";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadMoreLink } from "@/components/ui/LoadMoreLink";
import { Rating } from "@/components/ui/Rating";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { FilterBar } from "@/components/layout/FilterBar";
import { CITY_OPTIONS } from "@/config/filter-options";
import { DialogDemo } from "./DialogDemo";

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto w-full max-w-page flex-1 space-y-12 px-4 py-10">
      <h1 className="text-2xl font-bold">{t("devUi.title")}</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("devUi.sectionButtons")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>{t("devUi.variantPrimary")}</Button>
          <Button variant="outline">{t("devUi.variantOutline")}</Button>
          <Button variant="ghost">{t("devUi.variantGhost")}</Button>
          <Button loading>{t("devUi.variantPrimary")}</Button>
          <Button disabled>{t("devUi.stateDisabled")}</Button>
          <Button variant="outline" size="icon" aria-label={t("filter.search")}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("devUi.sectionForms")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input id="dev-input" label={t("devUi.inputLabel")} hint={t("devUi.hint")} />
          <Input id="dev-input-error" label={t("devUi.inputLabel")} error={t("validation.required")} />
          <Select
            id="dev-select"
            label={t("devUi.selectLabel")}
            options={CITY_OPTIONS}
            placeholder={t("common.selectPlaceholder")}
          />
          <Select
            id="dev-select-error"
            label={t("devUi.selectLabel")}
            options={CITY_OPTIONS}
            error={t("validation.required")}
          />
          <div className="md:col-span-2">
            <Textarea id="dev-textarea" label={t("devUi.textareaLabel")} hint={t("devUi.hint")} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("devUi.sectionBadges")}</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Badge>{t("badge.verified")}</Badge>
          <Badge tone="verified">{t("badge.verified")}</Badge>
          <Rating value={0} count={0} />
          <Rating value={3.5} count={12} />
          <Rating value={4.5} count={300} />
          <Rating value={5} count={300} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("devUi.sectionFeedback")}</h2>
        <DialogDemo />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <EmptyState description={t("home.placeholder")}>
            <LoadMoreLink href="/dev/ui?cursor=1" />
          </EmptyState>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("devUi.sectionFilters")}</h2>
        <FilterBar />
      </section>
    </main>
  );
}
