import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Trash2,
  Link2,
  Image as ImageIcon,
  Play,
  Check,
  MoveRight,
  Download,
  Search,
  Upload,
  FolderPlus,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const d = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties;

const Surface = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    aria-hidden
    className={cn(
      'w-full rounded-xl border border-border bg-card text-foreground shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_12px_32px_-20px_rgba(10,13,12,0.35)]',
      className
    )}
  >
    {children}
  </div>
);

const TREE = [
  { depth: 0, name: 'My Files', open: true },
  { depth: 1, name: 'Clients', open: true },
  { depth: 2, name: 'Acme', open: false },
  { depth: 2, name: 'Northwind', open: false },
  { depth: 1, name: 'Brand', open: false },
];

export const TreeDemo = () => (
  <Surface className="max-w-[340px] p-2">
    <div className="cvl-mono flex items-center gap-1 border-b border-border px-1.5 pb-2 text-[10.5px] text-muted-foreground">
      My Files <ChevronRight className="size-3" /> Clients{' '}
      <ChevronRight className="size-3" />
      <span className="text-foreground">Acme</span>
    </div>
    <div className="relative mt-1.5">
      <span className="cvl-anim cvl-tree-cursor cvl-accent-ring absolute inset-x-0 top-0 h-7 rounded-md bg-[var(--cvl-accent-soft)]" />
      {TREE.map((r, i) => (
        <div
          key={r.name}
          style={{ ...d(i * 0.08), paddingLeft: 6 + r.depth * 16 }}
          className="cvl-anim cvl-tree-row relative flex h-7 items-center gap-1.5 text-[12px]"
        >
          {r.open ? (
            <ChevronDown className="size-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3 text-muted-foreground" />
          )}
          <Folder className="size-3.5 fill-vault-500/20 text-vault-600 dark:text-vault-300" />
          {r.name}
          <span className="cvl-mono ml-auto pr-2 text-[10px] text-muted-foreground">
            {[3, 2, 14, 9, 6][i]}
          </span>
        </div>
      ))}
    </div>
  </Surface>
);

export const TrashDemo = () => (
  <div aria-hidden className="w-full max-w-[340px]">
    <div className="relative flex items-center justify-between gap-6">
      <Surface className="w-[190px] shrink-0 p-2">
        <p className="cvl-mono flex items-center gap-1 px-1 pb-2 text-[10px] text-muted-foreground">
          <Folder className="size-3 fill-vault-500/20 text-vault-600 dark:text-vault-300" />
          Clients / Acme
        </p>
        <div className="space-y-1">
          <span
            className="cvl-anim cvl-trash-file relative z-10 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-[11px] shadow-soft"
            style={{ '--to': '150px' } as React.CSSProperties}
          >
            <FileText className="size-3.5 text-signal-rose" />
            q3-plan.pdf
          </span>
          {['brief.docx', 'invoice-0912.pdf'].map((f) => (
            <span
              key={f}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground"
            >
              <FileText className="size-3.5" />
              {f}
            </span>
          ))}
        </div>
      </Surface>
      <span className="relative flex size-14 shrink-0 items-end justify-center rounded-2xl border border-dashed border-border bg-card/60">
        <span className="relative mb-3 flex flex-col items-center">
          <span className="cvl-anim cvl-trash-lid block h-[3px] w-6 rounded-full bg-muted-foreground" />
          <span className="mt-[2px] block h-5 w-[18px] rounded-b-[5px] border-2 border-t-0 border-muted-foreground" />
        </span>
        <span className="cvl-mono absolute -bottom-5 text-[9.5px] text-muted-foreground">
          Trash
        </span>
      </span>
    </div>
    <div className="relative mt-5 h-5 text-[11.5px]">
      <span className="cvl-anim cvl-label-a absolute inset-0 flex items-center gap-1.5 text-muted-foreground">
        <Trash2 className="size-3" /> Moved to trash
      </span>
      <span className="cvl-anim cvl-label-b cvl-accent absolute inset-0 flex items-center gap-1.5 opacity-0">
        <Check className="size-3" /> Restored to Clients / Acme
      </span>
    </div>
  </div>
);

const Segmented = ({
  items,
  thumbClass,
}: {
  items: string[];
  thumbClass: string;
}) => (
  <div
    className="relative grid rounded-lg border border-border bg-secondary/50 p-0.5"
    style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
  >
    <span
      className={cn(
        'cvl-anim absolute inset-y-0.5 left-0.5 rounded-md bg-card shadow-[0_0_0_1px_hsl(var(--border)),0_1px_2px_rgba(0,0,0,0.08)]',
        thumbClass
      )}
      style={{ width: `calc((100% - 4px) / ${items.length})` }}
    />
    {items.map((t) => (
      <span
        key={t}
        className="relative z-10 py-1 text-center text-[10.5px] font-medium"
      >
        {t}
      </span>
    ))}
  </div>
);

export const ShareDemo = () => (
  <Surface className="max-w-[280px] space-y-2.5 p-3">
    <div>
      <p className="cvl-eyebrow mb-1.5 text-[9.5px]">Role</p>
      <Segmented items={['Can view', 'Can edit']} thumbClass="cvl-role-thumb" />
    </div>
    <div>
      <p className="cvl-eyebrow mb-1.5 text-[9.5px]">Expires</p>
      <Segmented
        items={['Never', '1 day', '7 days', '30 days']}
        thumbClass="cvl-expiry-thumb"
      />
    </div>
    <div className="flex items-center gap-1.5 rounded-md bg-secondary/70 px-2 py-1.5 text-[10px]">
      <Link2 className="cvl-accent size-3" />
      <span className="cvl-mono truncate text-muted-foreground">
        /share/k8Qz2nLw
      </span>
    </div>
  </Surface>
);

export const PreviewDemo = () => (
  <Surface className="max-w-[280px] overflow-hidden">
    <div className="flex h-7 items-center gap-1.5 border-b border-border px-2.5 text-[10.5px]">
      <span className="size-1.5 rounded-full bg-vault-500" />
      <span className="text-muted-foreground">Preview</span>
    </div>
    <div className="relative aspect-[16/9]">
      <div className="cvl-anim cvl-cycle absolute inset-0 p-2.5" style={d(0)}>
        <div className="flex h-full items-end rounded-md bg-[linear-gradient(165deg,#d8efe7_0%,#8cc3b3_45%,#2c6d61_100%)] p-2 dark:bg-[linear-gradient(165deg,#2e4d47_0%,#1e3d37_45%,#0d201c_100%)]">
          <span className="cvl-mono flex items-center gap-1 rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white">
            <ImageIcon className="size-2.5" /> site-shot.png
          </span>
        </div>
      </div>
      <div className="cvl-anim cvl-cycle absolute inset-0 p-2.5" style={d(2.5)}>
        <div className="mx-auto h-full w-[62%] rounded-md border border-border bg-background p-2">
          {[90, 70, 82, 60, 76, 40].map((w, i) => (
            <span
              key={i}
              className="mb-1.5 block h-1 rounded-full bg-border"
              style={{ width: `${w}%` }}
            />
          ))}
          <span className="cvl-mono text-[8.5px] text-muted-foreground">
            page 1 / 12
          </span>
        </div>
      </div>
      <div className="cvl-anim cvl-cycle absolute inset-0 p-2.5" style={d(5)}>
        <div className="flex h-full flex-col justify-between rounded-md bg-ink-900 p-2 text-white">
          <span className="m-auto flex size-7 items-center justify-center rounded-full bg-white/15">
            <Play className="size-3 fill-white" />
          </span>
          <span className="block h-0.5 rounded-full bg-white/20">
            <span className="cvl-anim cvl-scrub block h-full rounded-full bg-vault-300" />
          </span>
        </div>
      </div>
      <div className="cvl-anim cvl-cycle absolute inset-0 p-2.5" style={d(7.5)}>
        <div className="flex h-full items-center justify-center gap-[3px] rounded-md border border-border bg-background">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="cvl-anim cvl-wave block w-[3px] rounded-full bg-vault-500"
              style={{
                height: `${20 + ((i * 37) % 60)}%`,
                ...d(-(i % 7) * 0.15),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </Surface>
);

const ROWS = [
  'contract-acme.pdf',
  'invoice-0912.pdf',
  'logo-final.svg',
  'notes.txt',
];

export const BulkDemo = () => (
  <div aria-hidden className="relative w-full max-w-[280px] pb-10">
    <Surface className="divide-y divide-border">
      {ROWS.map((r, i) => (
        <div
          key={r}
          className={cn(
            'flex items-center gap-2 px-2.5 py-2 text-[11px]',
            i < 3 && 'cvl-anim cvl-row-sel'
          )}
          style={d(i * 0.35)}
        >
          <span className="relative flex size-3.5 items-center justify-center rounded-[4px] border border-border">
            {i < 3 && (
              <span
                className="cvl-anim cvl-check absolute -inset-px flex items-center justify-center rounded-[4px] bg-vault-600 text-white dark:bg-vault-400 dark:text-ink-950"
                style={d(i * 0.35)}
              >
                <Check className="size-2.5" strokeWidth={3} />
              </span>
            )}
          </span>
          <FileText className="size-3.5 text-muted-foreground" />
          {r}
        </div>
      ))}
    </Surface>
    <div className="cvl-anim cvl-toolbar absolute inset-x-0 bottom-0 mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-foreground px-1.5 py-1 text-[10.5px] text-background shadow-soft-lg">
      <span className="px-1.5 font-medium">3 selected</span>
      {[
        { icon: MoveRight, t: 'Move' },
        { icon: Download, t: 'Zip' },
        { icon: Trash2, t: 'Trash' },
      ].map((a) => (
        <span
          key={a.t}
          className="flex items-center gap-1 rounded-full px-1.5 py-0.5 opacity-80"
        >
          <a.icon className="size-3" />
          {a.t}
        </span>
      ))}
    </div>
  </div>
);

export const QuotaDemo = () => (
  <Surface className="max-w-[300px] p-3">
    <div className="flex items-baseline justify-between">
      <p className="text-[11px] font-medium">Storage</p>
      <p className="cvl-mono text-[10px] text-muted-foreground">1.97 / 2 GB</p>
    </div>
    <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-secondary">
      <span className="cvl-anim cvl-fill block h-full w-[98.5%] rounded-full bg-[linear-gradient(90deg,#0e7a6e_0%,#199e7f_70%,var(--cvl-signal)_100%)]" />
    </div>
    <div className="mt-3 flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-[10.5px]">
      <Upload className="size-3 text-muted-foreground" />
      export.zip
      <span className="cvl-mono ml-auto text-muted-foreground">48 MB</span>
    </div>
    <p className="cvl-anim cvl-reject cvl-signal-chip mt-2 rounded-md border px-2 py-1.5 text-[10px] leading-snug">
      Uploading export.zip would exceed your storage quota (30 MB remaining).
    </p>
  </Surface>
);

const FEED = [
  { a: 'Uploaded', t: 'q3-plan.pdf' },
  { a: 'Created share link', t: 'view link, expires in 7 days' },
  { a: 'Renamed', t: 'draft.docx → brief.docx' },
  { a: 'Revoked access', t: 'dev@acme.co' },
];

export const ActivityDemo = () => (
  <Surface className="max-w-[300px] p-1.5">
    {FEED.map((f, i) => (
      <div
        key={f.a}
        className="cvl-anim cvl-feed-row flex items-start gap-2 rounded-md px-2 py-1.5"
        style={d(i * 0.45)}
      >
        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-vault-500" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium">{f.a}</p>
          <p className="cvl-mono truncate text-[9.5px] text-muted-foreground">
            {f.t}
          </p>
        </div>
        <span className="cvl-mono ml-auto shrink-0 text-[9.5px] text-muted-foreground">
          {['now', '4m', '1h', '2h'][i]}
        </span>
      </div>
    ))}
  </Surface>
);

export const CommandDemo = () => (
  <div aria-hidden className="w-full max-w-[300px]">
    <div className="mb-3 flex justify-center gap-1.5">
      <kbd className="cvl-kbd cvl-anim cvl-press h-8 min-w-8 text-[13px]">
        ⌘
      </kbd>
      <kbd
        className="cvl-kbd cvl-anim cvl-press h-8 min-w-8 text-[13px]"
        style={d(0.08)}
      >
        K
      </kbd>
    </div>
    <Surface className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-2.5 py-2 text-[11.5px]">
        <Search className="size-3.5 text-muted-foreground" />
        <span className="cvl-anim cvl-type">trash</span>
        <span className="cvl-caret" />
      </div>
      <div className="p-1 text-[11px]">
        <div className="cvl-anim cvl-result flex items-center gap-2 rounded-md bg-secondary px-2 py-1.5">
          <Trash2 className="size-3.5" /> Trash
          <CornerDownLeft className="ml-auto size-3 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
          <Upload className="size-3.5" /> Upload a file
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
          <FolderPlus className="size-3.5" /> New folder
        </div>
      </div>
    </Surface>
  </div>
);
