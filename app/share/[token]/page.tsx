import Link from 'next/link';
import { Clock, Download, Eye, FileX2, Link2Off, Pencil } from 'lucide-react';
import { BrandWordmark } from '@/components/BrandMark';
import { FilePreviewBody } from '@/components/FilePreview';
import FileTypeIcon from '@/components/FileTypeIcon';
import ShareAvatar from '@/components/ShareAvatar';
import ShareRenameForm from '@/components/ShareRenameForm';
import {
  formatBytes,
  formatFullDate,
  formatShortDate,
} from '@/components/FileFormat';
import { isShareActive } from '@/lib/permissions';
import { fileContentUrl } from '@/lib/preview';
import { getFileDoc, getShareByToken } from '@/lib/server/files';

export const dynamic = 'force-dynamic';

const TopBar = ({ children }: { children?: React.ReactNode }) => (
  <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link
        href="/"
        className="fx-focus rounded-md"
        aria-label="CloudVault home"
      >
        <BrandWordmark />
      </Link>
      {children}
    </div>
  </header>
);

const Unavailable = ({
  message,
  detail,
  icon: Icon,
}: {
  message: string;
  detail: string;
  icon: typeof Clock;
}) => (
  <div className="flex min-h-screen flex-col bg-background">
    <TopBar />
    <main className="flex flex-1 items-start justify-center px-4 pt-[18vh]">
      <div className="w-full max-w-[400px]">
        <span
          aria-hidden="true"
          className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-card text-muted-foreground shadow-[0_1px_2px_rgba(10,13,12,0.08),0_6px_16px_-8px_rgba(10,13,12,0.25)] ring-1 ring-border"
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <h1
          className="font-display text-[20px] font-semibold tracking-[-0.012em] text-foreground"
          data-testid="share-unavailable"
        >
          {message}
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-6 text-muted-foreground">
          {detail}
        </p>
        <Link href="/" className="fx-btn fx-btn-secondary mt-6">
          Go to CloudVault
        </Link>
      </div>
    </main>
  </div>
);

const SharePage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  const share = await getShareByToken(token);

  if (!share || !share.token) {
    return (
      <Unavailable
        icon={Link2Off}
        message="This link is invalid or has been revoked."
        detail="Ask the person who shared it with you for a new link."
      />
    );
  }
  if (!isShareActive(share)) {
    return (
      <Unavailable
        icon={Clock}
        message="This link has expired."
        detail={`It stopped working ${share.expiresAt ? `on ${formatFullDate(share.expiresAt)}` : 'recently'}. Ask the owner to share it again.`}
      />
    );
  }

  const file = await getFileDoc(share.fileId).catch(() => null);
  if (!file || file.deletedAt || file.isFolder) {
    return (
      <Unavailable
        icon={FileX2}
        message="This file is no longer available."
        detail="It may have been moved to trash or deleted by its owner."
      />
    );
  }

  const canEdit = share.role === 'edit';
  const ownerName = (file.owner?.fullName as string) || 'Someone';
  const downloadHref = fileContentUrl(file.$id, { token, download: true });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar>
        <a
          href={downloadHref}
          download={file.name}
          className="fx-btn fx-btn-primary"
        >
          <Download aria-hidden="true" />
          Download
        </a>
      </TopBar>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex min-w-0 items-start gap-3.5">
          <FileTypeIcon
            type={file.type}
            extension={file.extension}
            size="md"
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <h1
              className="truncate font-display text-[20px] font-semibold leading-7 tracking-[-0.012em] text-foreground"
              data-testid="shared-file-name"
              title={file.name}
            >
              {file.name}
            </h1>
            <div className="fx-num mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShareAvatar
                  name={ownerName}
                  seed={file.owner?.email}
                  size="xs"
                />
                Shared by <span className="text-foreground">{ownerName}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatBytes(file.size)}</span>
              <span aria-hidden="true">·</span>
              <span title={formatFullDate(file.$updatedAt)}>
                Modified {formatShortDate(file.$updatedAt)}
              </span>
              <span
                className={
                  canEdit
                    ? 'inline-flex h-5 items-center gap-1 rounded-full bg-vault-600/10 px-2 text-[11.5px] font-medium text-vault-700 dark:bg-vault-400/15 dark:text-vault-300'
                    : 'inline-flex h-5 items-center gap-1 rounded-full bg-ink-100 px-2 text-[11.5px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                }
              >
                {canEdit ? (
                  <Pencil className="size-3" aria-hidden="true" />
                ) : (
                  <Eye className="size-3" aria-hidden="true" />
                )}
                {canEdit ? 'Can edit' : 'View only'}
              </span>
            </div>
          </div>
        </div>

        <div
          className={
            canEdit ? 'grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]' : ''
          }
        >
          <section
            aria-label="Preview"
            className="fx-surface flex min-h-[60vh] items-center justify-center bg-ink-50/70 p-4 dark:bg-ink-950/50 sm:p-8"
          >
            <FilePreviewBody file={file} token={token} />
          </section>
          {canEdit && (
            <aside className="fx-surface h-fit p-4">
              <ShareRenameForm
                fileId={file.$id}
                token={token}
                name={file.name}
                extension={file.extension}
              />
            </aside>
          )}
        </div>
        {share.expiresAt && (
          <p className="fx-num text-[12px] text-muted-foreground">
            This link expires {formatFullDate(share.expiresAt)}.
          </p>
        )}
      </main>
    </div>
  );
};

export default SharePage;
