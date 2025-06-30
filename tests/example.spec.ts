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

  test('should show login fail', async ({ page, ai }) => {
    await page.goto('http://localhost:5173/login');

    const phone = '0965035221'
    const password = 'string12345678'
    await ai(`Fill out the form with ${phone} for phone number and  ${password} for password`)
    await ai('Click the "Đăng nhập" button ')

    await expect(page.getByText('Đăng nhập thất bại!')).toBeVisible()
  });

  test('should show list of 3 events found', async ({ page, ai }) => {
    await page.goto('http://localhost:5173/events');

    const dateFromDate = '2025-07-01'
    const dateToDate = '2025-07-10'

    await page.getByText('Thắp sáng niềm tin').waitFor()

    await ai(`'Fill out the input "Từ ngày" with the value ${dateFromDate} and the input "đến ngày" with value ${dateToDate}`)

    await ai('Click the "Tìm kiếm" button ')

    await page.getByText('Trao giọt máu - Nhận yêu thương').waitFor()

    const result = await page.locator('[data-testid="event-item"]').count()
    console.log("Result test " + result)
    await page.getByRole('button', { name: '2' }).click();

    await page.getByText('Thiếu máu O+ tại miền Tây').waitFor()

    const nextResult = await page.locator('[data-testid="event-item"]').count()
    console.log("Next page result " + nextResult)
    expect(result + nextResult).toBe(5)
  });
});