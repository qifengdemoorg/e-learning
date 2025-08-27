import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation Tests', () => {
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
    // Check user avatar
    const userAvatar = page.locator('.user-profile img').first();
    await expect(userAvatar).toBeVisible();
    
    // Check user name and department
    await expect(page.getByText('系统管理员')).toBeVisible();
    await expect(page.getByText('IT部')).toBeVisible();
  });

  test('should display all menu items', async ({ page }) => {
    // Check main menu items
    await expect(page.locator('text=仪表盘')).toBeVisible();
    await expect(page.locator('text=课程目录')).toBeVisible();
    await expect(page.locator('text=我的课程')).toBeVisible();
    await expect(page.locator('text=学习进度')).toBeVisible();
    await expect(page.locator('text=个人资料')).toBeVisible();
    await expect(page.locator('text=资料下载')).toBeVisible();
    await expect(page.locator('text=设置')).toBeVisible();
    await expect(page.locator('text=垃圾桶')).toBeVisible();
    
    // Check admin menu items (should be visible for admin user)
    await expect(page.locator('text=用户管理')).toBeVisible();
    await expect(page.locator('text=课程管理')).toBeVisible();
    await expect(page.locator('text=分类管理')).toBeVisible();
    
    // Check logout button
    await expect(page.locator('text=退出登录')).toBeVisible();
  });

  test('should navigate to course catalog', async ({ page }) => {
    await page.locator('text=课程目录').click();
    await expect(page).toHaveURL('/catalog');
    await expect(page.getByText('课程目录')).toBeVisible();
    await expect(page.getByText('发现适合您的课程')).toBeVisible();
  });

  test('should navigate to my courses', async ({ page }) => {
    await page.locator('text=我的课程').click();
    await expect(page).toHaveURL('/courses');
  });

  test('should navigate to progress', async ({ page }) => {
    await page.locator('text=学习进度').click();
    await expect(page).toHaveURL('/progress');
  });

  test('should navigate to settings', async ({ page }) => {
    await page.locator('text=设置').click();
    await expect(page).toHaveURL('/settings');
  });

  test('should navigate to admin sections for admin user', async ({ page }) => {
    // Test user management
    await page.locator('text=用户管理').click();
    await expect(page).toHaveURL('/admin/users');
    
    // Go back to dashboard
    await page.locator('text=仪表盘').click();
    await expect(page).toHaveURL('/');
    
    // Test course management
    await page.locator('text=课程管理').click();
    await expect(page).toHaveURL('/admin/courses');
    
    // Go back to dashboard
    await page.locator('text=仪表盘').click();
    await expect(page).toHaveURL('/');
    
    // Test category management
    await page.locator('text=分类管理').click();
    await expect(page).toHaveURL('/admin/categories');
  });

  test('should logout successfully', async ({ page }) => {
    await page.locator('text=退出登录').click();
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('欢迎回来')).toBeVisible();
  });

  test('should highlight active menu item', async ({ page }) => {
    // Dashboard should be active initially
    const dashboardItem = page.locator('.menu-item').filter({ hasText: '仪表盘' });
    await expect(dashboardItem).toHaveClass(/active/);
    
    // Navigate to catalog and check if it becomes active
    await page.locator('text=课程目录').click();
    const catalogItem = page.locator('.menu-item').filter({ hasText: '课程目录' });
    await expect(catalogItem).toHaveClass(/active/);
  });

  test('should hide admin menu items for non-admin users', async ({ page }) => {
    // Logout first
    await page.locator('text=退出登录').click();
    
    // Login as student
    await page.getByRole('textbox', { name: '* 用户名' }).fill('student');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    await page.getByRole('button', { name: '登 录' }).click();
    
    // Handle success dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await expect(page).toHaveURL('/');
    
    // Admin menu items should not be visible
    await expect(page.locator('text=用户管理')).not.toBeVisible();
    await expect(page.locator('text=课程管理')).not.toBeVisible();
    await expect(page.locator('text=分类管理')).not.toBeVisible();
  });
});
