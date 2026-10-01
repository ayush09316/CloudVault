'use client';

import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { FileThumb } from '@/components/Thumbnail';
import ActionDropdown from '@/components/ActionDropdown';
import ContextMenuFile from '@/components/ContextMenuFile';
import TrashActions from '@/components/TrashActions';
import FileTooltip, { FileTruncate } from '@/components/FileTooltip';
import ShareAvatar from '@/components/ShareAvatar';
import {
  FileItemProps,
  SelectBox,
  handleItemActivate,
  useItemMenu,
} from '@/components/Card';
import { triggerDownload } from '@/components/FileActions';
import {
  formatBytes,
  formatFullDate,
  formatShortDate,
} from '@/components/FileFormat';
import { fileKindLabel, getFileKind } from '@/components/FileTypeIcon';
import { cn } from '@/lib/utils';

export const LIST_GRID = {
  browse:
    'grid-cols-[28px_minmax(0,1fr)_76px] md:grid-cols-[28px_minmax(0,1fr)_132px_84px_108px] lg:grid-cols-[28px_minmax(0,1fr)_184px_132px_84px_108px]',
  trash:
    'grid-cols-[28px_minmax(0,1fr)_132px] md:grid-cols-[28px_minmax(0,1fr)_132px_84px_140px] lg:grid-cols-[28px_minmax(0,1fr)_184px_132px_84px_140px]',
};

const hoverReveal =
  'opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100';

const FileCard = (props: FileItemProps) => {
  const {
    file,
    mode = 'browse',
    selected,
    selectionActive,
    onToggleSelect,
  } = props;
  const menu = useItemMenu(file, mode, props.onOpen);
  const date = mode === 'trash' ? file.deletedAt : file.$updatedAt;
  const ownerName = file.owner?.fullName as string | undefined;
  const kind = getFileKind(
    file.extension,
    file.isFolder ? 'folder' : file.type
  );

  return (
    <>
      <ContextMenuFile
        title={file.name}
        items={menu.items}
        onOpenChange={menu.setMenuOpen}
      >
        <div
          role="row"
          aria-selected={onToggleSelect ? !!selected : undefined}
          data-testid="file-item"
          data-name={file.name}
          data-file-id={file.$id}
          data-state={
            selected ? 'selected' : menu.menuOpen ? 'open' : undefined
          }
          className={cn(
            'group relative grid h-[52px] items-center gap-x-3 border-b border-border px-3 transition-colors duration-100 last:border-b-0',
            LIST_GRID[mode],
            selected
              ? 'bg-vault-50 hover:bg-vault-100/60 dark:bg-vault-400/[0.08] dark:hover:bg-vault-400/[0.12]'
              : 'hover:bg-ink-50 data-[state=open]:bg-ink-50 dark:hover:bg-ink-800/50 dark:data-[state=open]:bg-ink-800/50'
          )}
        >
          {selected && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-0.5 bg-vault-600 dark:bg-vault-400"
            />
          )}
          <div role="gridcell" className="relative z-10 flex items-center">
            <SelectBox
              file={file}
              selected={selected}
              onToggleSelect={onToggleSelect}
              className={selected || selectionActive ? undefined : hoverReveal}
            />
          </div>

          <div role="gridcell" className="flex min-w-0 items-center gap-3">
            <FileThumb file={file} />
            <div className="flex min-w-0 flex-1 flex-col">
              <button
                type="button"
                data-open-button
                onClick={(e) => handleItemActivate(e, props)}
                aria-label={
                  mode === 'trash'
                    ? file.name
                    : `${file.isFolder ? 'Open folder' : 'Preview'} ${file.name}`
                }
                className="min-w-0 text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-vault-600/60 dark:focus-visible:after:ring-vault-300/70"
              >
                <FileTruncate
                  text={file.name}
                  className="text-[13.5px] font-medium leading-5 text-foreground"
                />
              </button>
              <span className="fx-num truncate text-[11.5px] leading-4 text-muted-foreground md:hidden">
                {file.isFolder ? 'Folder' : formatBytes(file.size)} ·{' '}
                {formatShortDate(date)}
              </span>
            </div>
          </div>

          <div
            role="gridcell"
            className="hidden min-w-0 items-center gap-2 text-[13px] text-muted-foreground lg:flex"
          >
            <ShareAvatar name={ownerName} seed={file.owner?.email} size="xs" />
            <FileTruncate text={ownerName || 'Unknown'} />
          </div>

          <div
            role="gridcell"
            className="fx-num hidden truncate text-[13px] text-muted-foreground md:block"
          >
            <time dateTime={date || undefined} title={formatFullDate(date)}>
              {formatShortDate(date)}
            </time>
          </div>

          <div
            role="gridcell"
            className="fx-num hidden text-right text-[13px] text-muted-foreground md:block"
            title={
              file.isFolder
                ? undefined
                : `${file.size.toLocaleString()} bytes · ${fileKindLabel(kind)}`
            }
          >
            {file.isFolder ? '—' : formatBytes(file.size)}
          </div>

          <div
            role="gridcell"
            className="relative z-10 flex items-center justify-end gap-0.5"
          >
            {mode === 'trash' ? (
              <TrashActions file={file} controller={menu.trash} />
            ) : (
              <>
                {!file.isFolder && (
                  <div
                    className={cn(
                      'hidden items-center gap-0.5 sm:flex',
                      hoverReveal
                    )}
                  >
                    <FileTooltip label="Share">
                      <button
                        type="button"
                        aria-label={`Share ${file.name}`}
                        className="fx-icon-btn"
                        onClick={() => menu.browse.openDialog('share')}
                      >
                        <Share2 />
                      </button>
                    </FileTooltip>
                    <FileTooltip label="Download">
                      <button
                        type="button"
                        aria-label={`Download ${file.name}`}
                        className="fx-icon-btn"
                        onClick={() => triggerDownload(file)}
                      >
                        <Download />
                      </button>
                    </FileTooltip>
                  </div>
                )}
                <ActionDropdown
                  file={file}
                  controller={menu.browse}
                  onOpenChange={menu.setMenuOpen}
                  className={menu.menuOpen ? undefined : hoverReveal}
                />
              </>
            )}
          </div>
        </div>
      </ContextMenuFile>
      {menu.dialogs}
    </>
  );
};

export default FileCard;
