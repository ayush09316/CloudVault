'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import UploadTray from '@/components/UploadTray';
import {
  claimUploader,
  isPrimaryUploader,
  uploadStore,
} from '@/components/UploadStore';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const FileUploader = ({ className }: Props) => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const parentId = path === '/files' ? searchParams.get('folder') : null;
  const token = useRef(Symbol('uploader'));
  const [primary, setPrimary] = useState(false);

  useEffect(() => {
    const release = claimUploader(token.current);
    setPrimary(isPrimaryUploader(token.current));
    return release;
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) =>
      uploadStore.enqueue(acceptedFiles, { parentId, path }),
    [parentId, path]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: false,
    noDrag: true,
  });

  useEffect(() => {
    const handler = () => {
      if (isPrimaryUploader(token.current)) open();
    };
    window.addEventListener('cloudvault:upload', handler);
    return () => window.removeEventListener('cloudvault:upload', handler);
  }, [open]);

  useEffect(() => {
    const handler = (e: Event) => {
      if (!isPrimaryUploader(token.current)) return;
      const detail = (e as CustomEvent<{ files: File[] }>).detail;
      if (detail?.files?.length) onDrop(detail.files);
    };
    window.addEventListener('cloudvault:files-dropped', handler);
    return () =>
      window.removeEventListener('cloudvault:files-dropped', handler);
  }, [onDrop]);

  return (
    <>
      <div {...getRootProps({ className: 'shrink-0', tabIndex: -1 })}>
        <input {...getInputProps()} />
        <button
          type="button"
          className={cn(
            'fx-btn fx-btn-primary h-10 gap-2 px-4 text-[13.5px]',
            className
          )}
        >
          <Upload aria-hidden="true" />
          Upload
        </button>
      </div>
      {primary && <UploadTray />}
    </>
  );
};

export default FileUploader;
