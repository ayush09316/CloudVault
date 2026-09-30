import { ID, Models, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { getCurrentUser } from '@/lib/actions/user.actions';
import {
  AccessRole,
  Principal,
  resolveRole,
  ShareGrant,
} from '@/lib/permissions';
import { FileDocument, ShareDocument, UserDocument } from '@/types';

export const PAGE_SIZE = 100;

export const resolveOwnerId = (owner: unknown): string => {
  if (owner && typeof owner === 'object' && '$id' in owner) {
    return (owner as { $id: string }).$id;
  }
  return owner as string;
};

export const listAll = async <T extends Models.Document>(
  collectionId: string,
  queries: string[],
  maxPages = 200
): Promise<T[]> => {
  const { databases } = await createAdminClient();
  const out: T[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionId,
      [
        ...queries,
        Query.limit(PAGE_SIZE),
        ...(cursor ? [Query.cursorAfter(cursor)] : []),
      ]
    );
    out.push(...(res.documents as T[]));
    if (res.documents.length < PAGE_SIZE) break;
    cursor = res.documents[res.documents.length - 1].$id;
  }
  return out;
};

export const notTrashed = () => Query.isNull('deletedAt');

export const rootQuery = () =>
  Query.or([Query.isNull('parentId'), Query.equal('parentId', [''])]);

export const getFileDoc = async (fileId: string) => {
  const { databases } = await createAdminClient();
  return (await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.filesCollectionId,
    fileId
  )) as FileDocument;
};

export const getSharesForFile = (fileId: string) =>
  listAll<ShareDocument>(appwriteConfig.sharesCollectionId, [
    Query.equal('fileId', [fileId]),
  ]);

export const getShareByToken = async (token: string) => {
  const { databases } = await createAdminClient();
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.sharesCollectionId,
    [Query.equal('token', [token]), Query.limit(1)]
  );
  return (res.documents[0] as ShareDocument | undefined) ?? null;
};

export const toGrant = (s: ShareDocument): ShareGrant => ({
  granteeEmail: s.granteeEmail,
  token: s.token,
  role: s.role,
  expiresAt: s.expiresAt,
});

export interface FileAccess {
  file: FileDocument;
  role: AccessRole;
  principal: Principal;
  user: UserDocument | null;
  actorId: string;
}

export const getFileAccess = async (
  fileId: string,
  opts: { token?: string | null } = {}
): Promise<FileAccess | null> => {
  let file: FileDocument;
  try {
    file = await getFileDoc(fileId);
  } catch {
    return null;
  }

  const user = opts.token
    ? null
    : ((await getCurrentUser()) as UserDocument | null);
  if (!opts.token && !user) return null;

  const principal: Principal = opts.token
    ? { token: opts.token }
    : { userId: user!.$id, email: user!.email, isAdmin: !!user!.isAdmin };

  const shares = await getSharesForFile(fileId);
  const role = resolveRole(
    { ownerId: resolveOwnerId(file.owner) },
    principal,
    shares.map(toGrant)
  );
  if (!role) return null;

  const tokenShare = opts.token
    ? shares.find((s) => s.token === opts.token)
    : undefined;

  return {
    file,
    role,
    principal,
    user,
    actorId: user ? user.$id : `share:${tokenShare?.$id ?? 'unknown'}`,
  };
};

export const logActivity = async (
  fileId: string,
  actorId: string,
  action: string,
  meta: Record<string, unknown> = {}
) => {
  try {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.activityCollectionId,
      ID.unique(),
      {
        fileId,
        actorId,
        action,
        at: new Date().toISOString(),
        meta: JSON.stringify(meta).slice(0, 4000),
      }
    );
  } catch (error) {
    console.error('Failed to write activity log', error);
  }
};

export const getOwnedFolders = (ownerId: string) =>
  listAll<FileDocument>(appwriteConfig.filesCollectionId, [
    Query.equal('owner', [ownerId]),
    Query.equal('isFolder', [true]),
    notTrashed(),
    Query.select(['$id', 'name', 'parentId']),
  ]);

export const collectDescendants = async (
  ownerId: string,
  rootIds: string[],
  extra: string[] = []
) => {
  const found: FileDocument[] = [];
  let frontier = rootIds;

  while (frontier.length > 0) {
    const children: FileDocument[] = [];
    for (let i = 0; i < frontier.length; i += 50) {
      children.push(
        ...(await listAll<FileDocument>(appwriteConfig.filesCollectionId, [
          Query.equal('owner', [ownerId]),
          Query.equal('parentId', frontier.slice(i, i + 50)),
          ...extra,
        ]))
      );
    }
    found.push(...children);
    frontier = children.filter((c) => c.isFolder).map((c) => c.$id);
  }
  return found;
};

export const sumOwnedBytes = async (ownerId: string) => {
  const docs = await listAll<FileDocument>(appwriteConfig.filesCollectionId, [
    Query.equal('owner', [ownerId]),
    notTrashed(),
    Query.select(['$id', 'size']),
  ]);
  return docs.reduce((acc, d) => acc + (d.size || 0), 0);
};
