'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query, ID } from 'node-appwrite';
import { parseStringify } from '@/lib/utils';
import { cookies } from 'next/headers';
import { avatarPlaceholderUrl } from '@/constants';
import { redirect } from 'next/navigation';

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw new Error(message);
};

const setCookie = async (name: string, value: string, options = {}) => {
  (await cookies()).set(name, value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24,
    ...options,
  });
  console.log('Cookie set', name, value);
};

const deleteCookie = async (name: string) => {
  (await cookies()).delete(name);
};

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('email', [email])]
    );
    return result.total > 0 ? result.documents[0] : null;
  } catch (error) {
    handleError(error, 'Failed to fetch user by email');
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email OTP');
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error('Account already exists');
  }

  const accountId = await sendEmailOTP({ email });
  if (!accountId) {
    throw new Error('Failed to send OTP');
  }

  const { databases } = await createAdminClient();

  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
        isAdmin: false,
      }
    );

    return parseStringify({ accountId });
  } catch (error) {
    handleError(error, 'Failed to create account');
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    await setCookie('appwrite-session', session.secret);
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, 'Failed to verify OTP');
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountId', result.$id)]
    );

    return user.total > 0 ? parseStringify(user.documents[0]) : null;
  } catch (error) {
    console.error('Failed to fetch current user', error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession('current');
    await deleteCookie('appwrite-session');
  } catch (error) {
    handleError(error, 'Failed to sign out user');
  } finally {
    redirect('/sign-in');
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    throw new Error('User not found');
  } catch (error) {
    handleError(error, 'Failed to sign in user');
  }
};
