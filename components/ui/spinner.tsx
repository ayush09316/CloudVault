import * as React from 'react';

import { cn } from '@/lib/utils';

const Spinner = ({
  className,
  label = 'Loading',
  ...props
}: React.SVGProps<SVGSVGElement> & { label?: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    role="status"
    aria-label={label}
    className={cn('size-4 animate-spin [animation-duration:700ms]', className)}
    {...props}
  >
    <circle
      cx="8"
      cy="8"
      r="6.25"
      stroke="currentColor"
      strokeOpacity="0.2"
      strokeWidth="1.5"
    />
    <path
      d="M14.25 8A6.25 6.25 0 0 0 8 1.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export { Spinner };
