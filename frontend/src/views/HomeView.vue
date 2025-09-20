<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="page-title">欢迎回来，{{ userStore.userName }}！</h1>
      <p class="page-subtitle">继续您的学习之旅</p>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- 学习统计 -->
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon completed">
              <BookOutlined />
            </div>
            <div class="stat-info">
              <div class="stat-number">12</div>
              <div class="stat-label">已完成课程</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon progress">
              <ClockCircleOutlined />
            </div>
            <div class="stat-info">
              <div class="stat-number">3</div>
              <div class="stat-label">进行中课程</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon time">
              <FieldTimeOutlined />
            </div>
            <div class="stat-info">
              <div class="stat-number">45h</div>
              <div class="stat-label">学习时长</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon certificates">
              <TrophyOutlined />
            </div>
            <div class="stat-info">
              <div class="stat-number">8</div>
              <div class="stat-label">获得证书</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[24, 24]" style="margin-top: 24px">
      <!-- 继续学习 -->
      <a-col :xs="24" :lg="16">
        <a-card title="继续学习" class="continue-learning">
          <div class="course-list">
            <div class="course-item" v-for="course in continueLearningCourses" :key="course.id">
              <div class="course-thumbnail">
                <img :src="course.thumbnail" :alt="course.title" />
              </div>
              <div class="course-info">
                <h3 class="course-title">{{ course.title }}</h3>
                <p class="course-instructor">{{ course.instructor }}</p>
                <div class="course-progress">
                  <a-progress :percent="course.progress" :show-info="false" />
                  <span class="progress-text">{{ course.progress }}% 完成</span>
                </div>
              </div>
              <div class="course-action">
                <a-button type="primary" @click="continueCourse(course.id)">
                  继续学习
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 学习进度 -->
      <a-col :xs="24" :lg="8">
        <a-card title="本月学习进度" class="progress-card">
          <div class="progress-summary">
            <div class="progress-circle">
              <a-progress
                type="circle"
                :percent="75"
                :size="120"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }"
              />
            </div>
            <div class="progress-details">
              <div class="progress-item">
                <span class="label">本月目标</span>
                <span class="value">20 小时</span>
              </div>
              <div class="progress-item">
                <span class="label">已完成</span>
                <span class="value">15 小时</span>
              </div>
              <div class="progress-item">
                <span class="label">剩余</span>
                <span class="value">5 小时</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 推荐课程 -->
    <a-row style="margin-top: 24px">
      <a-col :span="24">
        <a-card title="推荐课程" class="recommended-courses">
          <div class="course-grid">
            <div class="course-card" v-for="course in recommendedCourses" :key="course.id">
              <div class="course-image">
                <img :src="course.thumbnail" :alt="course.title" />
              </div>
              <div class="course-content">
                <h4 class="course-title">{{ course.title }}</h4>
                <p class="course-description">{{ course.description }}</p>
                <div class="course-meta">
                  <span class="rating">
                    <StarFilled />
                    {{ course.rating }}
                  </span>
                  <span class="students">{{ course.students }} 学员</span>
                </div>
                <a-button type="primary" block @click="enrollCourse(course.id)">
                  开始学习
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  BookOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  TrophyOutlined,
  StarFilled
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 模拟数据
const continueLearningCourses = ref([
  {
    id: 1,
    title: 'Vue.js 3 完整教程',
    instructor: '张老师',
    progress: 65,
    thumbnail: '/images/courses/frontend-small.jpg'
  },
  {
    id: 2,
    title: 'TypeScript 从入门到精通',
    instructor: '李老师',
    progress: 45,
    thumbnail: '/images/courses/typescript-small.jpg'
  },
  {
    id: 3,
    title: 'React 高级开发实战',
    instructor: '王老师',
    progress: 30,
    thumbnail: '/images/courses/frontend-small.jpg'
  }
])

const recommendedCourses = ref([
  {
    id: 4,
    title: 'Node.js 后端开发',
    description: '学习使用 Node.js 构建高性能的后端应用',
    rating: 4.8,
    students: 1250,
    thumbnail: '/images/courses/backend.jpg'
  },
  {
    id: 5,
    title: 'Python 数据分析',
    description: '掌握 Python 数据分析的核心技术和工具',
    rating: 4.6,
    students: 890,
    thumbnail: '/images/courses/data.jpg'
  },
  {
    id: 6,
    title: 'UI/UX 设计基础',
    description: '学习现代 UI/UX 设计原理和实践',
    rating: 4.7,
    students: 650,
    thumbnail: '/images/courses/design.jpg'
  }
])

const continueCourse = (courseId: number) => {
  alert(`继续学习课程 ${courseId}`)
  // router.push(`/course/${courseId}/learn`)
}

const enrollCourse = (courseId: number) => {
  alert(`注册课程 ${courseId}`)
  // router.push(`/course/${courseId}`)
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.completed {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.stat-icon.progress {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.stat-icon.time {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.stat-icon.certificates {
  background: linear-gradient(135deg, #fa8c16, #ffa940);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.continue-learning {
  height: 100%;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.2s;
}

.course-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.course-thumbnail img {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.course-instructor {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.course-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.progress-card {
  height: 100%;
}

.progress-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.progress-details {
  width: 100%;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.progress-item:last-child {
  border-bottom: none;
}

.progress-item .label {
  color: #6b7280;
}

.progress-item .value {
  font-weight: 600;
  color: #1f2937;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.course-card {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.course-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.course-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.course-content {
  padding: 16px;
}

.course-card .course-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.course-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.rating {
  color: #fa8c16;
  display: flex;
  align-items: center;
  gap: 4px;
}

.students {
  color: #6b7280;
}

@media (max-width: 768px) {
  .course-item {
    flex-direction: column;
    text-align: center;
  }
  
  .course-progress {
    justify-content: center;
  }
  
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
