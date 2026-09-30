'use server';

import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { ID, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { after } from 'next/server';
import sharp from 'sharp';
import { constructFileUrl, getFileType, parseStringify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { canDelete } from '@/lib/permissions';
import { checkQuota, resolveQuota } from '@/lib/quota';
import {
  buildBreadcrumbs,
  canMoveInto,
  Crumb,
  FolderNode,
  normalizeParentId,
  topLevelTrashed,
} from '@/lib/folders';
import { isThumbnailable } from '@/lib/preview';
import {
  collectDescendants,
  getFileAccess,
  getFileDoc,
  getOwnedFolders,
  getSharesForFile,
  listAll,
  logActivity,
  notTrashed,
  resolveOwnerId,
  rootQuery,
  sumOwnedBytes,
} from '@/lib/server/files';
import {
  ActivityEntry,
  DeleteFileProps,
  FileDocument,
  FileListResult,
  FileType,
  GetFilesProps,
  RenameFileProps,
  ShareDocument,
  UploadFileProps,
  UserDocument,
} from '@/types';

const DEFAULT_PAGE_SIZE = 50;
const THUMBNAIL_SIZE = 256;

// Folders live in the files collection, whose `url` (URL format) and
// `bucketFileId` attributes are required; these placeholders satisfy the
// schema and are never dereferenced because folder rows are filtered out of
// every content/download path.
const FOLDER_URL_PLACEHOLDER = 'https://folder.invalid/';
const FOLDER_BUCKET_PLACEHOLDER = 'folder';

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const requireUser = async () => {
  const currentUser = (await getCurrentUser()) as UserDocument | null;
  if (!currentUser) throw new Error('User is not authenticated.');
  return currentUser;
};

const assertOwnedFolder = async (ownerId: string, folderId: string | null) => {
  if (!folderId) return;
  const folder = await getFileDoc(folderId).catch(() => null);
  if (
    !folder ||
    !folder.isFolder ||
    folder.deletedAt ||
    resolveOwnerId(folder.owner) !== ownerId
  ) {
    throw new Error('Target folder not found.');
  }
};

const generateThumbnail = async (fileDocId: string, buffer: Buffer) => {
  try {
    const { storage, databases } = await createAdminClient();
    const thumb = await sharp(buffer, { animated: false })
      .rotate()
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 70 })
      .toBuffer();

    const thumbFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      InputFile.fromBuffer(thumb, `thumb-${fileDocId}.webp`)
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileDocId,
      { thumbnailBucketFileId: thumbFile.$id }
    );
  } catch (error) {
    console.error('Thumbnail generation failed', fileDocId, error);
  }
};

export const uploadFile = async ({ file, parentId, path }: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    if (!file || !file.name) {
      throw new Error('Invalid file or file name');
    }

    const currentUser = await requireUser();
    const targetParent = normalizeParentId(parentId);
    await assertOwnedFolder(currentUser.$id, targetParent);

    const used = await sumOwnedBytes(currentUser.$id);
    const quota = checkQuota(used, file.size, currentUser.quotaBytes);
    if (!quota.ok) {
      return {
        error: `Uploading ${file.name} would exceed your storage quota (${Math.round(
          quota.remaining / (1024 * 1024)
        )} MB remaining).`,
      };
    }

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    const { type, extension } = getFileType(bucketFile.name);

    const fileDocument = {
      type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension,
      size: bucketFile.sizeOriginal,
      // `owner` is a relationship attribute to the `users` collection
      // (confirmed via the Appwrite console) — passing the user's $id here
      // is correct, and Appwrite resolves it to the full document on read.
      owner: currentUser.$id,
      accountId: currentUser.accountId,
      users: [],
      bucketFileId: bucketFile.$id,
      isFolder: false,
      parentId: targetParent,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        console.error('Failed to create file document:', error);
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        throw error;
      });

    await logActivity(newFile.$id, currentUser.$id, 'uploaded', {
      name: newFile.name,
      size: newFile.size,
      parentId: targetParent,
    });

    if (isThumbnailable(extension)) {
      const buffer = Buffer.from(await file.arrayBuffer());
      after(() => generateThumbnail(newFile.$id, buffer));
    }

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    console.error('File upload failed:');
    handleError(error, 'Failed to upload file');
  }
};

export const createFolder = async ({
  name,
  parentId,
  path,
}: {
  name: string;
  parentId?: string | null;
  path: string;
}) => {
  try {
    const currentUser = await requireUser();
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Folder name is required.');

    const targetParent = normalizeParentId(parentId);
    await assertOwnedFolder(currentUser.$id, targetParent);

    const { databases } = await createAdminClient();
    const folder = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      {
        type: 'other',
        name: trimmed,
        url: FOLDER_URL_PLACEHOLDER,
        extension: '',
        size: 0,
        owner: currentUser.$id,
        accountId: currentUser.accountId,
        users: [],
        bucketFileId: FOLDER_BUCKET_PLACEHOLDER,
        isFolder: true,
        parentId: targetParent,
      }
    );

    await logActivity(folder.$id, currentUser.$id, 'created_folder', {
      name: trimmed,
      parentId: targetParent,
    });

    revalidatePath(path);
    return parseStringify(folder);
  } catch (error) {
    handleError(error, 'Failed to create folder');
  }
};

const sharedWithMeIds = async (email: string) => {
  const shares = await listAll<ShareDocument>(
    appwriteConfig.sharesCollectionId,
    [Query.equal('granteeEmail', [email.toLowerCase()])],
    5
  );
  const now = Date.now();
  return [
    ...new Set(
      shares
        .filter((s) => !s.expiresAt || new Date(s.expiresAt).getTime() > now)
        .map((s) => s.fileId)
    ),
  ].slice(0, 100);
};

export const getFiles = async ({
  types = [],
  searchText = '',
  sort = '$createdAt-desc',
  limit = DEFAULT_PAGE_SIZE,
  cursor = null,
  parentId,
  scope = 'mine',
  includeFolders,
}: GetFilesProps): Promise<FileListResult | undefined> => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await requireUser();
    const queries: string[] = [notTrashed()];
    const browsingFolder = parentId !== undefined;

    if (browsingFolder) {
      queries.push(Query.equal('owner', [currentUser.$id]));
      const folderId = normalizeParentId(parentId);
      queries.push(
        folderId ? Query.equal('parentId', [folderId]) : rootQuery()
      );
    } else if (!(scope === 'all' && currentUser.isAdmin)) {
      const sharedIds = await sharedWithMeIds(currentUser.email);
      queries.push(
        sharedIds.length > 0
          ? Query.or([
              Query.equal('owner', [currentUser.$id]),
              Query.equal('$id', sharedIds),
            ])
          : Query.equal('owner', [currentUser.$id])
      );
    }

    if (!(includeFolders ?? browsingFolder)) {
      queries.push(Query.equal('isFolder', [false]));
    }
    if (types.length > 0) queries.push(Query.equal('type', types));
    if (searchText.trim())
      queries.push(Query.search('name', searchText.trim()));

    if (browsingFolder) queries.push(Query.orderDesc('isFolder'));
    const [sortBy, orderBy] = (sort || '$createdAt-desc').split('-');
    queries.push(
      orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );

    const pageSize = Math.min(Math.max(limit, 1), 100);
    queries.push(Query.limit(pageSize));
    if (cursor) queries.push(Query.cursorAfter(cursor));

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    const documents = files.documents as FileDocument[];
    return parseStringify({
      documents,
      total: files.total,
      nextCursor:
        documents.length === pageSize
          ? documents[documents.length - 1].$id
          : null,
    });
  } catch (error) {
    handleError(error, 'Failed to get files');
  }
};

export const getFolderContext = async (
  folderId: string | null
): Promise<{ folder: FileDocument | null; breadcrumbs: Crumb[] }> => {
  const currentUser = await requireUser();
  const folders = await getOwnedFolders(currentUser.$id);
  const map = new Map<string, FolderNode>(folders.map((f) => [f.$id, f]));
  const id = normalizeParentId(folderId);

  if (id && !map.has(id)) {
    return { folder: null, breadcrumbs: buildBreadcrumbs(null, map) };
  }

  const folder = id ? (folders.find((f) => f.$id === id) ?? null) : null;
  return parseStringify({ folder, breadcrumbs: buildBreadcrumbs(id, map) });
};

export const listMyFolders = async (): Promise<
  { id: string; label: string }[]
> => {
  const currentUser = await requireUser();
  const folders = await getOwnedFolders(currentUser.$id);
  const map = new Map<string, FolderNode>(folders.map((f) => [f.$id, f]));

  return folders
    .map((f) => ({
      id: f.$id,
      label: buildBreadcrumbs(f.$id, map, '')
        .slice(1)
        .map((c) => c.name)
        .join(' / '),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
  shareToken,
}: RenameFileProps) => {
  try {
    const access = await getFileAccess(fileId, { token: shareToken });
    if (
      !access ||
      access.file.deletedAt ||
      !(access.role === 'owner' || access.role === 'edit')
    ) {
      throw new Error('You do not have permission to rename this file.');
    }

    const trimmed = name.trim();
    if (!trimmed) throw new Error('Name is required.');

    const { databases } = await createAdminClient();
    const newName =
      access.file.isFolder || !extension || trimmed.endsWith(`.${extension}`)
        ? trimmed
        : `${trimmed}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { name: newName }
    );

    await logActivity(fileId, access.actorId, 'renamed', {
      from: access.file.name,
      to: newName,
    });

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, 'Failed to rename file');
  }
};

const loadOwned = async (fileIds: string[], ownerId: string) => {
  const docs = await Promise.all(
    fileIds.map((id) => getFileDoc(id).catch(() => null))
  );
  return docs.filter(
    (d): d is FileDocument =>
      !!d &&
      canDelete({ ownerId: resolveOwnerId(d.owner) }, { userId: ownerId })
  );
};

const trashItems = async (items: FileDocument[], actorId: string) => {
  const { databases } = await createAdminClient();
  const stamp = new Date().toISOString();
  const live = items.filter((i) => !i.deletedAt);
  const descendants = await collectDescendants(
    actorId,
    live.filter((i) => i.isFolder).map((i) => i.$id),
    [notTrashed()]
  );

  for (const doc of [...live, ...descendants]) {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      doc.$id,
      { deletedAt: stamp }
    );
  }

  for (const item of live) {
    await logActivity(item.$id, actorId, 'trashed', {
      name: item.name,
      descendants: descendants.length,
    });
  }
  return live.length;
};

export const deleteFile = async ({ fileId, path }: DeleteFileProps) => {
  try {
    const currentUser = await requireUser();
    const [target] = await loadOwned([fileId], currentUser.$id);
    if (!target) {
      throw new Error('You do not have permission to delete this file.');
    }

    await trashItems([target], currentUser.$id);
    revalidatePath(path);
    return parseStringify({ status: 'success' });
  } catch (error) {
    handleError(error, 'Failed to delete file');
  }
};

export const deleteFiles = async ({
  fileIds,
  path,
}: {
  fileIds: string[];
  path: string;
}) => {
  try {
    const currentUser = await requireUser();
    const targets = await loadOwned(fileIds, currentUser.$id);
    const count = await trashItems(targets, currentUser.$id);
    revalidatePath(path);
    return parseStringify({ status: 'success', count });
  } catch (error) {
    handleError(error, 'Failed to delete files');
  }
};

export const moveFiles = async ({
  fileIds,
  targetParentId,
  path,
}: {
  fileIds: string[];
  targetParentId: string | null;
  path: string;
}) => {
  try {
    const currentUser = await requireUser();
    const targets = (await loadOwned(fileIds, currentUser.$id)).filter(
      (t) => !t.deletedAt
    );
    const folders = await getOwnedFolders(currentUser.$id);
    const map = new Map<string, FolderNode>(folders.map((f) => [f.$id, f]));
    const target = normalizeParentId(targetParentId);
    const { databases } = await createAdminClient();

    let moved = 0;
    const skipped: string[] = [];
    for (const item of targets) {
      if (!canMoveInto(item.$id, !!item.isFolder, target, map)) {
        skipped.push(item.name);
        continue;
      }
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        item.$id,
        { parentId: target }
      );
      await logActivity(item.$id, currentUser.$id, 'moved', {
        from: normalizeParentId(item.parentId),
        to: target,
      });
      moved++;
    }

    revalidatePath(path);
    return parseStringify({ moved, skipped });
  } catch (error) {
    handleError(error, 'Failed to move files');
  }
};

export const getTrashedFiles = async (): Promise<FileDocument[]> => {
  const currentUser = await requireUser();
  const trashed = await listAll<FileDocument>(
    appwriteConfig.filesCollectionId,
    [
      Query.equal('owner', [currentUser.$id]),
      Query.isNotNull('deletedAt'),
      Query.orderDesc('deletedAt'),
    ]
  );
  return parseStringify(topLevelTrashed(trashed));
};

export const restoreFile = async ({
  fileId,
  path,
}: {
  fileId: string;
  path: string;
}) => {
  try {
    const currentUser = await requireUser();
    const [target] = await loadOwned([fileId], currentUser.$id);
    if (!target || !target.deletedAt) {
      throw new Error('File is not in the trash.');
    }

    const { databases } = await createAdminClient();
    const stamp = target.deletedAt;
    const descendants = target.isFolder
      ? await collectDescendants(
          currentUser.$id,
          [target.$id],
          [Query.equal('deletedAt', [stamp])]
        )
      : [];

    let parentId = normalizeParentId(target.parentId);
    if (parentId) {
      const parent = await getFileDoc(parentId).catch(() => null);
      if (!parent || parent.deletedAt) parentId = null;
    }

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      target.$id,
      { deletedAt: null, parentId }
    );
    for (const doc of descendants) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        doc.$id,
        { deletedAt: null }
      );
    }

    await logActivity(target.$id, currentUser.$id, 'restored', {
      name: target.name,
      parentId,
    });

    revalidatePath(path);
    return parseStringify({ status: 'success' });
  } catch (error) {
    handleError(error, 'Failed to restore file');
  }
};

export const permanentlyDeleteFile = async ({
  fileId,
  path,
}: {
  fileId: string;
  path: string;
}) => {
  try {
    const currentUser = await requireUser();
    const [target] = await loadOwned([fileId], currentUser.$id);
    if (!target || !target.deletedAt) {
      throw new Error('Only files in the trash can be permanently deleted.');
    }

    const { databases, storage } = await createAdminClient();
    const descendants = target.isFolder
      ? await collectDescendants(currentUser.$id, [target.$id])
      : [];

    for (const doc of [...descendants.reverse(), target]) {
      const bucketIds = doc.isFolder
        ? []
        : [doc.bucketFileId, doc.thumbnailBucketFileId];
      for (const bucketId of bucketIds) {
        if (bucketId) {
          await storage
            .deleteFile(appwriteConfig.bucketId, bucketId)
            .catch((e) => console.error('Bucket delete failed', bucketId, e));
        }
      }
      const shares = await getSharesForFile(doc.$id);
      for (const s of shares) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.sharesCollectionId,
          s.$id
        );
      }
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        doc.$id
      );
    }

    await logActivity(target.$id, currentUser.$id, 'deleted_permanently', {
      name: target.name,
      descendants: descendants.length,
    });

    revalidatePath(path);
    return parseStringify({ status: 'success' });
  } catch (error) {
    handleError(error, 'Failed to permanently delete file');
  }
};

// ============================== TOTAL FILE SPACE USED
export async function getTotalSpaceUsed() {
  try {
    const currentUser = await requireUser();

    const files = await listAll<FileDocument>(
      appwriteConfig.filesCollectionId,
      [
        Query.equal('owner', [currentUser.$id]),
        notTrashed(),
        Query.equal('isFolder', [false]),
        Query.select(['$id', 'size', 'type', '$updatedAt']),
      ]
    );

    const totalSpace = {
      image: { size: 0, latestDate: '' },
      document: { size: 0, latestDate: '' },
      video: { size: 0, latestDate: '' },
      audio: { size: 0, latestDate: '' },
      other: { size: 0, latestDate: '' },
      used: 0,
      all: resolveQuota(currentUser.quotaBytes),
    };

    files.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size || 0;
      totalSpace.used += file.size || 0;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, 'Error calculating total space used:');
  }
}

const describeActor = (actorId: string, names: Map<string, string>) => {
  if (actorId.startsWith('share:')) return 'Anonymous (share link)';
  return names.get(actorId) ?? 'Unknown user';
};

export const getFileActivity = async (
  fileId: string
): Promise<ActivityEntry[]> => {
  const access = await getFileAccess(fileId);
  if (!access) throw new Error('You do not have access to this file.');

  const { databases } = await createAdminClient();
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.activityCollectionId,
    [Query.equal('fileId', [fileId]), Query.orderDesc('at'), Query.limit(50)]
  );

  const actorIds = [
    ...new Set(
      res.documents
        .map((d) => d.actorId as string)
        .filter((id) => !id.startsWith('share:'))
    ),
  ];
  const names = new Map<string, string>();
  if (actorIds.length > 0) {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('$id', actorIds), Query.limit(100)]
    );
    users.documents.forEach((u) => names.set(u.$id, u.fullName));
  }

  return res.documents.map((d) => {
    let meta: Record<string, unknown> | null = null;
    try {
      meta = d.meta ? JSON.parse(d.meta) : null;
    } catch {
      meta = null;
    }
    return {
      $id: d.$id,
      action: d.action,
      at: d.at,
      actorId: d.actorId,
      actorName: describeActor(d.actorId, names),
      meta,
    };
  });
};
