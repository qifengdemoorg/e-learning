#!/bin/bash
# 开发环境快速搭建脚本

set -e

echo "🚀 开始搭建 E-Learning Platform 开发环境..."

# 检查必要的软件是否已安装
check_requirements() {
    echo "📋 检查系统要求..."
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    # 检查 Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    # 检查 Git
    if ! command -v git &> /dev/null; then
        echo "❌ Git 未安装，请先安装 Git"
        exit 1
    fi
    
    echo "✅ 系统要求检查通过"
}

# 设置环境变量
setup_environment() {
    echo "🔧 设置环境变量..."
    
    # 复制环境变量文件
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# 数据库配置
DB_HOST=database
DB_PORT=3306
DB_NAME=elearning
DB_USERNAME=elearning_user
DB_PASSWORD=elearning_pass
MYSQL_ROOT_PASSWORD=rootpass

# JWT 配置
JWT_SECRET=dev-jwt-secret-key-please-change-in-production
JWT_EXPIRATION=3600

# 应用配置
SPRING_PROFILES_ACTIVE=development
SERVER_PORT=8080

# 前端配置
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=Contoso E-Learning Platform (Dev)
VITE_APP_DEBUG=true
EOF
        echo "✅ 环境变量文件已创建"
    else
        echo "ℹ️  环境变量文件已存在"
    fi
}

# 创建必要的目录结构
create_directories() {
    echo "📁 创建项目目录结构..."
    
    # 创建前端目录结构
    mkdir -p frontend/{src,public,tests}
    mkdir -p frontend/src/{components,views,router,stores,services,utils,assets}
    
    # 创建后端目录结构
    mkdir -p backend/src/{main,test}
    mkdir -p backend/src/main/{java,resources}
    mkdir -p backend/src/test/java
    
    # 创建其他目录
    mkdir -p database/{migrations,seeds}
    mkdir -p deployment/{docker,kubernetes,nginx}
    mkdir -p scripts
    
    echo "✅ 目录结构创建完成"
}

# 启动开发环境
start_development() {
    echo "🐳 启动开发环境..."
    
    # 构建并启动服务
    docker-compose -f docker-compose.dev.yml up -d
    
    echo "⏳ 等待服务启动..."
    sleep 30
    
    # 检查服务状态
    echo "🔍 检查服务状态..."
    docker-compose -f docker-compose.dev.yml ps
}

# 验证安装
verify_installation() {
    echo "✅ 验证安装..."
    
    # 检查数据库连接
    echo "📊 检查数据库连接..."
    if docker exec elearning-db-dev mysql -u elearning_user -pelearning_pass -e "SELECT 1" > /dev/null 2>&1; then
        echo "✅ 数据库连接正常"
    else
        echo "❌ 数据库连接失败"
        exit 1
    fi
    
    # 检查后端健康状态
    echo "🔧 检查后端服务..."
    sleep 10
    if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "✅ 后端服务正常"
    else
        echo "⚠️  后端服务尚未完全启动，请稍后检查"
    fi
    
    # 检查前端服务
    echo "🌐 检查前端服务..."
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 前端服务正常"
    else
        echo "⚠️  前端服务尚未完全启动，请稍后检查"
    fi
}

# 显示访问信息
show_access_info() {
    echo ""
    echo "🎉 开发环境搭建完成！"
    echo ""
    echo "📋 访问信息："
    echo "  前端应用: http://localhost:3000"
    echo "  后端 API: http://localhost:8080"
    echo "  API 文档: http://localhost:8080/swagger-ui.html"
    echo "  数据库:   localhost:3306"
    echo ""
    echo "👤 默认账户："
    echo "  管理员: admin@contoso.com / admin123"
    echo "  讲师:   teacher@contoso.com / teacher123"
    echo "  学员:   student@contoso.com / student123"
    echo ""
    echo "🔧 常用命令："
    echo "  查看日志: docker-compose -f docker-compose.dev.yml logs -f"
    echo "  停止服务: docker-compose -f docker-compose.dev.yml down"
    echo "  重启服务: docker-compose -f docker-compose.dev.yml restart"
    echo ""
}

# 主执行流程
main() {
    check_requirements
    setup_environment
    create_directories
    start_development
    verify_installation
    show_access_info
}

# 错误处理
trap 'echo "❌ 安装过程中出现错误，请检查日志"; exit 1' ERR

# 执行主程序
main