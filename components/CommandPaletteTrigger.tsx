'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CommandPaletteTrigger = () => {
  const open = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={open}
      aria-label="Open command palette"
      className="hidden items-center gap-2 rounded-full text-muted-foreground lg:flex"
    >
      <Search className="size-4" aria-hidden="true" />
      <span className="text-body-sm">Quick actions</span>
      <kbd className="cmdk-shortcut rounded border border-border px-1.5 py-0.5 font-sans">
        ⌘K
      </kbd>
    </Button>
  );
};

export default CommandPaletteTrigger;
