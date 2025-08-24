# 前端设计与页面原型 - E-Learning Platform

## 概述

本文档描述了 Contoso.tech 企业在线培训平台前端 UI/UX 设计，包含页面布局、组件设计和用户交互流程。

## 设计原则

### 视觉设计原则
- **简洁清晰**: 减少视觉噪音，突出核心内容
- **一致性**: 统一的设计语言和交互模式
- **可访问性**: 支持键盘导航，满足无障碍要求
- **响应式**: 适配桌面、平板、手机等不同设备

### 色彩方案
```css
/* 主色调 */
--primary-color: #2563eb;     /* 蓝色 - 主要按钮、链接 */
--primary-light: #3b82f6;     /* 浅蓝色 - 悬停状态 */
--primary-dark: #1d4ed8;      /* 深蓝色 - 激活状态 */

/* 辅助色 */
--secondary-color: #64748b;   /* 灰蓝色 - 次要文本 */
--accent-color: #10b981;      /* 绿色 - 成功状态 */
--warning-color: #f59e0b;     /* 橙色 - 警告状态 */
--error-color: #ef4444;       /* 红色 - 错误状态 */

/* 中性色 */
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;

/* 背景色 */
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-tertiary: #f1f5f9;
```

### 字体系统
```css
/* 字体族 */
--font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Courier New', monospace;

/* 字体大小 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* 字重 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 页面布局结构

### 整体布局
```
┌─────────────────────────────────────────────────────────────┐
│                        Top Navigation                       │
├─────────────────────────────────────────────────────────────┤
│          │                                                  │
│          │                                                  │
│ Sidebar  │                Main Content                      │
│          │                                                  │
│          │                                                  │
└─────────────────────────────────────────────────────────────┘
```

### 响应式断点
```css
/* 移动设备 */
@media (max-width: 768px) { ... }

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* 桌面设备 */
@media (min-width: 1025px) { ... }
```

## 核心页面设计

### 1. 登录页面 (Login Page)

#### 页面结构
```
┌─────────────────────────────────────────┐
│              Logo & Title               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         Login Form                │  │
│  │                                   │  │
│  │  Username: [________________]     │  │
│  │  Password: [________________]     │  │
│  │                                   │  │
│  │  [ ] Remember Me    [Forgot?]    │  │
│  │                                   │  │
│  │        [    Login    ]            │  │
│  │                                   │  │
│  │      Don't have account?          │  │
│  │         [Register]                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### 组件规格
- **表单宽度**: 最大 400px，居中显示
- **输入框**: 高度 48px，圆角 8px
- **按钮**: 高度 48px，全宽度，圆角 8px
- **Logo**: 高度 60px

### 2. 注册页面 (Register Page)

#### 页面结构
```
┌─────────────────────────────────────────┐
│              Logo & Title               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        Registration Form          │  │
│  │                                   │  │
│  │  First Name: [__________]         │  │
│  │  Last Name:  [__________]         │  │
│  │  Username:   [__________]         │  │
│  │  Email:      [__________]         │  │
│  │  Password:   [__________]         │  │
│  │  Confirm:    [__________]         │  │
│  │  Department: [__________]         │  │
│  │  Position:   [__________]         │  │
│  │                                   │  │
│  │        [   Register   ]           │  │
│  │                                   │  │
│  │      Already have account?        │  │
│  │           [Login]                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 3. 主页/Dashboard

#### 页面结构
```
┌─────────────────────────────────────────────────────────────┐
│  [≡] E-Learning Platform    [🔍Search] [🔔] [👤User Menu]   │
├─────────────────────────────────────────────────────────────┤
│      │                                                      │
│  📚  │  ┌─────────────────┐  ┌─────────────────┐           │
│ 课程  │  │ Continue Learn. │  │   My Progress   │           │
│      │  │                 │  │                 │           │
│  📊  │  │  [Course Card]  │  │  Course 1: 85%  │           │
│ 进度  │  │  [Course Card]  │  │  Course 2: 65%  │           │
│      │  └─────────────────┘  │  Course 3: 45%  │           │
│  👥  │                       └─────────────────┘           │
│ 管理  │  ┌─────────────────────────────────────┐           │
│      │  │         Recent Courses              │           │
│  ⚙️  │  │                                     │           │
│ 设置  │  │  [Course 1]  [Course 2]  [...]     │           │
│      │  └─────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

#### 核心组件
- **欢迎横幅**: 显示用户名和学习统计
- **继续学习卡片**: 显示进行中的课程
- **学习进度**: 圆形进度条显示总体进度
- **推荐课程**: 横向滚动的课程卡片

### 4. 课程目录页 (Course Catalog)

#### 页面结构
```
┌─────────────────────────────────────────────────────────────┐
│                    Search & Filters                         │
│  [Search Box]  [Category ▼] [Level ▼] [Sort ▼]             │
├─────────────────────────────────────────────────────────────┤
│      │                                                      │
│ 分类  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│ 筛选  │  │Course│ │Course│ │Course│ │Course│               │
│      │  │Image │ │Image │ │Image │ │Image │               │
│ 📁   │  │      │ │      │ │      │ │      │               │
│ 编程  │  ├──────┤ ├──────┤ ├──────┤ ├──────┤               │
│      │  │Title │ │Title │ │Title │ │Title │               │
│ 📁   │  │Desc  │ │Desc  │ │Desc  │ │Desc  │               │
│ 设计  │  │⭐4.5 │ │⭐4.2 │ │⭐4.8 │ │⭐4.1 │               │
│      │  │👥156 │ │👥89  │ │👥234 │ │👥67  │               │
│ 📁   │  └──────┘ └──────┘ └──────┘ └──────┘               │
│ 管理  │                                                      │
│      │                [Load More]                           │
└─────────────────────────────────────────────────────────────┘
```

#### 课程卡片设计
```css
.course-card {
  width: 280px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
```

### 5. 课程详情页

#### 页面结构
```
┌─────────────────────────────────────────────────────────────┐
│                     Course Header                           │
│  ┌─────────────┐                                           │
│  │   Course    │  Course Title                             │
│  │   Cover     │  ⭐⭐⭐⭐⭐ (4.5) 156 reviews             │
│  │   Image     │  👨‍🏫 Instructor Name                      │
│  │             │  🕒 6 hours | 📚 12 lessons              │
│  └─────────────┘  🏆 Beginner Level                        │
│                                                             │
│                   [    Enroll Now    ]                     │
├─────────────────────────────────────────────────────────────┤
│  [Description] [Curriculum] [Reviews] [Instructor]         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📖 What you'll learn:                                     │
│  ✓ Master Vue.js fundamentals                             │
│  ✓ Build reactive applications                            │
│  ✓ Understand component architecture                      │
│                                                             │
│  📋 Course Content:                                        │
│  📁 Chapter 1: Introduction (3 lessons)                   │
│    📄 1.1 What is Vue.js?                                │
│    📄 1.2 Setting up development environment             │
│    🎥 1.3 Your first Vue application                     │
│                                                             │
│  📁 Chapter 2: Components (4 lessons)                     │
│    📄 2.1 Component basics                               │
│    🎥 2.2 Props and events                               │
│    ...                                                     │
└─────────────────────────────────────────────────────────────┘
```

### 6. 学习页面 (Learning Page)

#### 页面结构
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Course    Course Title    Progress: 65% [████▒▒] │
├─────────────────────────────────────────────────────────────┤
│                     │                                       │
│   📚 Course Menu    │         Lesson Content               │
│                     │                                       │
│ ✅ 1.1 Introduction │  ┌─────────────────────────────────┐  │
│ ✅ 1.2 Setup       │  │                                 │  │
│ ⏸️ 1.3 First App   │  │        Video Player             │  │
│ 📝 2.1 Components  │  │          or                     │  │
│ 📝 2.2 Props       │  │       Text Content               │  │
│ 📝 2.3 Events      │  │                                 │  │
│ 📝 3.1 Routing     │  └─────────────────────────────────┘  │
│ 📝 3.2 State       │                                       │
│                     │  Lesson Title                        │
│                     │  📖 Lesson description here...       │
│                     │                                       │
│                     │  [← Previous]      [Next →]         │
│                     │            [Mark Complete]          │
└─────────────────────────────────────────────────────────────┘
```

#### 功能特性
- **进度跟踪**: 实时更新学习进度
- **自动保存**: 学习位置自动保存
- **响应式播放器**: 支持视频播放控制
- **笔记功能**: 允许用户添加学习笔记

### 7. 个人中心 (Profile Page)

#### 页面结构
```
┌─────────────────────────────────────────────────────────────┐
│                    User Profile                             │
├─────────────────────────────────────────────────────────────┤
│      │  ┌───────────────────────────────────────────────┐  │
│      │  │                Profile Info                   │  │
│ 📊   │  │  👤 Avatar    John Doe                       │  │
│ 概览  │  │               john@contoso.com               │  │
│      │  │               IT Department                   │  │
│ 👤   │  │               Senior Developer                │  │
│ 资料  │  │               [Edit Profile]                 │  │
│      │  └───────────────────────────────────────────────┘  │
│ 📚   │                                                      │
│ 课程  │  ┌───────────────────────────────────────────────┐  │
│      │  │              Learning Statistics               │  │
│ 🏆   │  │  📊 Completed: 12 courses                    │  │
│ 成就  │  │  ⏱️ Total time: 45 hours                     │  │
│      │  │  🎯 Current: 3 in progress                   │  │
│ ⚙️   │  │  🏆 Certificates: 8                          │  │
│ 设置  │  └───────────────────────────────────────────────┘  │
│      │                                                      │
│      │  ┌───────────────────────────────────────────────┐  │
│      │  │               Recent Activity                  │  │
│      │  │  • Completed "Vue.js Basics"                 │  │
│      │  │  • Started "React Advanced"                  │  │
│      │  │  • Earned certificate in "Java OOP"          │  │
│      │  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Vue.js 组件架构

### 组件层次结构
```
App.vue
├── router-view
├── TheHeader.vue
│   ├── SearchBox.vue
│   ├── UserMenu.vue
│   └── NotificationBell.vue
├── TheSidebar.vue
│   ├── NavMenu.vue
│   └── CategoryFilter.vue
└── TheFooter.vue

Pages/
├── LoginPage.vue
├── RegisterPage.vue
├── DashboardPage.vue
│   ├── WelcomeBanner.vue
│   ├── ContinueLearning.vue
│   ├── ProgressSummary.vue
│   └── RecommendedCourses.vue
├── CourseCatalog.vue
│   ├── CourseFilters.vue
│   ├── CourseCard.vue
│   └── CoursePagination.vue
├── CourseDetails.vue
│   ├── CourseHeader.vue
│   ├── CourseTabs.vue
│   ├── CourseCurriculum.vue
│   └── CourseReviews.vue
├── LearningPage.vue
│   ├── CourseMenu.vue
│   ├── LessonContent.vue
│   ├── VideoPlayer.vue
│   └── LessonNavigation.vue
└── ProfilePage.vue
    ├── ProfileInfo.vue
    ├── LearningStats.vue
    └── RecentActivity.vue
```

### 状态管理 (Pinia Store)

#### 用户状态 (User Store)
```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(credentials) { ... },
    async logout() { ... },
    async updateProfile(data) { ... }
  }
})
```

#### 课程状态 (Course Store)
```javascript
// stores/course.js
export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    currentCourse: null,
    filters: {
      category: null,
      difficulty: null,
      search: ''
    }
  }),
  
  actions: {
    async fetchCourses(params) { ... },
    async enrollCourse(courseId) { ... }
  }
})
```

#### 学习状态 (Learning Store)
```javascript
// stores/learning.js
export const useLearningStore = defineStore('learning', {
  state: () => ({
    currentLesson: null,
    progress: {},
    enrollments: []
  }),
  
  actions: {
    async updateProgress(lessonId, progress) { ... },
    async markComplete(lessonId) { ... }
  }
})
```

## 交互设计

### 微交互
- **按钮悬停**: 0.2s 过渡效果，轻微阴影变化
- **卡片悬停**: 向上浮动 4px，阴影加深
- **加载状态**: 骨架屏 + 脉冲动画
- **成功操作**: 绿色勾选动画 + Toast 提示

### 动画效果
```css
/* 页面切换动画 */
.page-enter-active, .page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from, .page-leave-to {
  opacity: 0;
}

/* 列表项动画 */
.list-enter-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
```

### 响应式设计

#### 移动端适配
- **导航**: 汉堡菜单，底部标签栏
- **卡片**: 单列布局，增大点击区域
- **表单**: 较大的输入框，优化键盘体验
- **视频**: 全屏播放支持

#### 平板端适配
- **布局**: 双列布局，侧边栏可折叠
- **导航**: 顶部标签栏 + 侧边菜单
- **触控**: 优化触控交互

## 可访问性 (Accessibility)

### WCAG 2.1 合规
- **颜色对比度**: 至少 4.5:1
- **键盘导航**: 完整的键盘操作支持
- **屏幕阅读器**: ARIA 标签和语义化 HTML
- **焦点管理**: 清晰的焦点指示器

### 语义化标记
```html
<main role="main">
  <section aria-labelledby="course-section">
    <h2 id="course-section">我的课程</h2>
    <article role="article">
      <header>
        <h3>课程标题</h3>
      </header>
      <div>课程描述</div>
    </article>
  </section>
</main>
```

## 性能优化

### 前端优化策略
- **代码分割**: 路由级别的懒加载
- **图片优化**: WebP 格式，懒加载
- **缓存策略**: Service Worker 缓存
- **bundle 优化**: Tree shaking，压缩

### 用户体验优化
- **首屏加载**: 关键路径优化，骨架屏
- **离线支持**: 基础功能离线可用
- **PWA 特性**: 可安装，推送通知