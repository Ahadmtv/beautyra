import Image from "next/image";

export function ProviderAvatar({ url }: { url: string | null }) {
  return (
    <div className="relative h-[100px] w-[77px] shrink-0 overflow-hidden rounded-md bg-surface">
      {url ? (
        <Image src={url} alt="" fill sizes="77px" className="object-cover" />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-full p-4 text-text-muted" fill="currentColor">
          <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-3.9 0-7.5 2-7.5 5.5V21h15v-1.5c0-3.5-3.6-5.5-7.5-5.5z" />
        </svg>
      )}
    </div>
  );
}
