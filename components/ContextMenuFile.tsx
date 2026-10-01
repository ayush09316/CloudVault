'use client';

import React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import {
  menuContentClass,
  renderActionItems,
} from '@/components/ActionDropdown';
import { FileActionItem } from '@/components/FileActions';

const ContextMenuFile = ({
  title,
  items,
  disabled,
  onOpenChange,
  children,
}: {
  title: string;
  items: FileActionItem[];
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactElement;
}) => (
  <ContextMenuPrimitive.Root modal={false} onOpenChange={onOpenChange}>
    <ContextMenuPrimitive.Trigger asChild disabled={disabled}>
      {children}
    </ContextMenuPrimitive.Trigger>
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        collisionPadding={8}
        className={menuContentClass}
      >
        <ContextMenuPrimitive.Label className="fx-menu-label max-w-[240px]">
          {title}
        </ContextMenuPrimitive.Label>
        {renderActionItems(
          items,
          ContextMenuPrimitive.Item,
          ContextMenuPrimitive.Separator
        )}
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  </ContextMenuPrimitive.Root>
);

export default ContextMenuFile;
