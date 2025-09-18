<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <img src="/logo.svg" alt="E-Learning Platform" />
        </div>
        <h1 class="title">欢迎回来</h1>
        <p class="subtitle">登录您的学习账户</p>
      </div>

      <a-form
        :model="formData"
        :rules="rules"
        @finish="handleLogin"
        class="login-form"
        layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名或邮箱"
            size="large"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="formData.password"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <div class="form-options">
            <a-checkbox v-model:checked="formData.rememberMe">
              记住我
            </a-checkbox>
            <a class="forgot-password" @click="goToForgotPassword">
              忘记密码？
            </a>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="login-button"
          >
            登录
          </a-button>
        </a-form-item>

        <div class="register-link">
          还没有账户？
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </a-form>

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
        
        <div class="debug-actions">
          <a-button 
            @click="clearLocalStorage" 
            danger 
            size="small"
            style="margin-top: 16px;"
          >
            清除本地存储
          </a-button>
          <span style="font-size: 12px; color: #666; margin-left: 8px;">
            如果遇到用户名显示问题，请点击此按钮
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
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

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

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
  }
}

const goToForgotPassword = () => {
  alert('忘记密码功能正在开发中')
}

const clearLocalStorage = () => {
  localStorage.clear()
  alert('本地存储已清除，现在可以重新登录')
  // 刷新页面以确保状态重置
  window.location.reload()
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

.logo img {
  height: 60px;
  margin-bottom: 16px;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: #1890ff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
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
