'use client';

import { useTransition } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortTypes } from '@/constants';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { label: 'Last modified', value: '$updatedAt-desc' },
  { label: 'Oldest modified', value: '$updatedAt-asc' },
  ...sortTypes.map((s) => ({
    ...s,
    label: s.label.replace('Created Date', 'Date created'),
  })),
];

const Sort = ({ className }: { className?: string }) => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const current = searchParams.get('sort') || sortTypes[0].value;

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    startTransition(() => {
      router.push(`${path}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Select value={current} onValueChange={handleSort}>
      <SelectTrigger
        aria-label="Sort by"
        className={cn(
          'h-9 w-auto min-w-[176px] gap-2 whitespace-nowrap text-[13px]',
          isPending && 'opacity-70',
          className
        )}
      >
        <ArrowUpDown
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground"
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {OPTIONS.map((sort) => (
          <SelectItem key={sort.value} value={sort.value}>
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
