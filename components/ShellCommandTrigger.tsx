'use client';

import { useEffect, useState } from 'react';
import { Command } from 'lucide-react';

const ShellCommandTrigger = () => {
  const [mod, setMod] = useState('⌘');

  useEffect(() => {
    if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) setMod('Ctrl');
  }, []);

  const open = () =>
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true })
    );

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open command menu"
      aria-keyshortcuts="Meta+K Control+K"
      className="shell-focus shell-press inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-body-sm text-ink-500 transition-colors hover:border-ink-300 hover:text-ink-800 dark:text-ink-400 dark:hover:border-ink-600 dark:hover:text-ink-100"
    >
      <Command className="size-3.5" aria-hidden="true" />
      <span className="hidden xl:inline">Commands</span>
      <span className="flex gap-0.5" aria-hidden="true">
        <kbd className="shell-kbd">{mod}</kbd>
        <kbd className="shell-kbd">K</kbd>
      </span>
    </button>
  );
};

export default ShellCommandTrigger;
