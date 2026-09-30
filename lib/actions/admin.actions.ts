'use server';

import { Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { parseStringify } from '@/lib/utils';
import { resolveQuota } from '@/lib/quota';
import { listAll, notTrashed, resolveOwnerId } from '@/lib/server/files';
import { FileDocument, UserDocument } from '@/types';

export interface AdminUserRow {
  $id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  disabled: boolean;
  usedBytes: number;
  quotaBytes: number;
  fileCount: number;
}

const requireAdmin = async () => {
  const currentUser = (await getCurrentUser()) as UserDocument | null;
  if (!currentUser?.isAdmin) throw new Error('Admin access required.');
  return currentUser;
};

export const listUsersWithUsage = async (): Promise<AdminUserRow[]> => {
  await requireAdmin();

  const [users, files] = await Promise.all([
    listAll<UserDocument>(appwriteConfig.usersCollectionId, [
      Query.orderAsc('fullName'),
    ]),
    listAll<FileDocument>(appwriteConfig.filesCollectionId, [
      notTrashed(),
      Query.equal('isFolder', [false]),
      Query.select(['$id', 'size', 'owner.$id']),
    ]),
  ]);

  const usage = new Map<string, { bytes: number; count: number }>();
  for (const f of files) {
    const ownerId = resolveOwnerId(f.owner);
    const current = usage.get(ownerId) ?? { bytes: 0, count: 0 };
    current.bytes += f.size || 0;
    current.count += 1;
    usage.set(ownerId, current);
  }

  return parseStringify(
    users.map((u) => ({
      $id: u.$id,
      fullName: u.fullName,
      email: u.email,
      isAdmin: !!u.isAdmin,
      disabled: !!u.disabled,
      usedBytes: usage.get(u.$id)?.bytes ?? 0,
      quotaBytes: resolveQuota(u.quotaBytes),
      fileCount: usage.get(u.$id)?.count ?? 0,
    }))
  );
};

export const setUserDisabled = async ({
  userId,
  disabled,
}: {
  userId: string;
  disabled: boolean;
}) => {
  const admin = await requireAdmin();
  if (admin.$id === userId) {
    throw new Error('You cannot disable your own account.');
  }

  const { databases, users } = await createAdminClient();
  const target = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    userId,
    { disabled }
  );

  if (disabled) {
    await users
      .deleteSessions(target.accountId)
      .catch((e) => console.error('Failed to revoke sessions', e));
  }

  revalidatePath('/admin/users');
  return parseStringify({ status: 'success' });
};
