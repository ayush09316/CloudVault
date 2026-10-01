'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCw, TriangleAlert } from 'lucide-react';

const FileRouteError = ({
  error,
  reset,
  title = 'Couldn’t load your files',
  homeHref = '/files',
  homeLabel = 'Go to My Files',
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  homeHref?: string;
  homeLabel?: string;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="fx-surface flex flex-col items-start gap-4 border-dashed bg-transparent px-6 py-10 sm:flex-row sm:items-center sm:px-8">
        <span
          aria-hidden="true"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-signal-amber/10 text-signal-amber"
        >
          <TriangleAlert className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1" role="alert">
          <h2 className="font-display text-[15.5px] font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">
            Something went wrong while loading this page. Try again, or come
            back in a moment.
            {error.digest && (
              <span className="fx-num ml-1 text-ink-400">
                Ref {error.digest}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={homeHref} className="fx-btn fx-btn-ghost">
            {homeLabel}
          </Link>
          <button
            type="button"
            onClick={reset}
            className="fx-btn fx-btn-primary"
          >
            <RotateCw aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileRouteError;
