import Link from "next/link";

import { t } from "@/config/messages.fa";
import type { DoctorCardView } from "@/lib/api/adapters/doctor-card";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";

function Avatar({ url }: { url: string | null }) {
  return (
    <div className="h-[100px] w-[77px] shrink-0 overflow-hidden rounded-md bg-surface">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-full p-4 text-text-muted" fill="currentColor">
          <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-3.9 0-7.5 2-7.5 5.5V21h15v-1.5c0-3.5-3.6-5.5-7.5-5.5z" />
        </svg>
      )}
    </div>
  );
}

export function DoctorCard({ card }: { card: DoctorCardView }) {
  return (
    <Link
      href={`/services/${card.id}`}
      className="flex gap-4 rounded-md border border-border bg-white p-4 transition-colors hover:border-primary"
    >
      <Avatar url={card.avatarUrl} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="min-w-0 truncate font-bold text-text">{card.name}</h3>
          {card.verified && <Badge tone="verified">{t("badge.verified")}</Badge>}
        </div>
        {card.specialties.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {card.specialties.slice(0, 2).map((specialty) => (
              <li key={specialty} className="truncate rounded-sm bg-surface px-2 py-1 text-xs text-text">
                {specialty}
              </li>
            ))}
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
