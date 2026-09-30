import { config } from "dotenv";
import { Client, Databases, IndexType } from "node-appwrite";

config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
  .setKey(process.env.NEXT_APPWRITE_KEY);

const db = new Databases(client);
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const filesId = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION;
const usersId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION;

const DEFAULT_QUOTA_BYTES = 2 * 1024 * 1024 * 1024;

async function ignoreExists(fn, label) {
  try {
    await fn();
    console.log("created:", label);
  } catch (e) {
    if (e.code === 409) console.log("already exists, skipped:", label);
    else throw e;
  }
}

async function waitAttr(collectionId, key) {
  for (let i = 0; i < 30; i++) {
    const attrs = await db.listAttributes(dbId, collectionId);
    const a = attrs.attributes.find((a) => a.key === key);
    if (a && a.status === "available") return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`attribute ${key} on ${collectionId} never became available`);
}

async function main() {
  await ignoreExists(
    () => db.createBooleanAttribute(dbId, filesId, "isFolder", false, false),
    "files.isFolder"
  );
  await waitAttr(filesId, "isFolder");

  await ignoreExists(
    () => db.createStringAttribute(dbId, filesId, "parentId", 64, false),
    "files.parentId"
  );
  await waitAttr(filesId, "parentId");

  await ignoreExists(
    () => db.createDatetimeAttribute(dbId, filesId, "deletedAt", false),
    "files.deletedAt"
  );
  await waitAttr(filesId, "deletedAt");

  await ignoreExists(
    () => db.createIndex(dbId, filesId, "parentId_idx", IndexType.Key, ["parentId"]),
    "files.parentId_idx"
  );
  await ignoreExists(
    () => db.createIndex(dbId, filesId, "deletedAt_idx", IndexType.Key, ["deletedAt"]),
    "files.deletedAt_idx"
  );
  await ignoreExists(
    () => db.createIndex(dbId, filesId, "name_fulltext_idx", IndexType.Fulltext, ["name"]),
    "files.name_fulltext_idx"
  );

  await ignoreExists(
    () => db.createIntegerAttribute(dbId, usersId, "quotaBytes", false, 0, undefined, DEFAULT_QUOTA_BYTES),
    "users.quotaBytes"
  );
  await waitAttr(usersId, "quotaBytes");

  await ignoreExists(
    () =>
      db.createCollection(dbId, "shares", "shares", [
        'create("any")',
        'read("any")',
        'update("any")',
        'delete("any")',
      ], false),
    "collection shares"
  );
  await ignoreExists(
    () => db.createStringAttribute(dbId, "shares", "fileId", 64, true),
    "shares.fileId"
  );
  await waitAttr("shares", "fileId");
  await ignoreExists(
    () => db.createStringAttribute(dbId, "shares", "granteeEmail", 320, false),
    "shares.granteeEmail"
  );
  await waitAttr("shares", "granteeEmail");
  await ignoreExists(
    () => db.createEnumAttribute(dbId, "shares", "role", ["view", "edit"], true),
    "shares.role"
  );
  await waitAttr("shares", "role");
  await ignoreExists(
    () => db.createStringAttribute(dbId, "shares", "token", 64, false),
    "shares.token"
  );
  await waitAttr("shares", "token");
  await ignoreExists(
    () => db.createDatetimeAttribute(dbId, "shares", "expiresAt", false),
    "shares.expiresAt"
  );
  await waitAttr("shares", "expiresAt");
  await ignoreExists(
    () => db.createIndex(dbId, "shares", "fileId_idx", IndexType.Key, ["fileId"]),
    "shares.fileId_idx"
  );
  await ignoreExists(
    () => db.createIndex(dbId, "shares", "token_idx", IndexType.Unique, ["token"]),
    "shares.token_idx"
  );

  await ignoreExists(
    () =>
      db.createCollection(dbId, "activity", "activity", [
        'create("any")',
        'read("any")',
        'update("any")',
        'delete("any")',
      ], false),
    "collection activity"
  );
  await ignoreExists(
    () => db.createStringAttribute(dbId, "activity", "fileId", 64, true),
    "activity.fileId"
  );
  await waitAttr("activity", "fileId");
  await ignoreExists(
    () => db.createStringAttribute(dbId, "activity", "actorId", 64, true),
    "activity.actorId"
  );
  await waitAttr("activity", "actorId");
  await ignoreExists(
    () => db.createStringAttribute(dbId, "activity", "action", 64, true),
    "activity.action"
  );
  await waitAttr("activity", "action");
  await ignoreExists(
    () => db.createDatetimeAttribute(dbId, "activity", "at", true),
    "activity.at"
  );
  await waitAttr("activity", "at");
  await ignoreExists(
    () => db.createStringAttribute(dbId, "activity", "meta", 4000, false),
    "activity.meta"
  );
  await waitAttr("activity", "meta");
  await ignoreExists(
    () => db.createIndex(dbId, "activity", "fileId_idx", IndexType.Key, ["fileId"]),
    "activity.fileId_idx"
  );

  console.log("schema setup complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
