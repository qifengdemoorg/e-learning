# 技术规格说明 - E-Learning Platform

## 概述

本文档详细说明了 Contoso.tech 企业在线培训平台的技术实现规格，包含前端、后端、数据库等各个组件的技术选型和实现细节。

## Phase 1 (MVP) 功能清单

### ✅ 已设计功能

#### 1. 基础用户管理
- [x] 用户注册与登录系统设计
- [x] 基于 JWT 的身份认证
- [x] 角色权限管理 (RBAC)
- [x] 个人资料管理界面
- [x] 密码重置流程

#### 2. 基础课程管理
- [x] 课程 CRUD 操作设计
- [x] 课程分类层级结构
- [x] 课程内容管理 (文本、视频、文档)
- [x] 课程发布状态管理
- [x] 讲师课程管理界面

#### 3. 核心学习功能
- [x] 课程目录浏览界面
- [x] 课程详情展示页面
- [x] 学习进度跟踪系统
- [x] 课程完成标记功能
- [x] 学习历史记录

#### 4. 基本 UI 实现
- [x] 响应式主页面设计
- [x] 课程目录页面布局
- [x] 课程学习页面设计
- [x] 个人中心界面设计
- [x] 管理员后台界面

## 技术架构详细说明

### 前端架构 (Vue.js 3.x)

#### 核心依赖
```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.4.0",
    "element-plus": "^2.3.0",
    "@element-plus/icons-vue": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0",
    "typescript": "^5.0.0",
    "eslint": "^8.40.0",
    "@vue/eslint-config-typescript": "^11.0.0",
    "sass": "^1.62.0"
  }
}
```

#### 组件架构
```
src/
├── components/           # 可复用组件
│   ├── common/          # 通用组件
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── AppFooter.vue
│   │   └── LoadingSpinner.vue
│   ├── course/          # 课程相关组件
│   │   ├── CourseCard.vue
│   │   ├── CourseFilters.vue
│   │   └── CourseCurriculum.vue
│   └── user/            # 用户相关组件
│       ├── UserProfile.vue
│       └── UserAvatar.vue
├── views/               # 页面组件
│   ├── auth/           # 认证页面
│   ├── dashboard/      # 主页
│   ├── courses/        # 课程页面
│   └── profile/        # 个人中心
├── router/             # 路由配置
├── stores/             # 状态管理
├── services/           # API 服务
└── utils/              # 工具函数
```

#### 状态管理设计
```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    token: null,
    isAuthenticated: false,
    roles: []
  }),
  
  getters: {
    isAdmin: (state) => state.roles.includes('ADMIN'),
    isInstructor: (state) => state.roles.includes('INSTRUCTOR'),
    fullName: (state) => state.currentUser ? 
      `${state.currentUser.firstName} ${state.currentUser.lastName}` : ''
  },
  
  actions: {
    async login(credentials) { /* 登录逻辑 */ },
    async logout() { /* 登出逻辑 */ },
    async fetchProfile() { /* 获取用户信息 */ }
  }
})
```

### 后端架构 (Spring Boot)

#### 依赖配置
```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.1.0</version>
    </dependency>
</dependencies>
```

#### 实体关系设计
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    // 其他字段和方法...
}
```

#### 安全配置
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
            
        return http.build();
    }
}
```

### 数据库设计详情

#### 性能优化索引
```sql
-- 用户表关键索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);

-- 课程表关键索引
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_created ON courses(created_at);

-- 学习进度复合索引
CREATE INDEX idx_progress_user_course ON enrollments(user_id, course_id);
CREATE INDEX idx_progress_status ON enrollments(status, enrolled_at);

-- 章节进度索引
CREATE INDEX idx_lesson_progress_user ON user_lesson_progress(user_id, lesson_id);
CREATE INDEX idx_lesson_progress_status ON user_lesson_progress(status, last_accessed_at);
```

#### 数据库分区策略 (Phase 2)
```sql
-- 按月分区学习记录表
ALTER TABLE user_lesson_progress 
PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    -- 继续按月分区...
);
```

## API 设计规范

### RESTful API 约定
- 使用名词复数形式作为资源路径
- HTTP 方法语义化使用
- 统一的响应格式
- 适当的 HTTP 状态码

### 接口版本控制
```java
@RestController
@RequestMapping("/api/v1/courses")
@Validated
public class CourseController {
    
    @GetMapping
    public ResponseEntity<PagedResponse<CourseDTO>> getCourses(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categoryId
    ) {
        // 实现逻辑
    }
    
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<CourseDTO> createCourse(
        @Valid @RequestBody CreateCourseRequest request
    ) {
        // 实现逻辑
    }
}
```

### 数据传输对象 (DTO)
```java
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private CategoryDTO category;
    private UserDTO instructor;
    private int durationMinutes;
    private DifficultyLevel difficulty;
    private String coverImage;
    private boolean isPublished;
    private int enrollmentCount;
    private LocalDateTime createdAt;
    
    // 构造器、getter、setter...
}
```

## 安全实现

### JWT 令牌管理
```java
@Component
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;
    
    public String generateToken(UserPrincipal userPrincipal) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        
        return Jwts.builder()
                .setSubject(userPrincipal.getId().toString())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

### 权限控制
```java
@PreAuthorize("hasRole('ADMIN') or (hasRole('INSTRUCTOR') and @courseService.isInstructor(#courseId, authentication.name))")
@PutMapping("/{courseId}")
public ResponseEntity<CourseDTO> updateCourse(
    @PathVariable Long courseId,
    @Valid @RequestBody UpdateCourseRequest request
) {
    // 更新课程逻辑
}
```

## 部署架构

### Docker 配置
```dockerfile
# 多阶段构建 - 后端
FROM maven:3.9.0-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-alpine
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appgroup app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Kubernetes 部署
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elearning-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: elearning-backend
  template:
    metadata:
      labels:
        app: elearning-backend
    spec:
      containers:
      - name: backend
        image: contoso/elearning-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          value: "mysql-service"
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
```

## 监控和日志

### 应用监控
```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
```

### 日志配置
```xml
<!-- logback-spring.xml -->
<configuration>
    <springProfile name="!prod">
        <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        <root level="INFO">
            <appender-ref ref="STDOUT" />
        </root>
    </springProfile>
    
    <springProfile name="prod">
        <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>logs/application.log</file>
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>logs/application.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
                <maxFileSize>100MB</maxFileSize>
                <maxHistory>30</maxHistory>
            </rollingPolicy>
            <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
                <providers>
                    <timestamp/>
                    <logLevel/>
                    <loggerName/>
                    <message/>
                    <mdc/>
                    <stackTrace/>
                </providers>
            </encoder>
        </appender>
        <root level="INFO">
            <appender-ref ref="FILE" />
        </root>
    </springProfile>
</configuration>
```

## 性能优化

### 数据库优化
- 合理的索引设计
- 查询优化和慢查询监控
- 连接池配置优化
- 读写分离 (Phase 2)

### 缓存策略
```java
@Service
@CacheConfig(cacheNames = "courses")
public class CourseService {
    
    @Cacheable(key = "#id")
    public CourseDTO getCourse(Long id) {
        // 查询课程逻辑
    }
    
    @CacheEvict(key = "#courseId")
    public void updateCourse(Long courseId, UpdateCourseRequest request) {
        // 更新课程逻辑
    }
}
```

### 前端优化
- 代码分割和懒加载
- 图片和静态资源优化
- Service Worker 缓存
- Bundle 分析和优化

## 测试策略

### 后端测试
```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class CourseServiceIntegrationTest {
    
    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Test
    void shouldCreateCourse() {
        // 集成测试逻辑
    }
}
```

### 前端测试
```javascript
// tests/unit/CourseCard.spec.js
import { mount } from '@vue/test-utils'
import CourseCard from '@/components/course/CourseCard.vue'

describe('CourseCard', () => {
  it('renders course information correctly', () => {
    const course = {
      id: 1,
      title: 'Test Course',
      description: 'Test Description'
    }
    
    const wrapper = mount(CourseCard, {
      props: { course }
    })
    
    expect(wrapper.text()).toContain('Test Course')
    expect(wrapper.text()).toContain('Test Description')
  })
})
```

## 扩展规划

### Phase 2 功能
- 实时视频会议集成
- 高级搜索和过滤
- 课程评价和评论系统
- 学习路径推荐
- 移动端应用

### Phase 3 功能
- AI 智能推荐系统
- 多语言支持
- 社交学习功能
- 高级数据分析
- 第三方系统集成