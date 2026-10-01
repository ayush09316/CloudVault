'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import { signOutUser } from '@/lib/actions/user.actions';
import ThemeToggle from '@/components/ThemeToggle';
import { BrandWordmark } from './BrandMark';
import ShellNavList, { type NavItem } from './ShellNav';
import ShellStorageMeter, { type StorageTotals } from './ShellStorageMeter';
import { initials } from './ShellConstants';

interface Props {
  fullName: string;
  avatar: string;
  email: string;
  navItems: NavItem[];
  totals?: StorageTotals | null;
}

const MobileNavigation = ({
  fullName,
  avatar,
  email,
  navItems,
  totals = null,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-sm sm:hidden">
      <Link
        href="/dashboard"
        aria-label="CloudVault home"
        className="shell-focus flex items-center rounded-md"
      >
        <BrandWordmark markClassName="size-[22px]" />
      </Link>

      <div className="flex items-center gap-1">
        <ThemeToggle className="size-9 rounded-lg" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="shell-focus shell-press flex size-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-900/[0.05] dark:text-ink-300 dark:hover:bg-white/[0.06]"
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent className="flex w-[86vw] max-w-[340px] flex-col gap-0 border-l border-border bg-background p-0">
            <div className="flex items-center gap-3 border-b border-border px-4 pb-4 pt-5">
              {avatar ? (
                <Image
                  src={avatar}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
                />
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full bg-ink-100 text-caption font-semibold dark:bg-ink-800">
                  {initials(fullName)}
                </span>
              )}
              <div className="min-w-0">
                <SheetTitle className="truncate text-body-sm font-medium capitalize">
                  {fullName}
                </SheetTitle>
                <SheetDescription className="truncate text-caption">
                  {email}
                </SheetDescription>
              </div>
            </div>

            <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 py-3">
              <ShellNavList
                items={navItems}
                size="lg"
                onNavigate={() => setOpen(false)}
              />
            </nav>

            <div className="flex flex-col gap-2 border-t border-border p-3">
              <ShellStorageMeter totals={totals} />
              <FileUploader className="!h-11 !w-full !rounded-lg !text-body !shadow-none [&_img]:size-4" />
              <button
                type="button"
                onClick={async () => await signOutUser()}
                className="shell-focus shell-press flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-body font-medium text-ink-600 transition-colors hover:bg-ink-900/[0.04] dark:text-ink-300 dark:hover:bg-white/[0.05]"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileNavigation;
