import React from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/Header';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { adminNavItems, navItems } from '@/constants';
import CommandPalette from '@/components/CommandPalette';
import DropOverlay from '@/components/DropOverlay';

export const dynamic = 'force-dynamic';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect('/sign-in');

  const items = currentUser.isAdmin
    ? [...navItems, ...adminNavItems]
    : navItems;

  return (
    <main className="flex h-screen">
      <Sidebar navItems={items} isAdmin={!!currentUser.isAdmin} />

      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} navItems={items} />
        <Header {...currentUser} />
        <div className="main-content">{children}</div>
      </section>

      <CommandPalette navItems={items} />
      <DropOverlay />
      <Toaster />
    </main>
  );
};
export default Layout;
