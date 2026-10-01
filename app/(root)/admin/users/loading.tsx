import { cn } from '@/lib/utils';

const Bone = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'shell-skeleton-shimmer rounded-md bg-ink-900/[0.06] dark:bg-white/[0.06]',
      className
    )}
  />
);

export default function AdminUsersLoading() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1200px] flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading users…</span>
      <div className="flex flex-col gap-2">
        <Bone className="h-7 w-24" />
        <Bone className="h-4 w-72" />
      </div>

      <div className="shell-panel grid grid-cols-2 overflow-hidden sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex flex-col gap-2 border-border px-5 py-4',
              i > 0 && 'sm:border-l',
              i % 2 === 1 && 'border-l',
              i >= 2 && 'border-t sm:border-t-0'
            )}
          >
            <Bone className="h-3 w-16" />
            <Bone className="h-6 w-20" />
          </div>
        ))}
      </div>

      <div className="shell-panel overflow-hidden">
        <div className="flex gap-6 border-b border-border px-5 py-3">
          {['w-16', 'w-10', 'w-28', 'w-14'].map((w) => (
            <Bone key={w} className={cn('h-3', w)} />
          ))}
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-5 py-3">
              <div className="flex w-[34%] items-center gap-3">
                <Bone className="size-8 shrink-0 rounded-full" />
                <div className="flex-1">
                  <Bone className="h-3.5 w-32" />
                  <Bone className="mt-1.5 h-3 w-44" />
                </div>
              </div>
              <Bone className="h-3.5 w-8" />
              <Bone className="hidden h-1.5 w-[140px] rounded-full sm:block" />
              <Bone className="h-5 w-16 rounded-full" />
              <Bone className="ml-auto h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
