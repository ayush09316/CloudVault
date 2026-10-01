import { cn } from '@/lib/utils';

const WIDTHS = [62, 48, 71, 39, 55, 66, 44, 58, 50, 35];

const FileListSkeleton = ({
  breadcrumbs = false,
  trash = false,
}: {
  breadcrumbs?: boolean;
  trash?: boolean;
}) => (
  <div
    className="mx-auto flex w-full max-w-7xl flex-col gap-5"
    aria-busy="true"
    aria-label="Loading files"
    role="status"
  >
    <div className="flex flex-col gap-3">
      {breadcrumbs && <span className="fx-skeleton block h-4 w-48" />}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="fx-skeleton block h-7 w-40" />
          <span className="fx-skeleton block h-3.5 w-28" />
        </div>
        <div className="flex gap-2">
          <span className="fx-skeleton block h-9 w-28 rounded-lg" />
          <span className="fx-skeleton hidden h-9 w-[68px] rounded-lg sm:block" />
        </div>
      </div>
    </div>
    <div className="fx-surface w-full overflow-hidden">
      <div className="flex h-10 items-center gap-3 border-b border-border px-3">
        <span className="fx-skeleton size-4 rounded-[4px]" />
        <span className="fx-skeleton h-3 w-12" />
        <span className="flex-1" />
        <span className="fx-skeleton hidden h-3 w-14 md:block" />
        <span className="fx-skeleton hidden h-3 w-10 md:block" />
        <span
          className={cn('hidden md:block', trash ? 'w-[140px]' : 'w-[108px]')}
        />
      </div>
      {WIDTHS.map((w, i) => (
        <div
          key={i}
          className="flex h-[52px] items-center gap-3 border-b border-border px-3 last:border-b-0"
          style={{ opacity: 1 - i * 0.07 }}
        >
          <span className="w-4" />
          <span className="fx-skeleton size-7 rounded-md" />
          <span className="min-w-0 flex-1">
            <span
              className="fx-skeleton block h-3"
              style={{ width: `${w}%`, maxWidth: 360 }}
            />
          </span>
          <span className="fx-skeleton hidden h-3 w-28 lg:block" />
          <span className="fx-skeleton hidden h-3 w-16 md:block" />
          <span className="fx-skeleton hidden h-3 w-12 md:block" />
          <span
            className={cn('hidden md:block', trash ? 'w-[140px]' : 'w-[108px]')}
          />
        </div>
      ))}
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);

export default FileListSkeleton;
