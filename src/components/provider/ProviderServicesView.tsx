"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProviderServiceActions } from "@/components/provider/ProviderServiceActions";
import { ProviderServiceForm } from "@/components/provider/ProviderServiceForm";
import { serviceCategoryLabel, t } from "@/config/messages.fa";
import type { Service, ServicePage } from "@/lib/api/types";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";

type ProviderServicesViewProps = { page: ServicePage };

export function ProviderServicesView({ page }: ProviderServicesViewProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [dirty, setDirty] = useState(false);
  const [formSession, setFormSession] = useState(0);

  function openForm(service?: Service) {
    setSelectedService(service);
    setDirty(false);
    setFormSession((current) => current + 1);
    setOpen(true);
  }

  function closeForm() {
    if (dirty && !window.confirm(t("provider.services.discardConfirm"))) return;
    setOpen(false);
    setSelectedService(undefined);
    setDirty(false);
  }

  function handleSaved() {
    setOpen(false);
    setSelectedService(undefined);
    setDirty(false);
    router.refresh();
  }

  return (
    <main dir="rtl" className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-[1.6] text-text">{t("provider.services.title")}</h1>
          <p className="mt-1 text-sm leading-7 text-text-muted">{t("provider.services.subtitle")}</p>
        </div>
        <Button type="button" onClick={() => openForm()} className="w-full shrink-0 sm:w-auto">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14m-7-7h14" /></svg>
          {t("provider.services.create")}
        </Button>
      </header>

      <section aria-label={t("provider.services.title")} className="mt-6">
        {page.items.length === 0 ? (
          <EmptyServicesState onAdd={() => openForm()} />
        ) : (
          <>
            <TableContainer component={Paper} elevation={0} role="region" aria-label={t("provider.services.title")} tabIndex={0} sx={{ display: "none", "@media (min-width:768px)": { display: "block" }, maxHeight: "min(70vh, 720px)", overflow: "auto", border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 3px 14px rgba(23, 43, 42, 0.05)", "&:focus-visible": { outline: "2px solid #0f766e", outlineOffset: 2 } }}>
              <Table stickyHeader sx={{ minWidth: 900, tableLayout: "fixed", "& .MuiTableCell-root": { height: 64, px: 2, verticalAlign: "middle", borderColor: "#e8efed" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headerCellSx, width: "20%" }}>{t("provider.services.name")}</TableCell>
                    <TableCell sx={{ ...headerCellSx, width: "15%" }}>{t("provider.services.category")}</TableCell>
                    <TableCell sx={{ ...headerCellSx, width: "13%" }}>{t("provider.services.duration")}</TableCell>
                    <TableCell sx={{ ...headerCellSx, width: "16%" }}>{t("provider.services.price")}</TableCell>
                    <TableCell sx={{ ...headerCellSx, width: "14%" }}>{t("provider.services.status.active")}</TableCell>
                    <TableCell sx={{ ...headerCellSx, width: "22%" }}>{t("provider.services.actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {page.items.map((service) => (
                    <TableRow key={service.id} hover sx={{ transition: "background-color 150ms", "&:hover": { backgroundColor: "#f7faf9" }, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>
                      <TableCell sx={{ ...bodyCellSx, fontWeight: 700 }}>{service.name}</TableCell>
                      <TableCell sx={bodyCellSx}><CategoryPill service={service} /></TableCell>
                      <TableCell sx={bodyCellSx}><DurationValue service={service} /></TableCell>
                      <TableCell sx={bodyCellSx}><PriceValue service={service} /></TableCell>
                      <TableCell sx={bodyCellSx}><StatusPill active={service.is_active} /></TableCell>
                      <TableCell sx={bodyCellSx}>
                        <ServiceRowActions service={service} onEdit={() => openForm(service)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <ul aria-label={t("provider.services.title")} className="grid gap-3 md:hidden">
              {page.items.map((service) => (
                <li key={service.id}>
                  <Paper elevation={0} sx={{ border: "1px solid #dce7e4", borderRadius: 3, p: 2, boxShadow: "0 2px 10px rgba(23, 43, 42, 0.04)" }}>
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <h2 className="min-w-0 break-words text-base font-bold text-text">{service.name}</h2>
                      <StatusPill active={service.is_active} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
                      <DetailValue label={t("provider.services.category")}><CategoryPill service={service} /></DetailValue>
                      <DetailValue label={t("provider.services.duration")}><DurationValue service={service} /></DetailValue>
                      <DetailValue label={t("provider.services.price")}><PriceValue service={service} /></DetailValue>
                    </dl>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                      <Button type="button" variant="outline" onClick={() => openForm(service)} className="min-h-10 shrink-0 whitespace-nowrap">
                        <PencilIcon />
                        {t("provider.services.edit")}
                      </Button>
                      <ProviderServiceActions service={service} />
                    </div>
                  </Paper>
                </li>
              ))}
            </ul>

            {page.next_cursor !== null && (
              <Link href={`/provider/services?cursor=${page.next_cursor}`} className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("provider.services.next")}
              </Link>
            )}
          </>
        )}
      </section>

      <Modal
        open={open}
        onClose={closeForm}
        title={t(selectedService ? "provider.services.editTitle" : "provider.services.create")}
        size="wide"
      >
        <ProviderServiceForm
          key={`${selectedService?.id ?? "new"}-${formSession}`}
          service={selectedService}
          formId={`provider-service-form-${formSession}`}
          onCancel={closeForm}
          onSaved={handleSaved}
          onDirtyChange={setDirty}
        />
      </Modal>
    </main>
  );
}

function ServiceRowActions({ service, onEdit }: { service: Service; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" onClick={onEdit} className="min-h-10 shrink-0 whitespace-nowrap">
        <PencilIcon />
        {t("provider.services.edit")}
      </Button>
      <ProviderServiceActions service={service} />
    </div>
  );
}

function EmptyServicesState({ onAdd }: { onAdd: () => void }) {
  return (
    <Paper elevation={0} sx={{ display: "flex", minHeight: 280, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5, p: 4, textAlign: "center", border: "1px dashed #cbd8d5", borderRadius: 3, backgroundColor: "#fff" }}>
      <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16v13H4zM8 7V5a4 4 0 0 1 8 0v2M8 12h8" /></svg>
      </span>
      <h2 className="text-lg font-bold text-text">{t("provider.services.emptyTitle")}</h2>
      <p className="max-w-md text-sm leading-7 text-text-muted">{t("provider.services.empty")}</p>
      <Button type="button" onClick={onAdd} className="mt-1">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14m-7-7h14" /></svg>
        {t("provider.services.addFirst")}
      </Button>
    </Paper>
  );
}

function DetailValue({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs font-medium text-text-muted">{label}</dt>
      <dd className="min-w-0 text-sm font-medium text-text">{children}</dd>
    </div>
  );
}

function CategoryPill({ service }: { service: Service }) {
  return <span className="inline-flex max-w-full rounded-full bg-surface px-2.5 py-1 text-xs text-text-muted">{serviceCategoryLabel(service.category)}</span>;
}

function DurationValue({ service }: { service: Service }) {
  return <span className="whitespace-nowrap tabular-nums">{numberFormatFa(service.duration_minutes)} {t("provider.services.minutes")}</span>;
}

function PriceValue({ service }: { service: Service }) {
  const amount = formatTomanFromRial(service.price_irr).replace(/\s*تومان$/, "");
  return <span className="whitespace-nowrap tabular-nums">{amount} <span className="font-normal text-text-muted">تومان</span></span>;
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-800" : "bg-surface text-text-muted"}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${active ? "bg-emerald-600" : "bg-slate-400"}`} />
      {t(active ? "provider.services.status.active" : "provider.services.status.inactive")}
    </span>
  );
}

function PencilIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" /></svg>
  );
}

const headerCellSx = { position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f3f6f5", fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#526764", whiteSpace: "nowrap", textAlign: "start" as const };
const bodyCellSx = { fontFamily: "inherit", fontSize: 13, color: "#172b2a", textAlign: "start" as const };
