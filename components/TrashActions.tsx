'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { FileDialog, FileDialogContent } from '@/components/FileDialog';
import FileTooltip from '@/components/FileTooltip';
import { FileActionItem } from '@/components/FileActions';
import { permanentlyDeleteFile, restoreFile } from '@/lib/actions/file.actions';
import { useToast } from '@/hooks/use-toast';
import { FileDocument } from '@/types';

export const useTrashActions = (file: FileDocument) => {
  const path = usePathname();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState<'restore' | 'delete' | null>(null);

  const restore = async () => {
    setBusy('restore');
    try {
      await restoreFile({ fileId: file.$id, path });
      toast({ description: `Restored “${file.name}”.` });
    } catch {
      toast({
        description: 'Failed to restore file.',
        className: 'error-toast',
      });
    } finally {
      setBusy(null);
    }
  };

  const destroy = async () => {
    setBusy('delete');
    try {
      await permanentlyDeleteFile({ fileId: file.$id, path });
      setConfirmOpen(false);
    } catch {
      toast({
        description: 'Failed to delete file.',
        className: 'error-toast',
      });
    } finally {
      setBusy(null);
    }
  };

  const items: FileActionItem[] = [
    { key: 'open', label: 'Restore', icon: RotateCcw, run: restore },
    {
      key: 'delete',
      label: 'Delete forever',
      icon: Trash2,
      danger: true,
      separatorBefore: true,
      run: () => setConfirmOpen(true),
    },
  ];

  const dialogs = (
    <FileDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <FileDialogContent
        title="Delete forever?"
        icon={
          <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-signal-rose/10 text-signal-rose">
            <Trash2 className="size-4" />
          </span>
        }
        description={
          <>
            <span className="font-medium text-foreground">{file.name}</span>
            {file.isFolder ? ' and everything inside it' : ''} will be
            permanently deleted. This can’t be undone.
          </>
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
              disabled={!!busy}
              onClick={destroy}
            >
              {busy === 'delete' && <Loader2 className="animate-spin" />}
              Delete forever
            </button>
          </>
        }
      />
    </FileDialog>
  );

  return { items, dialogs, restore, busy, confirm: () => setConfirmOpen(true) };
};

export type TrashController = ReturnType<typeof useTrashActions>;

const TrashButtons = ({
  file,
  controller,
}: {
  file: FileDocument;
  controller: TrashController;
}) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      className="fx-btn fx-btn-secondary fx-btn-sm"
      disabled={!!controller.busy}
      onClick={controller.restore}
    >
      {controller.busy === 'restore' ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : (
        <RotateCcw aria-hidden="true" />
      )}
      Restore
    </button>
    <FileTooltip label="Delete forever">
      <button
        type="button"
        aria-label={`Delete ${file.name} forever`}
        className="fx-icon-btn hover:!bg-signal-rose/10 hover:!text-signal-rose"
        disabled={!!controller.busy}
        onClick={controller.confirm}
      >
        <Trash2 />
      </button>
    </FileTooltip>
  </div>
);

const SelfContained = ({ file }: { file: FileDocument }) => {
  const controller = useTrashActions(file);
  return (
    <>
      <TrashButtons file={file} controller={controller} />
      {controller.dialogs}
    </>
  );
};

const TrashActions = ({
  file,
  controller,
}: {
  file: FileDocument;
  controller?: TrashController;
}) =>
  controller ? (
    <TrashButtons file={file} controller={controller} />
  ) : (
    <SelfContained file={file} />
  );

export default TrashActions;
