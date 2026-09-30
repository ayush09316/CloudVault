import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn('empty-state', className)}>
    <div className="empty-state-icon">
      <Icon className="size-6" aria-hidden="true" />
    </div>
    <p className="subtitle-2">{title}</p>
    {description && (
      <p className="body-2 max-w-sm text-muted-foreground">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
