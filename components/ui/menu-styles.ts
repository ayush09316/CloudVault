export const menuContent = [
  'z-50 min-w-[11rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-popover',
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.97] data-[state=open]:duration-fast data-[state=closed]:duration-instant',
  'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
].join(' ');

export const menuItem = [
  'relative flex h-8 cursor-default select-none items-center gap-2 rounded-lg px-2 text-body-sm text-foreground outline-none',
  'transition-colors duration-instant',
  'focus:bg-accent data-[highlighted]:bg-accent data-[state=open]:bg-accent',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
].join(' ');

export const menuItemDestructive =
  'text-destructive-text focus:bg-destructive-soft data-[highlighted]:bg-destructive-soft [&_svg]:text-destructive-text';

export const menuLabel =
  'px-2 pb-1 pt-1.5 text-2xs font-medium uppercase tracking-[0.06em] text-subtle';

export const menuSeparator = '-mx-1 my-1 h-px bg-border';

export const menuShortcut =
  'ml-auto pl-4 font-mono text-2xs tracking-normal text-subtle';

export const menuIndicator =
  'absolute left-2 flex size-4 items-center justify-center text-primary-text';
