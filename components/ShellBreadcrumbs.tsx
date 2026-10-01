'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { navMeta } from './ShellNav';

const LABELS: Record<string, string> = {
  dashboard: 'Overview',
  files: 'My Files',
  documents: 'Documents',
  images: 'Images',
  media: 'Media',
  others: 'Others',
  trash: 'Trash',
  admin: 'Admin',
  users: 'Users',
};

const ShellBreadcrumbs = () => {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0]
    ? `/${parts.slice(0, parts[0] === 'admin' ? 2 : 1).join('/')}`
    : '/dashboard';
  const section = navMeta(first).group;

  const crumbs = [
    {
      label: section === 'More' ? 'Workspace' : section,
      href: null as string | null,
    },
    ...parts.map((p, i) => ({
      label: LABELS[p] ?? decodeURIComponent(p),
      href: i < parts.length - 1 ? `/${parts.slice(0, i + 1).join('/')}` : null,
    })),
  ].filter((c) => c.label !== 'Admin' || section !== 'Admin');

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-body-sm">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li
              key={`${c.label}-${i}`}
              className="flex min-w-0 items-center gap-1"
            >
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="shell-focus truncate rounded px-1 text-ink-500 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={
                    last
                      ? 'truncate px-1 font-medium text-ink-900 dark:text-ink-50'
                      : 'truncate px-1 text-ink-500 dark:text-ink-400'
                  }
                >
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  className="size-3.5 shrink-0 text-ink-300 dark:text-ink-600"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ShellBreadcrumbs;
