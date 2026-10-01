'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Copy } from 'lucide-react';

import { BrandWordmark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type StatusPageProps = {
  code: string;
  title: string;
  description: React.ReactNode;
  detail?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export const StatusPage = ({
  code,
  title,
  description,
  detail,
  actions,
  className,
}: StatusPageProps) => (
  <main
    className={cn(
      'relative isolate flex min-h-dvh flex-col overflow-hidden bg-background text-foreground',
      className
    )}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,hsl(var(--border)/0.7)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.7)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_42%,#000_10%,transparent_70%)]"
    />
    <header className="flex h-16 items-center px-6 sm:px-10">
      <Link
        href="/"
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <BrandWordmark />
      </Link>
    </header>

    <section className="flex flex-1 items-center justify-center px-6 pb-24">
      <div className="w-full max-w-[440px] animate-fade-up">
        <p className="font-mono text-caption font-medium uppercase tracking-[0.08em] text-subtle">
          {code}
        </p>
        <h1 className="mt-3 text-h1 text-foreground">{title}</h1>
        <p className="mt-3 text-body text-muted-foreground">{description}</p>
        {detail && <div className="mt-6">{detail}</div>}
        {actions && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </section>
  </main>
);

export const RequestedPath = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-lg border bg-surface px-3 py-2.5 shadow-xs">
      <span
        className="size-1.5 shrink-0 rounded-full bg-warning"
        aria-hidden="true"
      />
      <code className="min-w-0 flex-1 truncate text-caption text-muted-foreground">
        <span className="text-subtle">cloudvault</span>
        <span className="text-foreground">{pathname || '/'}</span>
      </code>
      <span className="shrink-0 font-mono text-2xs uppercase tracking-[0.06em] text-warning-text">
        Not found
      </span>
    </div>
  );
};

export const BackButton = ({ fallback = '/' }: { fallback?: string }) => {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() =>
        window.history.length > 1 ? router.back() : router.push(fallback)
      }
    >
      <ArrowLeft aria-hidden="true" />
      Go back
    </Button>
  );
};

export const ErrorReference = ({ digest }: { digest?: string }) => {
  const [copied, setCopied] = React.useState(false);
  if (!digest) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-surface px-3 py-2 shadow-xs">
      <span
        className="size-1.5 shrink-0 rounded-full bg-destructive"
        aria-hidden="true"
      />
      <span className="text-caption text-muted-foreground">Reference</span>
      <code className="min-w-0 flex-1 truncate text-caption text-foreground">
        {digest}
      </code>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy reference'}
      >
        {copied ? <Check className="text-success-text" /> : <Copy />}
      </Button>
    </div>
  );
};
