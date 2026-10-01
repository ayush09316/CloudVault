'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useDebounce } from 'use-debounce';
import {
  ArrowLeft,
  Check,
  CornerDownLeft,
  File,
  FileAudio,
  FileStack,
  FileText,
  FileVideo,
  Folder,
  FolderPlus,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Search,
  ShieldCheck,
  SunMedium,
  Trash2,
  Upload,
  Video,
  type LucideIcon,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import { Spinner } from '@/components/ui/spinner';
import { navItems as defaultNavItems } from '@/constants';
import { getFiles } from '@/lib/actions/file.actions';
import { signOutUser } from '@/lib/actions/user.actions';
import { convertFileSize } from '@/lib/utils';
import type { FileDocument } from '@/types';

export const COMMAND_PALETTE_EVENT = 'cloudvault:command-palette';

export const openCommandPalette = () => {
  window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT));
};

const NAV_ICONS: Record<string, LucideIcon> = {
  '/dashboard': LayoutDashboard,
  '/files': Folder,
  '/documents': FileText,
  '/images': ImageIcon,
  '/media': Video,
  '/others': FileStack,
  '/trash': Trash2,
  '/admin/users': ShieldCheck,
};

const FILE_ICONS: Record<string, LucideIcon> = {
  document: FileText,
  image: ImageIcon,
  video: FileVideo,
  audio: FileAudio,
  other: File,
};

const TYPE_ROUTE: Record<string, string> = {
  document: '/documents',
  image: '/images',
  video: '/media',
  audio: '/media',
  other: '/others',
};

const THEMES = [
  { value: 'light', label: 'Light', icon: SunMedium },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

type Page = 'root' | 'theme';

interface Props {
  navItems?: { url: string; name: string }[];
}

const fileHref = (file: FileDocument) =>
  file.isFolder
    ? `/files?folder=${file.$id}`
    : `${TYPE_ROUTE[file.type] ?? '/others'}?query=${encodeURIComponent(file.name)}`;

const FileRow = ({
  file,
  onSelect,
  keywords,
}: {
  file: FileDocument;
  onSelect: (file: FileDocument) => void;
  keywords?: string[];
}) => {
  const Icon = file.isFolder ? Folder : (FILE_ICONS[file.type] ?? File);
  return (
    <CommandItem
      value={`file:${file.$id}`}
      keywords={[file.name, ...(keywords ?? [])]}
      onSelect={() => onSelect(file)}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-surface-sunken">
        <Icon aria-hidden="true" className="!size-3.5" />
      </span>
      <span className="min-w-0 flex-1 truncate">{file.name}</span>
      <CommandShortcut className="tabular-nums">
        {file.isFolder ? 'Folder' : convertFileSize(file.size)}
      </CommandShortcut>
    </CommandItem>
  );
};

const CommandPalette = ({ navItems = defaultNavItems }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<Page>('root');
  const [search, setSearch] = useState('');
  const [debounced] = useDebounce(search.trim(), 200);
  const [results, setResults] = useState<FileDocument[]>([]);
  const [recent, setRecent] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const recentFetchedAt = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener(COMMAND_PALETTE_EVENT, onOpen);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener(COMMAND_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPage('root');
        setSearch('');
        setResults([]);
      }, 150);
      return () => clearTimeout(t);
    }
    if (Date.now() - recentFetchedAt.current < 30_000) return;
    recentFetchedAt.current = Date.now();
    getFiles({ types: [], sort: '$updatedAt-desc', limit: 5 })
      .then((res) => setRecent(res?.documents ?? []))
      .catch(() => setRecent([]));
  }, [open]);

  useEffect(() => {
    if (page !== 'root' || debounced.length < 2) {
      requestId.current++;
      setResults([]);
      setLoading(false);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    getFiles({
      types: [],
      searchText: debounced,
      limit: 8,
      includeFolders: true,
    })
      .then((res) => {
        if (id === requestId.current) setResults(res?.documents ?? []);
      })
      .catch(() => {
        if (id === requestId.current) setResults([]);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [debounced, page]);

  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (url: string) => {
      close();
      router.push(url);
    },
    [close, router]
  );

  const openFile = useCallback(
    (file: FileDocument) => go(fileHref(file)),
    [go]
  );

  const runUpload = useCallback(() => {
    close();
    window.dispatchEvent(new Event('cloudvault:upload'));
  }, [close]);

  const runNewFolder = useCallback(() => {
    close();
    const dispatch = () =>
      window.dispatchEvent(new Event('cloudvault:new-folder'));
    if (window.location.pathname === '/files') {
      dispatch();
    } else {
      router.push('/files');
      setTimeout(dispatch, 150);
    }
  }, [close, router]);

  const runSignOut = useCallback(() => {
    close();
    startTransition(() => {
      signOutUser();
    });
  }, [close]);

  const pushPage = (next: Page) => {
    setPage(next);
    setSearch('');
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (page === 'root') return;
    if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
      e.preventDefault();
      e.stopPropagation();
      setPage('root');
    }
  };

  const showFiles =
    page === 'root' && debounced.length >= 2 && results.length > 0;
  const showRecent = page === 'root' && !search && recent.length > 0;

  const footer = (
    <div className="flex h-10 items-center justify-between gap-3 border-t bg-surface-sunken/60 px-3 text-caption text-muted-foreground">
      <span className="flex min-w-0 items-center gap-2 truncate">
        {page === 'root' ? (
          <>
            <span
              className="size-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
            CloudVault
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPage('root')}
            className="inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back
          </button>
        )}
      </span>
      <span className="hidden items-center gap-3 sm:flex" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <Kbd size="sm">
            <CornerDownLeft className="size-2.5" />
          </Kbd>
          Select
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd size="sm">↑</Kbd>
          <Kbd size="sm">↓</Kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd size="sm">{page === 'root' ? 'esc' : '⌫'}</Kbd>
          {page === 'root' ? 'Close' : 'Back'}
        </span>
      </span>
    </div>
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      footer={footer}
      onKeyDown={onKeyDown}
      loop
    >
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder={
          page === 'theme'
            ? 'Choose a theme…'
            : 'Search files or type a command…'
        }
        leading={
          page === 'theme' ? (
            <span className="inline-flex h-6 shrink-0 items-center rounded-md bg-accent px-2 text-caption font-medium text-foreground">
              Theme
            </span>
          ) : (
            <Search
              className="size-[18px] shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          )
        }
        trailing={
          loading ? (
            <Spinner className="text-muted-foreground" label="Searching" />
          ) : (
            <Kbd className="hidden sm:inline-flex">esc</Kbd>
          )
        }
      />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            'Searching…'
          ) : (
            <>
              <span className="text-foreground">No results</span>
              <span className="text-caption">
                {search ? `Nothing matches “${search}”.` : 'Try another word.'}
              </span>
            </>
          )}
        </CommandEmpty>

        {page === 'theme' && (
          <CommandGroup heading="Theme">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <CommandItem
                key={value}
                value={`theme:${value}`}
                keywords={[label]}
                onSelect={() => {
                  setTheme(value);
                  close();
                }}
              >
                <Icon aria-hidden="true" />
                {label}
                {theme === value && (
                  <Check
                    className="ml-auto !text-primary-text"
                    aria-label="Current"
                  />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showFiles && (
          <CommandGroup heading="Files">
            {results.map((file) => (
              <FileRow
                key={file.$id}
                file={file}
                onSelect={openFile}
                keywords={[search]}
              />
            ))}
          </CommandGroup>
        )}

        {showRecent && (
          <CommandGroup heading="Recent">
            {recent.map((file) => (
              <FileRow key={file.$id} file={file} onSelect={openFile} />
            ))}
          </CommandGroup>
        )}

        {page === 'root' && (
          <>
            <CommandGroup heading="Actions">
              <CommandItem
                value="action:upload"
                keywords={['upload', 'add', 'file']}
                onSelect={runUpload}
              >
                <Upload aria-hidden="true" />
                Upload files
              </CommandItem>
              <CommandItem
                value="action:new-folder"
                keywords={['new', 'create', 'folder']}
                onSelect={runNewFolder}
              >
                <FolderPlus aria-hidden="true" />
                New folder
              </CommandItem>
              <CommandItem
                value="action:theme"
                keywords={['theme', 'dark', 'light', 'appearance', 'mode']}
                onSelect={() => pushPage('theme')}
              >
                <Moon aria-hidden="true" />
                Change theme…
                <CommandShortcut className="capitalize">
                  {theme}
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Go to">
              {navItems.map((item) => {
                const Icon = NAV_ICONS[item.url] ?? Folder;
                const current = pathname === item.url;
                return (
                  <CommandItem
                    key={item.url}
                    value={`nav:${item.url}`}
                    keywords={[item.name, 'go', 'open']}
                    onSelect={() => go(item.url)}
                  >
                    <Icon aria-hidden="true" />
                    {item.name}
                    {current && <CommandShortcut>Current</CommandShortcut>}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandGroup heading="Account">
              <CommandItem
                value="action:sign-out"
                keywords={['sign out', 'log out', 'logout']}
                onSelect={runSignOut}
              >
                <LogOut aria-hidden="true" />
                Sign out
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
