'use client';

import { useEffect, useState } from 'react';
import { getFileActivity } from '@/lib/actions/file.actions';
import { ACTION_LABELS, describeActivityMeta } from '@/lib/activity';
import ShareAvatar from '@/components/ShareAvatar';
import { fileKindLabel, getFileKind } from '@/components/FileTypeIcon';
import {
  formatBytes,
  formatFullDate,
  formatRelative,
} from '@/components/FileFormat';
import { cn } from '@/lib/utils';
import { ActivityEntry, FileDocument } from '@/types';

type Tone = 'default' | 'dark';

const Row = ({
  label,
  children,
  tone,
}: {
  label: string;
  children: React.ReactNode;
  tone: Tone;
}) => (
  <div className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-3 py-1.5">
    <dt
      className={cn(
        'text-[12.5px]',
        tone === 'dark' ? 'text-ink-400' : 'text-muted-foreground'
      )}
    >
      {label}
    </dt>
    <dd
      className={cn(
        'fx-num min-w-0 break-words text-[13px]',
        tone === 'dark' ? 'text-ink-100' : 'text-foreground'
      )}
    >
      {children}
    </dd>
  </div>
);

export const PreviewMeta = ({
  file,
  tone = 'default',
}: {
  file: FileDocument;
  tone?: Tone;
}) => {
  const kind = getFileKind(
    file.extension,
    file.isFolder ? 'folder' : file.type
  );
  const ownerName = file.owner?.fullName as string | undefined;
  return (
    <dl>
      <Row label="Type" tone={tone}>
        {fileKindLabel(kind)}
        {!file.isFolder && file.extension && (
          <span
            className={
              tone === 'dark' ? 'text-ink-400' : 'text-muted-foreground'
            }
          >
            {' '}
            · .{file.extension}
          </span>
        )}
      </Row>
      {!file.isFolder && (
        <Row label="Size" tone={tone}>
          {formatBytes(file.size)}
          <span
            className={
              tone === 'dark' ? 'text-ink-400' : 'text-muted-foreground'
            }
          >
            {' '}
            · {file.size.toLocaleString()} bytes
          </span>
        </Row>
      )}
      <Row label="Owner" tone={tone}>
        <span className="flex min-w-0 items-center gap-2">
          <ShareAvatar name={ownerName} seed={file.owner?.email} size="xs" />
          <span className="truncate">{ownerName || 'Unknown'}</span>
        </span>
      </Row>
      <Row label="Modified" tone={tone}>
        {formatFullDate(file.$updatedAt)}
      </Row>
      <Row label="Created" tone={tone}>
        {formatFullDate(file.$createdAt)}
      </Row>
      {file.deletedAt && (
        <Row label="Deleted" tone={tone}>
          {formatFullDate(file.deletedAt)}
        </Row>
      )}
    </dl>
  );
};

export const PreviewActivity = ({
  fileId,
  tone = 'default',
}: {
  fileId: string;
  tone?: Tone;
}) => {
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null);
  const [error, setError] = useState(false);
  const muted = tone === 'dark' ? 'text-ink-400' : 'text-muted-foreground';

  useEffect(() => {
    let live = true;
    setEntries(null);
    setError(false);
    getFileActivity(fileId)
      .then((e) => live && setEntries(e))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [fileId]);

  if (error)
    return (
      <p className={cn('py-2 text-[13px]', muted)}>Couldn’t load activity.</p>
    );
  const bone =
    tone === 'dark'
      ? 'animate-pulse rounded bg-white/[0.08] motion-reduce:animate-none'
      : 'fx-skeleton';
  if (!entries)
    return (
      <ul className="space-y-3 py-1" aria-busy="true">
        {[70, 55, 62].map((w) => (
          <li key={w} className="flex gap-3">
            <span className={cn(bone, 'mt-0.5 size-5 !rounded-full')} />
            <span className="flex-1 space-y-1.5">
              <span
                className={cn(bone, 'block h-3')}
                style={{ width: `${w}%` }}
              />
              <span className={cn(bone, 'block h-2.5 w-1/3')} />
            </span>
          </li>
        ))}
      </ul>
    );
  if (entries.length === 0)
    return <p className={cn('py-2 text-[13px]', muted)}>No activity yet.</p>;

  return (
    <ol className="relative" data-testid="activity-list">
      {entries.map((e, i) => {
        const meta = describeActivityMeta(e);
        return (
          <li key={e.$id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < entries.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0 left-[9.5px] top-6 w-px',
                  tone === 'dark' ? 'bg-white/10' : 'bg-border'
                )}
              />
            )}
            <ShareAvatar name={e.actorName} size="xs" className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-[13px] leading-5',
                  tone === 'dark' ? 'text-ink-100' : 'text-foreground'
                )}
              >
                <span className="font-medium">{e.actorName}</span>{' '}
                <span className={muted}>
                  {(ACTION_LABELS[e.action] ?? e.action).toLowerCase()}
                </span>
              </p>
              {meta && (
                <p className={cn('truncate text-[12px] leading-4', muted)}>
                  {meta}
                </p>
              )}
              <time
                dateTime={e.at}
                title={formatFullDate(e.at)}
                className={cn('fx-num text-[11.5px] leading-4', muted)}
              >
                {formatRelative(e.at)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export const PreviewDetails = ({ file }: { file: FileDocument }) => (
  <div className="flex flex-col gap-6 p-5">
    <section>
      <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-400">
        Details
      </h3>
      <PreviewMeta file={file} tone="dark" />
    </section>
    <section>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-400">
        Activity
      </h3>
      <PreviewActivity fileId={file.$id} tone="dark" />
    </section>
  </div>
);
