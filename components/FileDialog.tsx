'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FileDialog = DialogPrimitive.Root;
export const FileDialogClose = DialogPrimitive.Close;

export const FileDialogContent = ({
  title,
  description,
  hideDescription = false,
  icon,
  children,
  footer,
  className,
  bodyClassName,
  onOpenAutoFocus,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  hideDescription?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  onOpenAutoFocus?: (e: Event) => void;
}) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fx-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:!animate-none" />
    <DialogPrimitive.Content
      onOpenAutoFocus={onOpenAutoFocus}
      className={cn(
        'fx-dialog duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] motion-reduce:!animate-none',
        className
      )}
      {...(description ? {} : { 'aria-describedby': undefined })}
    >
      <div className="flex items-start gap-3 px-5 pb-1 pt-5">
        {icon}
        <div className="min-w-0 flex-1 pr-8">
          <DialogPrimitive.Title className="font-display text-[15.5px] font-semibold leading-6 tracking-[-0.005em] text-foreground">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description
              className={cn(
                'mt-0.5 text-[13px] leading-5 text-muted-foreground',
                hideDescription && 'sr-only'
              )}
            >
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
      </div>
      <DialogPrimitive.Close
        className="fx-icon-btn absolute right-3 top-3"
        aria-label="Close"
      >
        <X />
      </DialogPrimitive.Close>
      {children !== undefined && (
        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-3',
            bodyClassName
          )}
        >
          {children}
        </div>
      )}
      {footer && (
        <div className="flex items-center justify-end gap-2 border-t border-border bg-ink-50/70 px-5 py-3 dark:bg-ink-950/40">
          {footer}
        </div>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);
