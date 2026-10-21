import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProviderServicesView } from "@/components/provider/ProviderServicesView";
import { t } from "@/config/messages.fa";
import { getProviderServices } from "@/lib/api/provider";
import type { ServicePage } from "@/lib/api/types";
import { redirectOnUnauthorized } from "@/lib/auth/session";

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

  return <ProviderServicesView page={page} />;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
