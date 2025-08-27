import { test, expect } from '@playwright/test';

test.describe('Complete User Journey E2E Tests', () => {
  test('should complete a full user journey from login to course exploration', async ({ page }) => {
    // Step 1: Navigate to the application
    await page.goto('/');
    
    // Step 2: Should redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: '欢迎回来' })).toBeVisible();
    
    // Step 3: Login with admin credentials
    await page.getByRole('textbox', { name: '* 用户名' }).fill('admin');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    
    // Step 4: Submit login form
    await page.getByRole('button', { name: '登 录' }).click();
    
    // Step 5: Handle success dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('登录成功！');
      await dialog.accept();
    });
    
    // Step 6: Verify dashboard loading
    await expect(page).toHaveURL('/');
    await expect(page.getByText('欢迎回来，系统管理员！')).toBeVisible();
    
    // Step 7: Verify sidebar is updated with new design
    await expect(page.locator('.user-profile')).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '仪表盘' })).toHaveClass(/active/);
    
    // Step 8: Navigate to course catalog
    await page.locator('.menu-item').filter({ hasText: '课程目录' }).click();
    await expect(page).toHaveURL('/catalog');
    await expect(page.getByRole('heading', { name: '课程目录' })).toBeVisible();
    
    // Step 9: Verify catalog content
    await expect(page.getByText('Flutter 移动开发')).toBeVisible();
    await expect(page.getByText('Vue.js 3 完整教程')).toBeVisible();
    await expect(page.getByText('React 高级开发实战')).toBeVisible();
    
    // Step 10: Test search functionality
    const searchBox = page.getByRole('textbox', { name: '搜索课程...' });
    await searchBox.fill('Vue');
    await expect(searchBox).toHaveValue('Vue');
    
    // Step 11: Navigate back to dashboard
    await page.locator('.menu-item').filter({ hasText: '仪表盘' }).click();
    await expect(page).toHaveURL('/');
    
    // Step 12: Verify dashboard content
    await expect(page.locator('.ant-card-head-title').filter({ hasText: '继续学习' })).toBeVisible();
    await expect(page.locator('.ant-card-head-title').filter({ hasText: '推荐课程' })).toBeVisible();
    await expect(page.locator('.ant-card-head-title').filter({ hasText: '本月学习进度' })).toBeVisible();
    
    // Step 13: Test admin navigation
    await page.locator('.menu-item').filter({ hasText: '用户管理' }).click();
    await expect(page).toHaveURL('/admin/users');
    
    // Step 14: Navigate to course management
    await page.locator('.menu-item').filter({ hasText: '课程管理' }).click();
    await expect(page).toHaveURL('/admin/courses');
    
    // Step 15: Test logout functionality
    await page.locator('.logout-button').click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: '欢迎回来' })).toBeVisible();
  });

  test('should work correctly for different user roles', async ({ page }) => {
    // Test student login
    await page.goto('/login');
    await page.getByRole('textbox', { name: '* 用户名' }).fill('student');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    await page.getByRole('button', { name: '登 录' }).click();
    
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await expect(page).toHaveURL('/');
    
    // Verify admin menu items are not visible for student
    await expect(page.locator('.menu-item').filter({ hasText: '用户管理' })).not.toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '课程管理' })).not.toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '分类管理' })).not.toBeVisible();
    
    // Verify student can access regular features
    await expect(page.locator('.menu-item').filter({ hasText: '课程目录' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '我的课程' })).toBeVisible();
    await expect(page.locator('.menu-item').filter({ hasText: '学习进度' })).toBeVisible();
    
    // Test navigation
    await page.locator('.menu-item').filter({ hasText: '课程目录' }).click();
    await expect(page).toHaveURL('/catalog');
    
    // Logout
    await page.locator('.logout-button').click();
    await expect(page).toHaveURL('/login');
  });

  test('should handle responsive behavior', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByRole('textbox', { name: '* 用户名' }).fill('admin');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    await page.getByRole('button', { name: '登 录' }).click();
    
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await expect(page).toHaveURL('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('.user-profile')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.sidebar')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    // Main content should still be accessible
    await expect(page.getByText('欢迎回来，系统管理员！')).toBeVisible();
    
    // Test navigation on mobile
    await page.locator('.menu-item').filter({ hasText: '课程目录' }).click();
    await expect(page).toHaveURL('/catalog');
    await expect(page.getByText('Flutter 移动开发')).toBeVisible();
  });
});
