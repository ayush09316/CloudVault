import * as React from 'react';

import { cn } from '@/lib/utils';

const RING = 'M24.37 14.52A8.5 8.5 0 1 1 17.48 7.63';

type BrandMarkProps = React.SVGProps<SVGSVGElement> & {
  variant?: 'tile' | 'glyph';
  title?: string;
};

export const BrandMark = ({
  variant = 'tile',
  title = 'CloudVault',
  className,
  ...props
}: BrandMarkProps) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    role="img"
    aria-label={title}
    className={cn('size-8 shrink-0', className)}
    {...props}
  >
    {variant === 'tile' && (
      <rect width="32" height="32" rx="8" className="fill-[#0E7A6E]" />
    )}
    <path
      d={RING}
      strokeWidth="3"
      strokeLinecap="round"
      className={variant === 'tile' ? 'stroke-[#EDFBF6]' : 'stroke-current'}
    />
    <circle
      cx="16"
      cy="16"
      r="2.75"
      className={variant === 'tile' ? 'fill-[#EDFBF6]' : 'fill-current'}
    />
  </svg>
);

type BrandWordmarkProps = React.HTMLAttributes<HTMLSpanElement> & {
  markClassName?: string;
  hideMark?: boolean;
};

export const BrandWordmark = ({
  className,
  markClassName,
  hideMark,
  ...props
}: BrandWordmarkProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-foreground',
      className
    )}
    {...props}
  >
    {!hideMark && (
      <BrandMark className={cn('size-6', markClassName)} aria-hidden="true" />
    )}
    <span>
      Cloud<span className="text-primary-text">Vault</span>
    </span>
  </span>
);

export default BrandMark;
