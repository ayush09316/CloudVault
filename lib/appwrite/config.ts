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

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const missingVars = parsedEnv.error.issues
    .map((issue) => issue.message)
    .join(', ');
  throw new Error(`Invalid Appwrite environment configuration: ${missingVars}`);
}

export const appwriteConfig = {
  endpointUrl: parsedEnv.data.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: parsedEnv.data.NEXT_PUBLIC_APPWRITE_PROJECT,
  databaseId: parsedEnv.data.NEXT_PUBLIC_APPWRITE_DATABASE,
  usersCollectionId: parsedEnv.data.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
  filesCollectionId: parsedEnv.data.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
  sharesCollectionId: parsedEnv.data.NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION,
  activityCollectionId: parsedEnv.data.NEXT_PUBLIC_APPWRITE_ACTIVITY_COLLECTION,
  bucketId: parsedEnv.data.NEXT_PUBLIC_APPWRITE_BUCKET,
  secretKey: parsedEnv.data.NEXT_APPWRITE_KEY,
};
