import { expect, test } from '@playwright/test';

test('demo happy path for burst pipe', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /try demo/i }).click();
  await expect(page.getByText(/Available Boss Fights/i)).toBeVisible();
  await page.getByRole('button', { name: /start mission/i }).first().click();
  await expect(page.getByRole('heading', { name: /Burst Pipe/i })).toBeVisible();
  await page.getByRole('button', { name: /start mission/i }).click();
  await page.getByRole('link', { name: /Evidence/i }).click();
  await page.getByPlaceholder('Title').fill('Leak behind sink');
  await page.getByRole('button', { name: /Secure evidence/i }).click();
  await expect(page.getByText(/Saved evidence/i)).toBeVisible();
  await page.goto(page.url().replace('/evidence', '/timeline'));
  await expect(page.getByText(/Incident timeline/i)).toBeVisible();
});
