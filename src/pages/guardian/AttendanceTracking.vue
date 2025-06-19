<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />
    
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('attendance.title') }}</h1>
        <p class="text-gray-600">{{ t('attendance.description') }}</p>
      </div>

      <!-- Child Profile Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ currentChild.name }}</h2>
            <p class="text-gray-600">{{ currentChild.kindergarten }}</p>
          </div>
        </div>
      </div>

      <!-- Today's Status Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ t('attendance.todaysStatus') }}</h3>
          </div>
          <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {{ t('common.status.present') }}
          </span>
        </div>
        
        <p class="text-gray-600 mb-4">{{ todayDate }}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ t('attendance.checkedInAt') }}</p>
              <p class="font-semibold text-gray-900">{{ todayStatus.checkIn }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ t('attendance.expectedCheckout') }}</p>
              <p class="font-semibold text-gray-900">{{ todayStatus.expectedCheckOut }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">{{ t('common.duration') }}</p>
              <p class="font-semibold text-gray-900">{{ todayStatus.duration }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Overview -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ t('attendance.weeklyOverview') }}</h3>
            <p class="text-gray-600">{{ weekRange }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="previousWeek" class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <span class="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">{{ t('common.thisWeek') }}</span>
            <button @click="nextWeek" class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Weekly Attendance List -->
        <div class="space-y-4">
          <div v-for="day in weeklyAttendance" :key="day.date" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">{{ day.dayName }}</h4>
                <p class="text-sm text-gray-600" v-if="day.status !== 'absent'">{{ day.timeRange }}</p>
                <p class="text-sm text-gray-600" v-else>{{ t('common.status.absent') }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span v-if="day.duration && day.status !== 'absent'" class="text-sm text-gray-600">{{ day.duration }}</span>
              <span v-if="day.status === 'present'" class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ t('common.status.present') }}
              </span>
              <span v-else-if="day.status === 'completed'" class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ t('common.status.completed') }}
              </span>
              <span v-else-if="day.status === 'absent'" class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ t('common.status.absent') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">{{ statistics.attendanceRate }}%</div>
          <p class="text-gray-600">{{ t('attendance.attendanceRate') }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ statistics.averageHours }}</div>
          <p class="text-gray-600">{{ t('attendance.averageDailyHours') }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div class="text-3xl font-bold text-orange-600 mb-2">{{ statistics.absencesThisMonth }}</div>
          <p class="text-gray-600">{{ t('attendance.absencesThisMonth') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const { t } = useI18n()

// Current child data
const currentChild = ref({
  name: 'Oliver Hansen',
  kindergarten: 'Sinsen Kindergarten'
})

// Today's status
const todayStatus = ref({
  checkIn: '08:15',
  expectedCheckOut: '15:30',
  duration: '7h 15m',
  status: 'present'
})

// Today's date
const todayDate = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
})

// Week range
const weekRange = ref('Jun 15 - Jun 19, 2025')

// Weekly attendance data
const weeklyAttendance = ref([
  {
    date: '2025-06-19',
    dayName: 'Thursday 19. June',
    timeRange: 'In: 08:15',
    duration: '7h 15m (ongoing)',
    status: 'present'
  },
  {
    date: '2025-06-18',
    dayName: 'Wednesday 18. June',
    timeRange: 'In: 08:05  Out: 15:45',
    duration: '7h 40m',
    status: 'completed'
  },
  {
    date: '2025-06-17',
    dayName: 'Tuesday 17. June',
    timeRange: 'In: 08:25  Out: 15:30',
    duration: '7h 5m',
    status: 'completed'
  },
  {
    date: '2025-06-16',
    dayName: 'Monday 16. June',
    timeRange: '',
    duration: '',
    status: 'absent'
  },
  {
    date: '2025-06-15',
    dayName: 'Sunday 15. June',
    timeRange: 'In: 08:10  Out: 16:00',
    duration: '7h 50m',
    status: 'completed'
  }
])

// Statistics
const statistics = ref({
  attendanceRate: 95,
  averageHours: '7h 25m',
  absencesThisMonth: 2
})

// Week navigation
const previousWeek = () => {
  console.log('Previous week')
}

const nextWeek = () => {
  console.log('Next week')
}
</script>

<style scoped>
.grid-cols-1 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style> 