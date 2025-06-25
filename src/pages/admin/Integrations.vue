<template>
  <BaseLayout>
    <template #content>
      <div class="integrations-admin p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">System Integrations</h1>
            <p class="mt-1 text-gray-600">Manage external system integrations</p>
          </div>
          <Button icon="pi pi-plus" label="Add Integration" class="p-button-primary" />
        </div>

        <Card>
          <template #title>Active Integrations</template>
          <template #content>
            <p class="text-gray-600">Integration management functionality will be implemented here.</p>
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
