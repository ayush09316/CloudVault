import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';

interface ProfileProps {
  avatar: string;
  email: string;
  fullName: string;
}

const ProfileDropDown = ({ avatar, email, fullName }: ProfileProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={avatar}
          alt="Avatar"
          width={32}
          height={32}
          className="sidebar-user-avatar"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="hidden lg:block">
        <DropdownMenuLabel className="text-[16px] text-brand">
          My Profile
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs">{fullName}</DropdownMenuItem>
        <DropdownMenuItem className="text-xs">{email}</DropdownMenuItem>
        <DropdownMenuItem>
          <form
            action={async () => {
              'use server';
              await signOutUser();
            }}
            className="w-full"
          >
            <Button type="submit" className="sign-out-button">
              <Image
                src="/assets/icons/logout.svg"
                alt="logo"
                width={24}
                height={24}
                className="w-6"
              />
              <span>Sign Out</span>
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
