import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <div className="empty-state-icon">
        <FileQuestion className="size-7" aria-hidden="true" />
      </div>
      <h1 className="h2 font-display">Page not found</h1>
      <p className="body-1 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Button
        asChild
        className="rounded-full bg-vault-600 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
      >
        <Link href="/">Back to CloudVault</Link>
      </Button>
    </main>
  );
}
