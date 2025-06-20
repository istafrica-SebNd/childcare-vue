<script setup lang="ts">
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import Messages from '@/components/communication/Messages.vue'
</script>

<template>
  <BaseLayout>
    <template #content>
      <!-- Messages Component -->
      <Messages
        user-role="guardian"
        user-name="John Smith"
      />
    </template>
  </BaseLayout>
</template>

<style scoped>
/* Override the Messages component to fit within the layout */
:deep(.h-screen) {
  height: 100%;
}

:deep(.bg-gray-100) {
  background-color: transparent;
}

:deep(.p-4) {
  padding: 0;
}

:deep(.rounded-2xl) {
  border-radius: 0.75rem;
}
</style>
