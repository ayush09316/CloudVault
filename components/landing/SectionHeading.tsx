import { cn } from '@/lib/utils';

const SectionHeading = ({
  id,
  index,
  eyebrow,
  title,
  body,
  className,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  className?: string;
}) => (
  <div
    data-reveal
    className={cn(
      'grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16',
      className
    )}
  >
    <div>
      <p className="cvl-eyebrow flex items-center gap-3">
        <span className="cvl-accent">{index}</span>
        <span aria-hidden className="h-px w-6 bg-border" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-5 max-w-[22ch] text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-[2.75rem]"
      >
        {title}
      </h2>
    </div>
    {body && (
      <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground lg:pb-1.5">
        {body}
      </p>
    )}
  </div>
);

export default SectionHeading;
