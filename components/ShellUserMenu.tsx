'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ChevronsUpDown, LogOut, Moon, Sun, Command } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOutUser } from '@/lib/actions/user.actions';
import { cn } from '@/lib/utils';
import { initials } from './ShellConstants';

interface Props {
  fullName: string;
  email: string;
  avatar: string;
  collapsed?: boolean;
}

const ShellUserMenu = ({
  fullName,
  email,
  avatar,
  collapsed = false,
}: Props) => {
  const { resolvedTheme, setTheme } = useTheme();

  const openPalette = () =>
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={cn(
          'shell-focus flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-ink-900/[0.04] data-[state=open]:bg-ink-900/[0.06] dark:hover:bg-white/[0.04] dark:data-[state=open]:bg-white/[0.07]',
          collapsed && 'justify-center'
        )}
      >
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
          />
        ) : (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[11px] font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
            {initials(fullName)}
          </span>
        )}
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span
                className="block truncate text-body-sm font-medium capitalize text-ink-800 dark:text-ink-100"
                title={fullName}
              >
                {fullName}
              </span>
              <span
                className="block truncate text-[11px] text-ink-400 dark:text-ink-500"
                title={email}
              >
                {email}
              </span>
            </span>
            <ChevronsUpDown
              className="size-3.5 shrink-0 text-ink-400"
              aria-hidden="true"
            />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={collapsed ? 'right' : 'top'}
        align="start"
        sideOffset={8}
        className="w-60 rounded-xl border-border p-1 shadow-soft-lg"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="truncate text-body-sm font-medium capitalize">
            {fullName}
          </p>
          <p className="truncate text-caption font-normal text-muted-foreground">
            {email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={openPalette}
          className="gap-2 rounded-md text-body-sm"
        >
          <Command
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          Command menu
          <kbd className="shell-kbd ml-auto">⌘K</kbd>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="gap-2 rounded-md text-body-sm"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="size-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <Moon className="size-4 text-muted-foreground" aria-hidden="true" />
          )}
          {resolvedTheme === 'dark' ? 'Light theme' : 'Dark theme'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await signOutUser();
          }}
          className="gap-2 rounded-md text-body-sm text-signal-rose focus:text-signal-rose"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShellUserMenu;
