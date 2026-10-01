'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import AppShell, { type AppView } from './preview/AppShell';
import {
  DashboardPanel,
  FilesPanel,
  SharePanel,
  TrashPanel,
} from './preview/AppPanels';

const TABS: { key: AppView; label: string; caption: string }[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    caption: 'Usage against your quota, split by file type.',
  },
  {
    key: 'files',
    label: 'Files',
    caption: 'Nested folders, multi-select, bulk move and zip.',
  },
  {
    key: 'share',
    label: 'Share',
    caption: 'People or links, each scoped to view or edit.',
  },
  {
    key: 'trash',
    label: 'Trash',
    caption: 'Everything deleted lands here first.',
  },
];

const PANEL: Record<AppView, React.ReactNode> = {
  dashboard: <DashboardPanel />,
  files: <FilesPanel />,
  share: <SharePanel />,
  trash: <TrashPanel />,
};

const DEPTH = [
  { y: 0, s: 1, dim: 0 },
  { y: -14, s: 0.955, dim: 0.45 },
  { y: -28, s: 0.91, dim: 0.7 },
  { y: -42, s: 0.865, dim: 0.85 },
];

const INTERVAL = 5200;
const DESIGN_LG = { w: 900, h: 500 };
const DESIGN_SM = { w: 560, h: 430 };

const ProductPreviewStack = () => {
  const n = TABS.length;
  const [order, setOrder] = useState<number[]>(() => TABS.map((_, i) => i));
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const reduced = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(1120);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setStageW(entry.contentRect.width)
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const front = order[0];

  useEffect(() => {
    reduced.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced.current) setStopped(true);
  }, []);

  const bring = useCallback((k: number) => {
    setOrder((o) => (o[0] === k ? o : [k, ...o.filter((x) => x !== k)]));
  }, []);

  const pick = (k: number) => {
    setStopped(true);
    bring(k);
  };

  useEffect(() => {
    if (stopped || paused) return;
    const t = window.setTimeout(() => bring((front + 1) % n), INTERVAL);
    return () => window.clearTimeout(t);
  }, [front, stopped, paused, n, bring]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (front + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
    pick(next);
    tabRefs.current[next]?.focus();
  };

  const running = !stopped && !paused;
  const design = stageW < 640 ? DESIGN_SM : DESIGN_LG;
  const scale = Math.max(0.3, (stageW - 14) / design.w);

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div
          role="tablist"
          aria-label="CloudVault product views"
          onKeyDown={onKey}
          className="flex rounded-full border border-border bg-card/70 p-1 backdrop-blur"
        >
          {TABS.map((t, i) => {
            const active = front === i;
            return (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`cvl-tab-${t.key}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="cvl-preview-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => pick(i)}
                className={cn(
                  'relative h-8 overflow-hidden rounded-full px-3.5 text-[12.5px] font-medium transition-colors duration-300',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
                {active && !stopped && (
                  <span
                    key={`${front}-${order.join('')}`}
                    aria-hidden
                    className="cvl-progress absolute inset-x-3 bottom-1 h-px bg-background/50"
                    style={
                      {
                        '--dur': `${INTERVAL}ms`,
                        animationPlayState: running ? 'running' : 'paused',
                      } as React.CSSProperties
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
        <p
          aria-live="polite"
          className="cvl-mono text-center text-[11.5px] text-muted-foreground sm:text-right"
        >
          {TABS[front].caption}
        </p>
      </div>

      <div
        id="cvl-preview-panel"
        role="tabpanel"
        aria-labelledby={`cvl-tab-${TABS[front].key}`}
        ref={stageRef}
        className="relative grid"
        style={{ paddingTop: (n - 1) * 14 }}
      >
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
                'relative origin-top transition-transform duration-700 ease-spring will-change-transform [grid-area:1/1]',
                !isFront && 'cursor-pointer'
              )}
              style={{
                zIndex: 10 - d,
                transform: `translateY(${p.y}px) scale(${p.s})`,
              }}
            >
              <div
                className={cn(
                  'relative rounded-[18px] border border-border bg-card/80 p-1.5 backdrop-blur',
                  isFront
                    ? 'shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_30px_60px_-30px_rgba(10,13,12,0.35)]'
                    : 'shadow-soft'
                )}
              >
                <div
                  className="relative overflow-hidden rounded-[14px]"
                  style={{ height: design.h * scale }}
                >
                  <div
                    className="absolute left-0 top-0 origin-top-left"
                    style={{
                      width: design.w,
                      height: design.h,
                      transform: `scale(${scale})`,
                    }}
                  >
                    <AppShell view={t.key}>{PANEL[t.key]}</AppShell>
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 rounded-[18px] bg-background transition-opacity duration-700"
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
