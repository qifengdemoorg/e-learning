import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation Tests - Fixed', () => {
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

  test('should display user profile in sidebar', async ({ page }) => {
    // Check user avatar in sidebar
    const sidebarUserAvatar = page.locator('.user-profile img, .user-profile-collapsed img').first();
    await expect(sidebarUserAvatar).toBeVisible();
    
    // Check user name and department in sidebar specifically
    const sidebarUserName = page.locator('.user-info h3').first();
    await expect(sidebarUserName).toBeVisible();
    
    const sidebarUserDept = page.locator('.user-info p').first();
    await expect(sidebarUserDept).toBeVisible();
  });

  test('should display all menu items', async ({ page }) => {
    // Check main menu items using more specific selectors
    await expect(page.locator('.menu-item').filter({ hasText: '仪表盘' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '课程目录' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '我的课程' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '学习进度' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '个人资料' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '资料下载' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '设置' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '垃圾桶' })).toBeVisible();
    
    // Check admin menu items (should be visible for admin user)
    await expect(page.locator('.menu-item').filter({ hasText: '用户管理' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '课程管理' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '分类管理' })).toBeVisible();
    
    // Check logout button
    await expect(page.locator('.logout-button')).toBeVisible();
  });

  test('should navigate to course catalog', async ({ page }) => {
    await page.locator('.menu-item').filter({ hasText: '课程目录' }).click();
    await expect(page).toHaveURL('/catalog');
    await expect(page.getByRole('heading', { name: '课程目录' })).toBeVisible();
    await expect(page.getByText('发现适合您的课程')).toBeVisible();
  });

  test('should navigate to my courses', async ({ page }) => {
    await page.locator('.menu-item').filter({ hasText: '我的课程' }).click();
    await expect(page).toHaveURL('/courses');
  });

  test('should navigate to progress', async ({ page }) => {
    await page.locator('.menu-item').filter({ hasText: '学习进度' }).click();
    await expect(page).toHaveURL('/progress');
  });

  test('should navigate to settings', async ({ page }) => {
    await page.locator('.menu-item').filter({ hasText: '设置' }).click();
    await expect(page).toHaveURL('/settings');
  });

  test('should logout successfully', async ({ page }) => {
    await page.locator('.logout-button').click();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('欢迎回来')).toBeVisible();
  });

  test('should highlight active menu item', async ({ page }) => {
    // Dashboard should be active initially
    const dashboardItem = page.locator('.menu-item').filter({ hasText: '仪表盘' });
    await expect(dashboardItem).toHaveClass(/active/);
    
    // Navigate to catalog and check if it becomes active
    await page.locator('.menu-item').filter({ hasText: '课程目录' }).click();
    const catalogItem = page.locator('.menu-item').filter({ hasText: '课程目录' });
    await expect(catalogItem).toHaveClass(/active/);
  });
});
