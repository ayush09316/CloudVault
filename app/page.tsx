import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import LandingFX from '@/components/landing/LandingFX';
import Backdrop from '@/components/landing/Backdrop';
import Nav from '@/components/landing/Nav';
import ProductPreviewStack from '@/components/landing/ProductPreviewStack';
import SpecStrip from '@/components/landing/SpecStrip';
import Bento from '@/components/landing/Bento';
import Security from '@/components/landing/Security';
import Steps from '@/components/landing/Steps';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'CloudVault — files in order, links on a timer',
  description:
    'File storage with nested folders, a recoverable trash, view or edit sharing with expiring links, in-browser previews and server-enforced quotas.',
};

const rise = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

export default function LandingPage() {
  return (
    <div
      className={`cvl relative min-h-dvh overflow-x-clip bg-background text-foreground`}
    >
      <LandingFX />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:shadow-soft"
      >
        Skip to content
      </a>
      <Backdrop />
      <Nav />

      <main id="main" className="relative">
        <div className="cvl-frame">
          <section
            aria-labelledby="hero-title"
            className="relative px-5 pb-16 pt-14 sm:px-10 sm:py-24"
          >
            <p
              className="cvl-rise cvl-eyebrow inline-flex h-7 items-center gap-2 rounded-full border border-border bg-card/70 px-3 backdrop-blur"
              style={rise(0)}
            >
              <span className="size-1.5 rounded-full bg-[var(--cvl-accent)]" />
              Folders · Trash · Expiring links · ⌘K
            </p>

            <div className="mt-8">
              <h1
                id="hero-title"
                className="font-display text-[2.9rem] font-semibold leading-[0.95] -tracking-wider text-foreground min-[400px]:text-[3.4rem] sm:text-[4.6rem] lg:text-[5.4rem]"
              >
                <span className="cvl-rise block" style={rise(60)}>
                  Files in order.
                </span>
                <span
                  className="cvl-rise block text-muted-foreground"
                  style={rise(140)}
                >
                  Links on a <span className="cvl-accent">timer.</span>
                </span>
              </h1>

              <div
                className="cvl-rise mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16"
                style={rise(240)}
              >
                <p className="max-w-xl text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                  CloudVault is file storage with nested folders, a trash you
                  can restore from, and share links scoped to view or edit that
                  expire when you say. Every permission is checked on the
                  server, not just hidden in the interface.
                </p>
                <div>
                  <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center">
                    <Link
                      href="/sign-up"
                      className="cvl-btn inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium"
                    >
                      <span className="shine" aria-hidden />
                      Create your vault
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                    <a
                      href="#security"
                      className="cvl-btn-2 inline-flex h-12 items-center justify-center gap-1 rounded-full px-6 text-[15px] font-medium"
                    >
                      How sharing is enforced
                      <ChevronRight
                        className="size-4 text-muted-foreground"
                        aria-hidden
                      />
                    </a>
                  </div>
                  <p className="cvl-mono mt-5 text-[11.5px] text-muted-foreground">
                    Email-code sign-in · 2 GB to start
                  </p>
                </div>
              </div>
            </div>

            <div className="cvl-rise mt-16 sm:mt-20" style={rise(380)}>
              <ProductPreviewStack />
            </div>
          </section>

          <SpecStrip />
          <Bento />
          <Security />
          <Steps />
          <Faq />
          <FinalCta />
          <Footer />
        </div>
      </main>
    </div>
  );
}
