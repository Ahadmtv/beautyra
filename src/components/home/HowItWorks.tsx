import { numberFormatFa } from "@/lib/format/digits";
import { t, type MessageKey } from "@/config/messages.fa";

const STEPS: { title: MessageKey; text: MessageKey }[] = [
  { title: "home.how.step1.title", text: "home.how.step1.text" },
  { title: "home.how.step2.title", text: "home.how.step2.text" },
  { title: "home.how.step3.title", text: "home.how.step3.text" },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="home-how-title" className="border-t border-[var(--brand-warm-200)] bg-white/60">
      <div className="mx-auto w-full max-w-page px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="home-how-title" className="text-xl font-extrabold text-text sm:text-2xl">
            {t("home.how.title")}
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-muted">{t("home.how.hint")}</p>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--brand-warm-200)] bg-white p-6 text-center shadow-[0_8px_24px_rgba(65,48,44,0.05)]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-lg font-extrabold text-white shadow-[0_10px_24px_rgba(15,118,110,0.25)]">
                {numberFormatFa(index + 1)}
              </span>
              <h3 className="text-base font-bold text-text">{t(step.title)}</h3>
              <p className="text-sm leading-7 text-text-muted">{t(step.text)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
