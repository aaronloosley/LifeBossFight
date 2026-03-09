import { expect, test } from '@playwright/test';

test('demo happy path for burst pipe', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: /try demo/i }).click();
  await expect(page.getByText(/Available Boss Fights/i)).toBeVisible();
  await page.getByRole('link', { name: /start mission/i }).first().click();
  await expect(page.getByRole('heading', { name: /Burst Pipe/i })).toBeVisible();
  await page.goto('/launch/burst-pipe');
  await page.waitForURL(/\/runs\/run-/);
  await expect(page.getByRole('button', { name: /mark objective complete/i })).toBeVisible();
  await page.getByRole('button', { name: /mark objective complete/i }).click();
  await page.getByRole('link', { name: /Evidence/i }).click();
  await expect(page.getByText(/No evidence yet/i)).toBeVisible();
  await page.getByPlaceholder('Title').fill('Leak behind sink');
  await page.getByRole('button', { name: /Secure evidence/i }).click();
  await expect(page.getByText(/items secured/i)).toBeVisible();
  await page.getByRole('link', { name: /Back to mission/i }).click();
  await expect(page.getByText(/10% complete/i)).toBeVisible();
  await page.getByRole('link', { name: /Timeline/i }).click();
  await expect(page.getByText(/Incident timeline/i)).toBeVisible();
  await expect(page.getByText(/Evidence secured/i)).toBeVisible();
  await page.getByRole('link', { name: /Back to mission/i }).click();
  await page.getByRole('link', { name: /Report/i }).click();
  await expect(page.getByText(/Report pack ready/i)).toBeVisible();
});

test('resume state preserves an incomplete mission in demo mode', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: /try demo/i }).click();
  await page.getByRole('link', { name: /start mission/i }).first().click();
  await page.goto('/launch/burst-pipe');
  await page.waitForURL(/\/runs\/run-/);
  await page.goto('/home');
  await expect(page.getByText(/1 active/i)).toBeVisible();
});
