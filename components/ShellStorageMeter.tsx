import Link from 'next/link';
import { cn, convertFileSize } from '@/lib/utils';
import { usagePercentage } from '@/lib/quota';

export const SEGMENT_COLOR: Record<string, string> = {
  Documents: 'var(--shell-seg-docs)',
  Images: 'var(--shell-seg-images)',
  Media: 'var(--shell-seg-media)',
  Others: 'var(--shell-seg-others)',
};

export const formatPct = (pct: number) =>
  pct > 0 && pct < 1 ? '<1' : String(Math.round(pct));

export type Segment = { title: string; size: number };

export type StorageTotals = {
  used: number;
  all: number;
  document?: { size: number };
  image?: { size: number };
  video?: { size: number };
  audio?: { size: number };
  other?: { size: number };
};

export const segmentsFromTotals = (t: StorageTotals): Segment[] => [
  { title: 'Documents', size: t.document?.size ?? 0 },
  { title: 'Images', size: t.image?.size ?? 0 },
  { title: 'Media', size: (t.video?.size ?? 0) + (t.audio?.size ?? 0) },
  { title: 'Others', size: t.other?.size ?? 0 },
];

export const SegmentedBar = ({
  segments,
  total,
  className,
  label,
}: {
  segments: Segment[];
  total: number;
  className?: string;
  label: string;
}) => (
  <div
    role="img"
    aria-label={label}
    className={cn(
      'relative h-1.5 w-full overflow-hidden rounded-full bg-ink-900/[0.06] dark:bg-white/[0.07]',
      className
    )}
  >
    <div className="shell-grow-x flex size-full gap-[2px]">
      {segments
        .filter((s) => s.size > 0)
        .map((s) => (
          <span
            key={s.title}
            title={`${s.title} · ${convertFileSize(s.size)}`}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${total ? Math.max((s.size / total) * 100, 0.75) : 0}%`,
              background: SEGMENT_COLOR[s.title],
            }}
          />
        ))}
    </div>
  </div>
);

const ShellStorageMeter = ({
  totals,
  collapsed = false,
}: {
  totals: StorageTotals | null;
  collapsed?: boolean;
}) => {
  if (!totals) return null;
  const pct = usagePercentage(totals.used, totals.all);
  const segments = segmentsFromTotals(totals);
  const near = pct >= 85;

  if (collapsed) {
    return (
      <Link
        href="/dashboard"
        aria-label={`Storage ${formatPct(pct)}% used`}
        className="shell-focus group relative mx-auto flex size-8 items-center justify-center rounded-lg hover:bg-ink-900/[0.04] dark:hover:bg-white/[0.04]"
      >
        <svg
          viewBox="0 0 20 20"
          className="size-5 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2.5"
            className="stroke-ink-900/10 dark:stroke-white/10"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${Math.min(pct, 100)} 100`}
            className={
              near
                ? 'stroke-signal-amber'
                : 'stroke-vault-600 dark:stroke-vault-400'
            }
          />
        </svg>
        <span
          role="tooltip"
          className="shell-tip rounded-md border border-border bg-popover px-2 py-1 text-caption tabular-nums text-popover-foreground shadow-soft"
        >
          {convertFileSize(totals.used)} of {convertFileSize(totals.all)}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="shell-focus block rounded-lg px-2.5 py-2 transition-colors hover:bg-ink-900/[0.035] dark:hover:bg-white/[0.035]"
    >
      <div className="flex items-baseline justify-between text-caption">
        <span className="font-medium text-ink-700 dark:text-ink-200">
          Storage
        </span>
        <span
          className={cn(
            'tabular-nums',
            near ? 'text-signal-amber' : 'text-ink-500 dark:text-ink-400'
          )}
        >
          {formatPct(pct)}%
        </span>
      </div>
      <SegmentedBar
        segments={segments}
        total={totals.all}
        className="mt-2"
        label={`${formatPct(pct)}% of storage used`}
      />
      <p className="mt-1.5 text-[11px] tabular-nums text-ink-400 dark:text-ink-500">
        {convertFileSize(totals.used)} of {convertFileSize(totals.all)}
      </p>
    </Link>
  );
};

export default ShellStorageMeter;
