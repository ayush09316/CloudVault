'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { permanentlyDeleteFile, restoreFile } from '@/lib/actions/file.actions';
import { useToast } from '@/hooks/use-toast';
import { FileDocument } from '@/types';

const TrashActions = ({ file }: { file: FileDocument }) => {
  const path = usePathname();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const run = async (fn: () => Promise<unknown>, failure: string) => {
    setIsLoading(true);
    try {
      await fn();
      setConfirmOpen(false);
    } catch {
      toast({ description: failure, className: 'error-toast' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isLoading}
        onClick={() =>
          run(
            () => restoreFile({ fileId: file.$id, path }),
            'Failed to restore file.'
          )
        }
      >
        Restore
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={isLoading}
        onClick={() => setConfirmOpen(true)}
      >
        Delete forever
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="shad-dialog button">
          <DialogHeader>
            <DialogTitle className="text-center text-light-100 dark:text-ink-200">
              Delete forever
            </DialogTitle>
            <p className="delete-confirmation">
              Permanently delete{' '}
              <span className="delete-file-name">{file.name}</span>
              {file.isFolder ? ' and everything inside it' : ''}? This cannot be
              undone.
            </p>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              onClick={() => setConfirmOpen(false)}
              className="modal-cancel-button"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() =>
                run(
                  () => permanentlyDeleteFile({ fileId: file.$id, path }),
                  'Failed to delete file.'
                )
              }
              className="modal-submit-button"
            >
              Delete forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrashActions;
