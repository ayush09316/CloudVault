'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ErrorReference, StatusPage } from '@/components/ui/status-page';

export default function RootError({
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
    <StatusPage
      code="Error 500"
      title="Something broke on our side"
      description="Your files are safe. This page failed to load. Try again, and if it keeps happening, send us the reference below."
      detail={<ErrorReference digest={error.digest} />}
      actions={
        <>
          <Button type="button" onClick={reset}>
            <RotateCw aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="ghost">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </>
      }
    />
  );
}
