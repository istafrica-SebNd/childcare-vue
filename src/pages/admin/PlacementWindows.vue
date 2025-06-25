<template>
  <BaseLayout>
    <template #content>
      <div class="placement-windows-admin p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Placement Windows</h1>
            <p class="mt-1 text-gray-600">Manage application and placement time periods</p>
          </div>
          <Button icon="pi pi-plus" label="Create Window" class="p-button-primary" />
        </div>

        <Card>
          <template #title>Placement Windows</template>
          <template #content>
            <p class="text-gray-600">Placement window management functionality will be implemented here.</p>
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
