import { t } from "@/config/messages.fa";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[1000px] flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold">{t("home.title")}</h1>
      <p className="mt-4 text-zinc-600">{t("home.placeholder")}</p>
    </main>
  );
}
