'use client';

import Thumbnail from '@/components/Thumbnail';
import { cn, convertFileSize, getThumbnailSrc } from '@/lib/utils';
import FormattedDateTime from '@/components/FormattedDateTime';
import ActionDropdown from '@/components/ActionDropdown';
import TrashActions from '@/components/TrashActions';
import { FileDocument } from '@/types';

export interface FileItemProps {
  file: FileDocument;
  mode?: 'browse' | 'trash';
  selected?: boolean;
  onToggleSelect?: (file: FileDocument) => void;
  onOpen?: (file: FileDocument) => void;
}

export const stop = (e: React.SyntheticEvent) => e.stopPropagation();

export const SelectBox = ({
  file,
  selected,
  onToggleSelect,
}: Pick<FileItemProps, 'file' | 'selected' | 'onToggleSelect'>) =>
  onToggleSelect ? (
    <input
      type="checkbox"
      aria-label={`Select ${file.name}`}
      data-testid="select-file"
      className="size-4 cursor-pointer accent-brand"
      checked={!!selected}
      onClick={stop}
      onChange={() => onToggleSelect(file)}
    />
  ) : null;

const Card = ({
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
      <div className="flex justify-between">
        <div className="flex items-start gap-2">
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
        </div>

        <div className="flex flex-col items-end justify-between" onClick={stop}>
          {mode === 'trash' ? (
            <TrashActions file={file} />
          ) : (
            <ActionDropdown file={file} />
          )}
          {!file.isFolder && (
            <p className="body-1">{convertFileSize(file.size)}</p>
          )}
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        <FormattedDateTime
          date={mode === 'trash' ? file.deletedAt || '' : file.$createdAt}
          className="body-2 text-light-100 dark:text-ink-200"
        />
        <p className="caption line-clamp-1 text-light-200 dark:text-ink-400">
          By: {file.owner?.fullName}
        </p>
      </div>
    </div>
  );
};
export default Card;
