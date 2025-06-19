<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()
const { t } = useI18n()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <Card class="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm text-center">
      <template #header>
        <div class="flex flex-col items-center gap-4 py-6">
          <span class="pi pi-exclamation-triangle text-4xl text-orange-500 bg-orange-100 rounded-2xl p-4 shadow-lg" />
          <div class="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">{{ t('common.notFoundTitle') || 'Page Not Found' }}</div>
        </div>
      </template>
      <template #content>
        <div class="space-y-6">
          <div class="text-slate-600">{{ t('common.notFoundMessage') || 'Sorry, the page you are looking for does not exist.' }}</div>
          <Button label="Go Home" class="w-full" icon="pi pi-home" @click="goHome" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.p-card {
  border-radius: 1.5rem;
}
</style> 