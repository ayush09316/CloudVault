'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, RotateCw, X } from 'lucide-react';
import FileTypeIcon from '@/components/FileTypeIcon';
import FileTooltip, { FileTooltipProvider } from '@/components/FileTooltip';
import { formatBytes } from '@/components/FileFormat';
import { UploadItem, uploadStore, useUploads } from '@/components/UploadStore';
import { cn, getFileType } from '@/lib/utils';
import { MAX_FILE_SIZE } from '@/constants';

const Ring = ({ value }: { value: number }) => {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 24 24" className="size-6 -rotate-90" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        strokeWidth="2.25"
        className="stroke-ink-200 dark:stroke-ink-700"
      />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        className="stroke-vault-600 transition-[stroke-dashoffset] duration-150 ease-linear dark:stroke-vault-400"
      />
    </svg>
  );
};

const DoneCheck = () => (
  <span className="fx-check inline-flex size-6 items-center justify-center rounded-full bg-vault-600 text-white dark:bg-vault-400 dark:text-ink-950">
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8.5l2.5 2.5L12 5.5" />
    </svg>
  </span>
);

const statusText = (i: UploadItem) => {
  switch (i.status) {
    case 'queued':
      return 'Waiting…';
    case 'uploading':
      return `${formatBytes(i.file.size * i.progress)} of ${formatBytes(i.file.size)}`;
    case 'done':
      return formatBytes(i.file.size);
    case 'cancelled':
      return 'Cancelled';
    case 'error':
      return i.error || 'Upload failed';
  }
};

const Row = ({ item }: { item: UploadItem }) => {
  const { extension, type } = getFileType(item.file.name);
  const active = item.status === 'uploading' || item.status === 'queued';

  return (
    <li
      className="group relative flex items-center gap-3 px-4 py-2.5"
      data-status={item.status}
    >
      <FileTypeIcon type={type} extension={extension} size="sm" />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-[13px] leading-5',
            item.status === 'cancelled'
              ? 'text-muted-foreground line-through decoration-ink-300'
              : 'text-foreground'
          )}
          title={item.file.name}
        >
          {item.file.name}
        </p>
        <p
          className={cn(
            'fx-num truncate text-[11.5px] leading-4',
            item.status === 'error'
              ? 'text-signal-rose'
              : 'text-muted-foreground'
          )}
        >
          {statusText(item)}
        </p>
      </div>
      <div className="relative flex size-8 shrink-0 items-center justify-center">
        {item.status === 'done' && <DoneCheck />}
        {item.status === 'error' && item.file.size <= MAX_FILE_SIZE && (
          <FileTooltip label="Retry">
            <button
              type="button"
              aria-label={`Retry ${item.file.name}`}
              className="fx-icon-btn"
              onClick={() => uploadStore.retry(item.id)}
            >
              <RotateCw />
            </button>
          </FileTooltip>
        )}
        {(item.status === 'cancelled' ||
          (item.status === 'error' && item.file.size > MAX_FILE_SIZE)) && (
          <FileTooltip label="Dismiss">
            <button
              type="button"
              aria-label={`Dismiss ${item.file.name}`}
              className="fx-icon-btn"
              onClick={() => uploadStore.dismiss(item.id)}
            >
              <X />
            </button>
          </FileTooltip>
        )}
        {active && (
          <>
            <span className="transition-opacity duration-150 group-focus-within:opacity-0 group-hover:opacity-0">
              {item.status === 'queued' ? (
                <span
                  className="block size-6 rounded-full border-[2.25px] border-dashed border-ink-200 dark:border-ink-700"
                  aria-hidden="true"
                />
              ) : (
                <Ring value={item.progress} />
              )}
            </span>
            <FileTooltip label="Cancel upload">
              <button
                type="button"
                aria-label={`Cancel upload of ${item.file.name}`}
                className="fx-icon-btn absolute inset-0 m-auto opacity-0 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                onClick={() => uploadStore.cancel(item.id)}
              >
                <X />
              </button>
            </FileTooltip>
          </>
        )}
      </div>
      {item.status === 'uploading' && (
        <span
          aria-hidden="true"
          className="absolute inset-x-4 bottom-0 h-px overflow-hidden bg-transparent"
        >
          <span
            className="block h-full bg-vault-600/70 transition-[width] duration-150 ease-linear dark:bg-vault-400/70"
            style={{ width: `${Math.round(item.progress * 100)}%` }}
          />
        </span>
      )}
    </li>
  );
};

const UploadTray = () => {
  const { items, collapsed, open } = useUploads();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dismissTimer = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const active = items.filter(
    (i) => i.status === 'uploading' || i.status === 'queued'
  );
  const done = items.filter((i) => i.status === 'done');
  const errors = items.filter((i) => i.status === 'error');
  const settled = active.length === 0;

  useEffect(() => {
    if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
    if (open && settled && errors.length === 0 && done.length > 0 && !hovered) {
      dismissTimer.current = window.setTimeout(() => uploadStore.close(), 6000);
    }
    return () => {
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
    };
  }, [open, settled, errors.length, done.length, hovered]);

  if (!mounted || !open || items.length === 0) return null;

  const totalBytes = active.reduce((s, i) => s + i.file.size, 0);
  const sentBytes = active.reduce((s, i) => s + i.file.size * i.progress, 0);
  const overall = totalBytes ? sentBytes / totalBytes : 1;

  const title = !settled
    ? `Uploading ${active.length} ${active.length === 1 ? 'item' : 'items'}`
    : errors.length
      ? `${errors.length} ${errors.length === 1 ? 'upload' : 'uploads'} failed`
      : `${done.length} ${done.length === 1 ? 'upload' : 'uploads'} complete`;

  return createPortal(
    <FileTooltipProvider>
      <section
        aria-label="Uploads"
        data-testid="upload-tray"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fx-rise-in fixed bottom-4 right-4 z-[65] flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(10,13,12,0.06),0_20px_48px_-16px_rgba(10,13,12,0.35)] sm:bottom-6 sm:right-6"
      >
        <header className="relative flex h-12 items-center gap-2 pl-4 pr-2">
          <h2
            className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-foreground"
            aria-live="polite"
          >
            {title}
          </h2>
          {!settled && (
            <FileTooltip label="Cancel all">
              <button
                type="button"
                className="fx-btn fx-btn-ghost fx-btn-sm"
                onClick={() => uploadStore.cancelAll()}
              >
                Cancel
              </button>
            </FileTooltip>
          )}
          <FileTooltip label={collapsed ? 'Expand' : 'Collapse'}>
            <button
              type="button"
              aria-label={collapsed ? 'Expand uploads' : 'Collapse uploads'}
              aria-expanded={!collapsed}
              className="fx-icon-btn"
              onClick={() => uploadStore.setCollapsed(!collapsed)}
            >
              <ChevronDown
                className={cn(
                  'transition-transform duration-200',
                  collapsed && 'rotate-180'
                )}
              />
            </button>
          </FileTooltip>
          {settled && (
            <FileTooltip label="Close">
              <button
                type="button"
                aria-label="Close uploads"
                className="fx-icon-btn"
                onClick={() => uploadStore.close()}
              >
                <X />
              </button>
            </FileTooltip>
          )}
          {!settled && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-100 dark:bg-ink-800"
            >
              <span
                className="block h-full bg-vault-600 transition-[width] duration-150 ease-linear dark:bg-vault-400"
                style={{ width: `${Math.max(3, Math.round(overall * 100))}%` }}
              />
            </span>
          )}
        </header>
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
            collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <ul className="max-h-[min(320px,50vh)] divide-y divide-border overflow-y-auto border-t border-border">
              {items.map((item) => (
                <Row key={item.id} item={item} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </FileTooltipProvider>,
    document.body
  );
};

export default UploadTray;
