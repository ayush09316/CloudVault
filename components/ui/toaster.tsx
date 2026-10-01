'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'success' | 'destructive' | 'warning' | 'info';

const ICONS: Record<Exclude<Variant, 'default'>, typeof Info> = {
  success: CheckCircle2,
  destructive: XCircle,
  warning: AlertTriangle,
  info: Info,
};

let activeOwner: symbol | null = null;
const ownerListeners = new Set<() => void>();

const claim = (id: symbol) => {
  if (!activeOwner) {
    activeOwner = id;
    ownerListeners.forEach((l) => l());
  }
};

const release = (id: symbol) => {
  if (activeOwner === id) {
    activeOwner = null;
    ownerListeners.forEach((l) => l());
  }
};

const subscribeOwner = (cb: () => void) => {
  ownerListeners.add(cb);
  return () => {
    ownerListeners.delete(cb);
  };
};

function useIsOwner() {
  const [id] = React.useState(() => Symbol('toaster'));
  const owner = React.useSyncExternalStore(
    subscribeOwner,
    () => activeOwner,
    () => null
  );

  React.useEffect(() => {
    claim(id);
    const reclaim = () => {
      if (!activeOwner) claim(id);
    };
    ownerListeners.add(reclaim);
    return () => {
      ownerListeners.delete(reclaim);
      release(id);
    };
  }, [id]);

  return owner === id;
}

export function Toaster() {
  const isOwner = useIsOwner();
  const { toasts } = useToast();

  if (!isOwner) return null;

  return (
    <ToastProvider duration={5000} swipeDirection="down">
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        className,
        ...props
      }) {
        const resolved: Variant =
          variant ??
          (className?.includes('error-toast') ? 'destructive' : 'default');
        const Icon = resolved === 'default' ? null : ICONS[resolved];

        return (
          <Toast key={id} variant={resolved} className={className} {...props}>
            {Icon && (
              <Icon
                className="mt-0.5 size-4 shrink-0 text-[hsl(var(--toast-accent))]"
                aria-hidden="true"
              />
            )}
            <div className="grid min-w-0 flex-1 gap-0.5">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription
                  className={cn(title && 'text-caption text-muted-foreground')}
                >
                  {description}
                </ToastDescription>
              )}
            </div>
            {action && (
              <div className="-my-0.5 shrink-0 self-center">{action}</div>
            )}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
