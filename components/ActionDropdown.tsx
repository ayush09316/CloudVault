'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import Image from 'next/image';
import { actionsDropdownItems } from '@/constants';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { deleteFile, renameFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from '@/components/ActionsModalContent';
import { fileContentUrl } from '@/lib/preview';
import { useToast } from '@/hooks/use-toast';
import { ActionType, FileDocument } from '@/types';

const FOLDER_ACTIONS = ['rename', 'details', 'delete'];

const baseName = (file: FileDocument) =>
  file.isFolder || !file.extension
    ? file.name
    : file.name.replace(new RegExp(`\\.${file.extension}$`, 'i'), '');

const ActionDropdown = ({ file }: { file: FileDocument }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(baseName(file));
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(baseName(file));
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      delete: () => deleteFile({ fileId: file.$id, path }),
    };

    try {
      const success = await actions[action.value as keyof typeof actions]();
      if (success) closeAllModals();
    } catch {
      toast({
        description: `Failed to ${action.value} ${file.name}.`,
        className: 'error-toast',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const items = file.isFolder
    ? actionsDropdownItems.filter((i) => FOLDER_ACTIONS.includes(i.value))
    : actionsDropdownItems;

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {label} {file.name}
          </DialogDescription>
          {value === 'rename' && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === 'details' && <FileDetails file={file} />}
          {value === 'share' && <ShareInput file={file} />}
          {value === 'delete' && (
            <p className="delete-confirmation">
              Move{` `}
              <span className="delete-file-name">{file.name}</span> to the
              trash?
            </p>
          )}
        </DialogHeader>
        {['rename', 'delete'].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          className="shad-no-focus"
          data-testid="file-actions"
        >
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (
                  ['rename', 'share', 'delete', 'details'].includes(
                    actionItem.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === 'download' ? (
                <Link
                  href={fileContentUrl(file.$id, { download: true })}
                  download={file.name}
                  prefetch={false}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
