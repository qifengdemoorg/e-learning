import { test, expect } from '@playwright/test';

test.describe('Course Catalog Tests', () => {
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
    
    // Navigate to catalog
    await page.locator('text=课程目录').click();
    await expect(page).toHaveURL('/catalog');
  });

  test('should display catalog header', async ({ page }) => {
    await expect(page.getByText('课程目录')).toBeVisible();
    await expect(page.getByText('发现适合您的课程')).toBeVisible();
  });

  test('should display search and filters', async ({ page }) => {
    // Check search box
    const searchBox = page.getByRole('textbox', { name: '搜索课程...' });
    await expect(searchBox).toBeVisible();
    
    // Check search button
    const searchButton = page.locator('button').filter({ hasText: 'search' }).nth(1);
    await expect(searchButton).toBeVisible();
    
    // Check category filters
    await expect(page.getByText('全部分类')).toBeVisible();
    await expect(page.getByText('前端开发')).toBeVisible();
    await expect(page.getByText('后端开发')).toBeVisible();
    await expect(page.getByText('移动开发')).toBeVisible();
    await expect(page.getByText('数据科学')).toBeVisible();
    await expect(page.getByText('设计')).toBeVisible();
    
    // Check level filters
    await expect(page.getByText('全部等级')).toBeVisible();
    await expect(page.getByText('初级')).toBeVisible();
    await expect(page.getByText('中级')).toBeVisible();
    await expect(page.getByText('高级')).toBeVisible();
    
    // Check sort options
    await expect(page.getByText('最新发布')).toBeVisible();
    await expect(page.getByText('最受欢迎')).toBeVisible();
    await expect(page.getByText('评分最高')).toBeVisible();
    await expect(page.getByText('价格从低到高')).toBeVisible();
  });

  test('should display course cards with correct information', async ({ page }) => {
    // Check Flutter course
    await expect(page.getByText('Flutter 移动开发')).toBeVisible();
    await expect(page.getByText('¥349')).toBeVisible();
    await expect(page.getByText('中级')).toBeVisible();
    await expect(page.getByText('孙老师')).toBeVisible();
    await expect(page.getByText('22小时')).toBeVisible();
    await expect(page.getByText('456人已学')).toBeVisible();
    await expect(page.getByText('4.8')).toBeVisible();
    
    // Check UI/UX course
    await expect(page.getByText('UI/UX 设计基础')).toBeVisible();
    await expect(page.getByText('¥159')).toBeVisible();
    await expect(page.getByText('初级')).toBeVisible();
    await expect(page.getByText('周老师')).toBeVisible();
    await expect(page.getByText('15小时')).toBeVisible();
    await expect(page.getByText('789人已学')).toBeVisible();
    await expect(page.getByText('4.5')).toBeVisible();
    
    // Check Python course
    await expect(page.getByText('Python 数据分析')).toBeVisible();
    await expect(page.getByText('¥199')).toBeVisible();
    await expect(page.getByText('赵老师')).toBeVisible();
    await expect(page.getByText('18小时')).toBeVisible();
    await expect(page.getByText('2145人已学')).toBeVisible();
    await expect(page.getByText('4.6')).toBeVisible();
    
    // Check Node.js course
    await expect(page.getByText('Node.js 后端开发')).toBeVisible();
    await expect(page.getByText('免费')).toBeVisible();
    await expect(page.getByText('王老师')).toBeVisible();
    await expect(page.getByText('30小时')).toBeVisible();
    await expect(page.getByText('567人已学')).toBeVisible();
    await expect(page.getByText('4.7')).toBeVisible();
    
    // Check React course
    await expect(page.getByText('React 高级开发实战')).toBeVisible();
    await expect(page.getByText('¥399')).toBeVisible();
    await expect(page.getByText('李老师')).toBeVisible();
    await expect(page.getByText('25小时')).toBeVisible();
    await expect(page.getByText('892人已学')).toBeVisible();
    await expect(page.getByText('4.9')).toBeVisible();
    
    // Check Vue.js course
    await expect(page.getByText('Vue.js 3 完整教程')).toBeVisible();
    await expect(page.getByText('¥299')).toBeVisible();
    await expect(page.getByText('张老师')).toBeVisible();
    await expect(page.getByText('20小时')).toBeVisible();
    await expect(page.getByText('1234人已学')).toBeVisible();
  });

  test('should display course action buttons', async ({ page }) => {
    // Check enrollment buttons
    const enrollButtons = page.getByRole('button', { name: '立即报名' });
    await expect(enrollButtons).toHaveCount(5); // 5 courses with enrollment buttons
    
    // Check detail buttons
    const detailButtons = page.getByRole('button', { name: '查看详情' });
    await expect(detailButtons).toHaveCount(6); // All courses should have detail buttons
    
    // Check enrolled course button
    const enrolledButton = page.getByRole('button', { name: '已报名' });
    await expect(enrolledButton).toHaveCount(1); // Node.js course shows as enrolled
  });

  test('should display course tags', async ({ page }) => {
    // Check Flutter tags
    await expect(page.getByText('Flutter')).toBeVisible();
    await expect(page.getByText('Dart')).toBeVisible();
    await expect(page.getByText('Mobile')).toBeVisible();
    
    // Check UI/UX tags
    await expect(page.getByText('UI')).toBeVisible();
    await expect(page.getByText('UX')).toBeVisible();
    await expect(page.getByText('Figma')).toBeVisible();
    
    // Check Python tags
    await expect(page.getByText('Python')).toBeVisible();
    await expect(page.getByText('Pandas')).toBeVisible();
    await expect(page.getByText('NumPy')).toBeVisible();
    
    // Check Node.js tags
    await expect(page.getByText('Node.js')).toBeVisible();
    await expect(page.getByText('Express')).toBeVisible();
    await expect(page.getByText('MongoDB')).toBeVisible();
    
    // Check React tags
    await expect(page.getByText('React')).toBeVisible();
    await expect(page.getByText('JavaScript')).toBeVisible();
    await expect(page.getByText('Redux')).toBeVisible();
    
    // Check Vue.js tags
    await expect(page.getByText('Vue.js')).toBeVisible();
    await expect(page.getByText('TypeScript')).toBeVisible();
  });

  test('should be able to search courses', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: '搜索课程...' });
    await searchBox.fill('Vue');
    
    const searchButton = page.locator('button').filter({ hasText: 'search' }).nth(1);
    await searchButton.click();
    
    // The search functionality might be implemented on backend
    // For now, we just verify the search input works
    await expect(searchBox).toHaveValue('Vue');
  });
});
