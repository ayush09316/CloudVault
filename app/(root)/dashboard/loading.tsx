import { cn } from '@/lib/utils';

const Bone = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'shell-skeleton-shimmer rounded-md bg-ink-900/[0.06] dark:bg-white/[0.06]',
      className
    )}
  />
);

export default function DashboardLoading() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1200px] flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading overview…</span>
      <div className="flex flex-col gap-2">
        <Bone className="h-7 w-32" />
        <Bone className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="shell-panel overflow-hidden lg:col-span-8">
          <div className="p-5 sm:p-6">
            <div className="flex justify-between">
              <Bone className="h-3.5 w-14" />
              <Bone className="h-5 w-20 rounded-full" />
            </div>
            <Bone className="mt-4 h-10 w-40" />
            <Bone className="mt-5 h-2 w-full rounded-full" />
          </div>
          <div className="grid grid-cols-2 border-t border-border sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'flex flex-col gap-2 border-border px-5 py-4',
                  i % 2 === 1 && 'border-l',
                  i >= 2 && 'border-t sm:border-t-0',
                  i === 2 && 'sm:border-l'
                )}
              >
                <Bone className="h-3 w-16" />
                <Bone className="h-4 w-14" />
                <Bone className="h-2.5 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="shell-panel p-1.5 lg:col-span-4">
          <Bone className="m-3 h-3 w-24" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <Bone className="size-8 rounded-lg" />
              <div className="flex-1">
                <Bone className="h-3.5 w-28" />
                <Bone className="mt-1.5 h-3 w-40" />
              </div>
            </div>
          ))}
        </div>

        <div className="shell-panel lg:col-span-8">
          <div className="flex justify-between px-5 pb-3 pt-4">
            <Bone className="h-4 w-28" />
            <Bone className="h-3.5 w-14" />
          </div>
          <div className="grid grid-cols-2 gap-3 px-5 pb-5 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'overflow-hidden rounded-[10px] border border-border',
                  i >= 6 && 'hidden xl:block',
                  i >= 4 && i < 6 && 'hidden sm:block'
                )}
              >
                <Bone className="aspect-[4/3] w-full rounded-none" />
                <div className="px-3 py-2.5">
                  <Bone className="h-3.5 w-3/4" />
                  <Bone className="mt-1.5 h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shell-panel lg:col-span-4">
          <div className="px-5 pb-3 pt-4">
            <Bone className="h-4 w-20" />
          </div>
          <div className="flex flex-col gap-4 px-5 pb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Bone className="size-7 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Bone className="h-3.5 w-full" />
                  <Bone className="mt-1.5 h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
