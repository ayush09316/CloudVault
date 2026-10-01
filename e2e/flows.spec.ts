import { createLoginCode, findFileByName } from './appwrite';
import {
  expect,
  fileItem,
  openAction,
  test,
  uniqueName,
  uploadPng,
} from './fixtures';

test('signs in with an email code', async ({ page, user }) => {
  await page.goto('/sign-in');
  await page.getByPlaceholder('Enter your email').fill(user.email);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Enter Your OTP')).toBeVisible();

  const code = await createLoginCode(user.accountId);
  await page.locator('input[data-input-otp]').click();
  await page.keyboard.type(code, { delay: 50 });
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 });
  await expect(page.getByText('Recent files')).toBeVisible();
});

test('uploads into a nested folder and generates a thumbnail', async ({
  authedPage: page,
  user,
}) => {
  const folder = uniqueName('folder');
  const file = `${uniqueName('pic')}.png`;

  await page.goto('/files');
  await page.getByRole('button', { name: 'New folder' }).click();
  await page.getByPlaceholder('Folder name').fill(folder);
  await page.getByRole('button', { name: 'Create' }).click();
  await fileItem(page, folder).click();

  await expect(page).toHaveURL(/\/files\?folder=/);
  await expect(page.getByTestId('breadcrumbs')).toContainText(folder);

  await uploadPng(page, file);

  const folderDoc = await findFileByName(user.userDocId, folder);
  const fileDoc = await findFileByName(user.userDocId, file);
  expect(folderDoc?.isFolder).toBe(true);
  expect(fileDoc?.parentId).toBe(folderDoc?.$id);

  await expect
    .poll(
      async () =>
        (await findFileByName(user.userDocId, file))?.thumbnailBucketFileId,
      { timeout: 30_000 }
    )
    .toBeTruthy();

  await page.goto('/files');
  await expect(fileItem(page, folder)).toBeVisible();
  await expect(fileItem(page, file)).toHaveCount(0);
});

test('soft-deletes to trash and restores', async ({ authedPage: page }) => {
  const file = `${uniqueName('trash')}.png`;

  await page.goto('/files');
  await uploadPng(page, file, '#00ff00');

  await openAction(page, file, 'Move to trash');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Move to trash' })
    .click();
  await expect(fileItem(page, file)).toHaveCount(0);

  await page.goto('/images');
  await expect(fileItem(page, file)).toHaveCount(0);

  await page.goto('/trash');
  await expect(fileItem(page, file)).toBeVisible();
  await fileItem(page, file).getByRole('button', { name: 'Restore' }).click();
  await expect(fileItem(page, file)).toHaveCount(0);

  await page.goto('/files');
  await expect(fileItem(page, file)).toBeVisible();
});

test('share link opens without login, revoke kills it', async ({
  authedPage: page,
  browser,
}) => {
  const file = `${uniqueName('shared')}.png`;

  await page.goto('/files');
  await uploadPng(page, file, '#0000ff');

  await openAction(page, file, 'Share');
  await page.getByTestId('create-share-link').click();
  const linkInput = page.getByTestId('share-link-url').first();
  await expect(linkInput).toBeVisible();
  const link = await linkInput.inputValue();
  expect(link).toMatch(/\/share\/[\w-]+$/);

  const anon = await browser.newContext();
  const anonPage = await anon.newPage();
  const contentResponse = anonPage.waitForResponse(
    (r) => r.url().includes('/api/files/') && r.status() === 200
  );
  await anonPage.goto(link);
  await expect(anonPage.getByTestId('shared-file-name')).toHaveText(file);
  expect(await contentResponse).toBeTruthy();
  await expect(anonPage.getByTestId('preview').locator('img')).toBeVisible();

  await page.getByRole('button', { name: 'Revoke' }).click();
  await expect(page.getByTestId('share-link-url')).toHaveCount(0);

  await anonPage.goto(link);
  await expect(anonPage.getByTestId('share-unavailable')).toContainText(
    'revoked'
  );
  await anon.close();
});

test('bulk-selects and moves files to trash', async ({ authedPage: page }) => {
  const a = `${uniqueName('bulk-a')}.png`;
  const b = `${uniqueName('bulk-b')}.png`;

  await page.goto('/files');
  await uploadPng(page, a, '#123456');
  await uploadPng(page, b, '#654321');

  await fileItem(page, a).getByTestId('select-file').check();
  await fileItem(page, b).getByTestId('select-file').check();
  await expect(page.getByTestId('selection-toolbar')).toContainText(
    '2 selected'
  );
  await page.getByRole('button', { name: 'Move to trash' }).click();

  await expect(fileItem(page, a)).toHaveCount(0);
  await expect(fileItem(page, b)).toHaveCount(0);

  await page.goto('/trash');
  await expect(fileItem(page, a)).toBeVisible();
  await expect(fileItem(page, b)).toBeVisible();
});
