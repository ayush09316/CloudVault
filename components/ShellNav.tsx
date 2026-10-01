'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  LayoutGrid,
  FolderClosed,
  FileText,
  Image as ImageIcon,
  Film,
  Shapes,
  Trash2,
  Users,
  Circle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavItem = { url: string; name: string; icon: string };

const META: Record<string, { icon: LucideIcon; key: string; group: string }> = {
  '/dashboard': { icon: LayoutGrid, key: 'D', group: 'Workspace' },
  '/files': { icon: FolderClosed, key: 'F', group: 'Workspace' },
  '/documents': { icon: FileText, key: 'C', group: 'Library' },
  '/images': { icon: ImageIcon, key: 'I', group: 'Library' },
  '/media': { icon: Film, key: 'M', group: 'Library' },
  '/others': { icon: Shapes, key: 'O', group: 'Library' },
  '/trash': { icon: Trash2, key: 'T', group: 'Workspace' },
  '/admin/users': { icon: Users, key: 'U', group: 'Admin' },
};

const GROUP_ORDER = ['Workspace', 'Library', 'Admin', 'More'];

export const navMeta = (url: string) =>
  META[url] ?? { icon: Circle, key: '', group: 'More' };

export const groupNav = (items: NavItem[]) =>
  GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((i) => navMeta(i.url).group === group),
  })).filter((g) => g.items.length > 0);

export const isActivePath = (pathname: string, url: string) =>
  pathname === url || pathname.startsWith(`${url}/`);

const isTypingTarget = (el: EventTarget | null) => {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) ||
    !!el.closest('[role="dialog"]')
  );
};

export const useGoShortcuts = (items: NavItem[]) => {
  const router = useRouter();
  useEffect(() => {
    let armed = false;
    let timer: number | undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target))
        return;
      const k = e.key.toUpperCase();
      if (!armed) {
        if (k === 'G') {
          armed = true;
          timer = window.setTimeout(() => (armed = false), 900);
        }
        return;
      }
      armed = false;
      window.clearTimeout(timer);
      const hit = items.find((i) => navMeta(i.url).key === k);
      if (hit) {
        e.preventDefault();
        router.push(hit.url);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [items, router]);
};

interface NavListProps {
  items: NavItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
  size?: 'sm' | 'lg';
}

const ShellNavList = ({
  items,
  collapsed = false,
  onNavigate,
  size = 'sm',
}: NavListProps) => {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ y: number; h: number } | null>(null);
  const firstPaint = useRef(true);
  const groups = groupNav(items);
  const activeUrl = items.find((i) => isActivePath(pathname, i.url))?.url;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const el = activeUrl
        ? root.querySelector<HTMLElement>(`[data-nav-url="${activeUrl}"]`)
        : null;
      setPos(el ? { y: el.offsetTop, h: el.offsetHeight } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [activeUrl, collapsed]);

  useEffect(() => {
    if (!pos) return;
    const id = requestAnimationFrame(() => (firstPaint.current = false));
    return () => cancelAnimationFrame(id);
  }, [pos]);

  const rowH = size === 'lg' ? 'h-11 text-body' : 'h-8 text-body-sm';

  return (
    <div ref={rootRef} className="relative">
      <span
        aria-hidden="true"
        className={cn(
          'shell-indicator bg-ink-900/[0.06] dark:bg-white/[0.07]',
          firstPaint.current && 'no-anim',
          !pos && 'opacity-0'
        )}
        style={{
          height: pos?.h ?? 0,
          transform: `translateY(${pos?.y ?? 0}px)`,
        }}
      />
      {groups.map(({ group, items: groupItems }, gi) => (
        <div key={group} className={cn(gi > 0 && 'mt-5')}>
          <p
            className={cn(
              'mb-1 px-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-400 transition-opacity duration-200 dark:text-ink-500',
              collapsed && 'pointer-events-none select-none opacity-0'
            )}
            aria-hidden={collapsed}
          >
            {group}
          </p>
          <ul className="flex flex-col gap-px">
            {groupItems.map((item) => {
              const { icon: Icon, key } = navMeta(item.url);
              const active = item.url === activeUrl;
              return (
                <li key={item.url} data-nav-url={item.url}>
                  <Link
                    href={item.url}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    aria-label={collapsed ? item.name : undefined}
                    className={cn(
                      'shell-focus group relative z-10 flex items-center gap-2.5 rounded-lg px-2.5 font-medium transition-colors duration-150',
                      rowH,
                      active
                        ? 'text-ink-900 dark:text-ink-50'
                        : 'text-ink-500 hover:bg-ink-900/[0.035] hover:text-ink-800 dark:text-ink-400 dark:hover:bg-white/[0.035] dark:hover:text-ink-100'
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={active ? 2.1 : 1.8}
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        active && 'text-vault-600 dark:text-vault-300'
                      )}
                    />
                    <span
                      className={cn(
                        'truncate transition-opacity duration-200',
                        collapsed && 'sr-only'
                      )}
                    >
                      {item.name}
                    </span>
                    {key && !collapsed && size === 'sm' && (
                      <span
                        aria-hidden="true"
                        className="ml-auto flex gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                      >
                        <kbd className="shell-kbd">G</kbd>
                        <kbd className="shell-kbd">{key}</kbd>
                      </span>
                    )}
                    {collapsed && (
                      <span
                        role="tooltip"
                        className="shell-tip flex items-center gap-2 rounded-md border border-border bg-popover px-2 py-1 text-caption text-popover-foreground shadow-soft"
                      >
                        {item.name}
                        {key && (
                          <span className="flex gap-0.5">
                            <kbd className="shell-kbd">G</kbd>
                            <kbd className="shell-kbd">{key}</kbd>
                          </span>
                        )}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ShellNavList;
