import { numberFormatFa } from "@/lib/format/digits";
import { t } from "@/config/messages.fa";

const STAR_PATH =
  "M12 2.5l2.94 6.02 6.64.96-4.8 4.68 1.13 6.6L12 17.77l-5.91 3.09 1.13-6.6-4.8-4.68 6.64-.96z";

function Stars({ className }: { className: string }) {
  return (
    <span className={`inline-flex w-max gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

type RatingProps = {
  value: number;
  count?: number;
};

export function Rating({ value, count }: RatingProps) {
  const clamped = Math.min(5, Math.max(0, value));
  const label = t("rating.label", { value: numberFormatFa(clamped) });

  return (
    <div className="inline-flex items-center gap-1.5">
      <span role="img" aria-label={label} className="relative inline-flex">
        <Stars className="text-border" />
        <span
          className="absolute inset-y-0 start-0 overflow-hidden"
          style={{ width: `${(clamped / 5) * 100}%` }}
        >
          <Stars className="text-star" />
        </span>
      </span>
      {count !== undefined && (
        <span className="text-sm text-text-muted">
          {t("rating.count", { count: numberFormatFa(count) })}
        </span>
      )}
    </div>
  );
}
