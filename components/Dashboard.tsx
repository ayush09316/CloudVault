'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FolderOpen, History } from 'lucide-react';
import {
  cn,
  convertFileSize,
  getFileIcon,
  getThumbnailSrc,
  calculatePercentage,
} from '@/lib/utils';
import ActionDropdown from './ActionDropdown';
import FilePreview from './FilePreview';
import EmptyState from './EmptyState';
import AnimatedCounter from './AnimatedCounter';
import DashboardQuickActions from './DashboardQuickActions';
import { SEGMENT_COLOR, SegmentedBar, formatPct } from './ShellStorageMeter';
import { initials } from './ShellConstants';
import { ACTION_LABELS, describeActivityMeta } from '@/lib/activity';
import { ActivityEntry, FileDocument } from '@/types';

const relativeTime = (iso: string) => {
  const then = new Date(iso).getTime();
  const diff = (Date.now() - then) / 1000;
  const rtf = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: 'short',
  });
  if (diff < 45) return 'just now';
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute');
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour');
  if (diff < 86400 * 7) return rtf.format(-Math.round(diff / 86400), 'day');
  return new Date(iso).toLocaleDateString('en', {
    month: 'short',
    day: 'numeric',
  });
};

const AVATAR_TINTS = [
  'bg-vault-600/10 text-vault-700 dark:bg-vault-400/15 dark:text-vault-200',
  'bg-blue/10 text-[#2A6DA8] dark:bg-blue/15 dark:text-[#9CC6EE]',
  'bg-signal-amber/10 text-[#9A621A] dark:bg-signal-amber/15 dark:text-[#F0C589]',
  'bg-ink-900/[0.06] text-ink-700 dark:bg-white/[0.08] dark:text-ink-200',
];

const tintFor = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_TINTS[Math.abs(h) % AVATAR_TINTS.length];
};

const splitSize = (bytes: number) => {
  const [num, unit] = convertFileSize(bytes).split(' ');
  const value = Number(num) || 0;
  return { value, unit, decimals: unit === 'Bytes' ? 0 : 1 };
};

interface DashboardProps {
  files: { documents: FileDocument[] };
  totalSpace: { used: number; all: number };
  usageSummary: {
    title: string;
    size: number;
    latestDate: string;
    url: string;
    icon: string;
  }[];
  activity: ActivityEntry[];
}

const PanelHeading = ({
  id,
  icon: Icon,
  children,
  action,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
    <h2
      id={id}
      className="flex items-center gap-2 text-body-sm font-semibold text-ink-900 dark:text-ink-50"
    >
      <Icon className="size-4 text-ink-400" aria-hidden={true} />
      {children}
    </h2>
    {action}
  </div>
);

const RecentFileTile = ({
  file,
  onOpen,
  index,
}: {
  file: FileDocument;
  onOpen: (f: FileDocument) => void;
  index: number;
}) => {
  const src = getThumbnailSrc(file);
  const isImage = !!src;
  const meta = [
    file.extension?.toUpperCase(),
    file.size ? convertFileSize(file.size) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <li
      className="shell-rise group relative"
      style={{ ['--i' as string]: index }}
    >
      <button
        type="button"
        onClick={() => onOpen(file)}
        className="shell-focus flex w-full flex-col overflow-hidden rounded-[10px] border border-border bg-background text-left transition-[border-color,box-shadow] duration-200 hover:border-ink-300 hover:shadow-soft dark:hover:border-ink-700"
      >
        <span className="relative block aspect-[4/3] w-full overflow-hidden border-b border-border bg-ink-50 dark:bg-ink-900">
          {isImage ? (
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1280px) 220px, (min-width: 640px) 30vw, 45vw"
              unoptimized={src.startsWith('/api/')}
              className="object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.03]"
            />
          ) : (
            <span className="flex size-full items-center justify-center">
              <Image
                src={getFileIcon(file.extension, file.type)}
                alt=""
                width={40}
                height={40}
                className="size-10 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5"
              />
            </span>
          )}
        </span>
        <span className="flex flex-col gap-0.5 px-3 py-2.5">
          <span
            className="truncate text-body-sm font-medium text-ink-900 dark:text-ink-50"
            title={file.name}
          >
            {file.name}
          </span>
          <span className="flex items-center justify-between gap-2 text-caption tabular-nums text-ink-500 dark:text-ink-400">
            <span className="truncate">{meta}</span>
            <time
              dateTime={file.$createdAt}
              title={new Date(file.$createdAt).toLocaleString()}
              suppressHydrationWarning
              className="shrink-0"
            >
              {relativeTime(file.$createdAt)}
            </time>
          </span>
        </span>
      </button>
      <div className="absolute right-1.5 top-1.5 rounded-md bg-background/90 opacity-100 shadow-soft backdrop-blur-sm transition-opacity duration-150 focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0 [&_img]:size-5">
        <ActionDropdown file={file} />
      </div>
    </li>
  );
};

const DashboardContent = ({
  files,
  totalSpace,
  usageSummary,
  activity,
}: DashboardProps) => {
  const [previewFile, setPreviewFile] = useState<FileDocument | null>(null);
  const percentage =
    Number(calculatePercentage(totalSpace.used, totalSpace.all)) || 0;
  const used = splitSize(totalSpace.used);
  const free = Math.max(totalSpace.all - totalSpace.used, 0);
  const near = percentage >= 85;
  const recent = files.documents ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <header className="shell-rise flex flex-col gap-1">
        <h1 className="font-display text-h2 tracking-[-0.02em] text-ink-900 dark:text-ink-50">
          Overview
        </h1>
        <p className="text-body-sm text-ink-500 dark:text-ink-400">
          {recent.length > 0
            ? `${convertFileSize(totalSpace.used)} stored across your vault`
            : 'Your vault is empty — upload something to get started.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section
          aria-labelledby="storage-title"
          className="shell-panel shell-grain shell-rise overflow-hidden lg:col-span-8"
          style={{ ['--i' as string]: 1 }}
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <h2
                id="storage-title"
                className="text-caption font-medium text-ink-500 dark:text-ink-400"
              >
                Storage
              </h2>
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums',
                  near
                    ? 'border-signal-amber/30 bg-signal-amber/10 text-[#9A621A] dark:text-[#F0C589]'
                    : 'border-border text-ink-500 dark:text-ink-400'
                )}
              >
                {convertFileSize(free)} free
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-ink-900 dark:text-ink-50">
                <AnimatedCounter value={used.value} decimals={used.decimals} />
                <span className="ml-1 text-h4 font-medium tracking-normal text-ink-400">
                  {used.unit}
                </span>
              </p>
              <p className="text-body-sm tabular-nums text-ink-500 dark:text-ink-400">
                of {convertFileSize(totalSpace.all)} ·{' '}
                <span className="font-medium text-ink-800 dark:text-ink-100">
                  {percentage > 0 && percentage < 1 ? (
                    '<1%'
                  ) : (
                    <AnimatedCounter value={percentage} suffix="%" />
                  )}
                </span>{' '}
                used
              </p>
            </div>

            <SegmentedBar
              segments={usageSummary}
              total={totalSpace.all}
              className="mt-5 h-2"
              label={`${formatPct(percentage)}% of storage used`}
            />
          </div>

          <ul className="grid grid-cols-2 border-t border-border sm:grid-cols-4">
            {usageSummary.map((s, i) => {
              const share = totalSpace.used
                ? (s.size / totalSpace.used) * 100
                : 0;
              return (
                <li
                  key={s.title}
                  className={cn(
                    'border-border',
                    i % 2 === 1 && 'border-l',
                    i >= 2 && 'border-t sm:border-t-0',
                    i === 2 && 'sm:border-l'
                  )}
                >
                  <Link
                    href={s.url}
                    className="shell-focus group flex h-full flex-col gap-1 px-5 py-4 transition-colors hover:bg-ink-900/[0.025] dark:hover:bg-white/[0.03]"
                  >
                    <span className="flex items-center gap-2 text-caption text-ink-500 dark:text-ink-400">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-[3px]"
                        style={{ background: SEGMENT_COLOR[s.title] }}
                      />
                      {s.title}
                      <ArrowRight
                        className="ml-auto size-3 -translate-x-1 text-ink-400 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-body font-semibold tabular-nums text-ink-900 dark:text-ink-50">
                      {s.size ? convertFileSize(s.size) : '—'}
                    </span>
                    <span className="text-[11px] tabular-nums text-ink-400 dark:text-ink-500">
                      {s.size ? `${formatPct(share)}% of used` : 'Nothing yet'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <DashboardQuickActions className="shell-rise lg:col-span-4" />

        <section
          aria-labelledby="recent-title"
          className="shell-panel shell-rise lg:col-span-8"
          style={{ ['--i' as string]: 2 }}
        >
          <PanelHeading
            id="recent-title"
            icon={FolderOpen}
            action={
              <Link
                href="/files"
                className="shell-focus group flex items-center gap-1 rounded text-caption font-medium text-ink-500 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50"
              >
                View all
                <ArrowRight
                  className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            }
          >
            Recent files
          </PanelHeading>
          <div className="px-5 pb-5">
            {recent.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {recent.map((file, i) => (
                  <RecentFileTile
                    key={file.$id}
                    file={file}
                    index={i}
                    onOpen={setPreviewFile}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={FolderOpen}
                title="No files uploaded yet"
                description="Upload your first file to see it here."
                className="py-10"
              />
            )}
          </div>
        </section>

        <section
          aria-labelledby="activity-title"
          className="shell-panel shell-rise lg:col-span-4"
          style={{ ['--i' as string]: 3 }}
        >
          <PanelHeading id="activity-title" icon={History}>
            Activity
          </PanelHeading>
          {activity.length > 0 ? (
            <ol className="relative px-5 pb-5">
              <span
                aria-hidden="true"
                className="absolute bottom-8 left-[34px] top-3 w-px bg-border"
              />
              {activity.map((entry, i) => {
                const meta = describeActivityMeta(entry);
                return (
                  <li
                    key={entry.$id}
                    className="shell-rise relative flex gap-3 py-2"
                    style={{ ['--i' as string]: i + 4 }}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold ring-4 ring-card',
                        tintFor(entry.actorId || entry.actorName)
                      )}
                    >
                      {initials(entry.actorName)}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="min-w-0 text-body-sm leading-snug text-ink-600 dark:text-ink-300">
                          <span className="font-medium text-ink-900 dark:text-ink-50">
                            {entry.actorName}
                          </span>{' '}
                          {(
                            ACTION_LABELS[entry.action] ?? entry.action
                          ).toLowerCase()}
                        </p>
                        <time
                          dateTime={entry.at}
                          title={new Date(entry.at).toLocaleString()}
                          suppressHydrationWarning
                          className="shrink-0 text-[11px] tabular-nums text-ink-400 dark:text-ink-500"
                        >
                          {relativeTime(entry.at)}
                        </time>
                      </div>
                      {entry.fileName && (
                        <p
                          className="truncate text-body-sm font-medium text-ink-800 dark:text-ink-100"
                          title={entry.fileName}
                        >
                          {entry.fileName}
                        </p>
                      )}
                      {meta && (
                        <p
                          className="truncate text-caption text-ink-500 dark:text-ink-400"
                          title={meta}
                        >
                          {meta}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="px-5 pb-6 text-body-sm text-ink-500 dark:text-ink-400">
              Uploads, shares and moves will show up here.
            </p>
          )}
        </section>
      </div>

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default DashboardContent;
