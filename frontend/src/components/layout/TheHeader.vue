<template>
  <a-layout class="app-header">
    <a-layout-header class="header">
      <div class="header-left">
        <!-- 侧边栏收缩按钮 -->
        <a-button 
          type="text" 
          class="sidebar-trigger"
          @click="toggleSidebar"
        >
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
        
        <div class="logo">
          <img src="/logo.svg" alt="E-Learning" />
          <span class="logo-text">E-Learning Platform</span>
        </div>
      </div>

      <div class="header-center">
        <a-input-search
          v-model:value="searchValue"
          placeholder="搜索课程、讲师或知识点..."
          size="large"
          style="width: 400px"
          @search="handleSearch"
        />
      </div>

      <div class="header-right">
        <a-space size="large">
          <!-- 通知 -->
          <a-badge :count="notificationCount">
            <BellOutlined class="header-icon" />
          </a-badge>

          <!-- 用户菜单 -->
          <a-dropdown>
            <div class="user-info">
              <a-avatar :src="userStore.user?.avatar" :size="32">
                {{ userStore.userName?.charAt(0) || 'U' }}
              </a-avatar>
              <span class="username">{{ userStore.userName || '未知用户' }}</span>
              <DownOutlined class="dropdown-icon" />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="goToProfile">
                  <UserOutlined />
                  个人中心
                </a-menu-item>
                <a-menu-item key="settings" @click="goToSettings">
                  <SettingOutlined />
                  设置
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </div>
    </a-layout-header>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchValue = ref('')
const notificationCount = ref(3) // 模拟通知数量
const collapsed = ref(false) // 侧边栏收缩状态

// 触发侧边栏收缩事件
const emit = defineEmits<{
  toggleSidebar: []
}>()

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
  emit('toggleSidebar')
}

const handleSearch = (value: string) => {
  if (value.trim()) {
    // 实现搜索功能
    console.log('搜索:', value)
    alert(`搜索: ${value}`)
  }
}

const goToProfile = () => {
  router.push('/profile')
}

const goToSettings = () => {
  router.push('/settings')
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sidebar-trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-trigger:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo img {
  height: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 48px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
}

.header-icon:hover {
  color: #1890ff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  font-weight: 500;
  color: #374151;
}

.dropdown-icon {
  font-size: 12px;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }
  
  .header-center {
    margin: 0 16px;
  }
  
  .header-center .ant-input-search {
    width: 100% !important;
    max-width: 300px;
  }
  
  .logo-text {
    display: none;
  }
}
</style>
