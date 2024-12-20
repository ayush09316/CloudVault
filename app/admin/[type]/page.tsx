import FileViewer from '@/components/FileViewer';
import { getFiles } from '@/lib/actions/file.actions';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getFileTypesParams } from '@/lib/utils';
import { FileType, SearchParamProps } from '@/types';

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || '';
  const searchText = ((await searchParams)?.query as string) || '';
  const sort = ((await searchParams)?.sort as string) || '';

  const types = getFileTypesParams(type) as FileType[];
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser.isAdmin;
  const files = await getFiles({ types, searchText, sort, isAdmin });

  const totalSize = files.documents?.reduce(
    (acc: number, file: File) => acc + file.size,
    0
  );

  return (
    <FileViewer files={files.documents} totalSize={totalSize} type={type} />
  );
};

export default Page;
