import FileViewer from '@/components/FileViewer';
import { getTrashedFiles } from '@/lib/actions/file.actions';
import { FileDocument } from '@/types';

const Page = async () => {
  const files = await getTrashedFiles();
  const totalSize = files.reduce(
    (acc: number, file: FileDocument) => acc + (file.size || 0),
    0
  );

  return (
    <FileViewer
      files={files}
      totalSize={totalSize}
      type="Trash"
      mode="trash"
      emptyVariant="trash"
    />
  );
};

export default Page;
