import Link from 'next/link';
import FileViewer from '@/components/FileViewer';
import { getFiles } from '@/lib/actions/file.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getFileTypesParams } from '@/lib/utils';
import {
  FileDocument,
  FileType,
  GetFilesProps,
  SearchParamProps,
} from '@/types';

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || '';
  const sp = await searchParams;
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
    <Link
      href={scope === 'all' ? `/${type}` : `/${type}?scope=all`}
      className="body-2 text-brand dark:text-vault-300"
    >
      {scope === 'all' ? 'Show only mine' : 'Show all users'}
    </Link>
  ) : null;

  return (
    <FileViewer
      key={`${type}-${scope}-${searchText}-${sort}`}
      files={documents}
      totalSize={totalSize}
      type={scope === 'all' ? `${type} (all users)` : type}
      nextCursor={files?.nextCursor}
      query={query}
      toolbar={toolbar}
    />
  );
};

export default Page;
