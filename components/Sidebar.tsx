'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandMark, BrandWordmark } from './BrandMark';
import ShellNavList, { type NavItem, useGoShortcuts } from './ShellNav';
import ShellStorageMeter, { type StorageTotals } from './ShellStorageMeter';
import ShellUserMenu from './ShellUserMenu';
import { SIDEBAR_COOKIE } from './ShellConstants';

interface SidebarInterface {
  navItems: NavItem[];
  isAdmin?: boolean;
  defaultCollapsed?: boolean;
  totals?: StorageTotals | null;
  user?: { fullName: string; email: string; avatar: string };
}

const Sidebar = ({
  navItems,
  isAdmin = false,
  defaultCollapsed = false,
  totals = null,
  user,
}: SidebarInterface) => {
  const [pref, setPref] = useState(defaultCollapsed);
  const [narrow, setNarrow] = useState(false);
  const collapsed = pref || narrow;

  useGoShortcuts(navItems);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const toggle = useCallback(
    () =>
      setPref((v) => {
        const next = !v;
        document.cookie = `${SIDEBAR_COOKIE}=${next ? 'collapsed' : 'expanded'}; path=/; max-age=31536000; samesite=lax`;
        return next;
      }),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        e.key !== '[' ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        (t &&
          (t.isContentEditable ||
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)))
      )
        return;
      e.preventDefault();
      toggle();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [toggle]);

  return (
    <aside
      data-collapsed={collapsed}
      aria-label="Primary"
      className={cn(
        'hidden h-screen shrink-0 flex-col border-r border-border bg-background sm:flex',
        collapsed ? 'w-[60px]' : 'w-[248px]'
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center px-3',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <Link
          href="/dashboard"
          aria-label="CloudVault home"
          className="shell-focus flex items-center gap-2 rounded-md p-1"
        >
          <BrandMark className="size-[22px]" aria-hidden="true" />
          {!collapsed && (
            <span className="flex items-center gap-1.5">
              <BrandWordmark hideMark />
              {isAdmin && (
                <span className="rounded border border-border px-1 py-px text-[10px] font-medium uppercase tracking-[0.06em] text-ink-500 dark:text-ink-400">
                  Admin
                </span>
              )}
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar  ["
            className="shell-focus shell-press hidden size-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-900/[0.05] hover:text-ink-700 dark:hover:bg-white/[0.06] dark:hover:text-ink-200 lg:flex"
          >
            <PanelLeftClose className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Main" className="flex-1 px-2 pt-2">
        <ShellNavList items={navItems} collapsed={collapsed} />
      </nav>

      <div className="flex flex-col gap-1 border-t border-border p-2">
        {collapsed && !narrow && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Expand sidebar"
            className="shell-focus shell-press group relative mx-auto flex size-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-900/[0.05] hover:text-ink-700 dark:hover:bg-white/[0.06] dark:hover:text-ink-200"
          >
            <PanelLeftOpen className="size-4" aria-hidden="true" />
            <span
              role="tooltip"
              className="shell-tip flex items-center gap-2 rounded-md border border-border bg-popover px-2 py-1 text-caption text-popover-foreground shadow-soft"
            >
              Expand <kbd className="shell-kbd">[</kbd>
            </span>
          </button>
        )}
        <ShellStorageMeter totals={totals} collapsed={collapsed} />
        {user && <ShellUserMenu {...user} collapsed={collapsed} />}
      </div>
    </aside>
  );
};
export default Sidebar;
