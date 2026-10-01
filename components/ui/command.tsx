'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex size-full flex-col overflow-hidden bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const CommandDialog = ({
  open,
  onOpenChange,
  title = 'Command menu',
  description = 'Search files, jump to a page or run an action',
  footer,
  children,
  className,
  ...commandProps
}: CommandDialogProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay/25 data-[state=closed]:duration-fast data-[state=open]:duration-base data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-overlay/60" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-[12vh] z-50 w-[calc(100%-1.5rem)] max-w-[640px] overflow-hidden rounded-xl border bg-popover shadow-modal outline-none sm:top-[16vh]',
          'origin-top data-[state=closed]:animate-palette-out data-[state=open]:animate-palette-in'
        )}
        style={{ transform: 'translateX(-50%)' }}
      >
        <DialogPrimitive.Title className="sr-only">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          {description}
        </DialogPrimitive.Description>
        <Command
          className={cn(
            '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.06em] [&_[cmdk-group-heading]]:text-subtle',
            className
          )}
          {...commandProps}
        >
          {children}
          {footer}
        </Command>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
  }
>(({ className, leading, trailing, ...props }, ref) => (
  <div
    className="flex h-12 items-center gap-2.5 border-b px-4"
    cmdk-input-wrapper=""
  >
    {leading ?? (
      <Search
        className="size-[18px] shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    )}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-full w-full bg-transparent text-body text-foreground outline-none placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
    {trailing}
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'h-[min(var(--cmdk-list-height),min(420px,56vh))] overflow-y-auto overflow-x-hidden overscroll-contain px-2 pb-2 transition-[height] duration-base ease-out',
      className
    )}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn(
      'flex flex-col items-center gap-1 py-12 text-center text-body-sm text-muted-foreground',
      className
    )}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandLoading = CommandPrimitive.Loading;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn('overflow-hidden text-foreground', className)}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-2 my-1 h-px bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'group relative flex h-10 cursor-default select-none items-center gap-3 rounded-lg px-2 text-body-sm text-foreground outline-none',
      'data-[selected=true]:bg-accent',
      'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground data-[selected=true]:[&_svg]:text-foreground',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      'ml-auto flex items-center gap-1 text-caption text-subtle',
      className
    )}
    {...props}
  />
);
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandLoading,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
