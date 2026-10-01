import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

const buttonVariants = cva(
  [
    'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'active:scale-[0.98] motion-reduce:active:scale-100',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-accent active:bg-border',
        outline:
          'border border-input bg-surface text-foreground shadow-xs hover:border-border-strong hover:bg-muted',
        ghost:
          'text-muted-foreground hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        'destructive-ghost':
          'text-destructive-text hover:bg-destructive-soft focus-visible:ring-destructive',
        soft: 'bg-primary-soft text-primary-text hover:bg-primary/15',
        link: 'h-auto px-0 text-primary-text underline-offset-4 hover:underline active:scale-100',
      },
      size: {
        xs: 'h-7 rounded-sm px-2 text-caption [&_svg]:size-3.5',
        sm: 'h-8 px-3 text-caption [&_svg]:size-4',
        default: 'h-9 px-3.5 text-body-sm [&_svg]:size-4',
        lg: 'h-10 px-4 text-body-sm [&_svg]:size-4',
        xl: 'h-12 rounded-lg px-5 text-body [&_svg]:size-[18px]',
        icon: 'size-9 [&_svg]:size-[18px]',
        'icon-sm': 'size-8 [&_svg]:size-4',
        'icon-xs': 'size-7 rounded-sm [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
