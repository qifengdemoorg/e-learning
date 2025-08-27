<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    class="sidebar"
    :width="240"
    :collapsed-width="80"
    theme="light"
  >
    <div class="sidebar-content">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="sidebar-menu"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>仪表盘</span>
        </a-menu-item>

        <a-menu-item key="courses">
          <template #icon>
            <BookOutlined />
          </template>
          <span>我的课程</span>
        </a-menu-item>

        <a-menu-item key="catalog">
          <template #icon>
            <AppstoreOutlined />
          </template>
          <span>课程目录</span>
        </a-menu-item>

        <a-menu-item key="progress">
          <template #icon>
            <BarChartOutlined />
          </template>
          <span>学习进度</span>
        </a-menu-item>

        <a-menu-divider />

        <a-sub-menu key="admin" v-if="isAdmin">
          <template #icon>
            <TeamOutlined />
          </template>
          <template #title>管理功能</template>
          <a-menu-item key="admin-users">
            <UserOutlined />
            用户管理
          </a-menu-item>
          <a-menu-item key="admin-courses">
            <BookOutlined />
            课程管理
          </a-menu-item>
          <a-menu-item key="admin-categories">
            <TagsOutlined />
            分类管理
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item key="settings">
          <template #icon>
            <SettingOutlined />
          </template>
          <span>设置</span>
        </a-menu-item>
      </a-menu>
    </div>

    <!-- 折叠按钮 -->
    <div class="sidebar-trigger" @click="toggleCollapsed">
      <MenuUnfoldOutlined v-if="collapsed" />
      <MenuFoldOutlined v-else />
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DashboardOutlined,
  BookOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  TeamOutlined,
  UserOutlined,
  TagsOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])

// 检查用户是否为管理员
const isAdmin = computed(() => {
  return userStore.user?.roleId === 1 // 假设 roleId 1 为管理员
})

// 根据当前路由设置选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    const pathToKey: Record<string, string> = {
      '/': 'dashboard',
      '/courses': 'courses',
      '/catalog': 'catalog',
      '/progress': 'progress',
      '/admin/users': 'admin-users',
      '/admin/courses': 'admin-courses',
      '/admin/categories': 'admin-categories',
      '/settings': 'settings'
    }
    
    const key = pathToKey[newPath]
    if (key) {
      selectedKeys.value = [key]
    }
  },
  { immediate: true }
)

const handleMenuClick = ({ key }: { key: string }) => {
  const keyToPath: Record<string, string> = {
    'dashboard': '/',
    'courses': '/courses',
    'catalog': '/catalog',
    'progress': '/progress',
    'admin-users': '/admin/users',
    'admin-courses': '/admin/courses',
    'admin-categories': '/admin/categories',
    'settings': '/settings'
  }
  
  const path = keyToPath[key]
  if (path) {
    router.push(path)
  }
}

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.sidebar {
  background: #fff;
  border-right: 1px solid #f0f0f0;
  position: relative;
  height: 100vh;
}

.sidebar-content {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none;
  padding: 16px 0;
}

.sidebar-menu :deep(.ant-menu-item) {
  margin: 4px 12px;
  border-radius: 8px;
  height: 40px;
  line-height: 40px;
}

.sidebar-menu :deep(.ant-menu-item-selected) {
  background-color: #e6f7ff;
  border-color: #1890ff;
}

.sidebar-menu :deep(.ant-menu-item:hover) {
  background-color: #f5f5f5;
}

.sidebar-menu :deep(.ant-menu-submenu-title) {
  margin: 4px 12px;
  border-radius: 8px;
  height: 40px;
  line-height: 40px;
}

.sidebar-trigger {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-trigger:hover {
  background: #e6f7ff;
  color: #1890ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
  }
}
</style>
