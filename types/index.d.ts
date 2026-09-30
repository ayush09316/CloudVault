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
  parentId?: string | null;
  path: string;
}

declare interface FileDocument extends Models.Document {
  name: string;
  url: string;
  type: FileType;
  extension: string;
  size: number;
  owner: Models.Document;
  accountId: string;
  users?: string[];
  bucketFileId: string;
  isFolder?: boolean | null;
  parentId?: string | null;
  deletedAt?: string | null;
  thumbnailBucketFileId?: string | null;
}

declare interface UserDocument extends Models.Document {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
  isAdmin?: boolean | null;
  disabled?: boolean | null;
  quotaBytes?: number | null;
}

declare interface ShareDocument extends Models.Document {
  fileId: string;
  granteeEmail?: string | null;
  role: 'view' | 'edit';
  token?: string | null;
  expiresAt?: string | null;
}

declare interface ActivityEntry {
  $id: string;
  action: string;
  at: string;
  actorId: string;
  actorName: string;
  meta: Record<string, unknown> | null;
  fileId?: string;
  fileName?: string;
}

declare interface FileListResult {
  documents: FileDocument[];
  total: number;
  nextCursor: string | null;
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
  trashed: number;
}

declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
  cursor?: string | null;
  parentId?: string | null;
  scope?: 'mine' | 'all';
  includeFolders?: boolean;
}
declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
  shareToken?: string;
}
declare interface DeleteFileProps {
  fileId: string;
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
