import Link from "next/link";
import { t } from "@/config/messages.fa";
import { buttonClassName } from "./Button";

export function LoadMoreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={buttonClassName({ variant: "outline", className: "w-full sm:w-auto" })}
    >
      {t("common.loadMore")}
    </Link>
  );
}
