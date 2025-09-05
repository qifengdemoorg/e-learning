# Memory Bank

Memory Bank 是一个为 Contoso.tech 企业在线培训平台提供项目上下文和技术决策记录的文档集合。这些文档能帮助开发团队和GitHub Copilot更好地理解项目架构、当前目标和编码模式。

## 文件结构

Memory Bank 包含以下核心文件:

| 文件 | 描述 |
|------|------|
| [`productContext.md`](./productContext.md) | 项目概述、架构和关键技术栈 |
| [`activeContext.md`](./activeContext.md) | 当前开发周期的目标和任务 |
| [`decisionLog.md`](./decisionLog.md) | 重要架构和技术决策的记录和理由 |
| [`progress.md`](./progress.md) | 已完成的工作和下一步计划 |
| [`systemPatterns.md`](./systemPatterns.md) | 项目中使用的代码模式和约定 |

## 使用方式

Memory Bank 文件可以在以下场景中使用:

1. **新特性开发**：参考 `systemPatterns.md` 中的代码模式和约定
2. **项目引导**：通过 `productContext.md` 了解项目架构和技术栈
3. **任务规划**：参考 `activeContext.md` 和 `progress.md` 了解当前任务和进度
4. **技术决策**：查阅 `decisionLog.md` 了解过去的决策和理由

## 与 GitHub Copilot 集成

当使用 GitHub Copilot 时，可以引用 Memory Bank 文件以获得更有针对性的建议：

```
请根据 memory-bank/systemPatterns.md 中的模式，为用户服务创建一个新方法
```

## 维护指南

为确保 Memory Bank 的有效性，请定期更新以下内容：

1. 在做出重要技术决策时更新 `decisionLog.md`
2. 完成主要任务后更新 `progress.md`
3. 开始新的开发周期时更新 `activeContext.md`
4. 引入新的代码模式时更新 `systemPatterns.md`

通过定期维护这些文档，可以确保项目知识的连续性和可访问性。
