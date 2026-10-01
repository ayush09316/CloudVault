import {
  LayoutGrid,
  FolderClosed,
  FileText,
  Image as ImageIcon,
  Film,
  Shapes,
  Trash2,
  Search,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/BrandMark';

export type AppView = 'dashboard' | 'files' | 'share' | 'trash';

const NAV: { key: string; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'files', label: 'My Files', icon: FolderClosed },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'images', label: 'Images', icon: ImageIcon },
  { key: 'media', label: 'Media', icon: Film },
  { key: 'others', label: 'Others', icon: Shapes },
  { key: 'trash', label: 'Trash', icon: Trash2 },
];

const ACTIVE_NAV: Record<AppView, string> = {
  dashboard: 'dashboard',
  files: 'files',
  share: 'files',
  trash: 'trash',
};

const AppShell = ({
  view,
  children,
}: {
  view: AppView;
  children: React.ReactNode;
}) => (
  <div className="flex h-full overflow-hidden rounded-[14px] border border-border bg-background text-foreground">
    <aside className="hidden w-[148px] shrink-0 flex-col border-r border-border bg-secondary/40 p-2.5 sm:flex">
      <div className="mb-3 flex items-center gap-1.5 px-1.5 pt-0.5">
        <BrandMark className="size-3.5" aria-hidden />
        <span className="font-display text-[11px] font-semibold tracking-tight">
          CloudVault
        </span>
      </div>
      <ul className="space-y-0.5">
        {NAV.map((n) => {
          const active = ACTIVE_NAV[view] === n.key;
          return (
            <li
              key={n.key}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-[10.5px]',
                active
                  ? 'bg-background font-medium text-foreground shadow-[0_0_0_1px_hsl(var(--border))]'
                  : 'text-muted-foreground'
              )}
            >
              <n.icon
                className={cn('size-3', active && 'cvl-accent')}
                aria-hidden
              />
              {n.label}
            </li>
          );
        })}
      </ul>
      <div className="mt-auto rounded-md border border-border bg-background p-2">
        <p className="text-[9px] text-muted-foreground">Storage</p>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-[43%] rounded-full bg-vault-600 dark:bg-vault-400" />
        </div>
        <p className="cvl-mono mt-1.5 text-[8.5px] text-muted-foreground">
          0.86 / 2 GB
        </p>
      </div>
    </aside>
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <div className="flex h-6 flex-1 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2 text-[10px] text-muted-foreground">
          <Search className="size-3" aria-hidden />
          Search files
          <span className="cvl-mono ml-auto text-[9px]">⌘K</span>
        </div>
        <span className="flex h-6 items-center gap-1 rounded-md bg-vault-600 px-2 text-[10px] font-medium text-white dark:bg-vault-400 dark:text-ink-950">
          <Upload className="size-3" aria-hidden />
          Upload
        </span>
        <span className="flex size-6 items-center justify-center rounded-full bg-vault-600/15 text-[9px] font-semibold text-vault-700 dark:text-vault-300">
          A
        </span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  </div>
);

export default AppShell;
