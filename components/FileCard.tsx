'use client';

import Thumbnail from '@/components/Thumbnail';
import { cn, convertFileSize, getThumbnailSrc } from '@/lib/utils';
import FormattedDateTime from '@/components/FormattedDateTime';
import ActionDropdown from '@/components/ActionDropdown';
import TrashActions from '@/components/TrashActions';
import { FileItemProps, SelectBox, stop } from '@/components/Card';

const FileCard = ({
  file,
  mode = 'browse',
  selected,
  onToggleSelect,
  onOpen,
}: FileItemProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      data-testid="file-item"
      data-name={file.name}
      onClick={() => onOpen?.(file)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen?.(file)}
      className={cn(
        'file-card cursor-pointer',
        selected && 'ring-2 ring-brand'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SelectBox
            file={file}
            selected={selected}
            onToggleSelect={onToggleSelect}
          />
          <Thumbnail
            type={file.isFolder ? 'folder' : file.type}
            extension={file.extension}
            url={getThumbnailSrc(file)}
            className="!size-20"
            imageClassName="!size-11"
          />
          <p className="subtitle-2 line-clamp-1">{file.name}</p>
        </div>
        <div className=" flex w-1/2 justify-between">
          <p className="body-2 text-light-200 dark:text-ink-400">
            By : {file.owner?.fullName}
          </p>
          <FormattedDateTime
            date={mode === 'trash' ? file.deletedAt || '' : file.$createdAt}
            className="body-2"
          />
          <p className="body-2 text-light-200 dark:text-ink-400">
            {file.isFolder ? 'Folder' : `size : ${convertFileSize(file.size)}`}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between" onClick={stop}>
          {mode === 'trash' ? (
            <TrashActions file={file} />
          ) : (
            <ActionDropdown file={file} />
          )}
        </div>
      </div>
    </div>
  );
};
export default FileCard;
