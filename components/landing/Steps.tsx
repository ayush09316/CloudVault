import Crosses from './Crosses';
import { Mail, UploadCloud, Link2 } from 'lucide-react';
import SectionHeading from './SectionHeading';

const STEPS = [
  {
    icon: Mail,
    title: 'Sign in with a code',
    body: 'Enter your email and we send a six-digit code. There is no password to create, reuse or leak.',
    detail: 'email → 6-digit code → session',
  },
  {
    icon: UploadCloud,
    title: 'Bring your files',
    body: 'Drop files onto the page or use Upload. Each one is checked against the 50 MB file limit and your remaining quota before it is stored.',
    detail: 'size check → quota check → stored',
  },
  {
    icon: Link2,
    title: 'Share on purpose',
    body: 'Choose people or a link, a role and an expiry. Revoke it whenever you like; the activity log records both.',
    detail: 'role + expiry → grant → revoke',
  },
];

const Steps = () => (
  <section
    id="how-it-works"
    aria-labelledby="how-title"
    className="cvl-hr scroll-mt-16"
  >
    <Crosses />
    <div className="px-5 py-20 sm:px-10 sm:py-28">
      <SectionHeading
        id="how-title"
        index="03"
        eyebrow="How it works"
        title="From an email address to a shared file in three steps."
      />
      <div className="relative mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-6 left-[23px] w-px lg:left-[24px] lg:right-[calc(33.333%-51px)] lg:top-[23px] lg:h-px lg:w-auto"
        >
          <svg
            className="absolute inset-0 size-full overflow-visible"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="lg:hidden"
              stroke="hsl(var(--border))"
              strokeDasharray="3 6"
            />
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              className="hidden lg:block"
              stroke="hsl(var(--border))"
              strokeDasharray="3 6"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              className="cvl-dash lg:hidden"
              stroke="var(--cvl-accent)"
              strokeOpacity="0.5"
              strokeDasharray="3 9"
            />
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              className="cvl-dash hidden lg:block"
              stroke="var(--cvl-accent)"
              strokeOpacity="0.5"
              strokeDasharray="3 9"
            />
          </svg>
          {[0, 2.25].map((delay) => (
            <span
              key={delay}
              className="cvl-travel"
              style={{ '--d': `${delay}s` } as React.CSSProperties}
            >
              <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-[var(--cvl-accent)] shadow-[0_0_0_3px_var(--cvl-accent-soft)] lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0" />
            </span>
          ))}
        </div>
        <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-10">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              style={{ '--d': `${i * 100}ms` } as React.CSSProperties}
              className="flex gap-5 lg:flex-col lg:gap-0"
            >
              <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-soft">
                <s.icon className="size-[18px]" aria-hidden />
              </span>
              <div className="lg:mt-7">
                <p className="cvl-eyebrow">Step 0{i + 1}</p>
                <h3 className="mt-2 font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
                <p className="cvl-mono mt-4 inline-flex rounded-md border border-border bg-secondary/50 px-2 py-1 text-[10.5px] text-muted-foreground">
                  {s.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default Steps;
