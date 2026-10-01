'use client';

import Link from 'next/link';
import { FolderPlus, SearchX, Trash2, Upload } from 'lucide-react';
import FileTypeIcon from '@/components/FileTypeIcon';
import { cn } from '@/lib/utils';

export type EmptyVariant = 'root' | 'folder' | 'type' | 'trash' | 'search';

const TYPE_ICON: Record<string, { type: string; extension?: string }[]> = {
  documents: [
    { type: 'document', extension: 'xlsx' },
    { type: 'document', extension: 'pdf' },
    { type: 'document', extension: 'docx' },
  ],
  images: [
    { type: 'image', extension: 'png' },
    { type: 'image', extension: 'jpg' },
    { type: 'image', extension: 'webp' },
  ],
  media: [
    { type: 'audio', extension: 'mp3' },
    { type: 'video', extension: 'mp4' },
    { type: 'audio', extension: 'wav' },
  ],
  others: [
    { type: 'other', extension: 'zip' },
    { type: 'other', extension: 'json' },
    { type: 'other', extension: 'bin' },
  ],
  default: [
    { type: 'image', extension: 'png' },
    { type: 'document', extension: 'pdf' },
    { type: 'folder' },
  ],
};

const Fan = ({ category }: { category?: string }) => {
  const icons = TYPE_ICON[category || ''] ?? TYPE_ICON.default;
  return (
    <div aria-hidden="true" className="relative mb-6 h-16 w-40">
      <span className="absolute left-2 top-3.5 -rotate-12 rounded-xl bg-card p-1 shadow-[0_1px_2px_rgba(10,13,12,0.08),0_6px_16px_-8px_rgba(10,13,12,0.25)] ring-1 ring-border">
        <FileTypeIcon {...icons[0]} size="md" />
      </span>
      <span className="absolute right-2 top-3.5 rotate-12 rounded-xl bg-card p-1 shadow-[0_1px_2px_rgba(10,13,12,0.08),0_6px_16px_-8px_rgba(10,13,12,0.25)] ring-1 ring-border">
        <FileTypeIcon {...icons[2]} size="md" />
      </span>
      <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-xl bg-card p-1 shadow-[0_1px_2px_rgba(10,13,12,0.08),0_10px_24px_-10px_rgba(10,13,12,0.35)] ring-1 ring-border">
        <FileTypeIcon {...icons[1]} size="lg" className="size-12" />
      </span>
    </div>
  );
};

const Glyph = ({ icon: Icon }: { icon: typeof Trash2 }) => (
  <span
    aria-hidden="true"
    className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-card text-muted-foreground shadow-[0_1px_2px_rgba(10,13,12,0.08),0_6px_16px_-8px_rgba(10,13,12,0.25)] ring-1 ring-border"
  >
    <Icon className="size-5" strokeWidth={1.75} />
  </span>
);

const upload = () => window.dispatchEvent(new Event('cloudvault:upload'));
const newFolder = () =>
  window.dispatchEvent(new Event('cloudvault:new-folder'));

const FileEmptyState = ({
  variant,
  category,
  title,
  query,
  clearHref,
  className,
}: {
  variant: EmptyVariant;
  category?: string;
  title?: string;
  query?: string;
  clearHref?: string;
  className?: string;
}) => {
  const copy = {
    root: {
      title: title ?? 'Nothing in your vault yet',
      body: 'Upload files or create a folder to start organizing. You can also drop files anywhere on this page.',
    },
    folder: {
      title: title ?? 'This folder is empty',
      body: 'Drop files anywhere on this page, or upload them from your computer.',
    },
    type: {
      title: title ?? `No ${category ?? 'files'} yet`,
      body: `${category ? category[0].toUpperCase() + category.slice(1) : 'Files'} you upload will be collected here automatically.`,
    },
    trash: {
      title: title ?? 'Trash is empty',
      body: 'Items you move to trash wait here until you restore them or delete them forever.',
    },
    search: {
      title: query ? `No results for “${query}”` : 'No results',
      body: 'Try a shorter name, or check the spelling.',
    },
  }[variant];

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center px-6 py-16 text-center',
        className
      )}
      data-testid="empty-state"
    >
      {variant === 'trash' ? (
        <Glyph icon={Trash2} />
      ) : variant === 'search' ? (
        <Glyph icon={SearchX} />
      ) : (
        <Fan category={category} />
      )}
      <h2 className="font-display text-[15.5px] font-semibold tracking-[-0.005em] text-foreground">
        {copy.title}
      </h2>
      <p className="mt-1 max-w-[360px] text-[13px] leading-5 text-muted-foreground">
        {copy.body}
      </p>
      {(variant === 'root' || variant === 'folder' || variant === 'type') && (
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            className="fx-btn fx-btn-primary"
            onClick={upload}
          >
            <Upload aria-hidden="true" />
            Upload files
          </button>
          {variant !== 'type' && (
            <button
              type="button"
              className="fx-btn fx-btn-secondary"
              onClick={newFolder}
            >
              <FolderPlus aria-hidden="true" />
              Create a folder
            </button>
          )}
        </div>
      )}
      {variant === 'search' && clearHref && (
        <Link href={clearHref} className="fx-btn fx-btn-secondary mt-5">
          Clear search
        </Link>
      )}
    </div>
  );
};

export default FileEmptyState;
