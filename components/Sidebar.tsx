'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarInterface {
  navItems: { url: string; name: string; icon: string }[];
}

const Sidebar = ({ navItems }: SidebarInterface) => {
  const pathname = usePathname();
  const isPathAdmin = pathname.includes('admin');

  return (
    <aside className="sidebar">
      <Link href="/">
        {isPathAdmin ? (
          <Image
            src="/assets/icons/logo-full-admin.svg"
            alt="logo"
            width={160}
            height={50}
            className="hidden h-auto lg:block"
          />
        ) : (
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={160}
            height={50}
            className="hidden h-auto lg:block"
          />
        )}

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
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
                  alt={name}
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

      <Image
        src="/assets/images/files-2.svg"
        alt="logo"
        width={200}
        height={218}
        className="w-full"
      />
    </aside>
  );
};
export default Sidebar;
