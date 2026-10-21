import type { ReactNode } from "react";

import { ProviderNavigation } from "@/components/provider/ProviderNavigation";
import { requireRole } from "@/lib/auth/session";

export default async function ProviderLayout({ children }: { children: ReactNode }) {
  await requireRole("provider");

  return (
    <>
      <ProviderNavigation />
      {children}
    </>
  );
}
