<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheSidebar from './components/layout/TheSidebar.vue'
import DebugPanel from './components/DebugPanel.vue'

const route = useRoute()
const sidebarRef = ref()

// 判断是否为认证页面（登录/注册）
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

// 处理侧边栏收缩事件
const handleToggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleCollapsed()
  }
}
</script>

<template>
  <div class="app">
    <!-- 认证页面不显示布局 -->
    <template v-if="isAuthPage">
      <RouterView />
    </template>
    
    <!-- 主应用布局 -->
    <template v-else>
      <a-layout class="app-layout">
        <TheHeader @toggle-sidebar="handleToggleSidebar" />
        <a-layout>
          <TheSidebar ref="sidebarRef" />
          <a-layout-content class="main-content">
            <RouterView />
          </a-layout-content>
        </a-layout>
      </a-layout>
      <!-- 调试面板 -->
      <DebugPanel />
    </template>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
}

.app-layout {
  height: 100vh;
}

.main-content {
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
  overflow-y: auto;
}

/* 全局样式重置 */
:global(body) {
  margin: 0;
  padding: 0;
}

:global(#app) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
}
</style>
