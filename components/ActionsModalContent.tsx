'use client';

import Thumbnail from '@/components/Thumbnail';
import FormattedDateTime from '@/components/FormattedDateTime';
import {
  cn,
  convertFileSize,
  formatDateTime,
  getThumbnailSrc,
} from '@/lib/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { getFileActivity } from '@/lib/actions/file.actions';
import {
  addShareGrantees,
  createShareLink,
  getFileShares,
  revokeShare,
} from '@/lib/actions/share.actions';
import { useToast } from '@/hooks/use-toast';
import { ActivityEntry, FileDocument, ShareDocument } from '@/types';

const ImageThumbnail = ({ file }: { file: FileDocument }) => (
  <div className="file-details-thumbnail">
    <Thumbnail
      type={file.isFolder ? 'folder' : file.type}
      extension={file.extension}
      url={getThumbnailSrc(file)}
    />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

const ACTION_LABELS: Record<string, string> = {
  uploaded: 'Uploaded',
  created_folder: 'Created folder',
  renamed: 'Renamed',
  moved: 'Moved',
  trashed: 'Moved to trash',
  restored: 'Restored',
  deleted_permanently: 'Deleted permanently',
  shared: 'Shared',
  shared_link: 'Created share link',
  unshared: 'Revoked access',
};

const describeMeta = (entry: ActivityEntry) => {
  const m = entry.meta ?? {};
  switch (entry.action) {
    case 'renamed':
      return `${m.from} → ${m.to}`;
    case 'shared':
      return `${m.granteeEmail} (${m.role})`;
    case 'shared_link':
      return `${m.role} link${m.expiresAt ? `, expires ${formatDateTime(m.expiresAt as string)}` : ''}`;
    case 'unshared':
      return m.link ? 'share link' : String(m.granteeEmail ?? '');
    default:
      return '';
  }
};

const ActivityList = ({ fileId }: { fileId: string }) => {
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getFileActivity(fileId)
      .then(setEntries)
      .catch(() => setError(true));
  }, [fileId]);

  if (error) return <p className="body-2">Could not load activity.</p>;
  if (!entries) return <p className="body-2">Loading…</p>;
  if (entries.length === 0) return <p className="body-2">No activity yet.</p>;

  return (
    <ul
      className="max-h-72 space-y-3 overflow-y-auto px-2 pt-2 text-left"
      data-testid="activity-list"
    >
      {entries.map((e) => (
        <li key={e.$id} className="flex flex-col">
          <p className="subtitle-2">
            {ACTION_LABELS[e.action] ?? e.action}
            <span className="body-2 text-light-200"> · {e.actorName}</span>
          </p>
          {describeMeta(e) && (
            <p className="caption text-light-100">{describeMeta(e)}</p>
          )}
          <p className="caption text-light-200">{formatDateTime(e.at)}</p>
        </li>
      ))}
    </ul>
  );
};

export const FileDetails = ({ file }: { file: FileDocument }) => {
  const [tab, setTab] = useState<'details' | 'activity'>('details');

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="flex gap-2 px-2">
        {(['details', 'activity'] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tab === t ? 'default' : 'outline'}
            className={cn('capitalize', tab === t && 'bg-brand')}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      {tab === 'details' ? (
        <div className="space-y-4 px-2 pt-2">
          <DetailRow
            label="Format:"
            value={file.isFolder ? 'Folder' : file.extension}
          />
          {!file.isFolder && (
            <DetailRow label="Size:" value={convertFileSize(file.size)} />
          )}
          <DetailRow label="Owner:" value={file.owner?.fullName} />
          <DetailRow
            label="Last edit:"
            value={formatDateTime(file.$updatedAt)}
          />
        </div>
      ) : (
        <ActivityList fileId={file.$id} />
      )}
    </>
  );
};

const EXPIRY_OPTIONS = [
  { label: 'Never expires', value: '0' },
  { label: '1 day', value: '1' },
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
];

export const ShareInput = ({ file }: { file: FileDocument }) => {
  const path = usePathname();
  const { toast } = useToast();
  const [shares, setShares] = useState<ShareDocument[]>([]);
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<'view' | 'edit'>('view');
  const [linkRole, setLinkRole] = useState<'view' | 'edit'>('view');
  const [expiry, setExpiry] = useState('0');
  const [busy, setBusy] = useState(false);

  const fail = (description: string) =>
    toast({ description, className: 'error-toast' });

  const refresh = useCallback(async () => {
    try {
      setShares(await getFileShares(file.$id));
    } catch {
      fail('Could not load sharing settings.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.$id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const run = async (fn: () => Promise<unknown>, failure: string) => {
    setBusy(true);
    try {
      await fn();
      await refresh();
    } catch {
      fail(failure);
    } finally {
      setBusy(false);
    }
  };

  const linkFor = (token: string) => `${window.location.origin}/share/${token}`;

  const grants = shares.filter((s) => s.granteeEmail);
  const links = shares.filter((s) => s.token);

  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email addresses, comma separated"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="share-input-field"
          />
          <Select
            value={role}
            onValueChange={(v) => setRole(v as 'view' | 'edit')}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">Viewer</SelectItem>
              <SelectItem value="edit">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="modal-submit-button mt-2 w-full"
          disabled={busy || !emails.trim()}
          onClick={() =>
            run(async () => {
              await addShareGrantees({
                fileId: file.$id,
                emails: emails.split(','),
                role,
                path,
              });
              setEmails('');
            }, 'Failed to share file.')
          }
        >
          Share
        </Button>

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">{grants.length} users</p>
          </div>

          <ul className="pt-2">
            {grants.map((s) => (
              <li
                key={s.$id}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">
                  {s.granteeEmail}{' '}
                  <span className="caption text-light-200">({s.role})</span>
                </p>
                <Button
                  onClick={() =>
                    run(
                      () => revokeShare({ shareId: s.$id, path }),
                      'Failed to remove user.'
                    )
                  }
                  className="share-remove-user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <p className="subtitle-2 text-light-100">Share links</p>
          <div className="flex gap-2 pt-2">
            <Select
              value={linkRole}
              onValueChange={(v) => setLinkRole(v as 'view' | 'edit')}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">Can view</SelectItem>
                <SelectItem value="edit">Can edit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={expiry} onValueChange={setExpiry}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPIRY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              disabled={busy}
              data-testid="create-share-link"
              onClick={() =>
                run(
                  () =>
                    createShareLink({
                      fileId: file.$id,
                      role: linkRole,
                      expiresInDays: Number(expiry) || null,
                      path,
                    }),
                  'Failed to create link.'
                )
              }
            >
              Create link
            </Button>
          </div>

          <ul className="space-y-2 pt-2">
            {links.map((s) => (
              <li key={s.$id} className="flex items-center gap-2">
                <Input
                  readOnly
                  value={linkFor(s.token!)}
                  data-testid="share-link-url"
                  className="share-input-field text-xs"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <span className="caption whitespace-nowrap text-light-200">
                  {s.role}
                  {s.expiresAt ? ` · until ${formatDateTime(s.expiresAt)}` : ''}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard?.writeText(linkFor(s.token!))
                  }
                >
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    run(
                      () => revokeShare({ shareId: s.$id, path }),
                      'Failed to revoke link.'
                    )
                  }
                >
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
