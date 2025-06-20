<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'
import Messages from '@/components/communication/Messages.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()
const isLoading = ref(true)

// Check if we have a contact parameter from the query
const contactEmail = ref(route.query.contact as string || '')

onMounted(() => {
  const timer = setTimeout(() => {
    isLoading.value = false
  }, 500)
  return () => clearTimeout(timer)
})
</script>

<template>
  <div class="space-y-6">
    <AppBreadcrumb />

    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ t('caseworker.messages.title', 'Case Worker Messages') }}
        </h1>
        <p class="text-gray-600">
          {{ t('caseworker.messages.description', 'Communicate with families, staff, and kindergartens') }}
        </p>
      </div>
    </div>

    <!-- Messages Component -->
    <Messages
      :user-role="'case-manager'"
      :contact-filter="contactEmail"
      :show-staff-filter="true"
      :show-kindergarten-filter="true"
    />
  </div>
</template>

<style scoped>
/* Component specific styles if needed */
</style>
