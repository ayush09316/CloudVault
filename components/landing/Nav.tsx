import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { BrandWordmark } from '@/components/BrandMark';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#security', label: 'Security' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

export const Brand = ({ className }: { className?: string }) => (
  <Link
    href="/"
    className={`inline-flex rounded-md ${className ?? ''}`}
    aria-label="CloudVault home"
  >
    <BrandWordmark />
  </Link>
);

const Nav = () => (
  <header
    data-cvl-nav
    data-scrolled="false"
    className="cvl-nav sticky top-0 z-40"
  >
    <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
      <div className="flex items-center gap-8">
        <Brand />
        <nav aria-label="Sections" className="hidden items-center md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle className="size-9 rounded-full text-muted-foreground" />
        <Link
          href="/sign-in"
          className="hidden h-9 items-center rounded-full px-3 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground min-[400px]:inline-flex"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="cvl-btn inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-medium"
        >
          <span className="shine" aria-hidden />
          Create a vault
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  </header>
);

export default Nav;
