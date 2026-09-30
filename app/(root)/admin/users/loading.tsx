import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersLoading() {
  return (
    <div className="page-container" aria-busy="true" aria-live="polite">
      <section className="w-full">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="mt-2 h-4 w-20" />
      </section>
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
