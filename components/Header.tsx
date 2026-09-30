import React from 'react';
import Search from '@/components/Search';
import FileUploader from '@/components/FileUploader';

import ProfileDropDown from './ProfileDropDown';
import ThemeToggle from './ThemeToggle';
import CommandPaletteTrigger from './CommandPaletteTrigger';

const Header = ({
  fullName,
  avatar,
  email,
}: {
  fullName: string;
  avatar: string;
  email: string;
}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <CommandPaletteTrigger />
        <ThemeToggle />
        <FileUploader />

        <div className="sidebar-user-info">
          <ProfileDropDown avatar={avatar} fullName={fullName} email={email} />
        </div>
      </div>
    </header>
  );
};
export default Header;
