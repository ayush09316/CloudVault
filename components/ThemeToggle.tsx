'use client';

import * as React from 'react';
import { Monitor, Moon, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const useMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
};

const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <SimpleTooltip content={label}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn('relative overflow-hidden', className)}
      >
        <SunMedium
          aria-hidden="true"
          className={cn(
            'absolute transition-[transform,opacity] duration-slow ease-out',
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-50 opacity-0'
          )}
        />
        <Moon
          aria-hidden="true"
          className={cn(
            'absolute transition-[transform,opacity] duration-slow ease-out',
            isDark
              ? 'rotate-90 scale-50 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          )}
        />
      </Button>
    </SimpleTooltip>
  );
};

const OPTIONS = [
  { value: 'light', label: 'Light', icon: SunMedium },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        'inline-flex h-8 items-center gap-0.5 rounded-lg border bg-surface-sunken p-0.5',
        className
      )}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = mounted && theme === value;
        return (
          <SimpleTooltip key={value} content={label}>
            <button
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              onClick={() => setTheme(value)}
              className={cn(
                'inline-flex h-full w-7 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color,box-shadow] duration-fast',
                'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active && 'bg-surface text-foreground shadow-sm'
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </button>
          </SimpleTooltip>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
