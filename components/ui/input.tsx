import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'flex w-full min-w-0 rounded-md border border-input bg-surface text-foreground shadow-xs',
    'transition-[border-color,box-shadow,background-color] duration-fast ease-out',
    'placeholder:text-subtle',
    'hover:border-border-strong',
    'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20',
    'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/20',
    'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
    'read-only:bg-surface-sunken',
    'file:mr-3 file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-foreground',
  ].join(' '),
  {
    variants: {
      inputSize: {
        sm: 'h-8 px-2.5 text-caption',
        default: 'h-9 px-3 text-body-sm',
        lg: 'h-11 px-3.5 text-body',
      },
    },
    defaultVariants: { inputSize: 'default' },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ inputSize }), className)}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input, inputVariants };
