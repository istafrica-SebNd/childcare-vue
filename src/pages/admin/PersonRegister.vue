<template>
  <BaseLayout>
    <template #content>
      <div class="admin-page">
        <h1>Person Register</h1>
        <p>Person register management page.</p>
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
