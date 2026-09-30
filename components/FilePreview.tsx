'use client';

/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fileContentUrl, getPreviewKind } from '@/lib/preview';
import { FileDocument } from '@/types';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => <p className="body-2 text-center">Loading PDF…</p>,
});

export const FilePreviewBody = ({
  file,
  token,
}: {
  file: Pick<FileDocument, '$id' | 'name' | 'extension'>;
  token?: string | null;
}) => {
  const src = fileContentUrl(file.$id, { token });
  const downloadHref = fileContentUrl(file.$id, { token, download: true });
  const kind = getPreviewKind(file.extension);

  return (
    <div className="flex flex-col items-center gap-4" data-testid="preview">
      {kind === 'image' && (
        <img
          src={src}
          alt={file.name}
          className="max-h-[65vh] max-w-full rounded-lg object-contain"
        />
      )}
      {kind === 'video' && (
        <video src={src} controls className="max-h-[65vh] max-w-full" />
      )}
      {kind === 'audio' && <audio src={src} controls className="w-full" />}
      {kind === 'pdf' && <PdfViewer src={src} />}
      {kind === 'none' && (
        <p className="body-2 text-center text-light-100 dark:text-ink-200">
          No preview is available for .{file.extension || 'unknown'} files.
        </p>
      )}
      <Button asChild className="primary-btn">
        <Link href={downloadHref} download={file.name} prefetch={false}>
          Download
        </Link>
      </Button>
    </div>
  );
};

const FilePreview = ({
  file,
  onClose,
}: {
  file: FileDocument | null;
  onClose: () => void;
}) => (
  <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="shad-dialog button max-w-4xl">
      {file && (
        <>
          <DialogHeader>
            <DialogTitle className="line-clamp-1 text-center text-light-100 dark:text-ink-200">
              {file.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Preview of {file.name}
            </DialogDescription>
          </DialogHeader>
          <FilePreviewBody file={file} />
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default FilePreview;
