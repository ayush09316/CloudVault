'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  deleteFiles,
  listMyFolders,
  moveFiles,
} from '@/lib/actions/file.actions';
import { fileContentUrl } from '@/lib/preview';
import { useToast } from '@/hooks/use-toast';
import { FileDocument } from '@/types';

const ROOT = '__root__';

const SelectionToolbar = ({
  selected,
  onClear,
}: {
  selected: FileDocument[];
  onClear: () => void;
}) => {
  const path = usePathname();
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);
  const [folders, setFolders] = useState<{ id: string; label: string }[]>([]);
  const [target, setTarget] = useState(ROOT);

  const ids = selected.map((f) => f.$id);
  const fail = (description: string) =>
    toast({ description, className: 'error-toast' });

  const handleDelete = async () => {
    setBusy('delete');
    try {
      await deleteFiles({ fileIds: ids, path });
      onClear();
    } catch {
      fail('Failed to delete the selected files.');
    } finally {
      setBusy(null);
    }
  };

  const openMove = async () => {
    setMoveOpen(true);
    try {
      setFolders(await listMyFolders());
    } catch {
      fail('Failed to load folders.');
    }
  };

  const handleMove = async () => {
    setBusy('move');
    try {
      const result = await moveFiles({
        fileIds: ids,
        targetParentId: target === ROOT ? null : target,
        path,
      });
      if (result?.skipped?.length) {
        fail(`Could not move: ${result.skipped.join(', ')}`);
      }
      setMoveOpen(false);
      onClear();
    } catch {
      fail('Failed to move the selected files.');
    } finally {
      setBusy(null);
    }
  };

  const handleZip = async () => {
    const files = selected.filter((f) => !f.isFolder);
    if (files.length === 0) return fail('Select at least one file to zip.');
    setBusy('zip');
    try {
      const zip = new JSZip();
      const used = new Map<string, number>();
      for (const file of files) {
        const res = await fetch(fileContentUrl(file.$id, { download: true }));
        if (!res.ok) throw new Error(`Failed to fetch ${file.name}`);
        const count = used.get(file.name) ?? 0;
        used.set(file.name, count + 1);
        const name = count === 0 ? file.name : `(${count}) ${file.name}`;
        zip.file(name, await res.blob());
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

  if (selected.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 shadow-drop-1 dark:bg-ink-900"
      data-testid="selection-toolbar"
    >
      <p className="subtitle-2">{selected.length} selected</p>
      <Button size="sm" variant="outline" onClick={openMove} disabled={!!busy}>
        Move to…
      </Button>
      <Button size="sm" variant="outline" onClick={handleZip} disabled={!!busy}>
        {busy === 'zip' ? 'Zipping…' : 'Download zip'}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
        disabled={!!busy}
      >
        {busy === 'delete' ? 'Deleting…' : 'Move to trash'}
      </Button>
      <Button size="sm" variant="ghost" onClick={onClear} disabled={!!busy}>
        Clear
      </Button>

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent className="shad-dialog button">
          <DialogHeader>
            <DialogTitle className="text-center text-light-100 dark:text-ink-200">
              Move {selected.length} item(s)
            </DialogTitle>
          </DialogHeader>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROOT}>My Files (root)</SelectItem>
              {folders
                .filter((f) => !ids.includes(f.id))
                .map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              onClick={() => setMoveOpen(false)}
              className="modal-cancel-button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              disabled={busy === 'move'}
              className="modal-submit-button"
            >
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectionToolbar;
