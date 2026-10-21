"use client";

import { useState, type MouseEvent, type ReactNode } from "react";

import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

export function MobileCategoryDrawer({ children, selectedCategoryLabel, hasActiveFilters }: { children: ReactNode; selectedCategoryLabel?: string; hasActiveFilters: boolean }) {
  const [open, setOpen] = useState(false);

  const closeOnLinkClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="lg:hidden">
        <Button variant="outline" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
          {selectedCategoryLabel ?? t("home.categoryButton")}
          {hasActiveFilters && <span aria-hidden="true" className="ms-1 size-2 rounded-full bg-[var(--brand-blush-deep)]" />}
        </Button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title={t("home.categories")} placement="bottom">
        <div onClick={closeOnLinkClick}>{children}</div>
      </Drawer>
    </>
  );
}
