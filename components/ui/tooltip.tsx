'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';
import { KbdGroup } from '@/components/ui/kbd';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    shortcut?: string[];
  }
>(({ className, sideOffset = 6, shortcut, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={8}
      className={cn(
        'z-[60] flex max-w-xs items-center gap-2 rounded-md bg-foreground px-2 py-1 text-caption font-medium text-background shadow-md',
        'origin-[--radix-tooltip-content-transform-origin] animate-in fade-in-0 zoom-in-[0.97] duration-fast',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:duration-instant',
        'data-[side=bottom]:slide-in-from-top-0.5 data-[side=left]:slide-in-from-right-0.5 data-[side=right]:slide-in-from-left-0.5 data-[side=top]:slide-in-from-bottom-0.5',
        className
      )}
      {...props}
    >
      {children}
      {shortcut && shortcut.length > 0 && (
        <KbdGroup keys={shortcut} variant="inverse" size="sm" />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type SimpleTooltipProps = {
  content: React.ReactNode;
  shortcut?: string[];
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  children: React.ReactNode;
};

const SimpleTooltip = ({
  content,
  shortcut,
  side,
  align,
  delayDuration,
  children,
}: SimpleTooltipProps) => (
  <Tooltip delayDuration={delayDuration}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} align={align} shortcut={shortcut}>
      {content}
    </TooltipContent>
  </Tooltip>
);

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
};
