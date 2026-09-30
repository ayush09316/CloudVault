'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from '@/components/Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/actions/file.actions';
import { usePathname, useSearchParams } from 'next/navigation';

interface Props {
  className?: string;
}

type QueueStatus = 'uploading' | 'done';
type QueueItem = { file: File; status: QueueStatus };

const FileUploader = ({ className }: Props) => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const parentId = path === '/files' ? searchParams.get('folder') : null;
  const { toast } = useToast();
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const remove = (name: string) =>
    setQueue((prev) => prev.filter((q) => q.file.name !== name));

  const markDone = (name: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.file.name === name ? { ...q, status: 'done' } : q))
    );
    setTimeout(() => remove(name), 900);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setQueue((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => ({
          file,
          status: 'uploading' as const,
        })),
      ]);

      const uploadPromises = acceptedFiles.map(async (file) => {
        try {
          if (file.size > MAX_FILE_SIZE) {
            remove(file.name);
            return toast({
              description: (
                <p className="body-2 text-white">
                  <span className="font-semibold">{file.name}</span> is too
                  large. Max file size is 50MB.
                </p>
              ),
              className: 'error-toast',
            });
          }

          const uploadedFile = await uploadFile({ file, parentId, path });
          if (uploadedFile && 'error' in uploadedFile) {
            remove(file.name);
            return toast({
              description: (
                <p className="body-2 text-white">{uploadedFile.error}</p>
              ),
              className: 'error-toast',
            });
          }
          if (uploadedFile) markDone(file.name);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          remove(file.name);
          toast({
            description: (
              <p className="body-2 text-white">
                Failed to upload{' '}
                <span className="font-semibold">{file.name}</span>.
              </p>
            ),
            className: 'error-toast',
          });
        }
      });

      await Promise.allSettled(uploadPromises);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentId, path]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: false,
    noDrag: true,
  });

  useEffect(() => {
    const handler = () => open();
    window.addEventListener('cloudvault:upload', handler);
    return () => window.removeEventListener('cloudvault:upload', handler);
  }, [open]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ files: File[] }>).detail;
      if (detail?.files?.length) onDrop(detail.files);
    };
    window.addEventListener('cloudvault:files-dropped', handler);
    return () =>
      window.removeEventListener('cloudvault:files-dropped', handler);
  }, [onDrop]);

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    remove(fileName);
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn('uploader-button', className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{' '}
        <p>Upload</p>
      </Button>
      {queue.length > 0 && (
        <ul className="uploader-preview-list" data-testid="upload-tray">
          <h4 className="h4 text-light-100 dark:text-ink-200">
            {queue.some((q) => q.status === 'uploading')
              ? 'Uploading'
              : 'Upload complete'}
          </h4>

          {queue.map(({ file, status }, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item relative overflow-hidden"
              >
                {status === 'uploading' && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-vault-600 dark:bg-vault-400"
                  />
                )}
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <p className="text-caption text-muted-foreground">
                      {status === 'uploading' ? 'Uploading…' : 'Done'}
                    </p>
                  </div>
                </div>

                {status === 'done' ? (
                  <span className="cv-check-pop flex size-6 items-center justify-center rounded-full bg-vault-600 text-white dark:bg-vault-400 dark:text-ink-950">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                ) : (
                  <button
                    type="button"
                    aria-label={`Remove ${file.name} from the upload queue`}
                    onClick={(e) => handleRemoveFile(e, file.name)}
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-light-300 dark:hover:bg-ink-700"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
