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
      <!-- User Profile Section -->
      <div class="user-profile" v-if="!collapsed">
        <div class="avatar-container">
          <a-avatar :size="80" :src="userStore.user?.avatar || defaultAvatar" />
        </div>
        <div class="user-info">
          <h3>{{ userStore.userName || '未登录用户' }}</h3>
          <p>{{ userStore.user?.department || 'Computer Science' }}</p>
        </div>
      </div>
      <div class="user-profile-collapsed" v-else>
        <a-avatar :size="40" :src="userStore.user?.avatar || defaultAvatar" />
      </div>

      <!-- Menu Items -->
      <div class="menu-container">
        <div 
          v-for="item in menuItems" 
          :key="item.key" 
          :class="['menu-item', { 'active': selectedKeys.includes(item.key) }]"
          @click="handleMenuClick({ key: item.key })"
          v-show="!item.adminOnly || isAdmin"
        >
          <AppstoreOutlined v-if="item.icon === 'AppstoreOutlined'" />
          <BookOutlined v-else-if="item.icon === 'BookOutlined'" />
          <TeamOutlined v-else-if="item.icon === 'TeamOutlined'" />
          <BarChartOutlined v-else-if="item.icon === 'BarChartOutlined'" />
          <UserOutlined v-else-if="item.icon === 'UserOutlined'" />
          <FileOutlined v-else-if="item.icon === 'FileOutlined'" />
          <SettingOutlined v-else-if="item.icon === 'SettingOutlined'" />
          <DeleteOutlined v-else-if="item.icon === 'DeleteOutlined'" />
          <TagsOutlined v-else-if="item.icon === 'TagsOutlined'" />
          <span v-if="!collapsed">{{ item.title }}</span>
        </div>
      </div>

      <!-- Logout Button -->
      <div class="logout-button" @click="handleLogout">
        <LogoutOutlined />
        <span v-if="!collapsed">退出登录</span>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  DeleteOutlined,
  FileOutlined,
  UserOutlined,
  TeamOutlined,
  TagsOutlined,
  BookOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])
const defaultAvatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'

// 检查用户是否为管理员
const isAdmin = computed(() => {
  return userStore.user?.roleId === 1 // 假设 roleId 1 为管理员
})

// 菜单项定义
const menuItems = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'AppstoreOutlined',
    path: '/',
    adminOnly: false
  },
  {
    key: 'catalog',
    title: '课程目录',
    icon: 'BookOutlined',
    path: '/catalog',
    adminOnly: false
  },
  {
    key: 'courses',
    title: '我的课程',
    icon: 'TeamOutlined',
    path: '/courses',
    adminOnly: false
  },
  {
    key: 'progress',
    title: '学习进度',
    icon: 'BarChartOutlined',
    path: '/progress',
    adminOnly: false
  },
  {
    key: 'profile',
    title: '个人资料',
    icon: 'UserOutlined',
    path: '/profile',
    adminOnly: false
  },
  {
    key: 'downloads',
    title: '资料下载',
    icon: 'FileOutlined',
    path: '/downloads',
    adminOnly: false
  },
  {
    key: 'settings',
    title: '设置',
    icon: 'SettingOutlined',
    path: '/settings',
    adminOnly: false
  },
  {
    key: 'trash',
    title: '垃圾桶',
    icon: 'DeleteOutlined',
    path: '/trash',
    adminOnly: false
  },
  {
    key: 'admin-users',
    title: '用户管理',
    icon: 'UserOutlined',
    path: '/admin/users',
    adminOnly: true
  },
  {
    key: 'admin-courses',
    title: '课程管理',
    icon: 'BookOutlined',
    path: '/admin/courses',
    adminOnly: true
  },
  {
    key: 'admin-categories',
    title: '分类管理',
    icon: 'TagsOutlined',
    path: '/admin/categories',
    adminOnly: true
  }
]

// 根据当前路由设置选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    const menuItem = menuItems.find(item => item.path === newPath)
    if (menuItem) {
      selectedKeys.value = [menuItem.key]
    }
  },
  { immediate: true }
)

const handleMenuClick = ({ key }: { key: string }) => {
  const menuItem = menuItems.find(item => item.key === key)
  if (menuItem) {
    router.push(menuItem.path)
  }
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Logout failed:', error)
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sidebar-content {
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

/* User Profile Styling */
.user-profile {
  padding: 16px;
  text-align: center;
  margin-bottom: 20px;
}

.avatar-container {
  margin-bottom: 10px;
}

.user-info h3 {
  margin: 10px 0 5px;
  font-size: 18px;
  font-weight: 500;
}

.user-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.user-profile-collapsed {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  margin-bottom: 20px;
}

/* Menu Items Styling */
.menu-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.menu-item:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.menu-item.active {
  background-color: #1890ff;
  color: white;
}

.menu-item span {
  margin-left: 12px;
}

/* Logout Button */
.logout-button {
  margin: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.logout-button:hover {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.logout-button span {
  margin-left: 12px;
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
