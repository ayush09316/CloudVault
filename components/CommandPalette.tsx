'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Folder,
  FileText,
  Image as ImageIcon,
  Video,
  FileStack,
  Trash2,
  ShieldCheck,
  Upload,
  FolderPlus,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const navIcons: Record<string, typeof LayoutDashboard> = {
  '/dashboard': LayoutDashboard,
  '/files': Folder,
  '/documents': FileText,
  '/images': ImageIcon,
  '/media': Video,
  '/others': FileStack,
  '/trash': Trash2,
  '/admin/users': ShieldCheck,
};

interface Props {
  navItems: { url: string; name: string }[];
}

const CommandPalette = ({ navItems }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const go = useCallback(
    (url: string) => {
      setOpen(false);
      router.push(url);
    },
    [router]
  );

  const runUpload = useCallback(() => {
    setOpen(false);
    window.dispatchEvent(new Event('cloudvault:upload'));
  }, []);

  const runNewFolder = useCallback(() => {
    setOpen(false);
    const dispatch = () =>
      window.dispatchEvent(new Event('cloudvault:new-folder'));
    if (window.location.pathname === '/files') {
      dispatch();
    } else {
      router.push('/files');
      setTimeout(dispatch, 150);
    }
  }, [router]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search actions and pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={runUpload} value="upload a file">
            <Upload aria-hidden="true" />
            Upload a file
          </CommandItem>
          <CommandItem onSelect={runNewFolder} value="new folder create folder">
            <FolderPlus aria-hidden="true" />
            New folder
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Navigate">
          {navItems.map((item) => {
            const Icon = navIcons[item.url] ?? Folder;
            return (
              <CommandItem
                key={item.url}
                onSelect={() => go(item.url)}
                value={item.name}
              >
                <Icon aria-hidden="true" />
                {item.name}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
