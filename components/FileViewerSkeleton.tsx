import { Skeleton } from '@/components/ui/skeleton';

const FileViewerSkeleton = () => (
  <div className="page-container" aria-busy="true" aria-live="polite">
    <section className="w-full">
      <Skeleton className="h-9 w-40" />
      <div className="total-size-section">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-40" />
      </div>
    </section>
    <section className="file-list">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="size-[50px] rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </section>
  </div>
);

export default FileViewerSkeleton;
