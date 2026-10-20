"use client";

import { useState, type MouseEvent, type ReactNode } from "react";

import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

export function MobileCategoryDrawer({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const closeOnLinkClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="md:hidden">
        <Button variant="outline" aria-haspopup="dialog" onClick={() => setOpen(true)}>
          {t("home.categories")}
        </Button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title={t("home.categories")}>
        <div onClick={closeOnLinkClick}>{children}</div>
      </Drawer>
    </>
  );
}
