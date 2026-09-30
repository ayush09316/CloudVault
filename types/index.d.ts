import { Models } from 'node-appwrite';

declare type FileType = 'document' | 'image' | 'video' | 'audio' | 'other';

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

declare interface FileDocument extends Models.Document {
  name: string;
  url: string;
  type: FileType;
  extension: string;
  size: number;
  // TODO: verify in the Appwrite console whether `owner` is a relationship
  // attribute (resolving to the owner's user document) or a plain string
  // storing the owner's user $id. Every read path (Card, FileCard,
  // ActionsModalContent) accesses `owner.fullName`, so this type assumes
  // a relationship. If the Appwrite collection schema stores `owner` as a
  // plain string, this type and those read paths are both wrong and need
  // a `databases.getDocument` lookup on the users collection instead.
  owner: Models.Document;
  accountId: string;
  users: string[];
  bucketFileId: string;
}

type MediaType = {
  size: number;
  latestDate: string;
};

export interface TotalSpace {
  image: MediaType;
  document: MediaType;
  video: MediaType;
  audio: MediaType;
  other: MediaType;
  used: number;
  all: number;
}

declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
  isAdmin?: boolean;
}
declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
declare interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
declare interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

declare interface ShareInputProps {
  file: FileDocument;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}
