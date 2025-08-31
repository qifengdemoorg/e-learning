<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <div class="logo-icon">E</div>
        </div>
        <h1 class="title">欢迎回来</h1>
        <p class="subtitle">登录您的学习账户</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-item">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="请输入用户名或邮箱"
            required
            class="form-input"
          />
        </div>

        <div class="form-item">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            required
            class="form-input"
          />
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input
              v-model="formData.rememberMe"
              type="checkbox"
              class="checkbox"
            />
            记住我
          </label>
          <a href="#" @click.prevent="goToForgotPassword" class="forgot-password">
            忘记密码？
          </a>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="login-button"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div class="register-link">
          还没有账户？
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </form>

      <!-- 测试用户信息 -->
      <div class="test-users">
        <h3>测试用户</h3>
        <div class="test-user-grid">
          <div class="test-user-card" @click="fillTestUser('admin')">
            <div class="role">管理员</div>
            <div class="username">admin</div>
            <div class="password">password123</div>
          </div>
          <div class="test-user-card" @click="fillTestUser('teacher')">
            <div class="role">教师</div>
            <div class="username">teacher</div>
            <div class="password">password123</div>
          </div>
          <div class="test-user-card" @click="fillTestUser('student')">
            <div class="role">学员</div>
            <div class="username">student</div>
            <div class="password">password123</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { LoginCredentials } from '@/types'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)

const formData = reactive<LoginCredentials & { rememberMe: boolean }>({
  username: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  loading.value = true
  
  try {
    const result = await userStore.login(formData)
    
    if (result.success) {
      router.push('/')
    } else {
      console.error('登录失败:', result.message)
    }
  } catch (error: any) {
    console.error('登录失败:', error.message)
  } finally {
    loading.value = false
  }
}

const fillTestUser = (role: string) => {
  const testUsers = {
    admin: { username: 'admin', password: 'password123' },
    teacher: { username: 'teacher', password: 'password123' },
    student: { username: 'student', password: 'password123' }
  }
  
  const user = testUsers[role as keyof typeof testUsers]
  if (user) {
    formData.username = user.username
    formData.password = user.password
    alert(`已填入${role === 'admin' ? '管理员' : role === 'teacher' ? '教师' : '学员'}测试账号`)
  }
}

const goToForgotPassword = () => {
  alert('忘记密码功能正在开发中')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 48px;
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 16px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  margin: 0;
}

.login-form {
  margin-top: 32px;
}

.form-item {
  margin-bottom: 24px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.checkbox {
  width: 16px;
  height: 16px;
}

.forgot-password {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 48px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  background: #40a9ff;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-link {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
}

.register-link .link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 600;
}

.register-link .link:hover {
  text-decoration: underline;
}

.test-users {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.test-users h3 {
  color: #374151;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.test-user-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.test-user-card {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
}

.test-user-card:hover {
  border-color: #1890ff;
  background: #f0f9ff;
  transform: translateY(-1px);
}

.test-user-card .role {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.test-user-card .username,
.test-user-card .password {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

@media (max-width: 640px) {
  .login-container {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>
