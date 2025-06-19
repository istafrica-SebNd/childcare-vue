<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const { t } = useI18n()

const scheduleItems = ref([
  {
    time: '08:00',
    activity: t('guardian.schedule.activities.arrival'),
    location: t('guardian.schedule.locations.mainRoom'),
    icon: 'pi-users',
    iconBg: 'bg-green-500',
    status: 'completed'
  },
  {
    time: '08:30',
    activity: t('guardian.schedule.activities.breakfast'),
    location: t('guardian.schedule.locations.diningRoom'),
    icon: 'pi-android',
    iconBg: 'bg-green-500',
    status: 'completed'
  },
  {
    time: '09:30',
    activity: t('guardian.schedule.activities.outdoorPlay'),
    location: t('guardian.schedule.locations.playground'),
    icon: 'pi-map-marker',
    iconBg: 'bg-blue-600',
    status: 'current'
  },
  {
    time: '11:00',
    activity: t('guardian.schedule.activities.learningTime'),
    location: t('guardian.schedule.locations.classroom'),
    icon: 'pi-users',
    iconBg: 'bg-gray-200',
    status: 'upcoming'
  },
  {
    time: '12:00',
    activity: t('guardian.schedule.activities.lunch'),
    location: t('guardian.schedule.locations.diningRoom'),
    icon: 'pi-android',
    iconBg: 'bg-gray-200',
    status: 'upcoming'
  },
  {
    time: '13:00',
    activity: t('guardian.schedule.activities.restTime'),
    location: t('guardian.schedule.locations.restRoom'),
    icon: 'pi-moon',
    iconBg: 'bg-gray-200',
    status: 'upcoming'
  },
  {
    time: '14:30',
    activity: t('guardian.schedule.activities.pickup'),
    location: t('guardian.schedule.locations.mainRoom'),
    icon: 'pi-users',
    iconBg: 'bg-gray-200',
    status: 'upcoming'
  }
])

const currentActivity = computed(() => 
  scheduleItems.value.find(item => item.status === 'current')
)

const getStatusBadgeProps = (status: string) => {
  switch (status) {
    case 'completed':
      return { 
        label: t('common.status.completed'), 
        severity: 'success',
        class: 'px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full border border-green-200'
      }
    case 'current':
      return { 
        label: t('common.status.current'), 
        severity: 'info',
        class: 'px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200'
      }
    case 'upcoming':
      return { 
        label: t('common.status.upcoming'), 
        severity: 'secondary',
        class: 'px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full border border-gray-200'
      }
    default:
      return { 
        label: status, 
        severity: 'secondary',
        class: 'px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full border border-gray-200'
      }
  }
}

const getItemClasses = (status: string) => {
  switch (status) {
    case 'completed':
      return 'flex items-center gap-4 p-4 rounded-lg bg-green-50 border border-green-100'
    case 'current':
      return 'flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100'
    case 'upcoming':
      return 'flex items-center gap-4 p-4 rounded-lg bg-white border border-gray-200'
    default:
      return 'flex items-center gap-4 p-4 rounded-lg bg-white border border-gray-200'
  }
}

const getIconClasses = (status: string) => {
  switch (status) {
    case 'completed':
      return 'w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white'
    case 'current':
      return 'w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white'
    case 'upcoming':
      return 'w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600'
    default:
      return 'w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600'
  }
}

const getTextClasses = (status: string) => {
  switch (status) {
    case 'completed':
      return { title: 'font-medium text-gray-900', location: 'text-sm text-gray-600' }
    case 'current':
      return { title: 'font-medium text-gray-900', location: 'text-sm text-gray-600' }
    case 'upcoming':
      return { title: 'font-medium text-gray-900', location: 'text-sm text-gray-600' }
    default:
      return { title: 'font-medium text-gray-900', location: 'text-sm text-gray-600' }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />
    
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 mb-1">{{ t('guardian.schedule.title') }}</h1>
          <p class="text-gray-600">{{ t('guardian.schedule.description') }}</p>
        </div>
        <Button 
          :label="t('guardian.schedule.viewWeek')"
          icon="pi pi-calendar"
          class="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          text
        />
      </div>
    </div>

    <!-- Current Activity Header -->
    <div class="bg-blue-50 rounded-lg shadow-sm border border-blue-100 border-l-4 border-l-blue-600 mb-6">
      <div class="p-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-clock text-blue-600"></i>
          <h3 class="text-lg font-medium text-gray-900">{{ t('guardian.schedule.currentActivity') }}</h3>
        </div>
        <div class="flex items-center gap-4" v-if="currentActivity">
          <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <i :class="`pi ${currentActivity.icon} text-xl`"></i>
          </div>
          <div>
            <h4 class="text-xl font-medium text-gray-900">{{ currentActivity.activity }}</h4>
            <p class="text-gray-600">{{ currentActivity.time }} - {{ currentActivity.location }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Schedule -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-xl font-medium text-gray-900 mb-1">{{ t('guardian.schedule.todaySchedule') }}</h3>
        <p class="text-sm text-gray-600">{{ t('guardian.schedule.date', { date: 'Tuesday 17. June 2025' }) }}</p>
      </div>
      
      <div class="p-4">
        <div class="space-y-3">
          <div 
            v-for="(item, index) in scheduleItems" 
            :key="index"
            :class="getItemClasses(item.status)"
          >
            <div class="text-sm font-medium text-gray-900 w-16">{{ item.time }}</div>
            <div :class="getIconClasses(item.status)">
              <i :class="`pi ${item.icon}`"></i>
            </div>
            <div class="flex-1">
              <h4 :class="getTextClasses(item.status).title">{{ item.activity }}</h4>
              <p :class="getTextClasses(item.status).location">{{ item.location }}</p>
            </div>
            <div 
              :class="getStatusBadgeProps(item.status).class"
            >
              {{ getStatusBadgeProps(item.status).label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-l-4 {
  border-left-width: 4px;
}
</style> 