import { defineStore } from 'pinia'
import type { User, LoginCredentials, ApiResponse } from '@/types'
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/utils/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    userInfo: (state) => state.user,
    userName: (state) => {
      if (state.user) {
        // 优先使用中文姓名（无空格连接）
        if (state.user.firstName && state.user.lastName) {
          return `${state.user.firstName}${state.user.lastName}`
        }
        // 备选方案：使用用户名
        return state.user.username || '未知用户'
      }
      return ''
    }
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      try {
        // 模拟登录功能，用于开发测试
        const mockUsers = {
          admin: { id: 1, username: 'admin', firstName: '系统', lastName: '管理员', email: 'admin@contoso.com', roleId: 1 },
          teacher: { id: 2, username: 'teacher', firstName: '张', lastName: '老师', email: 'teacher@contoso.com', roleId: 2 },
          student: { id: 3, username: 'student', firstName: '李', lastName: '学员', email: 'student@contoso.com', roleId: 3 }
        }

        const mockUser = mockUsers[credentials.username as keyof typeof mockUsers]
        
        if (mockUser && credentials.password === 'password123') {
          // 模拟成功登录
          const mockToken = 'mock-jwt-token-' + Date.now()
          const userData = {
            ...mockUser,
            department: credentials.username === 'admin' ? 'IT部' : credentials.username === 'teacher' ? '培训部' : 'IT部',
            position: credentials.username === 'admin' ? '系统管理员' : credentials.username === 'teacher' ? '高级讲师' : '软件工程师',
            avatar: undefined,
            createdAt: new Date().toISOString()
          }

          this.token = mockToken
          this.user = userData
          this.isAuthenticated = true
          
          // 保存到本地存储
          localStorage.setItem('token', mockToken)
          if (credentials.rememberMe) {
            localStorage.setItem('user', JSON.stringify(userData))
          }
          
          return { success: true }
        }

        // 如果模拟登录失败，尝试实际 API 调用
        try {
          const response: ApiResponse<{ token: string; user: User }> = await apiLogin(credentials)
          
          if (response.success && response.data) {
            this.token = response.data.token
            this.user = response.data.user
            this.isAuthenticated = true
            
            // 保存到本地存储
            localStorage.setItem('token', response.data.token)
            if (credentials.rememberMe) {
              localStorage.setItem('user', JSON.stringify(response.data.user))
            }
            
            return { success: true }
          } else {
            throw new Error(response.message || '登录失败')
          }
        } catch (apiError) {
          // API 调用失败，返回错误信息
          throw new Error('用户名或密码错误')
        }
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || '登录失败，请检查用户名和密码' 
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.token) {
          await apiLogout()
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    async loadUserFromStorage() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
          
          // 只有在生产环境或非模拟 token 时才验证
          if (!token.startsWith('mock-jwt-token-')) {
            await this.refreshUserInfo()
          } else {
            console.log('使用模拟用户数据，跳过 API 验证')
          }
        } catch (error) {
          console.error('Failed to load user from storage:', error)
          this.logout()
        }
      }
    },

    async refreshUserInfo() {
      if (!this.token) return
      
      try {
        // 在开发环境中，如果使用模拟 token，则跳过 API 调用
        if (this.token.startsWith('mock-jwt-token-')) {
          console.log('使用模拟用户数据，跳过 API 刷新')
          return
        }
        
        const response: ApiResponse<User> = await getCurrentUser()
        if (response.success && response.data) {
          this.user = response.data
        }
      } catch (error) {
        console.error('Failed to refresh user info:', error)
        this.logout()
      }
    }
  }
})
