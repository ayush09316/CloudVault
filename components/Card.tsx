'use client';

import React, { useState } from 'react';
import { FileThumb } from '@/components/Thumbnail';
import ActionDropdown from '@/components/ActionDropdown';
import ContextMenuFile from '@/components/ContextMenuFile';
import TrashActions, { useTrashActions } from '@/components/TrashActions';
import { useFileActions } from '@/components/FileActions';
import { FileTruncate } from '@/components/FileTooltip';
import FileTypeIcon from '@/components/FileTypeIcon';
import {
  formatBytes,
  formatFullDate,
  formatShortDate,
} from '@/components/FileFormat';
import { cn } from '@/lib/utils';
import { FileDocument } from '@/types';

export type SelectModifiers = {
  shiftKey?: boolean;
  metaKey?: boolean;
  ctrlKey?: boolean;
};

export interface FileItemProps {
  file: FileDocument;
  mode?: 'browse' | 'trash';
  selected?: boolean;
  selectionActive?: boolean;
  onToggleSelect?: (file: FileDocument, mods?: SelectModifiers) => void;
  onOpen?: (file: FileDocument) => void;
}

export const stop = (e: React.SyntheticEvent) => e.stopPropagation();

export const SelectBox = ({
  file,
  selected,
  onToggleSelect,
  className,
}: Pick<FileItemProps, 'file' | 'selected' | 'onToggleSelect'> & {
  className?: string;
}) =>
  onToggleSelect ? (
    <input
      type="checkbox"
      aria-label={`Select ${file.name}`}
      data-testid="select-file"
      className={cn('fx-checkbox', className)}
      checked={!!selected}
      onClick={(e) => {
        e.stopPropagation();
        onToggleSelect(file, {
          shiftKey: e.shiftKey,
          metaKey: e.metaKey,
          ctrlKey: e.ctrlKey,
        });
      }}
      onChange={() => undefined}
    />
  ) : null;

export const useItemMenu = (
  file: FileDocument,
  mode: 'browse' | 'trash',
  onOpen?: (file: FileDocument) => void
) => {
  const browse = useFileActions(file, { onOpen });
  const trash = useTrashActions(file);
  const [menuOpen, setMenuOpen] = useState(false);
  return {
    browse,
    trash,
    items: mode === 'trash' ? trash.items : browse.items,
    dialogs: mode === 'trash' ? trash.dialogs : browse.dialogs,
    menuOpen,
    setMenuOpen,
  };
};

export const handleItemActivate = (
  e: React.MouseEvent,
  { file, mode, onOpen, onToggleSelect }: FileItemProps
) => {
  const mods = { shiftKey: e.shiftKey, metaKey: e.metaKey, ctrlKey: e.ctrlKey };
  if (onToggleSelect && (e.shiftKey || e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    onToggleSelect(file, mods);
    return;
  }
  if (mode !== 'trash') onOpen?.(file);
};

const Card = (props: FileItemProps) => {
  const {
    file,
    mode = 'browse',
    selected,
    selectionActive,
    onToggleSelect,
  } = props;
  const menu = useItemMenu(file, mode, props.onOpen);
  const date = mode === 'trash' ? file.deletedAt : file.$updatedAt;
  const showCheckbox = cn(
    'transition-opacity duration-150',
    selected || selectionActive
      ? 'opacity-100'
      : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100'
  );

  const openButton = (
    <button
      type="button"
      data-open-button
      onClick={(e) => handleItemActivate(e, props)}
      aria-label={
        mode === 'trash'
          ? file.name
          : `${file.isFolder ? 'Open folder' : 'Preview'} ${file.name}`
      }
      className="min-w-0 flex-1 text-left outline-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-vault-600/60 dark:focus-visible:after:ring-vault-300/70"
    >
      <FileTruncate
        text={file.name}
        className="text-[13.5px] font-medium leading-5 text-foreground"
      />
    </button>
  );

  const actions =
    mode === 'trash' ? (
      <TrashActions file={file} controller={menu.trash} />
    ) : (
      <ActionDropdown
        file={file}
        controller={menu.browse}
        onOpenChange={menu.setMenuOpen}
        className={cn(
          'transition-opacity',
          !menu.menuOpen &&
            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100'
        )}
      />
    );

  if (file.isFolder) {
    return (
      <>
        <ContextMenuFile title={file.name} items={menu.items}>
          <div
            data-testid="file-item"
            data-name={file.name}
            data-file-id={file.$id}
            data-state={selected ? 'selected' : undefined}
            className={cn(
              'group relative flex h-14 items-center gap-3 rounded-xl border bg-card pl-3 pr-1.5 transition-[border-color,background-color,box-shadow] duration-150',
              selected
                ? 'border-vault-600/60 bg-vault-50 shadow-[0_0_0_1px_rgba(14,122,110,0.35)] dark:border-vault-400/60 dark:bg-vault-400/[0.08]'
                : 'border-border hover:border-ink-300 hover:bg-ink-50/60 dark:hover:border-ink-700 dark:hover:bg-ink-900'
            )}
          >
            {onToggleSelect && (
              <span className="relative z-10 flex items-center">
                <SelectBox
                  file={file}
                  selected={selected}
                  onToggleSelect={onToggleSelect}
                  className={showCheckbox}
                />
              </span>
            )}
            <FileTypeIcon type="folder" size="sm" />
            {openButton}
            <div className="relative z-10 flex shrink-0 items-center">
              {actions}
            </div>
          </div>
        </ContextMenuFile>
        {menu.dialogs}
      </>
    );
  }

  return (
    <>
      <ContextMenuFile title={file.name} items={menu.items}>
        <div
          data-testid="file-item"
          data-name={file.name}
          data-file-id={file.$id}
          data-state={selected ? 'selected' : undefined}
          className={cn(
            'fx-card-lift group relative flex flex-col overflow-hidden rounded-xl border bg-card',
            selected
              ? 'border-vault-600/60 shadow-[0_0_0_1px_rgba(14,122,110,0.35)] dark:border-vault-400/60'
              : 'border-border hover:border-ink-300 dark:hover:border-ink-700'
          )}
        >
          <div
            className={cn(
              'relative aspect-[4/3] border-b border-border',
              selected
                ? 'bg-vault-50 dark:bg-vault-400/[0.08]'
                : 'bg-ink-50 dark:bg-ink-950/60'
            )}
          >
            <FileThumb file={file} variant="card" />
            <div className="absolute left-2.5 top-2.5 z-10">
              <SelectBox
                file={file}
                selected={selected}
                onToggleSelect={onToggleSelect}
                className={cn('shadow-sm', showCheckbox)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 py-2 pl-3 pr-1.5">
            <FileTypeIcon
              type={file.type}
              extension={file.extension}
              size="xs"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              {openButton}
              <p className="fx-num truncate text-[11.5px] leading-4 text-muted-foreground">
                <span>{formatBytes(file.size)}</span>
                <span aria-hidden="true" className="mx-1">
                  ·
                </span>
                <time dateTime={date || undefined} title={formatFullDate(date)}>
                  {mode === 'trash' ? 'Deleted ' : ''}
                  {formatShortDate(date)}
                </time>
              </p>
            </div>
            <div className="relative z-10 flex shrink-0 items-center">
              {actions}
            </div>
          </div>
        </div>
      </ContextMenuFile>
      {menu.dialogs}
    </>
  );
};

export default Card;
