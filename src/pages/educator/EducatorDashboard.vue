<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'
import {
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  User,
  GraduationCap,
  TrendingUp,
  Bell,
  Star,
  Shield
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()
const isLoading = ref(true)

onMounted(() => {
  const timer = setTimeout(() => {
    isLoading.value = false
  }, 1500)
  return () => clearTimeout(timer)
})

// Mock data for demonstration
const children = [
  {
    id: 'emma-hansen',
    name: 'Emma Hansen',
    age: '3 years',
    group: 'Blue Group',
    status: 'present'
  },
  {
    id: 'oliver-hansen',
    name: 'Oliver Hansen',
    age: '5 years',
    group: 'Red Group',
    status: 'absent'
  }
]

const messages = [
  {
    id: 1,
    from: 'Maria Hansen',
    subject: 'Emma will be late today',
    date: '2024-03-18',
    unread: true,
    type: 'notification'
  },
  {
    id: 2,
    from: 'Oslo Municipality',
    subject: 'New guidelines for outdoor activities',
    date: '2024-03-16',
    unread: false,
    type: 'announcement'
  }
]

const activities = [
  {
    id: 1,
    title: 'Morning Circle',
    time: '09:00 - 09:30',
    group: 'All Groups',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Outdoor Play',
    time: '10:00 - 11:30',
    group: 'Blue Group',
    status: 'upcoming'
  }
]

const stats = [
  { label: 'Total Children', value: '24', change: '+2', trend: 'up' },
  { label: 'Present Today', value: '22', change: '-1', trend: 'down' },
  { label: 'Activities Today', value: '5', change: '0', trend: 'stable' },
  { label: 'Unread Messages', value: '3', change: '+2', trend: 'up' }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'present':
      return {
        severity: 'success',
        label: t('common.status.present', 'Present')
      }
    case 'absent':
      return {
        severity: 'danger',
        label: t('common.status.absent', 'Absent')
      }
    case 'completed':
      return {
        severity: 'success',
        label: t('common.status.completed', 'Completed')
      }
    case 'upcoming':
      return {
        severity: 'info',
        label: t('common.status.upcoming', 'Upcoming')
      }
    default:
      return {
        severity: 'info',
        label: 'Unknown'
      }
  }
}

const handleNewActivity = () => {
  router.push('/educator/new-activity')
}
</script>

<template>
  <div v-if="isLoading" class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div class="space-y-4">
        <Skeleton class="h-12 w-96" />
        <Skeleton class="h-6 w-80" />
        <Skeleton class="h-5 w-32" />
      </div>
      <Skeleton class="h-14 w-48" />
    </div>

    <!-- Stats skeleton -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="p-6 border-1 surface-border border-round surface-card">
        <div class="flex items-center justify-between">
          <div class="space-y-3">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-8 w-12" />
          </div>
          <Skeleton class="h-12 w-12 border-round-xl" />
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="p-6 border-1 surface-border border-round surface-card">
        <div class="flex items-center space-x-4">
          <Skeleton class="h-14 w-14 border-round-xl" />
          <div class="space-y-2 flex-1">
            <Skeleton class="h-5 w-24" />
            <Skeleton class="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <Skeleton class="h-80 w-full border-round-xl" />
    </div>
  </div>

  <div v-else class="space-y-8 animate-fade-in">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />

    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-900">{{ t('educator.dashboard.welcome', 'Welcome back') }}, {{ auth.user?.name }}</h1>
        <p class="text-500 mt-1">{{ t('educator.dashboard.subtitle', 'Here\'s your daily overview') }}</p>
      </div>
      <Button @click="handleNewActivity" severity="primary" icon="pi pi-plus" :label="t('educator.dashboard.newActivity', 'New Activity')" />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="(stat, index) in stats" :key="index" class="p-6">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-500">{{ stat.label }}</p>
              <div class="flex items-baseline mt-1">
                <p class="text-2xl font-semibold text-900">{{ stat.value }}</p>
                <span :class="[
                  'ml-2 text-sm font-medium',
                  stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'down' ? 'text-red-600' : 'text-500'
                ]">
                  {{ stat.change }}
                </span>
              </div>
            </div>
            <div :class="[
              'w-12 h-12 border-round-xl flex items-center justify-center',
              stat.trend === 'up' ? 'bg-green-50 text-green-600' :
              stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
            ]">
              <i class="pi pi-chart-line text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Children Overview -->
    <Card>
      <template #title>
        {{ t('educator.dashboard.children', 'Children') }}
      </template>
      <template #subtitle>
        {{ t('educator.dashboard.childrenDescription', 'Today\'s attendance and group overview') }}
      </template>
      <template #content>
        <div class="space-y-4">
          <div v-for="child in children" :key="child.id" class="flex items-center justify-between p-4 bg-gray-50 border-round-lg">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-primary-50 border-round-lg flex items-center justify-center">
                <i class="pi pi-user text-primary"></i>
              </div>
              <div>
                <h4 class="font-medium text-900">{{ child.name }}</h4>
                <p class="text-sm text-500">{{ child.group }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Tag :severity="getStatusBadge(child.status).severity" :value="getStatusBadge(child.status).label" />
              <Button icon="pi pi-chevron-right" text rounded />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Activities -->
    <Card>
      <template #title>
        {{ t('educator.dashboard.activities', 'Activities') }}
      </template>
      <template #subtitle>
        {{ t('educator.dashboard.activitiesDescription', 'Today\'s schedule and activities') }}
      </template>
      <template #content>
        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.id" class="flex items-center justify-between p-4 bg-gray-50 border-round-lg">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-primary-50 border-round-lg flex items-center justify-center">
                <i class="pi pi-calendar text-primary"></i>
              </div>
              <div>
                <h4 class="font-medium text-900">{{ activity.title }}</h4>
                <p class="text-sm text-500">{{ activity.time }} - {{ activity.group }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Tag :severity="getStatusBadge(activity.status).severity" :value="getStatusBadge(activity.status).label" />
              <Button icon="pi pi-chevron-right" text rounded />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Messages -->
    <Card>
      <template #title>
        {{ t('educator.dashboard.messages', 'Messages') }}
      </template>
      <template #subtitle>
        {{ t('educator.dashboard.messagesDescription', 'Recent communications from parents and staff') }}
      </template>
      <template #content>
        <div class="space-y-4">
          <div v-for="msg in messages" :key="msg.id" class="flex items-center justify-between p-4 bg-gray-50 border-round-lg">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-primary-50 border-round-lg flex items-center justify-center">
                <i class="pi pi-envelope text-primary"></i>
              </div>
              <div>
                <h4 class="font-medium text-900">{{ msg.from }}</h4>
                <p class="text-sm text-500">{{ msg.subject }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <Tag v-if="msg.unread" severity="info" :value="t('common.unread', 'Unread')" />
              <Button icon="pi pi-chevron-right" text rounded />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
