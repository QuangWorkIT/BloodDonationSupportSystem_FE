import { expect } from '@playwright/test';
import { test } from '../zeroTest'

// test.beforeEach(async ({ page }) => {
//   await page.goto('http://localhost:5173');
// });

test.describe('Tests', () => {

  // API testing
  test('api test - get events', async ({ page, ai, request }) => {
    const response = await request.get('/api/events')
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.data.items[0]).toHaveProperty('id')
    expect(body.data.items[0]).toHaveProperty('title')
  })

  test('api test zerostep - get events', async ({ page, ai, request }) => {
    const response = await request.get('/api/events');
    const json = await response.json();

    const firstItem = await ai(`Get the first "item" object from the "items" array in the "data" object of this response: ${JSON.stringify(json)}`);
    const result = await ai(
      `Does the following object have both "id" and "title" properties? ${JSON.stringify(firstItem)}`
    );

    expect(result).toBeTruthy();
  });


  // UI testing
  test('should show login successful', async ({ page, ai }) => {
    await page.goto('http://localhost:5173/login');

    const phone = '0965035221'
    const password = 'string12345'
    await ai(`Fill out the form with ${phone} for phone number and  ${password} for password`)
    await ai('Click the "Đăng nhập" button ')

    await expect(page.getByText('Đăng nhập thành công!')).toBeVisible()
  });

  test('should show list of 3 events found', async ({ page, ai }) => {
    await page.goto('http://localhost:5173/events');

    const dateFromDate = '2025-07-05'
    const dateToDate = '2025-07-10'

    await page.getByText('Trao giọt máu - Nhận yêu thương').waitFor()

    await ai(`'Fill out the input "Từ ngày" with the value ${dateFromDate} and the input "đến ngày" with value ${dateToDate}`)

    await ai('Click the "Tìm kiếm" button ')

    await page.getByText('Hiến máu tại Bạch Mai').waitFor()


    const result = await page.locator('[data-testid="event-item"]').count()
    console.log(result)
    expect(Number(result)).toBe(3)
  });
});

const testCases = [
  { phone: '0965035221', password: 'string12345', expectSuccess: true, reason: '' },
  { phone: '0123456789', password: 'wrongpass', expectSuccess: false, reason: '' },
  { phone: '098', password: 'string12345', expectSuccess: false, reason: 'Số điện thoại không hợp lệ' },
  { phone: '', password: 'string12345', expectSuccess: false, reason: 'Số điện thoại không hợp lệ' },
  { phone: '1234567890', password: '123', expectSuccess: false, reason: 'Mật khẩu phải có ít nhất 8 ký tự' },
  { phone: '1234567890', password: '1', expectSuccess: false, reason: 'Mật khẩu phải có ít nhất 8 ký tự' },
  { phone: '987654321', password: 'password1', expectSuccess: false, reason: 'Số điện thoại không hợp lệ' },
  { phone: '1234567890', password: 'pass123', expectSuccess: false, reason: 'Mật khẩu phải có ít nhất 8 ký tự' },
  { phone: 'abcdefghij', password: '12345678', expectSuccess: false, reason: '' }, 
];

test.describe('Login Tests - Data Driven', () => {
  for (const { phone, password, expectSuccess, reason } of testCases) {
    test(`Login with phone=${phone}, password=${password}`, async ({ page, ai }) => {
      await page.goto('http://localhost:5173/login');

      await ai(`Fill out the form with ${phone} for phone number and ${password} for password`);
      await ai('Click the "Đăng nhập" button');

      if (expectSuccess) {
        await expect(page.getByText('Đăng nhập thành công!')).toBeVisible();
      } else if(reason.length > 0) {
        await expect(page.getByText(reason)).toBeVisible()
      } else {
        await expect(page.getByText('Đăng nhập thất bại!')).toBeVisible();
      }
    });
  }
});