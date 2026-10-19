import { ServiceCardsSkeleton } from "@/components/listing/ServiceCardsSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
      <ServiceCardsSkeleton />
    </main>
  );
}
