import { t, type MessageKey } from "@/config/messages.fa";

const ITEMS: { title: MessageKey; text: MessageKey; icon: string }[] = [
  {
    title: "home.trust.verifiedTitle",
    text: "home.trust.verifiedText",
    icon: "M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
  },
  {
    title: "home.trust.bookingTitle",
    text: "home.trust.bookingText",
    icon: "M4 6h16v14H4Zm0 4h16M8 3v4m8-4v4",
  },
  {
    title: "home.trust.paymentTitle",
    text: "home.trust.paymentText",
    icon: "M3 7h18v10H3Zm0 4h18M7 15h4",
  },
  {
    title: "home.trust.disputeTitle",
    text: "home.trust.disputeText",
    icon: "M12 3v18M6 6h12M6 6l-3 6a3 3 0 0 0 6 0Zm12 0-3 6a3 3 0 0 0 6 0Z",
  },
];

export function TrustStrip() {
  return (
    <section className="relative z-10 mx-auto -mt-10 w-full max-w-page px-4 sm:px-6 md:-mt-12">
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[var(--brand-warm-200)] bg-[var(--brand-warm-200)] shadow-[0_24px_60px_rgba(15,72,67,0.14)] sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item.title} className="group flex items-start gap-4 bg-white p-5 transition-colors duration-200 hover:bg-[var(--brand-teal-50)] sm:p-6">
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-teal-50),#f8e7e8)] text-primary ring-1 ring-inset ring-white transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
            </span>
            <div className="min-w-0 pt-0.5">
              <h3 className="text-[15px] font-bold text-text">{t(item.title)}</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-text-muted">{t(item.text)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
