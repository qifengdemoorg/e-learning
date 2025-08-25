<template>
  <div class="admin-users-page">
    <div class="page-header">
      <h1>用户管理</h1>
      <p>管理系统中的所有用户</p>
    </div>

    <div class="admin-content">
      <a-card title="用户管理" :bordered="false">
        <p>用户管理功能开发中...</p>
        <p>这里将包含用户列表、权限管理、用户详情等功能。</p>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 用户管理页面 - 开发中
</script>

<style scoped>
.admin-users-page {
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
