import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/events');
  await page.locator('div').filter({ hasText: /^Từ ngày$/ }).getByRole('textbox').fill('2025-07-05');
  await page.locator('div').filter({ hasText: /^đến ngày$/ }).getByRole('textbox').fill('2025-07-10');
  await page.getByRole('button', { name: 'Tìm kiếm' }).click();
  await page.getByRole('heading', { name: 'Hiến máu tại Bạch Mai' }).click();
  await page.getByRole('heading', { name: 'Thiếu máu O+ tại miền Tây' }).click();
  await page.getByRole('heading', { name: 'Tuần lễ hiến máu nhân đạo' }).click();
});