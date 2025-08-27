import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByRole('textbox', { name: '* 用户名' }).fill('admin');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    await page.getByRole('button', { name: '登 录' }).click();
    
    // Handle success dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await expect(page).toHaveURL('/');
  });

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Check if sidebar is visible
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.getByText('系统管理员')).toBeVisible();
    await expect(page.getByText('IT部')).toBeVisible();
    
    // Check if main content is visible
    await expect(page.getByText('欢迎回来，系统管理员！')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Sidebar should still be visible on tablet
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.getByText('系统管理员')).toBeVisible();
  });

  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // On mobile, sidebar might be hidden or collapsed
    // The exact behavior depends on the implementation
    await expect(page.getByText('欢迎回来，系统管理员！')).toBeVisible();
  });

  test('should handle course catalog on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to catalog
    await page.locator('text=课程目录').click();
    await expect(page).toHaveURL('/catalog');
    
    // Course cards should be stacked on mobile
    await expect(page.getByText('课程目录')).toBeVisible();
    await expect(page.getByText('Flutter 移动开发')).toBeVisible();
  });
});
