import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FolderTree, Share2, Trash2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const highlights = [
  { icon: FolderTree, label: 'Nested folders, not one flat bucket' },
  { icon: Share2, label: 'Expiring, permission-aware share links' },
  { icon: Trash2, label: 'A trash you can actually restore from' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-vault-900 p-10 text-white lg:flex xl:w-2/5">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(59,190,156,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(112,216,185,0.25), transparent 50%)',
          }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <Image
            src="/assets/icons/logo-brand.svg"
            alt="CloudVault"
            width={36}
            height={36}
          />
          <span className="font-display text-xl font-bold">CloudVault</span>
        </Link>

        <div className="relative z-10 max-w-[420px] space-y-8">
          <h1 className="h1 font-display">
            Storage that finally stays organized.
          </h1>
          <ul className="space-y-4">
            {highlights.map((h) => (
              <li
                key={h.label}
                className="body-1 flex items-center gap-3 text-white/85"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
                  <h.icon className="size-4" aria-hidden="true" />
                </span>
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-caption text-white/50">
          &copy; {new Date().getFullYear()} CloudVault
        </p>
      </section>

      <section className="flex flex-1 flex-col items-center bg-background p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-10 flex w-full max-w-[480px] items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/icons/logo-brand.svg"
              alt="CloudVault"
              width={32}
              height={32}
            />
            <span className="font-display text-lg font-bold">CloudVault</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mb-4 hidden w-full max-w-[480px] justify-end lg:flex">
          <ThemeToggle />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
