import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Số điện thoại' }).fill('0965035221');
  await page.getByTestId('phone-input').fill('string12345');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.getByText('Đăng nhập thành công!')).toBeVisible();
});