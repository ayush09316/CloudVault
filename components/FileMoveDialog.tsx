'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, HardDrive, Loader2, Search } from 'lucide-react';
import { FileDialog, FileDialogContent } from '@/components/FileDialog';
import FileTypeIcon from '@/components/FileTypeIcon';
import { listMyFolders, moveFiles } from '@/lib/actions/file.actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FileDocument } from '@/types';

const ROOT = '__root__';

const FileMoveDialog = ({
  open,
  onOpenChange,
  files,
  onMoved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: FileDocument[];
  onMoved?: () => void;
}) => {
  const path = usePathname();
  const { toast } = useToast();
  const [folders, setFolders] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('');
  const [target, setTarget] = useState<string | null>(null);

  const ids = files.map((f) => f.$id);
  const idKey = ids.join(',');

  useEffect(() => {
    if (!open) return;
    setTarget(null);
    setFilter('');
    setLoading(true);
    listMyFolders()
      .then(setFolders)
      .catch(() =>
        toast({
          description: 'Failed to load folders.',
          className: 'error-toast',
        })
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const options = useMemo(() => {
    const excluded = idKey.split(',');
    const q = filter.trim().toLowerCase();
    return folders
      .filter((f) => !excluded.includes(f.id))
      .filter((f) => !q || f.label.toLowerCase().includes(q));
  }, [folders, filter, idKey]);

  const submit = async (dest: string | null = target) => {
    if (!dest) return;
    setBusy(true);
    try {
      const result = await moveFiles({
        fileIds: ids,
        targetParentId: dest === ROOT ? null : dest,
        path,
      });
      if (result?.skipped?.length) {
        toast({
          description: `Could not move: ${result.skipped.join(', ')}`,
          className: 'error-toast',
        });
      } else {
        const label =
          dest === ROOT
            ? 'My Files'
            : (folders.find((f) => f.id === dest)?.label ?? 'folder');
        toast({
          description: `Moved ${files.length === 1 ? `“${files[0].name}”` : `${files.length} items`} to ${label}.`,
        });
      }
      onOpenChange(false);
      onMoved?.();
    } catch {
      toast({
        description: 'Failed to move the selected items.',
        className: 'error-toast',
      });
    } finally {
      setBusy(false);
    }
  };

  const renderOption = (id: string, label: string, icon: React.ReactNode) => {
    const active = target === id;
    const parts = label.split(' / ');
    return (
      <li key={id}>
        <button
          type="button"
          role="option"
          aria-selected={active}
          onClick={() => setTarget(id)}
          onDoubleClick={() => submit(id)}
          className={cn(
            'fx-focus flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] transition-colors',
            active
              ? 'bg-vault-600/10 text-foreground dark:bg-vault-400/15'
              : 'hover:bg-ink-100 dark:hover:bg-ink-800'
          )}
        >
          {icon}
          <span className="min-w-0 flex-1 truncate">
            {parts.length > 1 && (
              <span className="text-muted-foreground">
                {parts.slice(0, -1).join(' / ')} /{' '}
              </span>
            )}
            <span className="font-medium">{parts[parts.length - 1]}</span>
          </span>
          {active && (
            <Check className="size-4 text-vault-600 dark:text-vault-300" />
          )}
        </button>
      </li>
    );
  };

  return (
    <FileDialog open={open} onOpenChange={onOpenChange}>
      <FileDialogContent
        title={
          files.length === 1 ? (
            <>
              Move <span className="text-muted-foreground">“</span>
              {files[0]?.name}
              <span className="text-muted-foreground">”</span>
            </>
          ) : (
            `Move ${files.length} items`
          )
        }
        description="Choose a destination folder."
        bodyClassName="pt-2"
        footer={
          <>
            <button
              type="button"
              className="fx-btn fx-btn-ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="fx-btn fx-btn-primary min-w-[88px]"
              disabled={!target || busy}
              onClick={() => submit()}
            >
              {busy && <Loader2 className="animate-spin" />}
              Move here
            </button>
          </>
        }
      >
        <label className="relative mb-2 block">
          <span className="sr-only">Filter folders</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            autoFocus
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter folders"
            className="fx-input pl-8"
          />
        </label>
        <ul
          role="listbox"
          aria-label="Destination folder"
          className="-mx-1 max-h-72 space-y-px overflow-y-auto px-1"
        >
          {!filter &&
            renderOption(
              ROOT,
              'My Files',
              <span className="inline-flex size-5 items-center justify-center text-muted-foreground">
                <HardDrive className="size-4" strokeWidth={1.75} />
              </span>
            )}
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex h-9 items-center gap-2.5 px-2">
                  <span className="fx-skeleton size-5" />
                  <span
                    className="fx-skeleton h-3"
                    style={{ width: `${40 + i * 15}%` }}
                  />
                </li>
              ))
            : options.map((f) =>
                renderOption(
                  f.id,
                  f.label,
                  <FileTypeIcon
                    type="folder"
                    size="xs"
                    bare
                    className="size-5"
                  />
                )
              )}
          {!loading && filter && options.length === 0 && (
            <li className="px-2 py-6 text-center text-[13px] text-muted-foreground">
              No folders match “{filter}”.
            </li>
          )}
        </ul>
      </FileDialogContent>
    </FileDialog>
  );
};

export default FileMoveDialog;
