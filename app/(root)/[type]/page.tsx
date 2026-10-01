import Link from 'next/link';
import FileViewer from '@/components/FileViewer';
import { getFiles } from '@/lib/actions/file.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { cn, getFileTypesParams } from '@/lib/utils';
import {
  FileDocument,
  FileType,
  GetFilesProps,
  SearchParamProps,
} from '@/types';

const scopeHref = (
  type: string,
  sp: Record<string, unknown>,
  scope: 'mine' | 'all'
) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === 'string' && k !== 'scope') params.set(k, v);
  }
  if (scope === 'all') params.set('scope', 'all');
  const qs = params.toString();
  return qs ? `/${type}?${qs}` : `/${type}`;
};

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || '';
  const sp = (await searchParams) ?? {};
  const searchText = (sp?.query as string) || '';
  const sort = (sp?.sort as string) || '';
  const currentUser = await getCurrentUser();
  const scope = currentUser?.isAdmin && sp?.scope === 'all' ? 'all' : 'mine';

  const types = getFileTypesParams(type) as FileType[];
  const query: GetFilesProps = { types, searchText, sort, scope };
  const files = await getFiles(query);
  const documents = files?.documents ?? [];

  const totalSize = documents.reduce(
    (acc: number, file: FileDocument) => acc + (file.size || 0),
    0
  );

  const toolbar = currentUser?.isAdmin ? (
    <div
      role="group"
      aria-label="Owner scope"
      className="inline-flex items-center rounded-lg border border-border bg-card p-0.5"
    >
      {(['mine', 'all'] as const).map((s) => (
        <Link
          key={s}
          href={scopeHref(type, sp, s)}
          aria-current={scope === s ? 'true' : undefined}
          className={cn(
            'fx-focus inline-flex h-7 items-center rounded-md px-2.5 text-[12.5px] font-medium transition-colors',
            scope === s
              ? 'bg-ink-100 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))] dark:bg-ink-800'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {s === 'mine' ? 'Mine' : 'All users'}
        </Link>
      ))}
    </div>
  ) : null;

  return (
    <FileViewer
      key={`${type}-${scope}-${searchText}-${sort}`}
      files={documents}
      totalSize={totalSize}
      type={searchText ? `Results for “${searchText}”` : type}
      category={type}
      subtitle={
        searchText ? (
          <>
            {documents.length}
            {files?.nextCursor ? '+' : ''}{' '}
            {documents.length === 1 ? 'match' : 'matches'} in{' '}
            <span className="capitalize">{type}</span>
            {scope === 'all' ? ' across all users' : ''}
          </>
        ) : undefined
      }
      emptyVariant={searchText ? 'search' : 'type'}
      nextCursor={files?.nextCursor}
      query={query}
      toolbar={toolbar}
    />
  );
};

export default Page;
