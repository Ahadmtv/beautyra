import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingPanel } from "@/components/service/BookingPanel";
import { ProviderAvatar } from "@/components/listing/ProviderAvatar";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { env } from "@/config/env";
import { messages, t } from "@/config/messages.fa";
import { ApiError } from "@/lib/api/problem";
import { DEFAULT_PAGE_LIMIT } from "@/lib/api/pagination";
import { parseServiceId } from "@/lib/api/service-id";
import { getPublicServiceCards, getPublicServiceDetail, type ServiceDetail } from "@/lib/api/services";
import { formatTomanFromRial } from "@/lib/format/money";
import { buildServiceJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";

const META_DESCRIPTION_MAX_LENGTH = 160;

type ServicePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const page = await getPublicServiceCards(undefined, DEFAULT_PAGE_LIMIT);
  return page.items.map((card) => ({ id: String(card.id) }));
}

async function loadService(rawId: string): Promise<ServiceDetail> {
  const id = parseServiceId(rawId);
  if (id === null) {
    notFound();
  }

  try {
    return await getPublicServiceDetail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const { service } = await loadService(id);

  const title = `${service.name} | ${t("brand.name")}`;
  const description =
    service.description.trim().slice(0, META_DESCRIPTION_MAX_LENGTH) || messages["meta.description"];
  const canonical = `/services/${service.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: t("brand.name"),
      locale: "fa_IR",
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { id } = await params;
  const { service, provider } = await loadService(id);

  const priceLabel = service.price_irr === 0 ? t("service.free") : formatTomanFromRial(service.price_irr);
  const profileName = provider?.name ?? service.name;
  const jsonLd = buildServiceJsonLd({
    url: new URL(`/services/${service.id}`, env.SITE_URL).toString(),
    name: service.name,
    description: service.description,
    priceIrr: service.price_irr,
    providerName: provider?.name ?? null,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 pb-28 md:py-8 md:pb-8">
        <nav aria-label={t("breadcrumb.label")}>
          <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <li>
              <Link href="/" className="hover:text-primary">
                {t("breadcrumb.home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text">
              {service.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_20rem] md:items-start">
          <div className="flex min-w-0 flex-col gap-6">
            <header className="flex gap-4 rounded-md border border-border bg-white p-4 md:p-6">
              <ProviderAvatar url={provider?.avatarUrl ?? null} />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <h1 className="min-w-0 text-xl font-bold text-text">{profileName}</h1>
                  <Badge tone="verified">{t("badge.verified")}</Badge>
                </div>
                {provider && provider.specialties.length > 0 && (
                  <ul className="flex flex-col gap-1.5">
                    {provider.specialties.map((specialty) => (
                      <li key={specialty} className="truncate rounded-sm bg-surface px-2 py-1 text-xs text-text">
                        {specialty}
                      </li>
                    ))}
                  </ul>
                )}
                {provider && (
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-text-muted">
                    <span>{provider.neighborhood}</span>
                    <Rating value={provider.rating} count={provider.reviewCount} />
                  </div>
                )}
              </div>
            </header>

            <section
              aria-labelledby="service-heading"
              className="flex flex-col gap-4 rounded-md border border-border bg-white p-4 md:p-6"
            >
              <h2 id="service-heading" className="text-lg font-bold text-text">
                {service.name}
              </h2>
              {service.description && (
                <p className="leading-7 whitespace-pre-line text-text">{service.description}</p>
              )}
            </section>
          </div>

          <BookingPanel
            serviceId={service.id}
            durationMinutes={service.duration_minutes}
            priceLabel={priceLabel}
          />
        </div>
      </main>
    </>
  );
}
