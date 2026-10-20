import Link from "next/link";

import { t } from "@/config/messages.fa";
import type { ProviderCardView } from "@/lib/api/adapters/provider-card";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";

import { ProviderAvatar } from "./ProviderAvatar";

export function ProviderCard({ card }: { card: ProviderCardView }) {
  return (
    <Link
      href={`/services/${card.id}`}
      className="flex gap-4 rounded-md border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:border-primary"
    >
      <ProviderAvatar url={card.avatarUrl} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="min-w-0 truncate font-bold text-text">{card.name}</h3>
          {card.verified && <Badge tone="verified">{t("badge.verified")}</Badge>}
        </div>
        {card.categoryLabel && (
          <ul className="flex flex-col gap-1.5">
            <li className="truncate rounded-sm bg-surface px-2 py-1 text-xs text-text">
              {card.categoryLabel}
            </li>
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-1 text-sm text-text-muted">
          {card.neighborhood && <span>{card.neighborhood}</span>}
          {card.rating !== null && (
            <Rating value={card.rating} count={card.reviewCount ?? undefined} />
          )}
        </div>
      </div>
    </Link>
  );
}
