import { test, expect } from '@playwright/test';

test.describe('Dashboard Tests', () => {
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

  test('should display dashboard header correctly', async ({ page }) => {
    await expect(page.getByText('欢迎回来，系统管理员！')).toBeVisible();
    await expect(page.getByText('继续您的学习之旅')).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    // Check statistics cards
    await expect(page.getByText('已完成课程')).toBeVisible();
    await expect(page.getByText('进行中课程')).toBeVisible();
    await expect(page.getByText('学习时长')).toBeVisible();
    await expect(page.getByText('获得证书')).toBeVisible();
    
    // Check the numbers
    await expect(page.getByText('12')).toBeVisible(); // Completed courses
    await expect(page.getByText('3')).toBeVisible();  // In progress courses
    await expect(page.getByText('45h')).toBeVisible(); // Study hours
    await expect(page.getByText('8')).toBeVisible();   // Certificates
  });

  test('should display continue learning section', async ({ page }) => {
    await expect(page.getByText('继续学习')).toBeVisible();
    
    // Check course cards
    await expect(page.getByText('Vue.js 3 完整教程')).toBeVisible();
    await expect(page.getByText('TypeScript 从入门到精通')).toBeVisible();
    await expect(page.getByText('React 高级开发实战')).toBeVisible();
    
    // Check progress indicators
    await expect(page.getByText('65% 完成')).toBeVisible();
    await expect(page.getByText('45% 完成')).toBeVisible();
    await expect(page.getByText('30% 完成')).toBeVisible();
    
    // Check continue learning buttons
    const continueButtons = page.getByRole('button', { name: '继续学习' });
    await expect(continueButtons).toHaveCount(3);
  });

  test('should display monthly progress section', async ({ page }) => {
    await expect(page.getByText('本月学习进度')).toBeVisible();
    await expect(page.getByText('本月目标')).toBeVisible();
    await expect(page.getByText('20 小时')).toBeVisible();
    await expect(page.getByText('已完成')).toBeVisible();
    await expect(page.getByText('15 小时')).toBeVisible();
    await expect(page.getByText('剩余')).toBeVisible();
    await expect(page.getByText('5 小时')).toBeVisible();
  });

  test('should display recommended courses section', async ({ page }) => {
    await expect(page.getByText('推荐课程')).toBeVisible();
    
    // Check recommended course cards
    await expect(page.getByText('Node.js 后端开发')).toBeVisible();
    await expect(page.getByText('Python 数据分析')).toBeVisible();
    await expect(page.getByText('UI/UX 设计基础')).toBeVisible();
    
    // Check ratings
    await expect(page.getByText('4.8')).toBeVisible();
    await expect(page.getByText('4.6')).toBeVisible();
    await expect(page.getByText('4.7')).toBeVisible();
    
    // Check student counts
    await expect(page.getByText('1250 学员')).toBeVisible();
    await expect(page.getByText('890 学员')).toBeVisible();
    await expect(page.getByText('650 学员')).toBeVisible();
    
    // Check start learning buttons
    const startButtons = page.getByRole('button', { name: '开始学习' });
    await expect(startButtons).toHaveCount(3);
  });

  test('should have search functionality in header', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: '搜索课程、讲师或知识点...' });
    await expect(searchBox).toBeVisible();
    
    const searchButton = page.locator('button').filter({ hasText: 'search' }).first();
    await expect(searchButton).toBeVisible();
  });

  test('should display notifications', async ({ page }) => {
    // Check notification bell
    const notificationBell = page.locator('[data-icon="bell"]').first();
    await expect(notificationBell).toBeVisible();
    
    // Check notification count
    await expect(page.getByText('3')).toBeVisible();
  });

  test('should display user dropdown', async ({ page }) => {
    await expect(page.getByText('系统管理员')).toBeVisible();
    
    // Check user dropdown
    const userDropdown = page.locator('.ant-dropdown-trigger').first();
    await expect(userDropdown).toBeVisible();
  });
});
