import { test as base, expect, Page } from '@playwright/test';
import {
  createSessionSecret,
  loadTestUser,
  pngBuffer,
  TestUser,
} from './appwrite';

export const test = base.extend<{ user: TestUser; authedPage: Page }>({
  // eslint-disable-next-line no-empty-pattern
  user: async ({}, provide) => {
    await provide(loadTestUser());
  },
  authedPage: async ({ context, page, user, baseURL }, provide) => {
    const secret = await createSessionSecret(user.accountId);
    await context.addCookies([
      {
        name: 'appwrite-session',
        value: secret,
        url: baseURL!,
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      },
    ]);
    await provide(page);
  },
});

export { expect };

export const uniqueName = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const uploadPng = async (
  page: Page,
  name: string,
  color = '#ff0000'
) => {
  await page
    .locator('[data-testid=app-header] input[type=file]')
    .setInputFiles({
      name,
      mimeType: 'image/png',
      buffer: await pngBuffer(color),
    });
  await expect(fileItem(page, name)).toBeVisible({ timeout: 45_000 });
};

export const fileItem = (page: Page, name: string) =>
  page.locator(`[data-testid="file-item"][data-name="${name}"]`);

export const openAction = async (page: Page, name: string, label: string) => {
  await fileItem(page, name).getByTestId('file-actions').click();
  await page.getByRole('menuitem', { name: label }).click();
};
