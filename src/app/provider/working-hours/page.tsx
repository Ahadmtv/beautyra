import type { Metadata } from "next";

import { WorkingHoursEditor } from "@/components/provider/WorkingHoursEditor";
import { t } from "@/config/messages.fa";
import { getWorkingHours } from "@/lib/api/provider";
import type { WorkingInterval } from "@/lib/api/types";
import { redirectOnUnauthorized } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: `${t("provider.workingHours.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

export default async function ProviderWorkingHoursPage() {
  let intervals: WorkingInterval[];
  try {
    intervals = (await getWorkingHours()).intervals;
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <section className="flex flex-col gap-5 rounded-md border border-border bg-white p-4 md:p-6">
        <h1 className="text-2xl font-bold text-text">{t("provider.workingHours.title")}</h1>
        <WorkingHoursEditor initialIntervals={intervals} />
      </section>
    </main>
  );
}
