'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Download,
  Eye,
  FolderInput,
  FolderOpen,
  Info,
  Loader2,
  LucideIcon,
  Pencil,
  Share2,
  Trash2,
} from 'lucide-react';
import { FileDialog, FileDialogContent } from '@/components/FileDialog';
import FileMoveDialog from '@/components/FileMoveDialog';
import { FileDetails, ShareInput } from '@/components/ActionsModalContent';
import {
  deleteFile,
  renameFile,
  restoreFile,
} from '@/lib/actions/file.actions';
import { fileContentUrl } from '@/lib/preview';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { FileDocument } from '@/types';

export type FileActionKey =
  | 'open'
  | 'share'
  | 'download'
  | 'rename'
  | 'move'
  | 'details'
  | 'delete';

export interface FileActionItem {
  key: FileActionKey;
  label: string;
  icon: LucideIcon;
  danger?: boolean;
  href?: string;
  download?: string;
  separatorBefore?: boolean;
  run: () => void;
}

const baseName = (file: FileDocument) =>
  file.isFolder || !file.extension
    ? file.name
    : file.name.replace(new RegExp(`\\.${file.extension}$`, 'i'), '');

export const triggerDownload = (file: FileDocument) => {
  const a = document.createElement('a');
  a.href = fileContentUrl(file.$id, { download: true });
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

type DialogKind = 'rename' | 'delete' | 'details' | 'share' | 'move' | null;

export const useFileActions = (
  file: FileDocument,
  { onOpen }: { onOpen?: (file: FileDocument) => void } = {}
) => {
  const path = usePathname();
  const { toast } = useToast();
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [name, setName] = useState(baseName(file));
  const [busy, setBusy] = useState(false);

  const open = (kind: Exclude<DialogKind, null>) => {
    if (kind === 'rename') setName(baseName(file));
    setDialog(kind);
  };
  const close = () => setDialog(null);

  const doRename = async () => {
    const next = name.trim();
    if (!next || next === baseName(file)) return close();
    setBusy(true);
    try {
      const ok = await renameFile({
        fileId: file.$id,
        name: next,
        extension: file.extension,
        path,
      });
      if (ok) close();
    } catch {
      toast({
        description: `Couldn’t rename “${file.name}”.`,
        className: 'error-toast',
      });
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    try {
      const ok = await deleteFile({ fileId: file.$id, path });
      if (ok) {
        close();
        toast({
          description: `Moved “${file.name}” to trash.`,
          action: (
            <ToastAction
              altText="Undo"
              onClick={() => restoreFile({ fileId: file.$id, path })}
            >
              Undo
            </ToastAction>
          ),
        });
      }
    } catch {
      toast({
        description: `Couldn’t move “${file.name}” to trash.`,
        className: 'error-toast',
      });
    } finally {
      setBusy(false);
    }
  };

  const items: FileActionItem[] = [];
  if (onOpen) {
    items.push({
      key: 'open',
      label: file.isFolder ? 'Open folder' : 'Preview',
      icon: file.isFolder ? FolderOpen : Eye,
      run: () => onOpen(file),
    });
  }
  if (!file.isFolder) {
    items.push({
      key: 'share',
      label: 'Share',
      icon: Share2,
      separatorBefore: items.length > 0,
      run: () => open('share'),
    });
    items.push({
      key: 'download',
      label: 'Download',
      icon: Download,
      href: fileContentUrl(file.$id, { download: true }),
      download: file.name,
      run: () => triggerDownload(file),
    });
  }
  items.push(
    {
      key: 'rename',
      label: 'Rename',
      icon: Pencil,
      separatorBefore: items.length > 0,
      run: () => open('rename'),
    },
    {
      key: 'move',
      label: 'Move to…',
      icon: FolderInput,
      run: () => open('move'),
    },
    {
      key: 'details',
      label: 'Details',
      icon: Info,
      run: () => open('details'),
    },
    {
      key: 'delete',
      label: 'Move to trash',
      icon: Trash2,
      danger: true,
      separatorBefore: true,
      run: () => open('delete'),
    }
  );

  const setOpen = (v: boolean) => !v && close();

  const dialogs = (
    <>
      <FileDialog open={dialog === 'rename'} onOpenChange={setOpen}>
        <FileDialogContent
          title={file.isFolder ? 'Rename folder' : 'Rename file'}
          footer={
            <>
              <button
                type="button"
                className="fx-btn fx-btn-ghost"
                onClick={close}
              >
                Cancel
              </button>
              <button
                type="submit"
                form={`rename-${file.$id}`}
                className="fx-btn fx-btn-primary min-w-[84px]"
                disabled={busy || !name.trim()}
              >
                {busy && <Loader2 className="animate-spin" />}
                Rename
              </button>
            </>
          }
        >
          <form
            id={`rename-${file.$id}`}
            onSubmit={(e) => {
              e.preventDefault();
              doRename();
            }}
          >
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">
              Name
            </label>
            <div className="flex items-stretch">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="New name"
                className={
                  file.isFolder || !file.extension
                    ? 'fx-input'
                    : 'fx-input rounded-r-none'
                }
              />
              {!file.isFolder && file.extension && (
                <span className="fx-num inline-flex items-center rounded-r-lg border border-l-0 border-input bg-ink-50 px-2.5 text-[13px] text-muted-foreground dark:bg-ink-800">
                  .{file.extension}
                </span>
              )}
            </div>
          </form>
        </FileDialogContent>
      </FileDialog>

      <FileDialog open={dialog === 'delete'} onOpenChange={setOpen}>
        <FileDialogContent
          title="Move to trash?"
          icon={
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-signal-rose/10 text-signal-rose">
              <Trash2 className="size-4" />
            </span>
          }
          description={
            <>
              <span className="font-medium text-foreground">{file.name}</span>
              {file.isFolder ? ' and everything inside it' : ''} will move to
              Trash. You can restore it from there.
            </>
          }
          footer={
            <>
              <button
                type="button"
                className="fx-btn fx-btn-ghost"
                onClick={close}
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                className="fx-btn fx-btn-danger"
                disabled={busy}
                onClick={doDelete}
              >
                {busy && <Loader2 className="animate-spin" />}
                Move to trash
              </button>
            </>
          }
        />
      </FileDialog>

      <FileDialog open={dialog === 'details'} onOpenChange={setOpen}>
        <FileDialogContent
          title="Details"
          description={file.name}
          className="max-w-[460px]"
        >
          {dialog === 'details' && <FileDetails file={file} />}
        </FileDialogContent>
      </FileDialog>

      <FileDialog open={dialog === 'share'} onOpenChange={setOpen}>
        <FileDialogContent
          title={
            <span className="flex min-w-0">
              <span className="shrink-0">Share “</span>
              <span className="truncate">{file.name}</span>
              <span className="shrink-0">”</span>
            </span>
          }
          description="Invite people or create a link anyone can open."
          hideDescription
          className="max-w-[540px]"
          bodyClassName="px-0 pb-0 pt-1"
        >
          {dialog === 'share' && <ShareInput file={file} onDone={close} />}
        </FileDialogContent>
      </FileDialog>

      <FileMoveDialog
        open={dialog === 'move'}
        onOpenChange={setOpen}
        files={[file]}
      />
    </>
  );

  return { items, dialogs, openDialog: open };
};

export type FileActionsController = ReturnType<typeof useFileActions>;
