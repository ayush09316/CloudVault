'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function RootSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <div className="shell-panel shell-rise max-w-xl p-6">
        <div className="flex size-9 items-center justify-center rounded-lg border border-signal-rose/25 bg-signal-rose/10 text-signal-rose">
          <AlertTriangle className="size-4" aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-display text-h4 tracking-[-0.01em] text-ink-900 dark:text-ink-50">
          Couldn&apos;t load this page
        </h1>
        <p className="mt-1 text-body-sm text-ink-500 dark:text-ink-400">
          Something went wrong while loading your files. Your data is safe — try
          again, or head back to the overview.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-ink-400">
            Reference {error.digest}
          </p>
        )}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="shell-focus shell-press inline-flex h-8 items-center gap-1.5 rounded-lg bg-vault-600 px-3 text-body-sm font-medium text-white transition-colors hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
          >
            <RotateCw className="size-3.5" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="shell-focus shell-press inline-flex h-8 items-center rounded-lg border border-border px-3 text-body-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/[0.04] dark:text-ink-200 dark:hover:bg-white/[0.05]"
          >
            Go to overview
          </Link>
        </div>
      </div>
    </div>
  );
}
