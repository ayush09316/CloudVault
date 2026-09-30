'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface SidebarInterface {
  navItems: { url: string; name: string; icon: string }[];
  isAdmin?: boolean;
}

const Sidebar = ({ navItems, isAdmin = false }: SidebarInterface) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/dashboard">
        <Image
          src={
            isAdmin
              ? '/assets/icons/logo-full-admin.svg'
              : '/assets/icons/logo-full-brand.svg'
          }
          alt="CloudVault"
          width={160}
          height={40}
          className="hidden h-auto dark:hidden lg:block"
        />
        <Image
          src={
            isAdmin
              ? '/assets/icons/logo-full-admin-dark.svg'
              : '/assets/icons/logo-full-brand-dark.svg'
          }
          alt="CloudVault"
          width={160}
          height={40}
          className="hidden h-auto dark:lg:block"
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="CloudVault"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  'sidebar-nav-item',
                  pathname === url && 'shad-active'
                )}
              >
                <Image
                  src={icon}
                  alt=""
                  width={24}
                  height={24}
                  className={cn(
                    'nav-icon',
                    pathname === url && 'nav-icon-active'
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <div className="hidden rounded-2xl border border-vault-600/15 bg-vault-600/5 p-4 dark:border-vault-400/15 dark:bg-vault-400/5 lg:block">
        <div className="mb-2 flex size-8 items-center justify-center rounded-full bg-vault-600/10 text-vault-600 dark:text-vault-300">
          <ShieldCheck className="size-4" aria-hidden="true" />
        </div>
        <p className="text-body-sm font-medium text-ink-800 dark:text-ink-100">
          Your files, encrypted in transit.
        </p>
        <p className="mt-1 text-caption text-muted-foreground">
          Folders, trash and shares — all in one vault.
        </p>
      </div>
    </aside>
  );
};
export default Sidebar;
