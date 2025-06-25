<template>
  <BaseLayout>
    <template #content>
      <div class="admin-page">
        <h1>Role Permissions</h1>
        <p>Role permissions management page.</p>
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
}
</style>
