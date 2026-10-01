'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowUpFromLine,
  FolderPlus,
  Search,
  Trash2,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Action = {
  label: string;
  hint: string;
  icon: LucideIcon;
  keys?: string[];
  run: () => void;
  primary?: boolean;
};

const DashboardQuickActions = ({ className }: { className?: string }) => {
  const router = useRouter();

  const actions: Action[] = [
    {
      label: 'Upload files',
      hint: 'Or drop anywhere on the page',
      icon: ArrowUpFromLine,
      primary: true,
      run: () => window.dispatchEvent(new Event('cloudvault:upload')),
    },
    {
      label: 'Create folder',
      hint: 'Opens in My Files',
      icon: FolderPlus,
      run: () => {
        router.push('/files');
        window.setTimeout(
          () => window.dispatchEvent(new Event('cloudvault:new-folder')),
          150
        );
      },
    },
    {
      label: 'Jump to anything',
      hint: 'Files, pages and actions',
      icon: Search,
      keys: ['⌘', 'K'],
      run: () =>
        document.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'k', metaKey: true })
        ),
    },
    {
      label: 'Review trash',
      hint: 'Restore or delete for good',
      icon: Trash2,
      keys: ['G', 'T'],
      run: () => router.push('/trash'),
    },
  ];

  return (
    <section
      aria-labelledby="quick-actions-title"
      className={cn('shell-panel flex flex-col p-1.5', className)}
    >
      <h2
        id="quick-actions-title"
        className="px-3 pb-1.5 pt-2.5 text-caption font-medium text-ink-500 dark:text-ink-400"
      >
        Quick actions
      </h2>
      <ul className="flex flex-1 flex-col">
        {actions.map((a, i) => (
          <li
            key={a.label}
            className="shell-rise"
            style={{ ['--i' as string]: i }}
          >
            <button
              type="button"
              onClick={a.run}
              className="shell-focus shell-press group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors hover:bg-ink-900/[0.035] dark:hover:bg-white/[0.04]"
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors',
                  a.primary
                    ? 'border-vault-600 bg-vault-600 text-white dark:border-vault-400 dark:bg-vault-400 dark:text-ink-950'
                    : 'border-border bg-background text-ink-600 group-hover:text-ink-900 dark:text-ink-300 dark:group-hover:text-ink-50'
                )}
              >
                <a.icon
                  className="size-4"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body-sm font-medium text-ink-900 dark:text-ink-50">
                  {a.label}
                </span>
                <span className="block truncate text-caption text-ink-500 dark:text-ink-400">
                  {a.hint}
                </span>
              </span>
              {a.keys ? (
                <span className="flex gap-0.5" aria-hidden="true">
                  {a.keys.map((k) => (
                    <kbd key={k} className="shell-kbd">
                      {k}
                    </kbd>
                  ))}
                </span>
              ) : (
                <ChevronRight
                  className="size-4 text-ink-300 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-ink-600"
                  aria-hidden="true"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DashboardQuickActions;
