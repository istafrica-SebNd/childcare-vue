<template>
  <BaseLayout>
    <template #content>
      <div class="releases-admin p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Release Management</h1>
            <p class="mt-1 text-gray-600">Manage system releases and deployments</p>
          </div>
          <Button icon="pi pi-plus" label="Create Release" class="p-button-primary" />
        </div>

        <Card>
          <template #title>System Releases</template>
          <template #content>
            <p class="text-gray-600">Release management functionality will be implemented here.</p>
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
