<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>设置</h1>
      <p>管理您的账户和偏好设置</p>
    </div>

    <div class="settings-content">
      <!-- 管理员功能区域 -->
      <div v-if="isAdmin" class="admin-shortcuts">
        <h3>管理员功能</h3>
        <div class="admin-cards">
          <div class="admin-card" @click="navigateTo('/admin/users')">
            <UserOutlined class="admin-icon" />
            <div class="admin-info">
              <h4>用户管理</h4>
              <p>管理系统中的所有用户</p>
            </div>
          </div>
          <div class="admin-card" @click="navigateTo('/admin/courses')">
            <BookOutlined class="admin-icon" />
            <div class="admin-info">
              <h4>课程管理</h4>
              <p>管理课程内容和发布</p>
            </div>
          </div>
          <div class="admin-card" @click="navigateTo('/admin/categories')">
            <TagsOutlined class="admin-icon" />
            <div class="admin-info">
              <h4>分类管理</h4>
              <p>管理课程分类和标签</p>
            </div>
          </div>
        </div>
      </div>

      <div class="personal-settings">
        <div class="settings-sidebar">
          <a-menu 
            v-model:selectedKeys="selectedSettingKeys" 
            mode="inline"
            @click="handleSettingMenuClick"
          >
            <a-menu-item key="profile">
              <UserOutlined />
              个人资料
            </a-menu-item>
            <a-menu-item key="account">
              <SettingOutlined />
              账户设置
            </a-menu-item>
            <a-menu-item key="notifications">
              <BellOutlined />
              通知设置
            </a-menu-item>
            <a-menu-item key="privacy">
              <LockOutlined />
              隐私设置
            </a-menu-item>
            <a-menu-item key="preferences">
              <AppstoreOutlined />
              学习偏好
            </a-menu-item>
          </a-menu>
        </div>

        <div class="settings-main">
          <!-- 个人资料 -->
          <div v-if="activeTab === 'profile'" class="settings-section">
            <h2>个人资料</h2>
            <a-form 
              :model="profileForm" 
              layout="vertical"
              @finish="updateProfile"
            >
              <div class="avatar-section">
                <a-avatar :size="80" :src="profileForm.avatar">
                  <UserOutlined />
                </a-avatar>
                <div class="avatar-actions">
                  <a-button type="primary" @click="changeAvatar">更换头像</a-button>
                  <a-button @click="removeAvatar">移除头像</a-button>
                </div>
              </div>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="姓名" name="name">
                    <a-input v-model:value="profileForm.name" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="用户名" name="username">
                    <a-input v-model:value="profileForm.username" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="邮箱" name="email">
                <a-input v-model:value="profileForm.email" />
              </a-form-item>

              <a-form-item label="电话" name="phone">
                <a-input v-model:value="profileForm.phone" />
              </a-form-item>

              <a-form-item label="个人简介" name="bio">
                <a-textarea 
                  v-model:value="profileForm.bio" 
                  :rows="4"
                  placeholder="简单介绍一下自己..."
                />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit" :loading="saving">
                  保存更改
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <!-- 账户设置 -->
          <div v-if="activeTab === 'account'" class="settings-section">
            <h2>账户设置</h2>
            
            <div class="setting-group">
              <h3>修改密码</h3>
              <a-form 
                :model="passwordForm" 
                layout="vertical"
                @finish="changePassword"
              >
                <a-form-item label="当前密码" name="currentPassword">
                  <a-input-password v-model:value="passwordForm.currentPassword" />
                </a-form-item>
                <a-form-item label="新密码" name="newPassword">
                  <a-input-password v-model:value="passwordForm.newPassword" />
                </a-form-item>
                <a-form-item label="确认新密码" name="confirmPassword">
                  <a-input-password v-model:value="passwordForm.confirmPassword" />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit" :loading="changingPassword">
                    修改密码
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <div class="setting-group">
              <h3>两步验证</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>启用两步验证</h4>
                  <p>为您的账户添加额外的安全保护</p>
                </div>
                <a-switch v-model:checked="accountSettings.twoFactorEnabled" />
              </div>
            </div>

            <div class="setting-group danger-zone">
              <h3>危险操作</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>删除账户</h4>
                  <p>永久删除您的账户和所有数据，此操作不可撤销</p>
                </div>
                <a-button danger @click="showDeleteAccountModal">删除账户</a-button>
              </div>
            </div>
          </div>

          <!-- 通知设置 -->
          <div v-if="activeTab === 'notifications'" class="settings-section">
            <h2>通知设置</h2>
            
            <div class="setting-group">
              <h3>邮件通知</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>课程更新</h4>
                  <p>新课程发布时接收邮件通知</p>
                </div>
                <a-switch v-model:checked="notificationSettings.emailCourseUpdates" />
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>学习提醒</h4>
                  <p>定期接收学习进度提醒</p>
                </div>
                <a-switch v-model:checked="notificationSettings.emailLearningReminders" />
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>营销邮件</h4>
                  <p>接收促销活动和新功能介绍</p>
                </div>
                <a-switch v-model:checked="notificationSettings.emailMarketing" />
              </div>
            </div>

            <div class="setting-group">
              <h3>推送通知</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>浏览器通知</h4>
                  <p>在浏览器中显示通知</p>
                </div>
                <a-switch v-model:checked="notificationSettings.browserNotifications" />
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>学习提醒</h4>
                  <p>定时提醒您继续学习</p>
                </div>
                <a-switch v-model:checked="notificationSettings.studyReminders" />
              </div>
            </div>
          </div>

          <!-- 隐私设置 -->
          <div v-if="activeTab === 'privacy'" class="settings-section">
            <h2>隐私设置</h2>
            
            <div class="setting-group">
              <h3>资料可见性</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>公开个人资料</h4>
                  <p>允许其他用户查看您的公开资料</p>
                </div>
                <a-switch v-model:checked="privacySettings.publicProfile" />
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>显示学习进度</h4>
                  <p>在个人资料中显示学习进度</p>
                </div>
                <a-switch v-model:checked="privacySettings.showProgress" />
              </div>
            </div>

            <div class="setting-group">
              <h3>数据使用</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>学习分析</h4>
                  <p>允许系统分析您的学习行为以提供个性化推荐</p>
                </div>
                <a-switch v-model:checked="privacySettings.learningAnalytics" />
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>改进建议</h4>
                  <p>参与产品改进计划，帮助我们优化学习体验</p>
                </div>
                <a-switch v-model:checked="privacySettings.productImprovement" />
              </div>
            </div>
          </div>

          <!-- 学习偏好 -->
          <div v-if="activeTab === 'preferences'" class="settings-section">
            <h2>学习偏好</h2>
            
            <div class="setting-group">
              <h3>语言设置</h3>
              <a-form-item label="界面语言">
                <a-select v-model:value="preferences.language" style="width: 200px;">
                  <a-select-option value="zh-CN">简体中文</a-select-option>
                  <a-select-option value="en-US">English</a-select-option>
                  <a-select-option value="ja-JP">日本語</a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div class="setting-group">
              <h3>学习偏好</h3>
              <a-form-item label="默认视频质量">
                <a-select v-model:value="preferences.videoQuality" style="width: 200px;">
                  <a-select-option value="auto">自动</a-select-option>
                  <a-select-option value="1080p">1080p</a-select-option>
                  <a-select-option value="720p">720p</a-select-option>
                  <a-select-option value="480p">480p</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="自动播放下一节">
                <a-switch v-model:checked="preferences.autoPlayNext" />
              </a-form-item>

              <a-form-item label="播放速度">
                <a-select v-model:value="preferences.playbackSpeed" style="width: 200px;">
                  <a-select-option value="0.5">0.5x</a-select-option>
                  <a-select-option value="0.75">0.75x</a-select-option>
                  <a-select-option value="1">1x</a-select-option>
                  <a-select-option value="1.25">1.25x</a-select-option>
                  <a-select-option value="1.5">1.5x</a-select-option>
                  <a-select-option value="2">2x</a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div class="setting-group">
              <h3>学习提醒</h3>
              <a-form-item label="每日学习目标">
                <a-select v-model:value="preferences.dailyGoal" style="width: 200px;">
                  <a-select-option value="30">30分钟</a-select-option>
                  <a-select-option value="60">1小时</a-select-option>
                  <a-select-option value="90">1.5小时</a-select-option>
                  <a-select-option value="120">2小时</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="提醒时间">
                <a-time-picker 
                  v-model:value="preferences.reminderTime" 
                  format="HH:mm"
                  placeholder="选择时间"
                />
              </a-form-item>
            </div>

            <a-form-item>
              <a-button type="primary" @click="savePreferences" :loading="savingPreferences">
                保存设置
              </a-button>
            </a-form-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LockOutlined,
  AppstoreOutlined,
  BookOutlined,
  TagsOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const selectedSettingKeys = ref(['profile'])
const activeTab = ref('profile')
const saving = ref(false)
const changingPassword = ref(false)
const savingPreferences = ref(false)

// 检查用户是否为管理员
const isAdmin = computed(() => {
  return userStore.user?.roleId === 1 // 假设 roleId 1 为管理员
})

// 表单数据
const profileForm = reactive({
  name: '张三',
  username: 'zhangsan',
  email: 'zhangsan@example.com',
  phone: '138****5678',
  bio: '热爱学习的程序员',
  avatar: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const accountSettings = reactive({
  twoFactorEnabled: false
})

const notificationSettings = reactive({
  emailCourseUpdates: true,
  emailLearningReminders: true,
  emailMarketing: false,
  browserNotifications: true,
  studyReminders: true
})

const privacySettings = reactive({
  publicProfile: true,
  showProgress: true,
  learningAnalytics: true,
  productImprovement: false
})

const preferences = reactive({
  language: 'zh-CN',
  videoQuality: 'auto',
  autoPlayNext: true,
  playbackSpeed: '1',
  dailyGoal: '60',
  reminderTime: dayjs('09:00', 'HH:mm')
})

// 方法
const navigateTo = (path: string) => {
  router.push(path)
}

const handleSettingMenuClick = ({ key }: { key: string }) => {
  activeTab.value = key
}

const changeAvatar = () => {
  message.info('更换头像功能开发中...')
}

const removeAvatar = () => {
  profileForm.avatar = ''
  message.success('头像已移除')
}

const updateProfile = async () => {
  saving.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('个人资料更新成功')
  } catch (error) {
    message.error('更新失败，请重试')
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }

  changingPassword.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('密码修改成功')
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  } catch (error) {
    message.error('密码修改失败，请重试')
  } finally {
    changingPassword.value = false
  }
}

const showDeleteAccountModal = () => {
  Modal.confirm({
    title: '确认删除账户？',
    content: '此操作将永久删除您的账户和所有数据，无法恢复。',
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      message.info('删除账户功能开发中...')
    }
  })
}

const savePreferences = async () => {
  savingPreferences.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('偏好设置保存成功')
  } catch (error) {
    message.error('保存失败，请重试')
  } finally {
    savingPreferences.value = false
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.settings-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* 管理员功能区域 */
.admin-shortcuts {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.admin-shortcuts h3 {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.admin-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.admin-icon {
  font-size: 24px;
  color: white;
}

.admin-info h4 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.admin-info p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 14px;
}

/* 个人设置区域 */
.personal-settings {
  display: flex;
  min-height: 600px;
}

.settings-sidebar {
  width: 240px;
  border-right: 1px solid #f0f0f0;
  padding: 24px 0;
}

.settings-main {
  flex: 1;
  padding: 32px;
}

.settings-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 32px 0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-group {
  margin-bottom: 40px;
}

.setting-group h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.setting-info p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.danger-zone {
  border: 1px solid #ff4d4f;
  border-radius: 8px;
  padding: 20px;
  background: #fff2f0;
}

.danger-zone h3 {
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .admin-cards {
    grid-template-columns: 1fr;
  }

  .personal-settings {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
