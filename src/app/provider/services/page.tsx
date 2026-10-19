import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProviderServiceActions } from "@/components/provider/ProviderServiceActions";
import { ProviderServiceForm } from "@/components/provider/ProviderServiceForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { t } from "@/config/messages.fa";
import { getProviderServices } from "@/lib/api/provider";
import type { ServicePage } from "@/lib/api/types";
import { redirectOnUnauthorized } from "@/lib/auth/session";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";

export const metadata: Metadata = {
  title: `${t("provider.services.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

type ProviderServicesPageProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function ProviderServicesPage({ searchParams }: ProviderServicesPageProps) {
  const rawCursor = firstValue((await searchParams).cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  if (cursor !== undefined && (!Number.isSafeInteger(cursor) || cursor < 1)) redirect("/provider/services");

  let page: ServicePage;
  try {
    page = await getProviderServices(cursor);
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-text">{t("provider.services.title")}</h1>
      <details className="mt-5 rounded-md border border-border bg-white p-4">
        <summary className="cursor-pointer list-none font-medium text-primary">{t("provider.services.create")}</summary>
        <div className="mt-5">
          <ProviderServiceForm submitLabel={t("provider.services.create")} />
        </div>
      </details>

      <section className="mt-6" aria-label={t("provider.services.title")}>
        {page.items.length === 0 ? (
          <EmptyState title={t("provider.services.empty")} />
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[760px] border-collapse bg-white text-start text-sm">
              <thead className="bg-surface text-text-muted">
                <tr>
                  <th scope="col" className="p-3 font-medium">{t("provider.services.name")}</th>
                  <th scope="col" className="p-3 font-medium">{t("provider.services.duration")}</th>
                  <th scope="col" className="p-3 font-medium">{t("provider.services.price")}</th>
                  <th scope="col" className="p-3 font-medium">{t("provider.services.status.active")}</th>
                  <th scope="col" className="p-3 font-medium">{t("provider.services.edit")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {page.items.map((service) => (
                  <tr key={service.id}>
                    <td className="p-3 font-medium text-text">{service.name}</td>
                    <td className="p-3">{numberFormatFa(service.duration_minutes)}</td>
                    <td className="p-3">{formatTomanFromRial(service.price_irr)}</td>
                    <td className="p-3">{t(service.is_active ? "provider.services.status.active" : "provider.services.status.inactive")}</td>
                    <td className="p-3">
                      <details>
                        <summary className="cursor-pointer text-primary hover:underline">{t("provider.services.edit")}</summary>
                        <div className="min-w-[32rem] py-4">
                          <ProviderServiceForm service={service} submitLabel={t("provider.services.save")} />
                        </div>
                      </details>
                      <ProviderServiceActions service={service} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {page.next_cursor !== null && (
          <Link
            href={`/provider/services?cursor=${page.next_cursor}`}
            className="mt-5 inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("provider.services.next")}
          </Link>
        )}
      </section>
    </main>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
