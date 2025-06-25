<template>
  <BaseLayout>
    <template #content>
      <div class="admin-page">
        <div class="page-header">
          <h1 class="page-title">Access Right Management</h1>
          <p class="page-description">
            Manage user access rights and permissions across the Oslo kindergarten system.
          </p>
        </div>

        <div class="content-area">
          <div class="placeholder-content">
            <div class="icon">
              <i class="pi pi-shield text-6xl text-blue-600"></i>
            </div>
            <h2>Access Right Management</h2>
            <p>This page will contain tools for managing user access rights and permissions.</p>
            <div class="features">
              <ul>
                <li>User permission management</li>
                <li>Role-based access control</li>
                <li>Access level configuration</li>
                <li>Permission audit logs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/core/BaseLayout.vue'
</script>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 7xl;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6b7280;
  font-size: 1.125rem;
}

.content-area {
  background: white;
  border-radius: 0.75rem;
  padding: 3rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.placeholder-content {
  text-align: center;
  max-width: 32rem;
  margin: 0 auto;
}

.icon {
  margin-bottom: 1.5rem;
}

.placeholder-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.placeholder-content p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.features ul {
  text-align: left;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.features li {
  padding: 0.5rem 0;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.features li:last-child {
  border-bottom: none;
}
</style>
