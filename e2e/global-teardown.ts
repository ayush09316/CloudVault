import { clearTestUserFile, deleteTestUser, loadTestUser } from './appwrite';

export default async function globalTeardown() {
  const user = loadTestUser();
  const removed = await deleteTestUser(user);
  clearTestUserFile();
  console.log(
    `[e2e] deleted throwaway user ${user.email} and ${removed} file documents`
  );
}
