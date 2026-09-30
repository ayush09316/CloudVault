'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <div className="empty-state-icon">
        <AlertTriangle className="size-7" aria-hidden="true" />
      </div>
      <h1 className="h2 font-display">Something went wrong</h1>
      <p className="body-1 max-w-sm text-muted-foreground">
        An unexpected error occurred. You can try again, or head back to your
        files.
      </p>
      <Button
        type="button"
        onClick={reset}
        className="rounded-full bg-vault-600 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
      >
        Try again
      </Button>
    </main>
  );
}
