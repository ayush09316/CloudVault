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
    <FileRouteError
      error={error}
      reset={reset}
      title="Couldn’t load the trash"
    />
  );
}
