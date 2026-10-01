'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-medium uppercase leading-none ring-1 ring-inset ring-foreground/[0.06]',
  {
    variants: {
      size: {
        xs: 'size-5 text-[9px]',
        sm: 'size-6 text-[10px]',
        default: 'size-8 text-2xs',
        lg: 'size-10 text-caption',
        xl: 'size-14 text-body',
      },
    },
    defaultVariants: { size: 'default' },
  }
);

const TINTS = [
  'bg-[hsl(172_45%_90%)] text-[hsl(172_70%_22%)] dark:bg-[hsl(172_35%_16%)] dark:text-[hsl(166_55%_70%)]',
  'bg-[hsl(205_60%_92%)] text-[hsl(208_65%_30%)] dark:bg-[hsl(208_35%_17%)] dark:text-[hsl(205_70%_74%)]',
  'bg-[hsl(34_80%_90%)] text-[hsl(28_80%_28%)] dark:bg-[hsl(30_35%_16%)] dark:text-[hsl(36_85%_68%)]',
  'bg-[hsl(268_40%_93%)] text-[hsl(268_40%_36%)] dark:bg-[hsl(268_22%_19%)] dark:text-[hsl(268_55%_78%)]',
  'bg-[hsl(345_55%_93%)] text-[hsl(345_55%_34%)] dark:bg-[hsl(345_25%_18%)] dark:text-[hsl(345_65%_76%)]',
  'bg-[hsl(150_35%_90%)] text-[hsl(152_55%_24%)] dark:bg-[hsl(152_25%_15%)] dark:text-[hsl(150_45%_68%)]',
];

export const getInitials = (name?: string | null) => {
  const parts = (name ?? '')
    .trim()
    .split(/[\s@._-]+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
};

const tintFor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return TINTS[Math.abs(hash) % TINTS.length];
};

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  name?: string | null;
  src?: string | null;
  alt?: string;
}

const PLACEHOLDER_HINTS = ['avatar-placeholder', 'placeholder'];

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, name, src, alt, ...props }, ref) => {
    const [failed, setFailed] = React.useState(false);
    const usable =
      !!src && !failed && !PLACEHOLDER_HINTS.some((h) => src.includes(h));

    React.useEffect(() => setFailed(false), [src]);

    return (
      <span
        ref={ref}
        className={cn(
          avatarVariants({ size }),
          !usable && tintFor(name ?? ''),
          className
        )}
        {...props}
      >
        {usable ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? name ?? ''}
            className="size-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <span aria-label={alt ?? name ?? undefined}>{getInitials(name)}</span>
        )}
      </span>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
