import Crosses from './Crosses';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FinalCta = () => (
  <section
    aria-labelledby="cta-title"
    className="cvl-hr relative overflow-hidden"
  >
    <Crosses />
    <div aria-hidden className="absolute inset-0">
      <div
        className="cvl-grid"
        style={{
          maskImage:
            'radial-gradient(ellipse 60% 80% at 50% 100%, #000, transparent)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 80% at 50% 100%, #000, transparent)',
        }}
      />
      <div className="absolute inset-x-0 bottom-[-260px] mx-auto h-[420px] max-w-[900px] bg-[radial-gradient(closest-side,var(--cvl-accent-soft),transparent)]" />
    </div>
    <div
      data-reveal
      className="relative flex flex-col items-start gap-8 px-5 py-24 sm:px-10 sm:py-32 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <p className="cvl-eyebrow">Get started</p>
        <h2
          id="cta-title"
          className="mt-5 max-w-[16ch] text-balance font-display text-[2.4rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3.5rem]"
        >
          Give your files somewhere sensible to live.
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          An email address is all it takes. Your vault starts with 2 GB.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row">
        <Link
          href="/sign-up"
          className="cvl-btn inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium"
        >
          <span className="shine" aria-hidden />
          Create your vault
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/sign-in"
          className="cvl-btn-2 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCta;
