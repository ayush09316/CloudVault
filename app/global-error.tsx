'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import localFont from 'next/font/local';
import { RotateCw } from 'lucide-react';

import './globals.css';
import { Button } from '@/components/ui/button';
import { ErrorReference, StatusPage } from '@/components/ui/status-page';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <title>Something went wrong · CloudVault</title>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <StatusPage
          code="Application error"
          title="CloudVault couldn’t start"
          description="A critical error stopped the app from loading. Your files are untouched. Reload to try again."
          detail={<ErrorReference digest={error.digest} />}
          actions={
            <>
              <Button type="button" onClick={reset}>
                <RotateCw aria-hidden="true" />
                Reload
              </Button>
              <Button asChild variant="ghost">
                <Link href="/">Go home</Link>
              </Button>
            </>
          }
        />
      </body>
    </html>
  );
}
