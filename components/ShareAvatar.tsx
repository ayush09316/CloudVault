import { avatarTone, initials } from '@/components/FileFormat';
import { cn } from '@/lib/utils';

const SIZES = {
  xs: 'size-5 text-[9px]',
  sm: 'size-7 text-[11px]',
  md: 'size-9 text-[12.5px]',
};

const ShareAvatar = ({
  name,
  seed,
  size = 'md',
  className,
}: {
  name?: string | null;
  seed?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) => (
  <span
    aria-hidden="true"
    className={cn(
      'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold tracking-[0.02em]',
      SIZES[size],
      avatarTone(seed || name),
      className
    )}
  >
    {initials(name)}
  </span>
);

export default ShareAvatar;
