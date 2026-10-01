import Crosses from './Crosses';
import { Check, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeading from './SectionHeading';

const POINTS = [
  {
    title: 'Roles resolve on the server',
    body: 'Every rename, share and download works out who you are to that file, owner, editor or viewer, from its owner and its active grants. The interface hides buttons; the server is what refuses.',
  },
  {
    title: 'Expired means gone',
    body: 'Grants past their expiry are skipped during resolution. A stale link gets a 404, not a file.',
  },
  {
    title: 'No public file URLs',
    body: 'File bytes stream through a route that runs the same check on every request, with private caching and nosniff headers.',
  },
  {
    title: 'Admins can look, not touch',
    body: 'An admin account resolves to view access on files it does not own. It can never rename, share or delete them.',
  },
];

type Row = {
  k: string;
  v: React.ReactNode;
  mark?: 'ok' | 'no';
  final?: boolean;
};

const TRACE: Row[] = [
  { k: 'action', v: 'renameFile("q3-plan.pdf" → "final.pdf")' },
  { k: 'principal', v: 'share token k8Qz…' },
  { k: 'owner', v: 'token is not the owner', mark: 'no' },
  { k: 'grant', v: 'link k8Qz… · view · expires in 7d', mark: 'ok' },
  { k: 'role', v: 'view' },
  { k: 'requires', v: 'owner | edit' },
  {
    k: 'result',
    v: 'You do not have permission to rename this file.',
    mark: 'no',
    final: true,
  },
];

const Trace = () => (
  <div
    data-reveal
    data-inview
    className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_60px_-36px_rgba(10,13,12,0.45)]"
  >
    <div className="flex h-10 items-center gap-2 border-b border-border px-4">
      <ShieldCheck className="cvl-accent size-3.5" aria-hidden />
      <span className="cvl-mono text-[11.5px] text-muted-foreground">
        getFileAccess → resolveRole
      </span>
      <span className="cvl-mono ml-auto rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
        server
      </span>
    </div>
    <ol className="cvl-mono space-y-0.5 p-3 text-[12px] sm:p-4">
      {TRACE.map((r, i) => (
        <li
          key={r.k}
          className={cn(
            'cvl-anim cvl-trace-row grid grid-cols-[5.5rem_1fr_auto] items-start gap-3 rounded-md px-2 py-1.5',
            r.final &&
              'mt-2 border border-signal-rose/30 bg-signal-rose/[0.06] text-signal-rose'
          )}
          style={{ '--d': `${i * 0.55}s` } as React.CSSProperties}
        >
          <span
            className={cn(
              'text-muted-foreground',
              r.final && 'text-signal-rose/80'
            )}
          >
            {r.k}
          </span>
          <span
            className={cn('min-w-0 break-words', !r.final && 'text-foreground')}
          >
            {r.v}
          </span>
          {r.mark ? (
            <span
              className={cn(
                'cvl-anim cvl-trace-mark mt-0.5 flex size-4 items-center justify-center rounded-full',
                r.mark === 'ok'
                  ? 'bg-vault-600/15 text-vault-700 dark:text-vault-300'
                  : 'bg-signal-rose/15 text-signal-rose'
              )}
              style={{ '--d': `${i * 0.55}s` } as React.CSSProperties}
            >
              {r.mark === 'ok' ? (
                <Check className="size-2.5" strokeWidth={3} aria-hidden />
              ) : (
                <X className="size-2.5" strokeWidth={3} aria-hidden />
              )}
            </span>
          ) : (
            <span />
          )}
        </li>
      ))}
    </ol>
  </div>
);

const Security = () => (
  <section
    id="security"
    aria-labelledby="security-title"
    className="cvl-hr scroll-mt-16"
  >
    <Crosses />
    <div className="px-5 py-20 sm:px-10 sm:py-28">
      <SectionHeading
        id="security-title"
        index="02"
        eyebrow="Permissions"
        title="A link that says view cannot be used to edit."
        body="Sharing is only as good as the check behind it. CloudVault resolves access on the server for every action, so a role in the UI is a role everywhere."
      />
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <dl className="grid gap-px self-start overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-1">
          {POINTS.map((p, i) => (
            <div
              key={p.title}
              data-reveal
              style={{ '--d': `${i * 70}ms` } as React.CSSProperties}
              className="bg-background p-5"
            >
              <dt className="flex items-center gap-2.5 text-[14.5px] font-semibold text-foreground">
                <span className="cvl-mono cvl-accent text-[11px]">
                  0{i + 1}
                </span>
                {p.title}
              </dt>
              <dd className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Trace />
          <p className="cvl-mono mt-4 text-[11px] leading-relaxed text-muted-foreground">
            The resolution rules live in one module and are covered by unit
            tests: owner first, then active grants, edit outranks view.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Security;
