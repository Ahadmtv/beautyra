import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminUsersLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-8">
      <p className="sr-only">در حال بارگذاری کاربران</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="mt-6 grid gap-3 rounded-xl border border-border bg-white p-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11 w-36 max-md:w-full" />
      </div>
      <div className="mt-5 hidden overflow-hidden rounded-xl border border-border bg-white md:block">
        <div className="grid grid-cols-6 gap-4 bg-surface p-4">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-4" />)}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} className="grid grid-cols-6 items-center gap-4 border-t border-border p-4">
            {Array.from({ length: 6 }, (_, column) => <Skeleton key={column} className="h-5" />)}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:hidden">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4">
            <Skeleton className="h-5 w-3/4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-9 w-32" />
          </div>
        ))}
      </div>
    </main>
  );
}
