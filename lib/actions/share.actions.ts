'use server';

import { randomBytes } from 'crypto';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { parseStringify } from '@/lib/utils';
import { ShareRole } from '@/lib/permissions';
import {
  getFileAccess,
  getSharesForFile,
  logActivity,
} from '@/lib/server/files';
import { ShareDocument } from '@/types';

const requireShareAccess = async (fileId: string) => {
  const access = await getFileAccess(fileId);
  if (!access || access.role !== 'owner' || access.file.deletedAt) {
    throw new Error('You do not have permission to share this file.');
  }
  if (access.file.isFolder) {
    throw new Error('Sharing folders is not supported.');
  }
  return access;
};

const roleSchema = z.enum(['view', 'edit']);

export const getFileShares = async (
  fileId: string
): Promise<ShareDocument[]> => {
  await requireShareAccess(fileId);
  return parseStringify(await getSharesForFile(fileId));
};

export const addShareGrantees = async ({
  fileId,
  emails,
  role,
  path,
}: {
  fileId: string;
  emails: string[];
  role: ShareRole;
  path: string;
}) => {
  const access = await requireShareAccess(fileId);
  const parsedRole = roleSchema.parse(role);
  const valid = [
    ...new Set(
      emails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => z.string().email().safeParse(e).success)
    ),
  ].filter((e) => e !== access.user?.email.toLowerCase());

  const { databases } = await createAdminClient();
  const existing = await getSharesForFile(fileId);

  for (const email of valid) {
    const current = existing.find((s) => s.granteeEmail === email);
    if (current) {
      if (current.role !== parsedRole) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.sharesCollectionId,
          current.$id,
          { role: parsedRole }
        );
      }
    } else {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sharesCollectionId,
        ID.unique(),
        { fileId, granteeEmail: email, role: parsedRole }
      );
    }
    await logActivity(fileId, access.actorId, 'shared', {
      granteeEmail: email,
      role: parsedRole,
    });
  }

  revalidatePath(path);
  return parseStringify(await getSharesForFile(fileId));
};

export const createShareLink = async ({
  fileId,
  role,
  expiresInDays,
  path,
}: {
  fileId: string;
  role: ShareRole;
  expiresInDays: number | null;
  path: string;
}) => {
  const access = await requireShareAccess(fileId);
  const parsedRole = roleSchema.parse(role);
  const expiresAt =
    expiresInDays && expiresInDays > 0
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : null;

  const { databases } = await createAdminClient();
  const share = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.sharesCollectionId,
    ID.unique(),
    {
      fileId,
      role: parsedRole,
      token: randomBytes(24).toString('base64url'),
      expiresAt,
    }
  );

  await logActivity(fileId, access.actorId, 'shared_link', {
    role: parsedRole,
    expiresAt,
  });

  revalidatePath(path);
  return parseStringify(share) as ShareDocument;
};

export const revokeShare = async ({
  shareId,
  path,
}: {
  shareId: string;
  path: string;
}) => {
  const { databases } = await createAdminClient();
  const share = (await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.sharesCollectionId,
    shareId
  )) as ShareDocument;
  const access = await requireShareAccess(share.fileId);

  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.sharesCollectionId,
    shareId
  );

  await logActivity(share.fileId, access.actorId, 'unshared', {
    granteeEmail: share.granteeEmail ?? null,
    link: !!share.token,
  });

  revalidatePath(path);
  return parseStringify({ status: 'success' });
};
