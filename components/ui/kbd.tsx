import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const kbdVariants = cva(
  'pointer-events-none inline-flex select-none items-center justify-center rounded-xs border font-mono font-medium leading-none tracking-normal',
  {
    variants: {
      variant: {
        default:
          'border-border bg-surface text-muted-foreground shadow-[inset_0_-1px_0_hsl(var(--border))]',
        ghost: 'border-transparent bg-foreground/[0.06] text-muted-foreground',
        inverse: 'border-background/15 bg-background/10 text-background/80',
      },
      size: {
        sm: 'h-4 min-w-4 px-1 text-[10px]',
        default: 'h-5 min-w-5 px-1.5 text-2xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, size, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(kbdVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Kbd.displayName = 'Kbd';

const KEY_LABELS: Record<string, string> = {
  mod: '⌘',
  meta: '⌘',
  cmd: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  option: '⌥',
  shift: '⇧',
  enter: '↵',
  return: '↵',
  esc: 'Esc',
  escape: 'Esc',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  backspace: '⌫',
  delete: '⌫',
  tab: '⇥',
};

const KbdGroup = ({
  keys,
  className,
  ...props
}: { keys: string[] } & Omit<KbdProps, 'children'>) => (
  <span
    className={cn('inline-flex items-center gap-0.5', className)}
    aria-label={keys.join(' ')}
  >
    {keys.map((key) => (
      <Kbd key={key} aria-hidden="true" {...props}>
        {KEY_LABELS[key.toLowerCase()] ?? key.toUpperCase()}
      </Kbd>
    ))}
  </span>
);

export { Kbd, KbdGroup, kbdVariants };
