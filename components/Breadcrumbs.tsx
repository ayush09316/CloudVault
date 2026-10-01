'use client';

import Link from 'next/link';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRight, HardDrive, MoreHorizontal } from 'lucide-react';
import { Crumb } from '@/lib/folders';
import { menuContentClass, menuItemClass } from '@/components/ActionDropdown';
import FileTypeIcon from '@/components/FileTypeIcon';

const href = (c: Crumb) => (c.id ? `/files?folder=${c.id}` : '/files');

const crumbLink =
  'fx-focus -mx-1 inline-flex h-7 max-w-[200px] items-center gap-1.5 truncate rounded-md px-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-ink-100 hover:text-foreground dark:hover:bg-ink-800';

const Sep = () => (
  <ChevronRight
    aria-hidden="true"
    className="size-3.5 shrink-0 text-ink-300 dark:text-ink-600"
  />
);

const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => {
  const collapse = crumbs.length > 4;
  const head = collapse ? crumbs.slice(0, 1) : crumbs.slice(0, -1);
  const hidden = collapse ? crumbs.slice(1, -2) : [];
  const tail = collapse ? crumbs.slice(-2, -1) : [];
  const last = crumbs[crumbs.length - 1];

  const renderLink = (c: Crumb, i: number) => (
    <li key={c.id ?? 'root'} className="flex min-w-0 items-center gap-1">
      <Link href={href(c)} className={crumbLink} title={c.name}>
        {i === 0 && !c.id && (
          <HardDrive aria-hidden="true" className="size-3.5 shrink-0" />
        )}
        <span className="truncate">{c.name}</span>
      </Link>
      <Sep />
    </li>
  );

  return (
    <nav aria-label="Breadcrumb" data-testid="breadcrumbs">
      <ol className="flex min-w-0 flex-wrap items-center gap-1">
        {head.map((c, i) => renderLink(c, i))}
        {hidden.length > 0 && (
          <li className="flex items-center gap-1">
            <DropdownMenuPrimitive.Root modal={false}>
              <DropdownMenuPrimitive.Trigger
                aria-label={`Show ${hidden.length} more folders`}
                className="fx-icon-btn size-7"
              >
                <MoreHorizontal />
              </DropdownMenuPrimitive.Trigger>
              <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                  align="start"
                  sideOffset={4}
                  className={menuContentClass}
                >
                  {hidden.map((c) => (
                    <DropdownMenuPrimitive.Item
                      key={c.id}
                      asChild
                      className={menuItemClass}
                    >
                      <Link href={href(c)}>
                        <FileTypeIcon type="folder" size="xs" bare />
                        <span className="truncate">{c.name}</span>
                      </Link>
                    </DropdownMenuPrimitive.Item>
                  ))}
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Root>
            <Sep />
          </li>
        )}
        {tail.map((c, i) => renderLink(c, i + 1))}
        {last && (
          <li className="min-w-0">
            <span
              aria-current="page"
              className="block max-w-[260px] truncate px-0.5 text-[13px] font-medium text-foreground"
              title={last.name}
            >
              {last.name}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
