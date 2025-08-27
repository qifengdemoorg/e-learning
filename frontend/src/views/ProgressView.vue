<template>
  <div class="progress-page">
    <div class="page-header">
      <h1>学习进度</h1>
      <p>跟踪您的学习成果</p>
    </div>

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">
          <BookOutlined style="color: #1890ff;" />
        </div>
        <div class="stat-content">
          <h3>{{ totalCourses }}</h3>
          <p>总课程数</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <PlayCircleOutlined style="color: #52c41a;" />
        </div>
        <div class="stat-content">
          <h3>{{ activeCourses }}</h3>
          <p>进行中</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <CheckCircleOutlined style="color: #f5a623;" />
        </div>
        <div class="stat-content">
          <h3>{{ completedCourses }}</h3>
          <p>已完成</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <ClockCircleOutlined style="color: #722ed1;" />
        </div>
        <div class="stat-content">
          <h3>{{ totalHours }}h</h3>
          <p>学习时长</p>
        </div>
      </div>
    </div>

    <div class="progress-content">
      <div class="overall-progress">
        <h2>总体进度</h2>
        <div class="progress-chart">
          <a-progress
            type="circle"
            :percent="overallProgress"
            :size="120"
            :stroke-color="{
              '0%': '#108ee9',
              '100%': '#87d068',
            }"
          >
            <template #format="percent">
              <span style="font-size: 18px; font-weight: 600;">{{ percent }}%</span>
            </template>
          </a-progress>
          <div class="progress-info">
            <p>您已完成了 {{ overallProgress }}% 的学习目标</p>
            <p>继续保持，距离下一个里程碑还有 {{ 100 - overallProgress }}%</p>
          </div>
        </div>
      </div>

      <div class="course-progress">
        <h2>课程进度详情</h2>
        <div class="course-progress-list">
          <div v-for="course in courseProgress" :key="course.id" class="progress-item">
            <div class="course-info">
              <img :src="course.thumbnail" :alt="course.title" class="course-thumb" />
              <div class="course-details">
                <h3>{{ course.title }}</h3>
                <p>{{ course.instructor }}</p>
                <div class="course-meta">
                  <span>{{ course.completedLessons }}/{{ course.totalLessons }} 节课</span>
                  <span>学习时长: {{ course.studyTime }}h</span>
                </div>
              </div>
            </div>
            
            <div class="progress-detail">
              <div class="progress-bar">
                <a-progress 
                  :percent="course.progress" 
                  :stroke-color="getProgressColor(course.progress)"
                  :show-info="false"
                />
                <span class="progress-text">{{ course.progress }}%</span>
              </div>
              
              <div class="progress-actions">
                <a-button 
                  v-if="course.progress < 100" 
                  type="primary" 
                  size="small"
                  @click="continueLearning(course.id)"
                >
                  继续学习
                </a-button>
                <a-button 
                  v-else 
                  type="default" 
                  size="small"
                  @click="reviewCourse(course.id)"
                >
                  复习课程
                </a-button>
                <a-button 
                  type="link" 
                  size="small"
                  @click="viewCourseDetail(course.id)"
                >
                  查看详情
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="achievements">
        <h2>学习成就</h2>
        <div class="achievement-grid">
          <div v-for="achievement in achievements" :key="achievement.id" class="achievement-card">
            <div class="achievement-icon" :class="{ unlocked: achievement.unlocked }">
              <component :is="achievement.icon" />
            </div>
            <div class="achievement-info">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <div class="achievement-progress">
                <a-progress 
                  :percent="achievement.progress" 
                  size="small"
                  :stroke-color="achievement.unlocked ? '#52c41a' : '#d9d9d9'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="study-calendar">
        <h2>学习日历</h2>
        <div class="calendar-view">
          <a-calendar v-model:value="selectedDate" :fullscreen="false">
            <template #dateCellRender="{ current }">
              <div class="calendar-cell">
                <div 
                  v-if="getStudyData(current)" 
                  class="study-indicator"
                  :class="getStudyIntensity(getStudyData(current) || 0)"
                >
                  {{ getStudyData(current) }}h
                </div>
              </div>
            </template>
          </a-calendar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs, { Dayjs } from 'dayjs'
import {
  BookOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  FireOutlined,
  CrownOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const selectedDate = ref<Dayjs>(dayjs())

// 模拟数据
const totalCourses = ref(8)
const activeCourses = ref(3)
const completedCourses = ref(5)
const totalHours = ref(68)

const courseProgress = ref([
  {
    id: 1,
    title: 'Vue.js 3 完整教程',
    instructor: '张老师',
    progress: 75,
    completedLessons: 18,
    totalLessons: 24,
    studyTime: 15,
    thumbnail: 'https://via.placeholder.com/60x40/1890ff/ffffff?text=Vue'
  },
  {
    id: 2,
    title: 'TypeScript 从入门到精通',
    instructor: '李老师',
    progress: 45,
    completedLessons: 8,
    totalLessons: 18,
    studyTime: 9,
    thumbnail: 'https://via.placeholder.com/60x40/3178c6/ffffff?text=TS'
  },
  {
    id: 3,
    title: 'React 高级开发实战',
    instructor: '王老师',
    progress: 30,
    completedLessons: 10,
    totalLessons: 32,
    studyTime: 12,
    thumbnail: 'https://via.placeholder.com/60x40/61dafb/000000?text=React'
  },
  {
    id: 4,
    title: 'JavaScript 基础',
    instructor: '赵老师',
    progress: 100,
    completedLessons: 20,
    totalLessons: 20,
    studyTime: 16,
    thumbnail: 'https://via.placeholder.com/60x40/f7df1e/000000?text=JS'
  },
  {
    id: 5,
    title: 'CSS 进阶技巧',
    instructor: '周老师',
    progress: 100,
    completedLessons: 16,
    totalLessons: 16,
    studyTime: 12,
    thumbnail: 'https://via.placeholder.com/60x40/1572b6/ffffff?text=CSS'
  }
])

const achievements = ref([
  {
    id: 1,
    title: '初学者',
    description: '完成第一门课程',
    progress: 100,
    unlocked: true,
    icon: StarOutlined
  },
  {
    id: 2,
    title: '学习达人',
    description: '连续学习7天',
    progress: 85,
    unlocked: false,
    icon: FireOutlined
  },
  {
    id: 3,
    title: '课程专家',
    description: '完成5门课程',
    progress: 100,
    unlocked: true,
    icon: TrophyOutlined
  },
  {
    id: 4,
    title: '学习王者',
    description: '累计学习100小时',
    progress: 68,
    unlocked: false,
    icon: CrownOutlined
  }
])

// 模拟学习数据（最近30天）
const studyData = ref<Record<string, number>>({
  '2024-01-15': 2,
  '2024-01-16': 1.5,
  '2024-01-17': 3,
  '2024-01-18': 0.5,
  '2024-01-20': 2.5,
  '2024-01-22': 1,
  '2024-01-23': 2,
  '2024-01-24': 1.5,
  '2024-01-25': 3.5,
  '2024-01-26': 2,
  '2024-01-28': 1,
  '2024-01-29': 2.5,
  '2024-01-30': 1.5
})

// 计算属性
const overallProgress = computed(() => {
  const totalProgress = courseProgress.value.reduce((sum, course) => sum + course.progress, 0)
  return Math.round(totalProgress / courseProgress.value.length)
})

// 方法
const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#52c41a'
  if (progress >= 60) return '#1890ff'
  if (progress >= 40) return '#faad14'
  return '#f5222d'
}

const continueLearning = (courseId: number) => {
  alert(`继续学习课程 ${courseId}`)
  // router.push(`/course/${courseId}/learn`)
}

const reviewCourse = (courseId: number) => {
  alert(`复习课程 ${courseId}`)
  // router.push(`/course/${courseId}/review`)
}

const viewCourseDetail = (courseId: number) => {
  alert(`查看课程详情 ${courseId}`)
  // router.push(`/course/${courseId}`)
}

const getStudyData = (date: Dayjs) => {
  const dateStr = date.format('YYYY-MM-DD')
  return studyData.value[dateStr] || null
}

const getStudyIntensity = (hours: number) => {
  if (hours >= 3) return 'high'
  if (hours >= 1.5) return 'medium'
  return 'low'
}
</script>

<style scoped>
.progress-page {
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

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.stat-content p {
  color: #6b7280;
  margin: 4px 0 0 0;
}

.progress-content {
  display: grid;
  gap: 32px;
}

.overall-progress {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.overall-progress h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.progress-chart {
  display: flex;
  align-items: center;
  gap: 48px;
}

.progress-info p {
  margin: 8px 0;
  color: #6b7280;
}

.course-progress {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.course-progress h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.course-progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.progress-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.course-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.course-thumb {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.course-details h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.course-details p {
  color: #6b7280;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.course-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #9ca3af;
}

.progress-detail {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar .ant-progress {
  flex: 1;
}

.progress-text {
  font-weight: 600;
  color: #1f2937;
  min-width: 40px;
}

.progress-actions {
  display: flex;
  gap: 8px;
}

.achievements {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.achievements h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.achievement-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #f5f5f5;
  color: #d9d9d9;
}

.achievement-icon.unlocked {
  background: #f6ffed;
  color: #52c41a;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.achievement-info p {
  color: #6b7280;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.study-calendar {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.study-calendar h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.calendar-view {
  max-width: 400px;
}

.calendar-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.study-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: 600;
}

.study-indicator.low {
  background: #52c41a;
}

.study-indicator.medium {
  background: #1890ff;
}

.study-indicator.high {
  background: #f5222d;
}

@media (max-width: 768px) {
  .progress-chart {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .progress-item {
    flex-direction: column;
    gap: 16px;
  }

  .course-info {
    width: 100%;
  }

  .progress-detail {
    width: 100%;
  }

  .progress-actions {
    justify-content: center;
  }
}
</style>
