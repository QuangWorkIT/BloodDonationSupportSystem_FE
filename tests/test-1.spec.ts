import { expect } from '@playwright/test';
import { test } from '../zeroTest'

test('test', async ({ page, ai }) => {
  await page.goto('http://localhost:5173/events');
  await page.locator('div').filter({ hasText: /^Từ ngày$/ }).getByRole('textbox').fill('2025-07-01');
  await page.locator('div').filter({ hasText: /^Từ ngày$/ }).getByRole('textbox').press('Tab');
  await page.locator('div').filter({ hasText: /^đến ngày$/ }).getByRole('textbox').fill('2025-07-05');
  await page.getByRole('button', { name: 'Tìm kiếm' }).click();

  await expect(page.locator('.flex.flex-col.md\\:flex-row.p-6').first()).toBeVisible();
  await expect(page.locator('div:nth-child(2) > .flex.flex-col.md\\:flex-row')).toBeVisible();
  await expect(page.locator('div:nth-child(3) > .flex.flex-col.md\\:flex-row')).toBeVisible();
});