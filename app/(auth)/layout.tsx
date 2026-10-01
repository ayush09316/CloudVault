import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { BrandWordmark } from '@/components/BrandMark';
import AuthShowcase from '@/components/landing/AuthShowcase';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="cvl grid min-h-dvh bg-background text-foreground lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
      <section className="relative flex min-h-dvh flex-col">
        <header className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            aria-label="CloudVault home"
            className="inline-flex rounded-md"
          >
            <BrandWordmark />
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back to site
            </Link>
            <ThemeToggle className="size-9 rounded-full text-muted-foreground" />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="cvl-rise w-full max-w-[400px]">{children}</div>
        </main>

        <footer className="cvl-mono flex items-center justify-between px-5 pb-6 text-[11px] text-muted-foreground sm:px-8">
          <span>© {new Date().getFullYear()} CloudVault</span>
          <span>No passwords. Codes by email.</span>
        </footer>
      </section>

      <aside className="sticky top-0 hidden h-dvh border-l border-border lg:block">
        <AuthShowcase />
      </aside>
    </div>
  );
};

export default Layout;
