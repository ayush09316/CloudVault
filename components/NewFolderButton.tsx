'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FolderPlus, Loader2 } from 'lucide-react';
import { FileDialog, FileDialogContent } from '@/components/FileDialog';
import { createFolder } from '@/lib/actions/file.actions';
import { useToast } from '@/hooks/use-toast';

const NewFolderButton = ({ parentId }: { parentId: string | null }) => {
  const path = usePathname();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('cloudvault:new-folder', handler);
    return () => window.removeEventListener('cloudvault:new-folder', handler);
  }, []);

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  const submit = async () => {
    if (!name.trim() || isLoading) return;
    setIsLoading(true);
    try {
      await createFolder({ name: name.trim(), parentId, path });
      setOpen(false);
      setName('');
    } catch {
      toast({
        description: 'Failed to create folder.',
        className: 'error-toast',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fx-btn fx-btn-secondary"
        onClick={() => setOpen(true)}
      >
        <FolderPlus aria-hidden="true" />
        New folder
      </button>
      <FileDialog open={open} onOpenChange={setOpen}>
        <FileDialogContent
          title="New folder"
          footer={
            <>
              <button
                type="button"
                className="fx-btn fx-btn-ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="new-folder-form"
                disabled={isLoading || !name.trim()}
                className="fx-btn fx-btn-primary min-w-[80px]"
              >
                {isLoading && (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                )}
                Create
              </button>
            </>
          }
        >
          <form
            id="new-folder-form"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label
              htmlFor="new-folder-name"
              className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground"
            >
              Name
            </label>
            <input
              id="new-folder-name"
              autoFocus
              autoComplete="off"
              placeholder="Folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fx-input"
            />
          </form>
        </FileDialogContent>
      </FileDialog>
    </>
  );
};

export default NewFolderButton;
