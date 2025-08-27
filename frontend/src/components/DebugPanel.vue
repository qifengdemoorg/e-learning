<template>
  <div class="debug-panel" v-if="showDebug">
    <h3>调试信息</h3>
    <p><strong>Token:</strong> {{ userStore.token?.substring(0, 20) }}...</p>
    <p><strong>User:</strong> {{ JSON.stringify(userStore.user, null, 2) }}</p>
    <p><strong>userName:</strong> {{ userStore.userName }}</p>
    <p><strong>getUserDisplayName():</strong> {{ getUserDisplayName() }}</p>
    <a-button @click="clearStorage" danger>清除本地存储</a-button>
    <a-button @click="showDebug = false" style="margin-left: 10px;">关闭</a-button>
  </div>
  <a-button 
    v-else 
    @click="showDebug = true" 
    type="dashed" 
    size="small"
    style="position: fixed; top: 10px; right: 10px; z-index: 1000;"
  >
    调试
  </a-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const showDebug = ref(false)

const getUserDisplayName = () => {
  if (userStore.user) {
    if (userStore.user.firstName && userStore.user.lastName) {
      return `${userStore.user.firstName}${userStore.user.lastName}`
    }
    return userStore.user.username
  }
  return '未知用户'
}

const clearStorage = () => {
  localStorage.clear()
  userStore.logout()
  router.push('/login')
  showDebug.value = false
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  background: white;
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  max-width: 400px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.debug-panel p {
  margin: 8px 0;
  font-size: 12px;
  word-break: break-all;
}

.debug-panel pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 10px;
}
</style>
