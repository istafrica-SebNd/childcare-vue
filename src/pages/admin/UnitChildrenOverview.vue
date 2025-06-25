<template>
  <BaseLayout>
    <template #content>
      <div class="admin-page">
        <h1>Unit Children Overview</h1>
        <p>Unit children overview page.</p>
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
