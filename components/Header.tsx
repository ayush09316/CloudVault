import React from 'react';
import Search from '@/components/Search';
import FileUploader from '@/components/FileUploader';
import ThemeToggle from './ThemeToggle';
import ShellBreadcrumbs from './ShellBreadcrumbs';
import ShellCommandTrigger from './ShellCommandTrigger';

const Header = ({
  breadcrumbs,
}: {
  fullName?: string;
  avatar?: string;
  email?: string;
  breadcrumbs?: React.ReactNode;
}) => {
  return (
    <header
      data-testid="app-header"
      className="hidden h-16 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-5 backdrop-blur-sm sm:flex lg:px-6"
    >
      <div className="min-w-0 flex-1">
        {breadcrumbs ?? <ShellBreadcrumbs />}
      </div>
      <div className="hidden w-full max-w-[340px] md:block [&_.search-input-wrapper]:h-9 [&_.search-input-wrapper]:rounded-lg [&_.search-input-wrapper]:shadow-none">
        <Search />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <ShellCommandTrigger />
        <ThemeToggle className="size-8 rounded-lg text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50" />
        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
        <FileUploader className="shell-press !h-8 !gap-1.5 !rounded-lg !px-3 !text-body-sm !font-medium !shadow-none [&_img]:size-4" />
      </div>
    </header>
  );
};
export default Header;
