'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import FileTypeIcon from '@/components/FileTypeIcon';
import { cn, getThumbnailSrc } from '@/lib/utils';
import { FileDocument } from '@/types';

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = ({
  type,
  extension,
  url = '',
  imageClassName,
  className,
}: Props) => {
  const [failed, setFailed] = useState(false);
  const isImage = type === 'image' && extension !== 'svg' && !!url && !failed;

  return (
    <figure
      className={cn(
        'thumbnail !rounded-lg',
        !isImage && '!bg-transparent',
        className
      )}
    >
      {isImage ? (
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('thumbnail-image', imageClassName)}
        />
      ) : (
        <FileTypeIcon
          type={type}
          extension={extension}
          size="md"
          className="size-full max-h-full max-w-full"
        />
      )}
    </figure>
  );
};

export const FileThumb = ({
  file,
  variant = 'row',
  className,
}: {
  file: Pick<
    FileDocument,
    '$id' | 'type' | 'extension' | 'thumbnailBucketFileId' | 'isFolder' | 'name'
  >;
  variant?: 'row' | 'card';
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);
  const src = file.isFolder ? '' : getThumbnailSrc(file);
  const type = file.isFolder ? 'folder' : file.type;

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'relative flex size-full items-center justify-center overflow-hidden',
          className
        )}
      >
        {src && !failed ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FileTypeIcon type={type} extension={file.extension} size="lg" />
            {file.extension && (
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {file.extension}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return src && !failed ? (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn(
        'size-7 shrink-0 rounded-md bg-ink-100 object-cover ring-1 ring-inset ring-black/5 dark:bg-ink-800 dark:ring-white/10',
        className
      )}
    />
  ) : (
    <FileTypeIcon
      type={type}
      extension={file.extension}
      size="sm"
      className={className}
    />
  );
};

export default Thumbnail;
