import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z
    .string({ required_error: 'NEXT_PUBLIC_APPWRITE_ENDPOINT is missing' })
    .min(1, 'NEXT_PUBLIC_APPWRITE_ENDPOINT is missing'),
  NEXT_PUBLIC_APPWRITE_PROJECT: z
    .string({ required_error: 'NEXT_PUBLIC_APPWRITE_PROJECT is missing' })
    .min(1, 'NEXT_PUBLIC_APPWRITE_PROJECT is missing'),
  NEXT_PUBLIC_APPWRITE_DATABASE: z
    .string({ required_error: 'NEXT_PUBLIC_APPWRITE_DATABASE is missing' })
    .min(1, 'NEXT_PUBLIC_APPWRITE_DATABASE is missing'),
  NEXT_PUBLIC_APPWRITE_USERS_COLLECTION: z
    .string({
      required_error: 'NEXT_PUBLIC_APPWRITE_USERS_COLLECTION is missing',
    })
    .min(1, 'NEXT_PUBLIC_APPWRITE_USERS_COLLECTION is missing'),
  NEXT_PUBLIC_APPWRITE_FILES_COLLECTION: z
    .string({
      required_error: 'NEXT_PUBLIC_APPWRITE_FILES_COLLECTION is missing',
    })
    .min(1, 'NEXT_PUBLIC_APPWRITE_FILES_COLLECTION is missing'),
  NEXT_PUBLIC_APPWRITE_BUCKET: z
    .string({ required_error: 'NEXT_PUBLIC_APPWRITE_BUCKET is missing' })
    .min(1, 'NEXT_PUBLIC_APPWRITE_BUCKET is missing'),
  NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION: z.string().min(1).default('shares'),
  NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION: z
    .string()
    .min(1)
    .default('activity'),
  NEXT_APPWRITE_KEY: z
    .string({ required_error: 'NEXT_APPWRITE_KEY is missing' })
    .min(1, 'NEXT_APPWRITE_KEY is missing'),
});

type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

const env = (): Env => {
  if (cached) return cached;
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    NEXT_PUBLIC_APPWRITE_DATABASE: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
    NEXT_PUBLIC_APPWRITE_USERS_COLLECTION:
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
    NEXT_PUBLIC_APPWRITE_FILES_COLLECTION:
      process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
    NEXT_PUBLIC_APPWRITE_BUCKET: process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
    NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION:
      process.env.NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION || undefined,
    NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION:
      process.env.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION || undefined,
    NEXT_APPWRITE_KEY: process.env.NEXT_APPWRITE_KEY,
  });
  if (!parsed.success) {
    const missingVars = parsed.error.issues
      .map((issue) => issue.message)
      .join(', ');
    throw new Error(
      `Invalid Appwrite environment configuration: ${missingVars}`
    );
  }
  cached = parsed.data;
  return cached;
};

// Validated on first use rather than at import, so `next build` can load
// route modules in an environment without Appwrite credentials (CI).
export const appwriteConfig = {
  get endpointUrl() {
    return env().NEXT_PUBLIC_APPWRITE_ENDPOINT;
  },
  get projectId() {
    return env().NEXT_PUBLIC_APPWRITE_PROJECT;
  },
  get databaseId() {
    return env().NEXT_PUBLIC_APPWRITE_DATABASE;
  },
  get usersCollectionId() {
    return env().NEXT_PUBLIC_APPWRITE_USERS_COLLECTION;
  },
  get filesCollectionId() {
    return env().NEXT_PUBLIC_APPWRITE_FILES_COLLECTION;
  },
  get sharesCollectionId() {
    return env().NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION;
  },
  get activityCollectionId() {
    return env().NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION;
  },
  get bucketId() {
    return env().NEXT_PUBLIC_APPWRITE_BUCKET;
  },
  get secretKey() {
    return env().NEXT_APPWRITE_KEY;
  },
};
