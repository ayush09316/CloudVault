'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FolderOpen, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sort from '@/components/Sort';
import FileCard from '@/components/FileCard';
import Card from '@/components/Card';
import FilePreview from '@/components/FilePreview';
import SelectionToolbar from '@/components/SelectionToolbar';
import EmptyState from '@/components/EmptyState';
import { cn, convertFileSize } from '@/lib/utils';
import { getFiles } from '@/lib/actions/file.actions';
import { FileDocument, GetFilesProps } from '@/types';

type FileViewerProps = {
  files: FileDocument[];
  totalSize: number;
  type: string;
  mode?: 'browse' | 'trash';
  nextCursor?: string | null;
  query?: GetFilesProps;
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
  emptyText?: string;
};

const FileViewer = ({
  files: initialFiles,
  totalSize,
  type,
  mode = 'browse',
  nextCursor: initialCursor = null,
  query,
  header,
  toolbar,
  emptyText = 'No files uploaded',
}: FileViewerProps) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [files, setFiles] = useState(initialFiles);
  const [cursor, setCursor] = useState(initialCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<FileDocument | null>(null);

  useEffect(() => {
    setFiles(initialFiles);
    setCursor(initialCursor);
    setSelectedIds(
      (prev) =>
        new Set(
          [...prev].filter((id) => initialFiles.some((f) => f.$id === id))
        )
    );
  }, [initialFiles, initialCursor]);

  const selected = useMemo(
    () => files.filter((f) => selectedIds.has(f.$id)),
    [files, selectedIds]
  );

  const toggleSelect = (file: FileDocument) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(file.$id)) next.delete(file.$id);
      else next.add(file.$id);
      return next;
    });

  const allSelected = files.length > 0 && selected.length === files.length;
  const toggleAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(files.map((f) => f.$id)));

  const openFile = (file: FileDocument) => {
    if (mode === 'trash') return;
    if (file.isFolder) router.push(`/files?folder=${file.$id}`);
    else setPreviewFile(file);
  };

  const loadMore = async () => {
    if (!cursor || !query) return;
    setLoadingMore(true);
    try {
      const page = await getFiles({ ...query, cursor });
      if (page) {
        setFiles((prev) => [...prev, ...page.documents]);
        setCursor(page.nextCursor);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const selectable = mode === 'browse';

  return (
    <div className="page-container">
      <section className="w-full">
        {header}
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{convertFileSize(totalSize)}</span>
          </p>

          <div className="flex items-center gap-4">
            {toolbar}
            {selectable && files.length > 0 && (
              <label className="body-2 flex cursor-pointer items-center gap-2 text-light-200 dark:text-ink-400">
                <input
                  type="checkbox"
                  className="size-4 accent-brand"
                  checked={allSelected}
                  onChange={toggleAll}
                />
                Select all
              </label>
            )}
            {mode === 'browse' && (
              <div className="sort-container">
                <p className="body-1 hidden text-light-200 dark:text-ink-400 sm:block">
                  Sort by:
                </p>
                <Sort />
              </div>
            )}
            <Button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              aria-label={
                isActive ? 'Switch to list view' : 'Switch to grid view'
              }
              aria-pressed={isActive}
              className={`hidden rounded-lg p-2 lg:block ${
                isActive
                  ? 'bg-vault-600 hover:bg-vault-700 dark:bg-vault-500'
                  : 'bg-ink-400 hover:bg-ink-500'
              }`}
            >
              <Image
                src="/assets/images/view.svg"
                alt=""
                width={20}
                height={20}
              />
            </Button>
          </div>
        </div>

        {selectable && (
          <SelectionToolbar
            selected={selected}
            onClear={() => setSelectedIds(new Set())}
          />
        )}
      </section>

      {files?.length > 0 ? (
        <section
          className={cn('cv-stagger', isActive ? 'file-list' : 'file-stack')}
        >
          {files.map((file: FileDocument) => {
            const props = {
              file,
              mode,
              selected: selectedIds.has(file.$id),
              onToggleSelect: selectable ? toggleSelect : undefined,
              onOpen: openFile,
            };
            return isActive ? (
              <Card key={file.$id} {...props} />
            ) : (
              <FileCard key={file.$id} {...props} />
            );
          })}
        </section>
      ) : (
        <EmptyState
          icon={mode === 'trash' ? Trash2 : FolderOpen}
          title={emptyText}
          description={
            mode === 'trash'
              ? 'Deleted files and folders will show up here until you empty them.'
              : 'Drag and drop, or use the upload button to add your first file.'
          }
          action={
            mode === 'browse' ? (
              <Button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event('cloudvault:upload'))
                }
                className="mt-2 rounded-full bg-vault-600 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
              >
                <Upload className="size-4" aria-hidden="true" />
                Upload your first file
              </Button>
            ) : undefined
          }
          className="w-full"
        />
      )}

      {cursor && query && (
        <Button
          variant="outline"
          onClick={loadMore}
          disabled={loadingMore}
          className="self-center"
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </Button>
      )}

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default FileViewer;
