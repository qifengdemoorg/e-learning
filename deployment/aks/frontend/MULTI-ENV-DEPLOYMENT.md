# 多环境部署配置说明

## 概述

本项目支持多环境部署配置，通过分支自动部署到不同的 Kubernetes 命名空间。

## 部署环境

### 生产环境 (Production)
- **分支**: `main`
- **命名空间**: `elearning`
- **环境标识**: `production`
- **API URL**: `https://api.elearning.demo.com`

### UAT 环境 (User Acceptance Testing)
- **分支**: 所有非 `main` 分支 (如 `develop`, `feature/*`, `hotfix/*` 等)
- **命名空间**: `elearning-uat`
- **环境标识**: `uat`
- **API URL**: `https://api-uat.elearning.demo.com`

## 触发条件

### Pull Request
- 触发条件: 当 PR 修改了以下路径时
  - `frontend/**`
  - `.github/workflows/frontend-deploy.yml`
  - `deployment/aks/frontend/**`
- 行为: 构建和测试，但**不推送镜像**，不部署

### Push
- 触发条件: 所有分支的 push 事件
- 行为: 
  - 构建并推送 Docker 镜像到 ACR
  - 根据分支自动部署到对应环境

## 部署流程

### 1. 构建阶段 (Build Job)
```yaml
- 代码检出
- 安装依赖
- 类型检查
- 构建应用
- 构建 Docker 镜像
- 推送到 Azure Container Registry (ACR)
```

### 2. 部署阶段 (Deploy Job)
```yaml
- 确定部署目标 (命名空间和环境)
- Azure 登录
- 配置 kubectl
- 创建/更新命名空间
- 应用 ConfigMap
- 更新部署清单 (替换镜像变量)
- 应用 Kubernetes 资源
  - Deployment
  - Service
  - Ingress
  - HPA
- 等待部署完成
- 验证部署健康状态
```

## 镜像标签策略

- **main 分支**: `latest` 和 `main`
- **其他分支**: 使用分支名作为标签 (如 `feature-xxx`, `develop`)
- **PR**: 使用 `pr-{number}` 格式

## 配置文件说明

### Namespace 配置
- `01-namespace.yaml` - 生产环境命名空间
- `01-namespace-uat.yaml` - UAT 环境命名空间

### Deployment 配置
`03-deployment.yaml` 使用变量占位符：
```yaml
image: #{ACR_LOGIN_SERVER}#/#{CONTAINER_NAME}#:#{IMAGE_TAG}#
```

这些变量会在部署时被替换：
- `#{ACR_LOGIN_SERVER}#` -> ACR 登录服务器地址
- `#{CONTAINER_NAME}#` -> 容器名称 (elearning-frontend)
- `#{IMAGE_TAG}#` -> 镜像标签 (基于分支名)

### 环境变量配置
部署时会根据分支设置不同的环境变量：
```yaml
VITE_API_BASE_URL:
  - main 分支: https://api.elearning.demo.com
  - 其他分支: https://api-uat.elearning.demo.com
```

## 示例场景

### 场景 1: 开发新功能
```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交更改
git add .
git commit -m "feat: add new feature"

# 推送到远程 (自动触发部署到 elearning-uat)
git push origin feature/new-feature
```

### 场景 2: 发布到生产
```bash
# 切换到 main 分支
git checkout main

# 合并功能分支
git merge feature/new-feature

# 推送到远程 (自动触发部署到 elearning)
git push origin main
```

### 场景 3: 创建 Pull Request
```bash
# 创建 PR (触发构建和测试，但不部署)
gh pr create --title "New Feature" --body "Description"
```

## 监控和验证

部署完成后，可以通过以下命令验证：

```bash
# 查看生产环境
kubectl get all -n elearning

# 查看 UAT 环境
kubectl get all -n elearning-uat

# 查看特定部署的 Pod 日志
kubectl logs -n elearning -l app=elearning-frontend

# 查看部署状态
kubectl rollout status deployment/elearning-frontend -n elearning
```

## 回滚操作

如果需要回滚部署：

```bash
# 查看部署历史
kubectl rollout history deployment/elearning-frontend -n elearning

# 回滚到上一个版本
kubectl rollout undo deployment/elearning-frontend -n elearning

# 回滚到特定版本
kubectl rollout undo deployment/elearning-frontend -n elearning --to-revision=2
```

## 注意事项

1. **密钥管理**: 确保 GitHub Secrets 已正确配置
   - `ACR_LOGIN_SERVER`
   - `ACR_USERNAME`
   - `ACR_PASSWORD`
   - `AZURE_CREDENTIALS`

2. **命名空间隔离**: UAT 和 Production 环境完全隔离在不同的命名空间中

3. **资源配额**: 建议为不同命名空间设置资源配额，防止资源耗尽

4. **网络策略**: 考虑为不同环境配置不同的网络策略

5. **数据库连接**: 确保不同环境连接到对应的数据库实例

## 故障排查

### 部署失败
```bash
# 查看部署事件
kubectl describe deployment/elearning-frontend -n elearning

# 查看 Pod 状态
kubectl get pods -n elearning -l app=elearning-frontend

# 查看 Pod 日志
kubectl logs -n elearning -l app=elearning-frontend --tail=100
```

### 镜像拉取失败
```bash
# 验证镜像是否存在
az acr repository show-tags --name democrhk --repository elearning-frontend

# 检查 imagePullSecrets
kubectl get secrets -n elearning
```

## 未来改进

- [ ] 添加自动化测试到部署流程
- [ ] 实现金丝雀部署
- [ ] 添加部署通知 (Slack/Teams)
- [ ] 集成监控和告警
- [ ] 添加性能测试门控
