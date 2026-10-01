import React from 'react';
import { cookies } from 'next/headers';
import Sidebar from '@/components/Sidebar';
import { SIDEBAR_COOKIE } from '@/components/ShellConstants';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/Header';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getTotalSpaceUsed } from '@/lib/actions/file.actions';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { adminNavItems, navItems } from '@/constants';
import CommandPalette from '@/components/CommandPalette';
import DropOverlay from '@/components/DropOverlay';

export const dynamic = 'force-dynamic';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const [currentUser, totals, cookieStore] = await Promise.all([
    getCurrentUser(),
    getTotalSpaceUsed().catch(() => null),
    cookies(),
  ]);

  if (!currentUser) return redirect('/sign-in');

  const items = currentUser.isAdmin
    ? [...navItems, ...adminNavItems]
    : navItems;
  const collapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === 'collapsed';
  const user = {
    fullName: currentUser.fullName,
    email: currentUser.email,
    avatar: currentUser.avatar,
  };

  return (
    <main className="flex h-screen bg-background">
      <Sidebar
        navItems={items}
        isAdmin={!!currentUser.isAdmin}
        defaultCollapsed={collapsed}
        totals={totals ?? null}
        user={user}
      />

      <section className="flex h-full min-w-0 flex-1 flex-col">
        <MobileNavigation {...user} navItems={items} totals={totals ?? null} />
        <Header {...user} />
        <div className="remove-scrollbar flex-1 overflow-auto bg-ink-50/60 px-4 py-6 dark:bg-ink-950 sm:px-6 lg:p-8">
          {children}
        </div>
      </section>

      <CommandPalette navItems={items} />
      <DropOverlay />
      <Toaster />
    </main>
  );
};
export default Layout;
