'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="page-container">
      <div className="empty-state w-full">
        <div className="empty-state-icon">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </div>
        <p className="subtitle-2">Couldn&apos;t load this page</p>
        <p className="body-2 max-w-sm text-center text-muted-foreground">
          Something went wrong while loading your files. Please try again.
        </p>
        <Button
          type="button"
          onClick={reset}
          className="mt-2 rounded-full bg-vault-600 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
