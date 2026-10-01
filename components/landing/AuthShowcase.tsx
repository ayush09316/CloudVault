import { FileText, Folder, Link2, RotateCcw, ShieldCheck } from 'lucide-react';

const d = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties;

const FACTS = [
  'Sign in with a six-digit email code',
  'Links scoped to view or edit, with an expiry',
  'Trash restores to the original folder',
];

const AuthShowcase = () => (
  <div className="cvl dark relative flex h-full flex-col overflow-hidden bg-[#071513] text-foreground">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(112,216,185,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(112,216,185,0.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_60%_40%,#000_30%,transparent_80%)]"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(25,158,127,0.22),transparent)]"
    />
    <div className="absolute inset-x-0 top-[167px]" aria-hidden>
      <span className="cvl-beam" style={d(1.2)} />
    </div>

    <div className="relative flex flex-1 items-center justify-center px-10 py-16">
      <div className="relative h-[360px] w-full max-w-[440px]" aria-hidden>
        <div
          className="cvl-float absolute left-0 top-6 w-[300px] rounded-xl border border-border bg-card/90 p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur"
          style={d(0)}
        >
          <p className="cvl-mono flex items-center gap-1.5 pb-2.5 text-[10.5px] text-muted-foreground">
            <Folder className="size-3 fill-vault-400/20 text-vault-300" />
            My Files / Clients / Acme
          </p>
          <ul className="space-y-1">
            {[
              { n: 'q3-plan.pdf', m: '2.4 MB' },
              { n: 'brief.docx', m: '96 KB' },
              { n: 'site-shot.png', m: '880 KB' },
            ].map((f, i) => (
              <li
                key={f.n}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] ${
                  i === 0 ? 'bg-secondary' : ''
                }`}
              >
                <FileText className="size-3.5 text-muted-foreground" />
                {f.n}
                <span className="cvl-mono ml-auto text-[10px] text-muted-foreground">
                  {f.m}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="cvl-float absolute bottom-6 right-0 w-[268px] rounded-xl border border-border bg-card/95 p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)] backdrop-blur"
          style={d(-2.5)}
        >
          <p className="text-[12px] font-medium">Share q3-plan.pdf</p>
          <div className="mt-2 flex gap-1.5 text-[10.5px]">
            <span className="rounded-md border border-border px-2 py-1">
              Can view
            </span>
            <span className="rounded-md border border-border px-2 py-1">
              7 days
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1.5 text-[10.5px]">
            <Link2 className="cvl-accent size-3" />
            <span className="cvl-mono truncate text-muted-foreground">
              /share/k8Qz2nLw
            </span>
            <span className="cvl-signal-chip ml-auto shrink-0 rounded-full border px-1.5 text-[9.5px]">
              7d
            </span>
          </div>
        </div>

        <div
          className="cvl-float absolute right-6 top-0 w-[172px] rounded-xl border border-border bg-card/95 p-3 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur"
          style={d(-5)}
        >
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-medium">Storage</p>
            <p className="cvl-mono text-[9.5px] text-muted-foreground">
              0.86 / 2 GB
            </p>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
            <span className="cvl-fill block h-full w-[43%] rounded-full bg-vault-400" />
          </div>
        </div>

        <div
          className="cvl-float absolute bottom-0 left-8 flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-1.5 text-[11px] shadow-soft backdrop-blur"
          style={d(-3.5)}
        >
          <RotateCcw className="cvl-accent size-3" />
          Restored to Clients / Acme
        </div>
      </div>
    </div>

    <div className="relative border-t border-border px-10 py-9">
      <p className="cvl-eyebrow flex items-center gap-2">
        <ShieldCheck className="cvl-accent size-3.5" aria-hidden />
        Checked on the server
      </p>
      <p className="mt-4 max-w-[26ch] text-balance font-display text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground">
        Your files, exactly where you left them.
      </p>
      <ul className="cvl-mono mt-6 space-y-2 text-[11.5px] text-muted-foreground">
        {FACTS.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <span className="size-1 rounded-full bg-vault-400" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default AuthShowcase;
