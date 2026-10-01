'use client';

import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import {
  FileActionItem,
  FileActionsController,
  useFileActions,
} from '@/components/FileActions';
import { cn } from '@/lib/utils';
import {
  menuContent,
  menuItem,
  menuItemDestructive,
  menuSeparator,
} from '@/components/ui/menu-styles';
import { FileDocument } from '@/types';

type ItemPrimitive = React.ElementType<{
  asChild?: boolean;
  className?: string;
  onSelect?: (e: Event) => void;
  children?: React.ReactNode;
}>;

export const renderActionItems = (
  items: FileActionItem[],
  Item: ItemPrimitive,
  Separator: React.ElementType<{ className?: string }>
) =>
  items.map((item) => {
    const Icon = item.icon;
    const className = cn(menuItem, item.danger && menuItemDestructive);
    return (
      <React.Fragment key={item.key}>
        {item.separatorBefore && <Separator className={menuSeparator} />}
        {item.href ? (
          <Item asChild className={className}>
            <a href={item.href} download={item.download}>
              <Icon aria-hidden="true" />
              {item.label}
            </a>
          </Item>
        ) : (
          <Item className={className} onSelect={() => item.run()}>
            <Icon aria-hidden="true" />
            {item.label}
          </Item>
        )}
      </React.Fragment>
    );
  });

export const menuContentClass = cn(menuContent, 'min-w-[220px]');
export const menuItemClass = menuItem;
export const menuItemDangerClass = cn(menuItem, menuItemDestructive);
export const menuSeparatorClass = menuSeparator;

export const ActionMenu = ({
  file,
  controller,
  className,
  onOpenChange,
}: {
  file: FileDocument;
  controller: FileActionsController;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) => (
  <DropdownMenuPrimitive.Root modal={false} onOpenChange={onOpenChange}>
    <DropdownMenuPrimitive.Trigger
      data-testid="file-actions"
      aria-label={`More actions for ${file.name}`}
      className={cn('fx-icon-btn', className)}
    >
      <MoreHorizontal />
    </DropdownMenuPrimitive.Trigger>
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align="end"
        sideOffset={4}
        collisionPadding={8}
        className={menuContentClass}
      >
        <DropdownMenuPrimitive.Label className="fx-menu-label max-w-[240px]">
          {file.name}
        </DropdownMenuPrimitive.Label>
        {renderActionItems(
          controller.items,
          DropdownMenuPrimitive.Item,
          DropdownMenuPrimitive.Separator
        )}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  </DropdownMenuPrimitive.Root>
);

const SelfContainedDropdown = ({
  file,
  onOpen,
  className,
}: {
  file: FileDocument;
  onOpen?: (file: FileDocument) => void;
  className?: string;
}) => {
  const controller = useFileActions(file, { onOpen });
  return (
    <>
      <ActionMenu file={file} controller={controller} className={className} />
      {controller.dialogs}
    </>
  );
};

const ActionDropdown = ({
  file,
  controller,
  onOpen,
  className,
  onOpenChange,
}: {
  file: FileDocument;
  controller?: FileActionsController;
  onOpen?: (file: FileDocument) => void;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) =>
  controller ? (
    <ActionMenu
      file={file}
      controller={controller}
      className={className}
      onOpenChange={onOpenChange}
    />
  ) : (
    <SelfContainedDropdown file={file} onOpen={onOpen} className={className} />
  );

export default ActionDropdown;
