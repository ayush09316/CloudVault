'use client';

import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

const Reveal = ({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
}) => {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <Tag ref={ref as never} className={cn('cv-reveal', className)}>
      {children}
    </Tag>
  );
};

export default Reveal;
