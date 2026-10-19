import type { ReactNode } from "react";

type BadgeProps = {
  tone?: "neutral" | "verified";
  children: ReactNode;
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  if (tone === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-verified">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor">
          <path d="M12 2.5l2.4 1.9 3-.2 1 2.8 2.5 1.6-.9 2.9.9 2.9-2.5 1.6-1 2.8-3-.2-2.4 1.9-2.4-1.9-3 .2-1-2.8-2.5-1.6.9-2.9-.9-2.9 2.5-1.6 1-2.8 3 .2z" />
          <path
            d="M8 12.2l2.6 2.6L16.2 9.2"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-sm bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary-active">
      {children}
    </span>
  );
}
