'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import JSZip from 'jszip';
import {
  CheckCheck,
  Download,
  FolderInput,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  deleteFiles,
  permanentlyDeleteFile,
  restoreFile,
} from '@/lib/actions/file.actions';
import { fileContentUrl } from '@/lib/preview';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import FileMoveDialog from '@/components/FileMoveDialog';
import FileTooltip from '@/components/FileTooltip';
import { FileDialog, FileDialogContent } from '@/components/FileDialog';
import { cn } from '@/lib/utils';
import { FileDocument } from '@/types';

const Divider = () => (
  <span
    aria-hidden="true"
    className="mx-1 h-5 w-px bg-white/15 dark:bg-ink-900/15"
  />
);

const barBtn =
  'inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-ink-100 transition-colors hover:bg-white/10 active:bg-white/15 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-300/70 dark:text-ink-800 dark:hover:bg-ink-900/10 dark:active:bg-ink-900/15 [&_svg]:size-4';

const SelectionToolbar = ({
  selected,
  total,
  mode = 'browse',
  onClear,
  onSelectAll,
}: {
  selected: FileDocument[];
  total?: number;
  mode?: 'browse' | 'trash';
  onClear: () => void;
  onSelectAll?: () => void;
}) => {
  const path = usePathname();
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const lastCount = useRef(0);

  useEffect(() => setMounted(true), []);

  const count = selected.length;
  if (count > 0) lastCount.current = count;

  useEffect(() => {
    if (count > 0) {
      setVisible(true);
      return;
    }
    const t = window.setTimeout(() => setVisible(false), 180);
    return () => window.clearTimeout(t);
  }, [count]);

  const ids = selected.map((f) => f.$id);
  const fail = (description: string) =>
    toast({ description, className: 'error-toast' });

  const handleDelete = async () => {
    setBusy('delete');
    try {
      await deleteFiles({ fileIds: ids, path });
      onClear();
      toast({
        description: `Moved ${ids.length} ${ids.length === 1 ? 'item' : 'items'} to trash.`,
        action: (
          <ToastAction
            altText="Undo"
            onClick={() => {
              ids.forEach((fileId) => restoreFile({ fileId, path }));
            }}
          >
            Undo
          </ToastAction>
        ),
      });
    } catch {
      fail('Failed to delete the selected files.');
    } finally {
      setBusy(null);
    }
  };

  const handleRestore = async () => {
    setBusy('restore');
    try {
      for (const fileId of ids) await restoreFile({ fileId, path });
      onClear();
      toast({
        description: `Restored ${ids.length} ${ids.length === 1 ? 'item' : 'items'}.`,
      });
    } catch {
      fail('Failed to restore some items.');
    } finally {
      setBusy(null);
    }
  };

  const handleDestroy = async () => {
    setBusy('destroy');
    try {
      for (const fileId of ids) await permanentlyDeleteFile({ fileId, path });
      setConfirmOpen(false);
      onClear();
    } catch {
      fail('Failed to delete some items.');
    } finally {
      setBusy(null);
    }
  };

  const handleZip = async () => {
    const files = selected.filter((f) => !f.isFolder);
    if (files.length === 0)
      return fail('Select at least one file to download.');
    setBusy('zip');
    try {
      const zip = new JSZip();
      const used = new Map<string, number>();
      for (const file of files) {
        const res = await fetch(fileContentUrl(file.$id, { download: true }));
        if (!res.ok) throw new Error(`Failed to fetch ${file.name}`);
        const n = used.get(file.name) ?? 0;
        used.set(file.name, n + 1);
        zip.file(n === 0 ? file.name : `(${n}) ${file.name}`, await res.blob());
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cloudvault-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      fail('Failed to build the zip file.');
    } finally {
      setBusy(null);
    }
  };

  if (!mounted || (!visible && count === 0)) return null;

  const shown = count || lastCount.current;
  const allSelected = total !== undefined && count === total;

  return createPortal(
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4 sm:bottom-7">
        <div
          role="toolbar"
          aria-label="Selection actions"
          data-testid="selection-toolbar"
          className={cn(
            'pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl bg-ink-900 p-1 pl-1 text-ink-50 shadow-[0_1px_2px_rgba(10,13,12,0.2),0_16px_40px_-12px_rgba(10,13,12,0.55)] ring-1 ring-black/5 dark:bg-ink-50 dark:text-ink-900 dark:ring-white/10',
            count > 0 ? 'fx-rise-in' : 'fx-sink-out'
          )}
        >
          <FileTooltip label="Clear selection" kbd={['Esc']}>
            <button
              type="button"
              className={cn(barBtn, 'px-2')}
              onClick={onClear}
              aria-label="Clear selection"
            >
              <X />
            </button>
          </FileTooltip>
          <p
            className="fx-num whitespace-nowrap pl-1 pr-2 text-[13px] font-medium"
            aria-live="polite"
          >
            {shown} selected
          </p>
          {onSelectAll &&
            !allSelected &&
            total !== undefined &&
            total > shown && (
              <button type="button" className={barBtn} onClick={onSelectAll}>
                <CheckCheck />
                <span className="hidden sm:inline">Select all</span>
                <span className="fx-num text-ink-400 dark:text-ink-500">
                  {total}
                </span>
              </button>
            )}
          <Divider />
          {mode === 'trash' ? (
            <>
              <button
                type="button"
                className={barBtn}
                onClick={handleRestore}
                disabled={!!busy}
              >
                {busy === 'restore' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RotateCcw />
                )}
                Restore
              </button>
              <button
                type="button"
                className={cn(barBtn, 'text-[#F2A39B] dark:text-signal-rose')}
                onClick={() => setConfirmOpen(true)}
                disabled={!!busy}
              >
                <Trash2 />
                Delete forever
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={barBtn}
                onClick={() => setMoveOpen(true)}
                disabled={!!busy}
              >
                <FolderInput />
                <span className="hidden sm:inline">Move</span>
              </button>
              <button
                type="button"
                className={barBtn}
                onClick={handleZip}
                disabled={!!busy}
              >
                {busy === 'zip' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download />
                )}
                <span className="hidden sm:inline">
                  {busy === 'zip' ? 'Zipping…' : 'Download'}
                </span>
              </button>
              <button
                type="button"
                aria-label="Move to trash"
                className={cn(barBtn, 'text-[#F2A39B] dark:text-signal-rose')}
                onClick={handleDelete}
                disabled={!!busy}
              >
                {busy === 'delete' ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
                <span className="hidden sm:inline">Trash</span>
              </button>
            </>
          )}
        </div>
      </div>

      <FileMoveDialog
        open={moveOpen}
        onOpenChange={setMoveOpen}
        files={selected}
        onMoved={onClear}
      />

      <FileDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <FileDialogContent
          title={`Delete ${shown} ${shown === 1 ? 'item' : 'items'} forever?`}
          description="These items will be permanently deleted. This can’t be undone."
          icon={
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-signal-rose/10 text-signal-rose">
              <Trash2 className="size-4" />
            </span>
          }
          footer={
            <>
              <button
                type="button"
                className="fx-btn fx-btn-ghost"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="fx-btn fx-btn-danger"
                onClick={handleDestroy}
                disabled={!!busy}
              >
                {busy === 'destroy' && <Loader2 className="animate-spin" />}
                Delete forever
              </button>
            </>
          }
        />
      </FileDialog>
    </>,
    document.body
  );
};

export default SelectionToolbar;
