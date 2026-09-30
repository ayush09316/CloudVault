'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  Folder,
  Link2,
  Trash2,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PanelKey = 'dashboard' | 'files' | 'share';

const TABS: { key: PanelKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'files', label: 'Files' },
  { key: 'share', label: 'Share' },
];

const DEPTH = [
  { y: 0, s: 1, dim: 0 },
  { y: -16, s: 0.94, dim: 0.35 },
  { y: -32, s: 0.88, dim: 0.65 },
];

const Chrome = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background">
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-border bg-secondary/60 px-3">
      <span className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
      </span>
      <span className="mx-auto flex h-5 max-w-48 flex-1 items-center justify-center truncate rounded-md bg-muted px-2 font-mono text-[10px] text-muted-foreground">
        {path}
      </span>
    </div>
    <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
  </div>
);

const DashboardPanel = () => (
  <div className="flex h-full flex-col gap-3 p-4">
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-[10px] uppercase tracking-wide text-vault-600 dark:text-vault-300">
          Storage
        </p>
        <p className="mt-1 text-lg font-bold">43%</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-[43%] rounded-full bg-vault-600 dark:bg-vault-400" />
        </div>
      </div>
      <div className="col-span-2 rounded-xl border border-border bg-card p-3">
        <p className="text-[10px] uppercase tracking-wide text-vault-600 dark:text-vault-300">
          By category
        </p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[FileText, ImageIcon, Video, FileIcon].map((Icon, i) => (
            <div key={i} className="rounded-lg border border-border p-1.5">
              <Icon className="size-3.5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="flex-1 rounded-xl border border-border bg-card p-3">
      <p className="mb-2 text-[10px] uppercase tracking-wide text-vault-600 dark:text-vault-300">
        Recent activity
      </p>
      <div className="space-y-2">
        {[
          'Priya shared Q3-roadmap.pdf',
          'You uploaded hero-shot.png',
          'Amit restored contract.docx',
        ].map((t) => (
          <div
            key={t}
            className="flex items-center gap-2 text-[11px] text-muted-foreground"
          >
            <History className="size-3 shrink-0 text-vault-600 dark:text-vault-300" />
            <span className="line-clamp-1">{t}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FilesPanel = () => (
  <div className="flex h-full flex-col gap-2 p-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold">My Files</span>
      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
        Grid
      </span>
    </div>
    <div className="grid flex-1 grid-cols-3 gap-2">
      {[
        { icon: Folder, name: 'Contracts', color: 'text-vault-500' },
        { icon: FileText, name: 'Q3-roadmap.pdf', color: 'text-signal-rose' },
        { icon: ImageIcon, name: 'hero-shot.png', color: 'text-blue' },
        { icon: Video, name: 'demo.mp4', color: 'text-orange' },
        { icon: FileIcon, name: 'invoice.docx', color: 'text-pink' },
        { icon: Trash2, name: 'old-draft.txt', color: 'text-muted-foreground' },
      ].map((f) => (
        <div
          key={f.name}
          className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2"
        >
          <f.icon className={cn('size-4', f.color)} />
          <span className="line-clamp-1 text-[10px] text-muted-foreground">
            {f.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SharePanel = () => (
  <div className="flex h-full flex-col gap-3 p-4">
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center gap-2">
        <Link2 className="size-3.5 text-vault-600 dark:text-vault-300" />
        <span className="text-xs font-semibold">
          Share &ldquo;Q3-roadmap.pdf&rdquo;
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          { name: 'Priya Nair', role: 'Can edit' },
          { name: 'Amit Shah', role: 'Can view' },
        ].map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-lg bg-background px-2 py-1.5 text-[11px]"
          >
            <span className="flex items-center gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-vault-600/15 text-[9px] font-semibold text-vault-700 dark:text-vault-300">
                {p.name[0]}
              </span>
              {p.name}
            </span>
            <span className="text-muted-foreground">{p.role}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="rounded-xl border border-dashed border-border bg-card p-3">
      <p className="text-[11px] text-muted-foreground">Anyone with the link</p>
      <div className="mt-2 flex items-center justify-between rounded-lg bg-background px-2 py-1.5 text-[10px] text-muted-foreground">
        <span>cloudvault.app/share/8fk2…</span>
        <span className="rounded-full bg-vault-600/10 px-2 py-0.5 text-vault-700 dark:text-vault-300">
          Expires in 7d
        </span>
      </div>
    </div>
  </div>
);

const PANEL_CONTENT: Record<PanelKey, React.ReactNode> = {
  dashboard: <DashboardPanel />,
  files: <FilesPanel />,
  share: <SharePanel />,
};

const PANEL_PATH: Record<PanelKey, string> = {
  dashboard: 'cloudvault.app/dashboard',
  files: 'cloudvault.app/files',
  share: 'cloudvault.app/share/8fk2…',
};

const ProductPreviewStack = () => {
  const n = TABS.length;
  const [order, setOrder] = useState<number[]>(() => TABS.map((_, i) => i));
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const front = order[0];

  const bring = useCallback((k: number) => {
    setOrder((o) =>
      o[0] === k ? o : [k, ...o.filter((x) => x !== k && x !== o[0]), o[0]]
    );
  }, []);

  const pick = (k: number) => {
    setStopped(true);
    bring(k);
  };

  const reducedRef = useRef(false);
  useEffect(() => {
    reducedRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  useEffect(() => {
    if (stopped || paused || reducedRef.current) return;
    const t = setTimeout(() => bring((front + 1) % n), 4200);
    return () => clearTimeout(t);
  }, [front, stopped, paused, n, bring]);

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="mb-4 flex justify-center">
        <div
          role="tablist"
          aria-label="CloudVault product previews"
          className="relative grid rounded-full border border-border bg-card/80 p-1 backdrop-blur"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(4.5rem, 1fr))` }}
        >
          <span
            aria-hidden
            className="absolute inset-y-1 left-1 rounded-full bg-vault-600 transition-transform duration-500 ease-spring dark:bg-vault-400"
            style={{
              width: `calc((100% - 0.5rem) / ${n})`,
              transform: `translateX(${order.indexOf(0) === 0 ? front * 100 : front * 100}%)`,
            }}
          />
          {TABS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={front === i}
              onClick={() => pick(i)}
              className={cn(
                'relative z-10 h-8 rounded-full px-3 text-xs font-medium transition-colors',
                front === i
                  ? 'text-white dark:text-ink-950'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -bottom-10 top-8 -z-10 rounded-[40px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(14,122,110,0.25),rgba(217,143,43,0.18),rgba(112,216,185,0.2),rgba(14,122,110,0.25))] opacity-60 blur-3xl"
      />

      <div className="relative grid" style={{ paddingTop: (n - 1) * 16 }}>
        {TABS.map((t, i) => {
          const d = order.indexOf(i);
          const p = DEPTH[Math.min(d, DEPTH.length - 1)];
          const isFront = d === 0;
          return (
            <div
              key={t.key}
              aria-hidden={!isFront}
              onClick={isFront ? undefined : () => pick(i)}
              className={cn(
                'relative [grid-area:1/1] origin-top transition-[transform,opacity] duration-500 ease-spring will-change-transform',
                !isFront && 'cursor-pointer'
              )}
              style={{
                zIndex: 10 - d,
                transform: `translateY(${p.y}px) scale(${p.s})`,
              }}
            >
              <div
                className={cn(
                  'relative aspect-[4/3] rounded-[22px] bg-background p-1.5 sm:aspect-[16/10]',
                  isFront
                    ? 'shadow-soft-lg ring-1 ring-border'
                    : 'shadow-soft ring-1 ring-border'
                )}
              >
                <Chrome path={PANEL_PATH[t.key]}>{PANEL_CONTENT[t.key]}</Chrome>
                <div
                  className="pointer-events-none absolute inset-0 rounded-[22px] bg-background transition-opacity duration-500"
                  style={{ opacity: p.dim }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPreviewStack;
