export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-surface motion-reduce:animate-none ${className ?? ""}`} />;
}
