'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
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

const FileUploader = ({ className }: Props) => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const parentId = path === '/files' ? searchParams.get('folder') : null;
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        try {
          if (file.size > MAX_FILE_SIZE) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name)
            );

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

          const uploadedFile = await uploadFile({
            file,
            parentId,
            path,
          });
          if (uploadedFile && 'error' in uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name)
            );
            return toast({
              description: (
                <p className="body-2 text-white">{uploadedFile.error}</p>
              ),
              className: 'error-toast',
            });
          }
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name)
            );
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );
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
  });

  useEffect(() => {
    const handler = () => open();
    window.addEventListener('cloudvault:upload', handler);
    return () => window.removeEventListener('cloudvault:upload', handler);
  }, [open]);

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
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
      {files?.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100 dark:text-ink-200">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Remove ${file.name} from the upload queue`}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                  className="rounded-full p-1 transition-colors hover:bg-light-300 dark:bg-ink-800 dark:hover:bg-ink-700"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="dark:invert"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
