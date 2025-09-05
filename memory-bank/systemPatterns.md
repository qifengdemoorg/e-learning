# 系统模式与编码规范 - Contoso.tech 企业在线培训平台

本文档定义了 Contoso.tech 企业在线培训平台开发中使用的设计模式、编码风格和约定。所有新代码应遵循这些模式，以确保代码库的一致性和可维护性。

## 前端开发模式

### Vue 组件设计

#### 组件结构
```vue
<!-- 推荐的 Vue 组件结构 -->
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
// 导入
import { ref, computed, onMounted } from 'vue'
import { useStore } from '../stores/store'
import ChildComponent from './ChildComponent.vue'

// 属性定义
interface Props {
  propName: string
  propWithDefault?: number
}

const props = withDefaults(defineProps<Props>(), {
  propWithDefault: 0
})

// 事件
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete'): void
}>()

// 状态
const store = useStore()
const localState = ref('')

// 计算属性
const computedValue = computed(() => {
  return `${props.propName}: ${localState.value}`
})

// 方法
const handleAction = () => {
  localState.value = 'updated'
  emit('update', localState.value)
}

// 生命周期钩子
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
.component-name {
  /* 组件样式 */
}
</style>
```

#### 组件命名约定
- **文件名**: 使用 PascalCase，例如 `CourseCard.vue`, `UserProfile.vue`
- **组件名**: 使用 PascalCase，例如 `CourseCard`, `UserProfile`
- **实例名**: 使用 camelCase，例如 `courseCard`, `userProfile`

#### 组件分类

##### 1. 页面组件 (Pages)
- 对应路由的顶级组件
- 包含业务逻辑和数据获取
- 位于 `src/views/` 目录

```vue
<!-- 页面组件示例: CourseDetailsView.vue -->
<template>
  <div class="course-details-view">
    <CourseHeader :course="course" />
    <CourseTabs 
      :content="course.content"
      :reviews="reviews"
      @tab-change="handleTabChange" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import CourseHeader from '@/components/course/CourseHeader.vue'
import CourseTabs from '@/components/course/CourseTabs.vue'

const route = useRoute()
const courseStore = useCourseStore()
const course = ref({})
const reviews = ref([])

onMounted(async () => {
  const courseId = route.params.id as string
  course.value = await courseStore.fetchCourseDetails(courseId)
  reviews.value = await courseStore.fetchCourseReviews(courseId)
})

const handleTabChange = (tab: string) => {
  // 处理标签页切换
}
</script>
```

##### 2. 容器组件 (Containers)
- 包含业务逻辑和子组件协调
- 可能包含数据获取
- 位于 `src/components/containers/` 目录

##### 3. 展示组件 (Presentational)
- 专注于 UI 展示，无业务逻辑
- 通过 props 接收数据，通过事件发送用户操作
- 位于 `src/components/common/` 或按功能组织

```vue
<!-- 展示组件示例: CourseCard.vue -->
<template>
  <div class="course-card" @click="$emit('click', course.id)">
    <img :src="course.coverImage" :alt="course.title" class="course-card__image">
    <div class="course-card__content">
      <h3 class="course-card__title">{{ course.title }}</h3>
      <p class="course-card__description">{{ truncatedDescription }}</p>
      <div class="course-card__footer">
        <span class="course-card__rating">⭐ {{ course.rating }}</span>
        <span class="course-card__students">👥 {{ course.studentCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CourseProps {
  course: {
    id: string
    title: string
    description: string
    coverImage: string
    rating: number
    studentCount: number
  }
}

const props = defineProps<CourseProps>()
defineEmits<{ (e: 'click', id: string): void }>()

const truncatedDescription = computed(() => {
  return props.course.description.length > 100
    ? props.course.description.substring(0, 97) + '...'
    : props.course.description
})
</script>
```

### 状态管理模式

#### Pinia Store 结构
```ts
// 典型的 Pinia Store 结构
import { defineStore } from 'pinia'
import { apiClient } from '@/utils/api'
import type { Course, CourseFilters } from '@/types'

export const useCourseStore = defineStore('course', {
  // 状态定义
  state: () => ({
    courses: [] as Course[],
    currentCourse: null as Course | null,
    loading: false,
    error: null as string | null,
    filters: {
      category: null as string | null,
      level: null as string | null,
      search: ''
    } as CourseFilters
  }),
  
  // 计算属性
  getters: {
    filteredCourses: (state) => {
      return state.courses.filter(course => {
        // 过滤逻辑
        return true
      })
    },
    
    courseById: (state) => {
      return (id: string) => state.courses.find(course => course.id === id)
    }
  },
  
  // 动作
  actions: {
    // 异步操作
    async fetchCourses() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiClient.get('/courses', { params: this.filters })
        this.courses = response.data
      } catch (err: any) {
        this.error = err.message || '加载课程失败'
        console.error('Failed to fetch courses:', err)
      } finally {
        this.loading = false
      }
    },
    
    // 同步操作
    updateFilters(filters: Partial<CourseFilters>) {
      this.filters = { ...this.filters, ...filters }
    },
    
    clearFilters() {
      this.filters = {
        category: null,
        level: null,
        search: ''
      }
    }
  }
})
```

#### 状态管理原则
1. **状态隔离**: 按领域划分 store，避免单一巨大 store
2. **状态最小化**: 只存储必要的状态，避免衍生状态
3. **操作封装**: 所有状态修改通过 actions 进行
4. **错误处理**: 在 actions 中统一处理 API 错误

### API 调用模式

#### Axios 实例配置
```ts
// src/utils/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 处理常见错误
    if (error.response) {
      // 处理 401 未授权错误
      if (error.response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      }
      
      // 处理 422 表单验证错误
      if (error.response.status === 422) {
        return Promise.reject({
          message: '表单验证失败',
          errors: error.response.data.errors
        })
      }
    }
    
    return Promise.reject(error)
  }
)
```

#### API 服务模式
```ts
// src/services/courseService.ts
import { apiClient } from '@/utils/api'
import type { Course, CourseFilters, CourseCreateData } from '@/types'

export const courseService = {
  // 获取课程列表
  async getCourses(filters: CourseFilters) {
    const response = await apiClient.get('/courses', { params: filters })
    return response.data
  },
  
  // 获取单个课程详情
  async getCourseById(id: string) {
    const response = await apiClient.get(`/courses/${id}`)
    return response.data
  },
  
  // 创建新课程
  async createCourse(data: CourseCreateData) {
    const response = await apiClient.post('/courses', data)
    return response.data
  },
  
  // 更新课程
  async updateCourse(id: string, data: Partial<CourseCreateData>) {
    const response = await apiClient.put(`/courses/${id}`, data)
    return response.data
  },
  
  // 删除课程
  async deleteCourse(id: string) {
    const response = await apiClient.delete(`/courses/${id}`)
    return response.data
  }
}
```

### 路由设计模式

#### 路由配置
```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 路由定义
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('@/views/CoursesView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/courses/:id',
    name: 'CourseDetails',
    component: () => import('@/views/CourseDetailsView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/learning/:id',
    name: 'Learning',
    component: () => import('@/views/LearningView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // 检查是否为已登录用户专属页面
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }
  
  // 检查角色权限
  if (to.meta.roles && !authStore.hasRole(to.meta.roles)) {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router
```

## 后端开发模式

### 控制器模式
```java
// 典型的 Spring Boot 控制器
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    
    @GetMapping
    public ResponseEntity<Page<CourseResponse>> getCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        CourseFilter filter = CourseFilter.builder()
                .category(category)
                .level(level)
                .search(search)
                .build();
                
        Page<CourseResponse> courses = courseService.findCourses(filter, page, size);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable String id) {
        CourseResponse course = courseService.findById(id);
        return ResponseEntity.ok(course);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        CourseResponse created = courseService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("@coursePermissionEvaluator.canEdit(authentication, #id)")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable String id,
            @Valid @RequestBody CourseRequest request) {
        
        CourseResponse updated = courseService.update(id, request);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("@coursePermissionEvaluator.canDelete(authentication, #id)")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 服务层模式
```java
// 典型的服务层实现
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    
    @Override
    public Page<CourseResponse> findCourses(CourseFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Specification<Course> spec = Specification.where(null);
        
        if (StringUtils.hasText(filter.getCategory())) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("category").get("name"), filter.getCategory()));
        }
        
        if (StringUtils.hasText(filter.getLevel())) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("level"), filter.getLevel()));
        }
        
        if (StringUtils.hasText(filter.getSearch())) {
            String searchTerm = "%" + filter.getSearch().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("title")), searchTerm),
                    cb.like(cb.lower(root.get("description")), searchTerm)
                ));
        }
        
        Page<Course> courses = courseRepository.findAll(spec, pageable);
        return courses.map(courseMapper::toResponse);
    }
    
    @Override
    public CourseResponse findById(String id) {
        Course course = getCourseOrThrow(id);
        return courseMapper.toResponse(course);
    }
    
    @Override
    @Transactional
    public CourseResponse create(CourseRequest request) {
        User currentUser = getCurrentUser();
        Category category = getCategoryOrThrow(request.getCategoryId());
        
        Course course = courseMapper.toEntity(request);
        course.setInstructor(currentUser);
        course.setCategory(category);
        course.setStatus(CourseStatus.DRAFT);
        
        Course saved = courseRepository.save(course);
        return courseMapper.toResponse(saved);
    }
    
    @Override
    @Transactional
    public CourseResponse update(String id, CourseRequest request) {
        Course course = getCourseOrThrow(id);
        Category category = getCategoryOrThrow(request.getCategoryId());
        
        courseMapper.updateEntity(request, course);
        course.setCategory(category);
        
        Course updated = courseRepository.save(course);
        return courseMapper.toResponse(updated);
    }
    
    @Override
    @Transactional
    public void delete(String id) {
        Course course = getCourseOrThrow(id);
        courseRepository.delete(course);
    }
    
    private Course getCourseOrThrow(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }
    
    private Category getCategoryOrThrow(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
```

### 数据层模式
```java
// 典型的 JPA 仓库
@Repository
public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {
    
    List<Course> findByInstructorId(String instructorId);
    
    List<Course> findByCategoryId(String categoryId);
    
    @Query("SELECT c FROM Course c WHERE c.status = :status AND c.title LIKE %:keyword%")
    List<Course> searchByTitleAndStatus(@Param("keyword") String keyword, @Param("status") CourseStatus status);
    
    @Query("SELECT c FROM Course c JOIN c.enrollments e WHERE e.user.id = :userId")
    List<Course> findEnrolledCoursesByUserId(@Param("userId") String userId);
    
    @Modifying
    @Query("UPDATE Course c SET c.status = :status WHERE c.id = :id")
    void updateStatus(@Param("id") String id, @Param("status") CourseStatus status);
}
```

### DTO 映射模式
```java
// 使用 MapStruct 进行 DTO 映射
@Mapper(componentModel = "spring")
public interface CourseMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instructor", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "enrollments", ignore = true)
    @Mapping(target = "lessons", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Course toEntity(CourseRequest request);
    
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "instructorName", source = "instructor.name")
    @Mapping(target = "enrollmentCount", expression = "java(course.getEnrollments().size())")
    CourseResponse toResponse(Course course);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "instructor", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "enrollments", ignore = true)
    @Mapping(target = "lessons", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(CourseRequest request, @MappingTarget Course course);
}
```

## 共享编码规范

### 命名约定

#### 前端命名约定
- **文件和目录**: 使用 kebab-case，例如 `course-card.vue`, `user-profile.ts`
- **组件**: 使用 PascalCase，例如 `CourseCard`, `UserProfile`
- **变量和函数**: 使用 camelCase，例如 `userData`, `fetchCourses()`
- **常量**: 使用 UPPER_SNAKE_CASE，例如 `MAX_ATTEMPTS`, `API_URL`
- **类型和接口**: 使用 PascalCase，例如 `CourseData`, `UserPreferences`

#### 后端命名约定
- **类**: 使用 PascalCase，例如 `UserService`, `CourseController`
- **方法和变量**: 使用 camelCase，例如 `findUserById()`, `courseList`
- **常量**: 使用 UPPER_SNAKE_CASE，例如 `MAX_UPLOAD_SIZE`, `DEFAULT_PAGE_SIZE`
- **包**: 使用全小写，例如 `com.contoso.elearning.service`
- **数据库表**: 使用 snake_case，例如 `user_courses`, `learning_progress`

### 注释规范

#### 前端注释
```typescript
/**
 * 获取用户已注册的课程列表
 * 
 * @param userId - 用户ID
 * @param options - 查询选项
 * @param options.status - 课程状态过滤 ('all', 'in-progress', 'completed')
 * @param options.sort - 排序方式 ('recent', 'title', 'progress')
 * @returns 课程列表和分页信息
 * 
 * @example
 * const { courses, pagination } = await getUserCourses('123', { status: 'in-progress' })
 */
async function getUserCourses(
  userId: string, 
  options: { status?: string; sort?: string } = {}
): Promise<{ courses: Course[]; pagination: Pagination }> {
  // 实现...
}
```

#### 后端注释
```java
/**
 * 更新用户课程学习进度
 * 
 * @param userId 用户ID
 * @param courseId 课程ID
 * @param lessonId 课时ID
 * @param progressData 进度数据，包含完成状态和学习时间
 * @return 更新后的进度信息
 * @throws ResourceNotFoundException 当用户、课程或课时不存在时
 * @throws AccessDeniedException 当用户无权访问此课程时
 */
@Transactional
public ProgressResponse updateProgress(
        String userId,
        String courseId,
        String lessonId,
        ProgressRequest progressData) {
    // 实现...
}
```

### 错误处理模式

#### 前端错误处理
```typescript
// API 调用错误处理
async function fetchData() {
  try {
    // 显示加载状态
    this.loading = true
    
    // 发起 API 请求
    const response = await apiClient.get('/endpoint')
    return response.data
  } catch (error) {
    // 错误分类处理
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 服务器返回错误状态码
        const status = error.response.status
        
        if (status === 401) {
          // 未授权，跳转到登录页面
          router.push('/login')
        } else if (status === 403) {
          // 权限不足
          showToast('权限不足，无法执行此操作')
        } else if (status === 404) {
          // 资源不存在
          showToast('请求的资源不存在')
        } else if (status === 422) {
          // 表单验证错误
          return { errors: error.response.data.errors }
        } else {
          // 其他 HTTP 错误
          showToast(`服务器错误: ${error.response.data.message || '未知错误'}`)
        }
      } else if (error.request) {
        // 请求已发出但未收到响应
        showToast('无法连接到服务器，请检查网络连接')
      } else {
        // 请求配置错误
        showToast('请求配置错误')
      }
    } else {
      // 非 Axios 错误
      showToast(`发生错误: ${error.message || '未知错误'}`)
    }
    
    // 记录错误
    console.error('API 调用失败:', error)
    return { error: true }
  } finally {
    // 隐藏加载状态
    this.loading = false
  }
}
```

#### 后端错误处理
```java
// 全局异常处理器
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDeniedException(AccessDeniedException ex) {
        ApiError apiError = new ApiError(HttpStatus.FORBIDDEN, "访问被拒绝: " + ex.getMessage());
        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> handleValidationException(MethodArgumentNotValidException ex) {
        ValidationError error = new ValidationError();
        error.setStatus(HttpStatus.UNPROCESSABLE_ENTITY.value());
        error.setMessage("表单验证失败");
        
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            error.addError(fieldError.getField(), fieldError.getDefaultMessage());
        });
        
        return new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusinessException(BusinessException ex) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, ex.getMessage());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex) {
        log.error("未处理的异常", ex);
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "服务器内部错误");
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### 测试模式

#### 前端单元测试
```typescript
// 使用 Vitest 的组件测试
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CourseCard from '@/components/course/CourseCard.vue'

describe('CourseCard.vue', () => {
  let wrapper
  const mockCourse = {
    id: 'course-1',
    title: 'Vue Masterclass',
    description: 'Learn Vue.js from scratch',
    coverImage: '/images/vue.jpg',
    rating: 4.5,
    studentCount: 150
  }
  
  beforeEach(() => {
    wrapper = mount(CourseCard, {
      props: {
        course: mockCourse
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
  })
  
  it('renders course title correctly', () => {
    expect(wrapper.find('.course-card__title').text()).toBe('Vue Masterclass')
  })
  
  it('truncates long descriptions', async () => {
    await wrapper.setProps({
      course: {
        ...mockCourse,
        description: 'A'.repeat(150) // 超长描述
      }
    })
    
    const description = wrapper.find('.course-card__description').text()
    expect(description.length).toBeLessThan(105) // 100 + '...'
    expect(description.endsWith('...')).toBe(true)
  })
  
  it('emits click event with course id when clicked', async () => {
    await wrapper.find('.course-card').trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
    expect(wrapper.emitted().click[0]).toEqual(['course-1'])
  })
})
```

#### 后端单元测试
```java
// 使用 JUnit 5 和 Mockito 的服务层测试
@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private CourseMapper courseMapper;
    
    @InjectMocks
    private CourseServiceImpl courseService;
    
    @Test
    void findById_ShouldReturnCourse_WhenIdExists() {
        // Arrange
        String courseId = "course-123";
        Course course = new Course();
        course.setId(courseId);
        course.setTitle("Test Course");
        
        CourseResponse expectedResponse = new CourseResponse();
        expectedResponse.setId(courseId);
        expectedResponse.setTitle("Test Course");
        
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        when(courseMapper.toResponse(course)).thenReturn(expectedResponse);
        
        // Act
        CourseResponse result = courseService.findById(courseId);
        
        // Assert
        assertNotNull(result);
        assertEquals(courseId, result.getId());
        assertEquals("Test Course", result.getTitle());
        
        verify(courseRepository).findById(courseId);
        verify(courseMapper).toResponse(course);
    }
    
    @Test
    void findById_ShouldThrowException_WhenIdNotExists() {
        // Arrange
        String courseId = "non-existent";
        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            courseService.findById(courseId);
        });
        
        verify(courseRepository).findById(courseId);
        verifyNoInteractions(courseMapper);
    }
    
    @Test
    void create_ShouldReturnNewCourse() {
        // Arrange
        String categoryId = "category-123";
        String userId = "user-123";
        
        CourseRequest request = new CourseRequest();
        request.setTitle("New Course");
        request.setCategoryId(categoryId);
        
        User currentUser = new User();
        currentUser.setId(userId);
        
        Category category = new Category();
        category.setId(categoryId);
        
        Course newCourse = new Course();
        newCourse.setTitle("New Course");
        
        Course savedCourse = new Course();
        savedCourse.setId("course-new");
        savedCourse.setTitle("New Course");
        
        CourseResponse expectedResponse = new CourseResponse();
        expectedResponse.setId("course-new");
        expectedResponse.setTitle("New Course");
        
        // Mock security context
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(currentUser));
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(courseMapper.toEntity(request)).thenReturn(newCourse);
        when(courseRepository.save(any(Course.class))).thenReturn(savedCourse);
        when(courseMapper.toResponse(savedCourse)).thenReturn(expectedResponse);
        
        // Act
        CourseResponse result = courseService.create(request);
        
        // Assert
        assertNotNull(result);
        assertEquals("course-new", result.getId());
        assertEquals("New Course", result.getTitle());
        
        verify(userRepository).findByUsername("testuser");
        verify(categoryRepository).findById(categoryId);
        verify(courseMapper).toEntity(request);
        verify(courseRepository).save(any(Course.class));
        verify(courseMapper).toResponse(savedCourse);
    }
}
```

## 安全性模式

### 前端安全实践
1. **输入验证**: 所有用户输入在客户端和服务器端都进行验证
2. **XSS 防护**: 使用 Vue 的内置转义和 CSP 策略
3. **认证状态管理**: 安全存储 JWT，定期刷新
4. **敏感数据处理**: 不在前端存储敏感信息，不存储明文密码
5. **CSRF 防护**: 对非 GET 请求使用 CSRF 令牌

### 后端安全实践
1. **身份验证**: 使用 JWT 和适当的过期策略
2. **授权**: 使用 Spring Security 的 `@PreAuthorize` 和表达式
3. **密码存储**: 使用 BCrypt 哈希算法存储密码
4. **API 安全**: 实现请求频率限制，防止暴力攻击
5. **数据验证**: 使用 Bean Validation 进行输入验证

## 性能优化模式

### 前端性能优化
1. **代码分割**: 路由级别的懒加载
2. **缓存策略**: 合理使用浏览器缓存和应用缓存
3. **资源优化**: 图片压缩，CSS/JS 压缩，Tree Shaking
4. **渲染优化**: 虚拟列表，懒加载图片，按需渲染

### 后端性能优化
1. **数据库优化**: 合理使用索引，查询优化
2. **缓存策略**: 结果缓存，数据缓存
3. **连接池管理**: 合理配置数据库连接池
4. **异步处理**: 使用 `@Async` 处理耗时操作

## 部署与运维模式

### 容器化最佳实践
1. **多阶段构建**: 减小镜像大小
2. **非 root 用户**: 以非特权用户运行容器
3. **只读文件系统**: 提高安全性
4. **健康检查**: 实现合适的活跃性和就绪性探针

### Kubernetes 部署模式
1. **资源请求和限制**: 确保适当的资源分配
2. **自动扩缩容**: 配置 HPA 基于 CPU 和内存
3. **滚动更新**: 零停机部署
4. **ConfigMap 和 Secret**: 外部化配置

## 总结

遵循这些设计模式和编码约定，可以确保 Contoso.tech 企业在线培训平台的代码库保持一致、可维护和高质量。这些模式不是静态的，应随着项目发展和团队经验的积累而演进。
