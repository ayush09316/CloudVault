import { formatDateTime } from '@/lib/utils';
import { ActivityEntry } from '@/types';

export const ACTION_LABELS: Record<string, string> = {
  uploaded: 'Uploaded',
  created_folder: 'Created folder',
  renamed: 'Renamed',
  moved: 'Moved',
  trashed: 'Moved to trash',
  restored: 'Restored',
  deleted_permanently: 'Deleted permanently',
  shared: 'Shared',
  shared_link: 'Created share link',
  unshared: 'Revoked access',
};

export const describeActivityMeta = (entry: ActivityEntry) => {
  const m = entry.meta ?? {};
  switch (entry.action) {
    case 'renamed':
      return `${m.from} → ${m.to}`;
    case 'shared':
      return `${m.granteeEmail} (${m.role})`;
    case 'shared_link':
      return `${m.role} link${m.expiresAt ? `, expires ${formatDateTime(m.expiresAt as string)}` : ''}`;
    case 'unshared':
      return m.link ? 'share link' : String(m.granteeEmail ?? '');
    default:
      return '';
  }
};
