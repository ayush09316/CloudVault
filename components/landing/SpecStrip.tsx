import Crosses from './Crosses';
import AnimatedCounter from '@/components/AnimatedCounter';

const SPECS = [
  {
    value: 2,
    suffix: ' GB',
    label: 'Default quota',
    detail: 'checked before every upload',
  },
  {
    value: 50,
    suffix: ' MB',
    label: 'Per-file limit',
    detail: 'rejected in the uploader',
  },
  { value: 2, suffix: '', label: 'Share roles', detail: 'view · edit' },
  {
    value: 4,
    suffix: '',
    label: 'Link lifetimes',
    detail: 'never · 1d · 7d · 30d',
  },
  {
    value: 4,
    suffix: '',
    label: 'Preview kinds',
    detail: 'image · video · audio · PDF',
  },
  { value: 10, suffix: '', label: 'Logged events', detail: 'upload to revoke' },
];

const SpecStrip = () => (
  <section aria-label="Product limits and capabilities" className="cvl-hr">
    <Crosses />
    <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {SPECS.map((s, i) => (
        <div
          key={s.label}
          data-reveal
          style={{ '--d': `${i * 60}ms` } as React.CSSProperties}
          className="flex flex-col gap-1.5 border-b border-r border-border px-5 py-6 lg:border-b-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(6n)]:border-r-0"
        >
          <dt className="cvl-eyebrow">{s.label}</dt>
          <dd className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em] text-foreground">
            <AnimatedCounter
              value={s.value}
              suffix={s.suffix}
              duration={1100}
            />
          </dd>
          <dd className="cvl-mono text-[11px] text-muted-foreground">
            {s.detail}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

export default SpecStrip;
