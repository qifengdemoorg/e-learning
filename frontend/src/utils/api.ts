import axios, { type AxiosResponse } from 'axios'
import type { LoginCredentials, RegisterData, User, Course, ApiResponse } from '@/types'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证相关 API
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '登录失败'
    }
  }
}

export const register = async (data: RegisterData): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post('/auth/register', data)
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '注册失败'
    }
  }
}

export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await api.post('/auth/logout')
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '退出失败'
    }
  }
}

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get('/auth/me')
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取用户信息失败'
    }
  }
}

// 课程相关 API
export const getCourses = async (params?: {
  category?: number
  difficulty?: string
  search?: string
  page?: number
  limit?: number
}): Promise<ApiResponse<{ courses: Course[]; total: number }>> => {
  try {
    const response = await api.get('/courses', { params })
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取课程列表失败'
    }
  }
}

export const getCourse = async (id: number): Promise<ApiResponse<Course>> => {
  try {
    const response = await api.get(`/courses/${id}`)
    return response
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取课程详情失败'
    }
  }
}

// 导出 axios 实例以供其他模块使用
export default api
