<template>
  <div class="admin-categories-page">
    <div class="page-header">
      <h1>分类管理</h1>
      <p>管理课程分类和标签</p>
    </div>

    <div class="admin-content">
      <a-card title="分类管理" :bordered="false">
        <p>分类管理功能开发中...</p>
        <p>这里将包含分类列表、分类编辑、分类层级管理等功能。</p>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 分类管理页面 - 开发中
</script>

<style scoped>
.admin-categories-page {
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
