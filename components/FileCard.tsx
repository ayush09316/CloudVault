import { Models } from 'node-appwrite';
import Link from 'next/link';
import Thumbnail from '@/components/Thumbnail';
import { convertFileSize } from '@/lib/utils';
import FormattedDateTime from '@/components/FormattedDateTime';
import ActionDropdown from '@/components/ActionDropdown';

const FileCard = ({ file }: { file: Models.Document }) => {
  return (
    <Link href={file.url} target="_blank" className="file-card ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="!size-20"
            imageClassName="!size-11"
          />
          <p className="subtitle-2 line-clamp-1">{file.name}</p>
        </div>
        <div className=" flex w-1/2 justify-between">
          <p className="body-2 text-light-200">By : {file.owner.fullName}</p>
          <FormattedDateTime date={file.$createdAt} className="body-2" />
          <p className="body-2 text-light-200">
            size : {convertFileSize(file.size)}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
        </div>
      </div>
    </Link>
  );
};
export default FileCard;
