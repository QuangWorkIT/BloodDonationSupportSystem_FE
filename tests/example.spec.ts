import { expect } from '@playwright/test';
import { test } from '../zeroTest'

// test.beforeEach(async ({ page }) => {
//   await page.goto('http://localhost:5173');
// });
// test.describe('Login page', () => {
//   test('should show phone input with correct placeholder', async ({ page, ai }) => {
//     await page.goto('http://localhost:5173/events');

//     await ai('Click the tab "Đăng ký tình nguyện viên" ')
//     await page.getByPlaceholder('Nhập họ và tên').waitFor();
//     const formValue = await ai('Fill out the form with meaning value for each fields')
//     await ai(['Fill out the field "Số điện thoại" with value "012345678" ', 'Fill out the filed "Email" with value "test@gmail.com" '])
//     console.log(formValue)
//   });
// });


test.describe('Login page', () => {
  test('should show phone input with correct placeholder', async ({ page, ai }) => {
    // comment login by google because SDK error
    await page.goto('http://localhost:5173/login');

    const phone = '0965035221'
    const password = 'string12345'
    await ai(`Fill out the form with ${phone} for phone number and  ${password} for password`)
    await ai('Click the "Đăng nhập" button ')
    
    await expect(page.getByText('Đăng nhập thành công!')).toBeVisible()
  });
});