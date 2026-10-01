import {
  FileText,
  Image as ImageIcon,
  Film,
  Shapes,
  Folder,
  ChevronRight,
  Check,
  Link2,
  RotateCcw,
  MoveRight,
  Download,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
    {children}
  </p>
);

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn('rounded-lg border border-border bg-card p-2.5', className)}
  >
    {children}
  </div>
);

const CATEGORIES = [
  {
    icon: FileText,
    name: 'Documents',
    size: '312 MB',
    tone: 'text-signal-rose',
  },
  { icon: ImageIcon, name: 'Images', size: '284 MB', tone: 'text-blue' },
  { icon: Film, name: 'Media', size: '221 MB', tone: 'text-vault-500' },
  { icon: Shapes, name: 'Others', size: '43 MB', tone: 'text-pink' },
];

const ACTIVITY = [
  { action: 'Uploaded', target: 'q3-plan.pdf', when: '2m' },
  { action: 'Created share link', target: 'view · 7 days', when: '9m' },
  { action: 'Renamed', target: 'draft.docx → brief.docx', when: '1h' },
  { action: 'Restored', target: 'Contracts', when: '3h' },
];

export const DashboardPanel = () => (
  <div className="grid h-full grid-cols-5 gap-2 p-3">
    <Card className="col-span-2 flex flex-col">
      <Label>Storage</Label>
      <div className="flex flex-1 items-center gap-3">
        <svg
          viewBox="0 0 36 36"
          className="size-16 shrink-0 -rotate-90"
          aria-hidden
        >
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            strokeWidth="3.5"
            className="stroke-secondary"
          />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="97.4"
            strokeDashoffset={97.4 * 0.57}
            className="stroke-vault-600 dark:stroke-vault-400"
          />
        </svg>
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            43%
          </p>
          <p className="cvl-mono text-[9px] text-muted-foreground">
            0.86 of 2 GB
          </p>
        </div>
      </div>
    </Card>
    <div className="col-span-3 grid grid-cols-2 gap-2">
      {CATEGORIES.map((c) => (
        <Card key={c.name} className="flex flex-col justify-between">
          <c.icon className={cn('size-3.5', c.tone)} aria-hidden />
          <div>
            <p className="text-[10.5px] font-medium">{c.name}</p>
            <p className="cvl-mono text-[9px] text-muted-foreground">
              {c.size}
            </p>
          </div>
        </Card>
      ))}
    </div>
    <Card className="col-span-5">
      <Label>Recent activity</Label>
      <ul className="mt-1.5 divide-y divide-border">
        {ACTIVITY.map((a) => (
          <li
            key={a.action}
            className="flex items-center gap-2 py-1 text-[10px]"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-vault-500" />
            <span className="font-medium">{a.action}</span>
            <span className="truncate text-muted-foreground">{a.target}</span>
            <span className="cvl-mono ml-auto shrink-0 text-[9px] text-muted-foreground">
              {a.when}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  </div>
);

const ITEMS = [
  { kind: 'folder', name: 'Contracts', meta: '14 items' },
  { kind: 'folder', name: 'Brand', meta: '6 items' },
  { kind: 'pdf', name: 'q3-plan.pdf', meta: '2.4 MB', selected: true },
  { kind: 'img', name: 'site-shot.png', meta: '880 KB', selected: true },
  { kind: 'video', name: 'walkthrough.mp4', meta: '41 MB' },
  { kind: 'doc', name: 'brief.docx', meta: '96 KB' },
];

const Thumb = ({ kind }: { kind: string }) => {
  if (kind === 'folder')
    return (
      <Folder
        className="size-5 fill-vault-500/20 text-vault-600 dark:text-vault-300"
        aria-hidden
      />
    );
  if (kind === 'img')
    return (
      <span className="block size-full rounded-[5px] bg-[linear-gradient(160deg,#cfe9e1_0%,#7fb8a8_55%,#2f6f63_100%)] dark:bg-[linear-gradient(160deg,#2b4a44_0%,#1d3b35_55%,#10231f_100%)]" />
    );
  if (kind === 'video')
    return <Film className="size-5 text-vault-500" aria-hidden />;
  return (
    <FileText
      className={cn(
        'size-5',
        kind === 'pdf' ? 'text-signal-rose' : 'text-blue'
      )}
      aria-hidden
    />
  );
};

export const FilesPanel = ({ dim = false }: { dim?: boolean }) => (
  <div className={cn('flex h-full flex-col p-3', dim && 'opacity-40')}>
    <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
      My Files
      <ChevronRight className="size-3" aria-hidden />
      Clients
      <ChevronRight className="size-3" aria-hidden />
      <span className="font-medium text-foreground">Acme</span>
      <span className="cvl-mono ml-auto text-[9px]">Sort: Date modified</span>
    </div>
    <div className="mt-2.5 grid grid-cols-3 content-start gap-2">
      {ITEMS.map((f) => (
        <div
          key={f.name}
          className={cn(
            'relative flex flex-col gap-1.5 rounded-lg border bg-card p-2',
            f.selected
              ? 'border-vault-500/60 bg-vault-600/[0.04]'
              : 'border-border'
          )}
        >
          <span
            className={cn(
              'absolute right-1.5 top-1.5 flex size-3 items-center justify-center rounded-[3px] border',
              f.selected
                ? 'border-vault-600 bg-vault-600 text-white dark:border-vault-400 dark:bg-vault-400 dark:text-ink-950'
                : 'border-border'
            )}
          >
            {f.selected && (
              <Check className="size-2" strokeWidth={3} aria-hidden />
            )}
          </span>
          <div className="flex h-16 items-center justify-center overflow-hidden rounded-md bg-secondary/60">
            <Thumb kind={f.kind} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium">{f.name}</p>
            <p className="cvl-mono text-[8.5px] text-muted-foreground">
              {f.meta}
            </p>
          </div>
        </div>
      ))}
    </div>
    {!dim && (
      <div className="mx-auto mt-auto flex items-center gap-1 rounded-full border border-border bg-card px-1.5 py-1 text-[9.5px] shadow-soft">
        <span className="px-1.5 font-medium">2 selected</span>
        <span className="h-3 w-px bg-border" />
        {[
          { icon: MoveRight, label: 'Move' },
          { icon: Download, label: 'Zip' },
          { icon: Trash2, label: 'Trash' },
        ].map((a) => (
          <span
            key={a.label}
            className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-muted-foreground"
          >
            <a.icon className="size-2.5" aria-hidden />
            {a.label}
          </span>
        ))}
      </div>
    )}
  </div>
);

export const SharePanel = () => (
  <div className="relative h-full">
    <FilesPanel dim />
    <div className="absolute inset-0 flex items-center justify-center bg-background/30 p-3">
      <div className="w-full max-w-[290px] rounded-xl border border-border bg-card p-3 shadow-soft-lg">
        <p className="text-[11px] font-semibold">Share q3-plan.pdf</p>
        <div className="mt-2 flex gap-1.5">
          <span className="flex h-6 flex-1 items-center rounded-md border border-border px-2 text-[9.5px] text-muted-foreground">
            sam@acme.co
          </span>
          <span className="flex h-6 items-center rounded-md border border-border px-2 text-[9.5px]">
            Editor
          </span>
        </div>
        <ul className="mt-2 space-y-1">
          {[
            { n: 'Riya Kapoor', r: 'Editor' },
            { n: 'Dev Mehta', r: 'Viewer' },
          ].map((p) => (
            <li key={p.n} className="flex items-center gap-1.5 text-[9.5px]">
              <span className="flex size-4 items-center justify-center rounded-full bg-vault-600/15 text-[8px] font-semibold text-vault-700 dark:text-vault-300">
                {p.n[0]}
              </span>
              {p.n}
              <span className="ml-auto text-muted-foreground">{p.r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2.5 border-t border-border pt-2">
          <p className="text-[9.5px] font-medium text-muted-foreground">
            Share links
          </p>
          <div className="mt-1.5 flex gap-1.5 text-[9.5px]">
            <span className="rounded-md border border-border px-2 py-1">
              Can view
            </span>
            <span className="rounded-md border border-border px-2 py-1">
              7 days
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 rounded-md bg-secondary/70 px-2 py-1.5 text-[9px]">
            <Link2 className="cvl-accent size-3 shrink-0" aria-hidden />
            <span className="cvl-mono truncate text-muted-foreground">
              /share/k8Qz…
            </span>
            <span className="cvl-signal-chip ml-auto shrink-0 rounded-full border px-1.5 text-[8.5px]">
              expires in 7d
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TRASHED = [
  { name: 'Contracts', from: 'My Files', when: '2 days ago', folder: true },
  { name: 'old-logo.svg', from: 'Brand', when: '5 days ago' },
  { name: 'notes-v1.txt', from: 'Clients / Acme', when: '1 week ago' },
];

export const TrashPanel = () => (
  <div className="flex h-full flex-col p-3">
    <div className="flex items-center justify-between">
      <p className="text-[11px] font-semibold">Trash</p>
      <span className="text-[9.5px] text-muted-foreground">
        Restores to the original folder
      </span>
    </div>
    <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
      {TRASHED.map((t, i) => (
        <li key={t.name} className="flex items-center gap-2 px-2.5 py-2">
          {t.folder ? (
            <Folder
              className="size-4 shrink-0 fill-vault-500/20 text-vault-600 dark:text-vault-300"
              aria-hidden
            />
          ) : (
            <FileText
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium">{t.name}</p>
            <p className="text-[8.5px] text-muted-foreground">
              from {t.from} · {t.when}
            </p>
          </div>
          <span
            className={cn(
              'ml-auto flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px]',
              i === 0
                ? 'border-vault-600/40 text-vault-700 dark:border-vault-400/40 dark:text-vault-300'
                : 'border-border text-muted-foreground'
            )}
          >
            <RotateCcw className="size-2.5" aria-hidden />
            Restore
          </span>
        </li>
      ))}
    </ul>
    <p className="mt-auto pt-2 text-[9px] text-muted-foreground">
      Restoring a folder brings back everything trashed with it.
    </p>
  </div>
);
