import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { Client, Databases, ID, Query, Storage, Users } from 'node-appwrite';
import sharp from 'sharp';

config({ path: path.resolve(__dirname, '../.env.local'), quiet: true });

const env = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is missing for e2e tests`);
  return value;
};

const client = new Client()
  .setEndpoint(env('NEXT_PUBLIC_APPWRITE_ENDPOINT'))
  .setProject(env('NEXT_PUBLIC_APPWRITE_PROJECT'))
  .setKey(env('NEXT_APPWRITE_KEY'));

export const db = new Databases(client);
export const storage = new Storage(client);
export const users = new Users(client);

export const ids = {
  database: env('NEXT_PUBLIC_APPWRITE_DATABASE'),
  users: env('NEXT_PUBLIC_APPWRITE_USERS_COLLECTION'),
  files: env('NEXT_PUBLIC_APPWRITE_FILES_COLLECTION'),
  bucket: env('NEXT_PUBLIC_APPWRITE_BUCKET'),
  shares: process.env.NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION || 'shares',
  activity: process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION || 'activity',
};

export interface TestUser {
  email: string;
  accountId: string;
  userDocId: string;
}

const STATE_FILE = path.resolve(__dirname, '.e2e-user.json');

export const saveTestUser = (user: TestUser) =>
  fs.writeFileSync(STATE_FILE, JSON.stringify(user));

export const loadTestUser = (): TestUser =>
  JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

export const clearTestUserFile = () => fs.rmSync(STATE_FILE, { force: true });

export const createTestUser = async (): Promise<TestUser> => {
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
  const account = await users.create(ID.unique(), email);
  const doc = await db.createDocument(ids.database, ids.users, ID.unique(), {
    fullName: 'E2E Tester',
    email,
    avatar:
      'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
    accountId: account.$id,
    isAdmin: false,
    disabled: false,
  });
  return { email, accountId: account.$id, userDocId: doc.$id };
};

export const createSessionSecret = async (accountId: string) =>
  (await users.createSession(accountId)).secret;

export const createLoginCode = async (accountId: string) =>
  (await users.createToken(accountId, 6)).secret;

export const findFileByName = async (userDocId: string, name: string) => {
  const res = await db.listDocuments(ids.database, ids.files, [
    Query.equal('owner', [userDocId]),
    Query.equal('name', [name]),
    Query.limit(1),
  ]);
  return res.documents[0] ?? null;
};

const listAllOwned = async (userDocId: string) => {
  const out = [];
  let cursor: string | undefined;
  for (;;) {
    const res = await db.listDocuments(ids.database, ids.files, [
      Query.equal('owner', [userDocId]),
      Query.limit(100),
      ...(cursor ? [Query.cursorAfter(cursor)] : []),
    ]);
    out.push(...res.documents);
    if (res.documents.length < 100) return out;
    cursor = res.documents[res.documents.length - 1].$id;
  }
};

export const deleteTestUser = async (user: TestUser) => {
  const files = await listAllOwned(user.userDocId);
  for (const f of files) {
    for (const bucketFileId of [f.bucketFileId, f.thumbnailBucketFileId]) {
      if (bucketFileId) {
        await storage.deleteFile(ids.bucket, bucketFileId).catch(() => null);
      }
    }
    for (const col of [ids.shares, ids.activity]) {
      const rows = await db.listDocuments(ids.database, col, [
        Query.equal('fileId', [f.$id]),
        Query.limit(100),
      ]);
      for (const r of rows.documents) {
        await db.deleteDocument(ids.database, col, r.$id).catch(() => null);
      }
    }
    await db.deleteDocument(ids.database, ids.files, f.$id).catch(() => null);
  }
  await db
    .deleteDocument(ids.database, ids.users, user.userDocId)
    .catch(() => null);
  await users.delete(user.accountId).catch(() => null);
  return files.length;
};

export const pngBuffer = (color: string, size = 64) =>
  sharp({
    create: { width: size, height: size, channels: 3, background: color },
  })
    .png()
    .toBuffer();
