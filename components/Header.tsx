import React from 'react';
import Search from '@/components/Search';
import FileUploader from '@/components/FileUploader';

import ProfileDropDown from './ProfileDropDown';

const Header = ({
  userId,
  accountId,
  fullName,
  avatar,
  email,
  isAdmin,
}: {
  userId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
  isAdmin: boolean;
}) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        {!isAdmin && <FileUploader ownerId={userId} accountId={accountId} />}

        <div className="sidebar-user-info">
          <ProfileDropDown avatar={avatar} fullName={fullName} email={email} />
        </div>
      </div>
    </header>
  );
};
export default Header;
