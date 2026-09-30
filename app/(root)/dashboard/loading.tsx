import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="bento-grid" aria-busy="true" aria-live="polite">
      <div className="bento-card lg:col-span-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-3 h-9 w-24" />
        <Skeleton className="mt-6 h-2.5 w-full rounded-full" />
        <Skeleton className="mt-2 h-3 w-32" />
      </div>
      <div className="bento-card lg:col-span-2">
        <Skeleton className="h-4 w-24" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-3">
              <Skeleton className="size-7" />
              <Skeleton className="mt-3 h-4 w-16" />
              <Skeleton className="mt-1 h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
      <div className="bento-card lg:col-span-2">
        <Skeleton className="h-5 w-32" />
        <div className="mt-4 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-[50px] rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-2 h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bento-card lg:col-span-1">
        <Skeleton className="h-5 w-28" />
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-l-2 border-border pl-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
