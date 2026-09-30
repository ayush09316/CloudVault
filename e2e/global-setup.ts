import { createTestUser, saveTestUser } from './appwrite';

export default async function globalSetup() {
  const user = await createTestUser();
  saveTestUser(user);
  console.log(`[e2e] created throwaway user ${user.email}`);
}
