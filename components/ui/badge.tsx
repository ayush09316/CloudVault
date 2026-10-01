import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex h-5 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 text-2xs font-medium leading-none [&_svg]:size-3 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        neutral: 'border-border bg-muted text-muted-foreground',
        outline: 'border-border bg-transparent text-muted-foreground',
        primary: 'border-primary/15 bg-primary-soft text-primary-text',
        success: 'border-success/20 bg-success-soft text-success-text',
        warning: 'border-warning/25 bg-warning-soft text-warning-text',
        danger:
          'border-destructive/20 bg-destructive-soft text-destructive-text',
        info: 'border-info/20 bg-info-soft text-info-text',
        solid: 'border-transparent bg-foreground text-background',
      },
      shape: {
        pill: 'rounded-full',
        square: 'rounded-xs px-1.5',
      },
    },
    defaultVariants: { variant: 'neutral', shape: 'pill' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, shape, dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current opacity-80"
        />
      )}
      {children}
    </span>
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
