'use client';

import React, { useRef, useState } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import { TooltipContent } from '@/components/ui/tooltip';

export const FileTooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <TooltipPrimitive.Provider delayDuration={450} skipDelayDuration={250}>
    {children}
  </TooltipPrimitive.Provider>
);

const Content = ({
  label,
  kbd,
  side,
}: {
  label: React.ReactNode;
  kbd?: string[];
  side?: 'top' | 'bottom' | 'left' | 'right';
}) => (
  <TooltipContent side={side} shortcut={kbd} className="z-[90]">
    <span className="break-words">{label}</span>
  </TooltipContent>
);

const FileTooltip = ({
  label,
  kbd,
  side = 'top',
  children,
}: {
  label: React.ReactNode;
  kbd?: string[];
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
}) => (
  <FileTooltipProvider>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <Content label={label} kbd={kbd} side={side} />
    </TooltipPrimitive.Root>
  </FileTooltipProvider>
);

export const FileTruncate = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <FileTooltipProvider>
      <TooltipPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          const el = ref.current;
          setOpen(next && !!el && el.scrollWidth > el.clientWidth);
        }}
      >
        <TooltipPrimitive.Trigger asChild>
          <span ref={ref} className={cn('block min-w-0 truncate', className)}>
            {text}
          </span>
        </TooltipPrimitive.Trigger>
        <Content label={text} />
      </TooltipPrimitive.Root>
    </FileTooltipProvider>
  );
};

export default FileTooltip;
