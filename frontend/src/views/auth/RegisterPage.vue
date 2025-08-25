<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="logo">
          <img src="/logo.svg" alt="E-Learning Platform" />
        </div>
        <h1 class="title">创建账户</h1>
        <p class="subtitle">开始您的学习之旅</p>
      </div>

      <a-form
        :model="formData"
        :rules="rules"
        @finish="handleRegister"
        class="register-form"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓" name="firstName">
              <a-input
                v-model:value="formData.firstName"
                placeholder="请输入姓"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="名" name="lastName">
              <a-input
                v-model:value="formData.lastName"
                placeholder="请输入名"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            size="large"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="邮箱地址" name="email">
          <a-input
            v-model:value="formData.email"
            placeholder="请输入邮箱地址"
            size="large"
          >
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="部门" name="department">
              <a-input
                v-model:value="formData.department"
                placeholder="如：IT部"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="职位" name="position">
              <a-input
                v-model:value="formData.position"
                placeholder="如：软件工程师"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="formData.password"
            placeholder="请输入密码（至少6位）"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password
            v-model:value="formData.confirmPassword"
            placeholder="请再次输入密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="register-button"
          >
            注册账户
          </a-button>
        </a-form-item>

        <div class="login-link">
          已有账户？
          <router-link to="/login" class="link">立即登录</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { register } from '@/utils/api'
import type { RegisterData } from '@/types'

const router = useRouter()
const loading = ref(false)

const formData = reactive<RegisterData>({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  department: '',
  position: '',
  password: '',
  confirmPassword: ''
})

const validatePassword = (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请输入密码')
  }
  if (value.length < 6) {
    return Promise.reject('密码长度至少6位')
  }
  return Promise.resolve()
}

const validateConfirmPassword = (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请确认密码')
  }
  if (value !== formData.password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

const rules = {
  firstName: [
    { required: true, message: '请输入姓', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: '请输入名', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少3位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入部门', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  loading.value = true
  
  try {
    const result = await register(formData)
    
    if (result.success) {
      message.success('注册成功！请登录您的账户')
      router.push('/login')
    } else {
      message.error(result.message || '注册失败')
    }
  } catch (error: any) {
    message.error(error.message || '注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 48px;
  width: 100%;
  max-width: 600px;
}

.register-header {
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

.register-form {
  margin-top: 32px;
}

.register-button {
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
}

.login-link .link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 600;
}

.login-link .link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .register-container {
    padding: 32px 24px;
  }
  
  .title {
    font-size: 24px;
  }
}
</style>
