<template>
  <div class="admin-analytics-page">
    <div class="page-header">
      <h1>数据分析</h1>
      <p>查看系统运营数据和统计信息</p>
    </div>

    <div class="admin-content">
      <a-card title="数据分析" :bordered="false">
        <p>数据分析功能开发中...</p>
        <p>这里将包含用户统计、课程数据、学习进度分析等功能。</p>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 数据分析页面 - 开发中
</script>

<style scoped>
.admin-analytics-page {
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

.admin-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>
