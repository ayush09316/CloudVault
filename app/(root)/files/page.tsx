import Breadcrumbs from '@/components/Breadcrumbs';
import FileViewer from '@/components/FileViewer';
import NewFolderButton from '@/components/NewFolderButton';
import { getFiles, getFolderContext } from '@/lib/actions/file.actions';
import { FileDocument, GetFilesProps, SearchParamProps } from '@/types';

const Page = async ({ searchParams }: SearchParamProps) => {
  const sp = await searchParams;
  const folderId = (sp?.folder as string) || null;
  const sort = (sp?.sort as string) || '';

  const { folder, breadcrumbs } = await getFolderContext(folderId);
  const parentId = folder ? folder.$id : null;
  const query: GetFilesProps = { types: [], sort, parentId };
  const files = await getFiles(query);
  const documents = files?.documents ?? [];

  const totalSize = documents.reduce(
    (acc: number, file: FileDocument) => acc + (file.size || 0),
    0
  );

  return (
    <FileViewer
      key={`${parentId}-${sort}`}
      files={documents}
      totalSize={totalSize}
      type={folder ? folder.name : 'My Files'}
      nextCursor={files?.nextCursor}
      query={query}
      header={<Breadcrumbs crumbs={breadcrumbs} />}
      toolbar={<NewFolderButton parentId={parentId} />}
      emptyText="This folder is empty"
    />
  );
};

export default Page;
