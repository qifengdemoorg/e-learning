<template>
  <div class="admin-courses-page">
    <div class="page-header">
      <h1>课程管理</h1>
      <p>管理系统中的所有课程</p>
    </div>

    <div class="admin-content">
      <a-card title="课程管理" :bordered="false">
        <p>课程管理功能开发中...</p>
        <p>这里将包含课程列表、课程编辑、发布管理等功能。</p>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 课程管理页面 - 开发中
</script>

<style scoped>
.admin-courses-page {
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
