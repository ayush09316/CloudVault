import Image from 'next/image';
import { FilePreviewBody } from '@/components/FilePreview';
import ShareRenameForm from '@/components/ShareRenameForm';
import { isShareActive } from '@/lib/permissions';
import { getFileDoc, getShareByToken } from '@/lib/server/files';
import { convertFileSize } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const ShareLogo = () => (
  <div className="flex items-center gap-2">
    <Image src="/assets/icons/logo-brand.svg" alt="" width={36} height={36} />
    <span className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">
      CloudVault
    </span>
  </div>
);

const Unavailable = ({ message }: { message: string }) => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6">
    <ShareLogo />
    <p
      className="h4 text-light-100 dark:text-ink-200"
      data-testid="share-unavailable"
    >
      {message}
    </p>
  </main>
);

const SharePage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  const share = await getShareByToken(token);

  if (!share || !share.token) {
    return <Unavailable message="This link is invalid or has been revoked." />;
  }
  if (!isShareActive(share)) {
    return <Unavailable message="This link has expired." />;
  }

  const file = await getFileDoc(share.fileId).catch(() => null);
  if (!file || file.deletedAt || file.isFolder) {
    return <Unavailable message="This file is no longer available." />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-background p-6">
      <ShareLogo />
      <section className="flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft dark:bg-ink-900">
        <div className="flex flex-col gap-1 text-center">
          <h1
            className="h3 text-light-100 dark:text-ink-200"
            data-testid="shared-file-name"
          >
            {file.name}
          </h1>
          <p className="body-2 text-light-200 dark:text-ink-400">
            {convertFileSize(file.size)} · shared by {file.owner?.fullName} ·{' '}
            {share.role === 'edit' ? 'can edit' : 'view only'}
          </p>
        </div>
        {share.role === 'edit' && (
          <ShareRenameForm
            fileId={file.$id}
            token={token}
            name={file.name}
            extension={file.extension}
          />
        )}
        <FilePreviewBody file={file} token={token} />
      </section>
    </main>
  );
};

export default SharePage;
