"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { t } from "@/config/messages.fa";

export function ListingRetry() {
  const router = useRouter();
  return (
    <Button type="button" variant="outline" onClick={() => router.refresh()}>
      {t("common.retry")}
    </Button>
  );
}
