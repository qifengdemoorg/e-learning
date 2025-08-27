import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect to login page when not authenticated', async ({ page }) => {
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('欢迎回来');
  });

  test('should display login form correctly', async ({ page }) => {
    // Check login form elements
    await expect(page.getByRole('textbox', { name: '* 用户名' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* 密码' })).toBeVisible();
    await expect(page.getByRole('button', { name: '登 录' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: '记住我' })).toBeVisible();
    
    // Check test users section
    await expect(page.getByText('测试用户')).toBeVisible();
    await expect(page.getByText('管理员')).toBeVisible();
    await expect(page.getByText('教师')).toBeVisible();
    await expect(page.getByText('学员')).toBeVisible();
  });

  test('should login successfully with admin credentials', async ({ page }) => {
    // Fill login form
    await page.getByRole('textbox', { name: '* 用户名' }).fill('admin');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    
    // Click login button
    await page.getByRole('button', { name: '登 录' }).click();
    
    // Handle success dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('登录成功！');
      await dialog.accept();
    });
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.getByText('欢迎回来，系统管理员！')).toBeVisible();
  });

  test('should login successfully with teacher credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: '* 用户名' }).fill('teacher');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    await page.getByRole('button', { name: '登 录' }).click();
    
    // Handle success dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await expect(page).toHaveURL('/');
  });

  test('should login successfully with student credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: '* 用户名' }).fill('student');
    await page.getByRole('textbox', { name: '* 密码' }).fill('password123');
    await page.getByRole('button', { name: '登 录' }).click();
    
    // Handle success dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await expect(page).toHaveURL('/');
  });

  test('should show register link', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: '立即注册' });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('should show forgot password link', async ({ page }) => {
    await expect(page.getByText('忘记密码？')).toBeVisible();
  });
});
