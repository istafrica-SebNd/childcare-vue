<template>
  <BaseLayout>
    <template #content>
      <div class="admin-analytics p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
            <p class="mt-1 text-gray-600">System analytics and performance insights</p>
          </div>
          <Button icon="pi pi-refresh" label="Refresh Data" class="p-button-outlined" />
        </div>

        <Card>
          <template #title>Analytics Dashboard</template>
          <template #content>
            <p class="text-gray-600">Analytics dashboard functionality will be implemented here.</p>
          </template>
        </Card>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
</script>
