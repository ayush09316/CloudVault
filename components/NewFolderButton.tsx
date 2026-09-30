'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createFolder } from '@/lib/actions/file.actions';
import { useToast } from '@/hooks/use-toast';

const NewFolderButton = ({ parentId }: { parentId: string | null }) => {
  const path = usePathname();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      await createFolder({ name, parentId, path });
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
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        New folder
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="shad-dialog button">
          <DialogHeader>
            <DialogTitle className="text-center text-light-100">
              New folder
            </DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              onClick={() => setOpen(false)}
              className="modal-cancel-button"
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={isLoading}
              className="modal-submit-button"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewFolderButton;
