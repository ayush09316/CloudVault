import Image from 'next/image';
import { FilePreviewBody } from '@/components/FilePreview';
import ShareRenameForm from '@/components/ShareRenameForm';
import { isShareActive } from '@/lib/permissions';
import { getFileDoc, getShareByToken } from '@/lib/server/files';
import { convertFileSize } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const Unavailable = ({ message }: { message: string }) => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
    <Image
      src="/assets/icons/logo-full-brand.svg"
      alt="logo"
      width={160}
      height={50}
    />
    <p className="h4 text-light-100" data-testid="share-unavailable">
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
    <main className="flex min-h-screen flex-col items-center gap-6 p-6">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={160}
        height={50}
      />
      <section className="flex w-full max-w-4xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-drop-1">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="h3 text-light-100" data-testid="shared-file-name">
            {file.name}
          </h1>
          <p className="body-2 text-light-200">
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
