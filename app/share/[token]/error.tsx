'use client';

import FileRouteError from '@/components/FileRouteError';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-start justify-center bg-background px-4 pt-[18vh]">
      <FileRouteError
        error={error}
        reset={reset}
        title="Couldn’t open this shared file"
        homeHref="/"
        homeLabel="Go to CloudVault"
      />
    </main>
  );
}
