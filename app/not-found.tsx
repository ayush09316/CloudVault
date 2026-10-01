import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  BackButton,
  RequestedPath,
  StatusPage,
} from '@/components/ui/status-page';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <StatusPage
      code="Error 404"
      title="Nothing stored at this address"
      description="The link may be mistyped, or the page was moved or deleted. Shared links also stop working once they expire or are revoked."
      detail={<RequestedPath />}
      actions={
        <>
          <Button asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
          <BackButton />
        </>
      }
    />
  );
}
