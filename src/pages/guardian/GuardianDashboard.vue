<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

onMounted(() => {
  console.log('GuardianDashboard loaded')
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeydown)
  // Optionally start auto-slide
  // startAutoSlide()
})

// Slider state
const currentSlide = ref(0)

// Enhanced data structure for multiple children
const childrenStatusData = ref([
  {
    id: 1,
    childName: 'Oliver',
    kindergarten: 'Sinsen Kindergarten',
    notificationCount: 1,
    attendance: {
      checkedIn: true,
      time: '08:15',
      status: 'Checked In'
    },
    comingUp: {
      activity: 'Outdoor Play',
      time: '10:30'
    },
    pickup: {
      time: '15:30',
      type: 'Regular pickup time'
    }
  },
  {
    id: 2,
    childName: 'Emma',
    kindergarten: 'Løvenskiold Kindergarten',
    notificationCount: 0,
    attendance: {
      checkedIn: true,
      time: '08:30',
      status: 'Checked In'
    },
    comingUp: {
      activity: 'Music Time',
      time: '11:00'
    },
    pickup: {
      time: '16:00',
      type: 'Regular pickup time'
    }
  },
  {
    id: 3,
    childName: 'Liam',
    kindergarten: 'Majorstuen Kindergarten',
    notificationCount: 2,
    attendance: {
      checkedIn: false,
      time: '09:00',
      status: 'Expected'
    },
    comingUp: {
      activity: 'Story Time',
      time: '10:00'
    },
    pickup: {
      time: '15:00',
      type: 'Early pickup'
    }
  }
])

// Current child data for display
const currentChildStatus = computed(() => {
  return childrenStatusData.value[currentSlide.value] || childrenStatusData.value[0]
})

// Slider navigation
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % childrenStatusData.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? childrenStatusData.value.length - 1 
    : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Dashboard data
const todayStatus = ref({
  childName: 'Oliver',
  kindergarten: 'Sinsen Kindergarten',
  attendance: {
    checkedIn: true,
    time: '08:15'
  },
  comingUp: {
    activity: 'Outdoor Play',
    time: '10:30'
  },
  pickup: {
    time: '15:30',
    type: 'Regular pickup time'
  }
})

const quickActions = ref([
  {
    id: 'report-absence',
    title: 'Report Absence',
    description: 'Quick absence notification',
    icon: 'exclamation-circle',
    color: 'red',
    urgent: true
  },
  {
    id: 'message-teacher',
    title: 'Message Teacher',
    description: 'Send direct message',
    icon: 'envelope',
    color: 'blue'
  },
  {
    id: 'view-schedule',
    title: 'View Schedule',
    description: 'Check daily activities',
    icon: 'calendar',
    color: 'blue'
  },
  {
    id: 'child-profile',
    title: 'Child Profile',
    description: 'Manage child information',
    icon: 'user',
    color: 'blue'
  },
  {
    id: 'notice-board',
    title: 'Notice Board',
    description: 'Latest updates and news',
    icon: 'bell',
    color: 'blue'
  }
])

const noticeBoard = ref([
  {
    id: 1,
    title: 'Easter Holiday Preparations',
    preview: "We're getting ready for Easter with fun activities...",
    date: '2024-03-20',
    type: 'activity',
    hasPhotos: true
  },
  {
    id: 2,
    title: 'Important: Pick-up Changes Tomorrow',
    preview: 'Due to staff training, pick-up times will be...',
    date: '2024-03-19',
    type: 'urgent',
    urgent: true
  },
  {
    id: 3,
    title: 'Weekly Menu Update',
    preview: "This week's healthy and delicious menu includes...",
    date: '2024-03-18',
    type: 'menu',
    hasPhotos: true
  }
])

const applications = ref([
  {
    id: 'APP-001',
    childName: 'Emma Hansen',
    kindergarten: 'Løvenskiold Kindergarten',
    status: 'Submitted',
    progress: 60,
    statusText: 'Awaiting placement decision'
  }
])

const children = ref([
  {
    id: 1,
    name: 'Emma Hansen',
    age: '3 years',
    kindergarten: 'Løvenskiold Kindergarten',
    status: 'placed',
    initials: 'EH'
  },
  {
    id: 2,
    name: 'Oliver Hansen',
    age: '5 years',
    kindergarten: 'Sinsen Kindergarten',
    status: 'placed',
    initials: 'OH'
  }
])

const recentMessages = ref([
  {
    id: 1,
    title: 'Welcome to our kindergarten',
    sender: 'Løvenskiold Kindergarten',
    date: '2024-03-18',
    isNew: true
  },
  {
    id: 2,
    title: 'Application status update',
    sender: 'Oslo Municipality',
    date: '2024-03-16',
    isNew: false
  }
])

// Handlers
const handleNewApplication = () => {
  router.push('/guardian/new-application')
}

const handleQuickAction = (actionId: string) => {
  switch (actionId) {
    case 'report-absence':
      // Handle absence reporting
      console.log('Report absence')
      break
    case 'message-teacher':
      router.push('/guardian/messages')
      break
    case 'view-schedule':
      router.push('/guardian/daily-schedule')
      break
    case 'child-profile':
      router.push('/guardian/children')
      break
    case 'notice-board':
      router.push('/guardian/notice-board')
      break
  }
}

const handleViewAllNotices = () => {
  router.push('/guardian/notice-board')
}

const handleViewApplications = () => {
  router.push('/guardian/application-status')
}

const handleViewChildren = () => {
  router.push('/guardian/children')
}

const handleViewMessages = () => {
  router.push('/guardian/messages')
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('no-NO', { 
    day: '2-digit', 
    month: '2-digit'
  })
}

// Keyboard navigation for slider
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    prevSlide()
  } else if (event.key === 'ArrowRight') {
    nextSlide()
  }
}

// Auto-advance slider (optional)
let autoSlideInterval: number | null = null

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 5000) // Change slide every 5 seconds
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopAutoSlide()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-4">
          <!-- Graduation Icon -->
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-1">Welcome, Anna Hansen</h1>
            <p class="text-gray-600 mb-3">Overview of your kindergarten applications and information</p>
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                Guardian Account
              </span>
              <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>
        
        <!-- New Application Button -->
        <button 
          @click="handleNewApplication"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>New Application</span>
        </button>
      </div>
    </div>

    <!-- Main Grid Layout - 2x3 Card Arrangement -->
    <div class="grid grid-cols-12 gap-6">
      
      <!-- Top Row: Today's Status, Quick Actions, Notice Board -->
      <div class="col-span-12">
        <div class="grid grid-cols-3 gap-6">
          
          <!-- Today's Status Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Header -->
            <div class="px-6 pt-6 pb-4">
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold text-gray-900">Today's Status</h2>
              </div>
              <p class="text-sm text-gray-600">Children's current status</p>
            </div>

            <!-- Slider Container -->
            <div class="relative">
              <!-- Left Arrow -->
              <button 
                @click="prevSlide"
                :disabled="childrenStatusData.length <= 1"
                class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                :class="{ 'opacity-0 pointer-events-none': childrenStatusData.length <= 1 }"
              >
                <ChevronLeft class="w-4 h-4 text-gray-600" />
              </button>

              <!-- Right Arrow -->
              <button 
                @click="nextSlide"
                :disabled="childrenStatusData.length <= 1"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                :class="{ 'opacity-0 pointer-events-none': childrenStatusData.length <= 1 }"
              >
                <ChevronRight class="w-4 h-4 text-gray-600" />
              </button>

              <!-- Main Slider Content -->
              <div class="px-6 pb-6">
                <!-- Green Left Border -->
                <div class="relative">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-full"></div>
                  
                  <!-- Child Status Content -->
                  <div class="pl-6 space-y-4">
                    <!-- Child Name & Kindergarten -->
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-xl font-bold text-gray-900">{{ currentChildStatus.childName }}</h3>
                        <p class="text-sm text-gray-600">{{ currentChildStatus.kindergarten }}</p>
                      </div>
                      <!-- Notification Badge -->
                      <div 
                        v-if="currentChildStatus.notificationCount > 0"
                        class="flex items-center space-x-2"
                      >
                        <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {{ currentChildStatus.notificationCount }}
                        </div>
                        <button class="text-gray-400 hover:text-gray-600">
                          <ChevronRight class="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <!-- Attendance Section -->
                    <div class="space-y-2">
                      <h4 class="text-base font-semibold text-gray-900">Attendance</h4>
                      <div class="flex items-center space-x-3">
                        <div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 8 8">
                            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"></path>
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-green-700">{{ currentChildStatus.attendance.status }}</span>
                        <span class="text-sm text-gray-600">at {{ currentChildStatus.attendance.time }}</span>
                      </div>
                    </div>

                    <!-- Coming Up Section -->
                    <div class="space-y-3">
                      <h4 class="text-base font-semibold text-gray-900">Coming Up</h4>
                      <div class="bg-gray-50 rounded-lg p-3">
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <span class="text-sm font-medium text-gray-900">{{ currentChildStatus.comingUp.activity }}</span>
                            <p class="text-xs text-gray-600">Starting at {{ currentChildStatus.comingUp.time }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Pickup Section -->
                    <div class="space-y-2">
                      <h4 class="text-base font-semibold text-gray-900">Pickup</h4>
                      <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-sm font-bold text-gray-900">{{ currentChildStatus.pickup.time }}</span>
                        <span class="text-sm text-gray-600">{{ currentChildStatus.pickup.type }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Slider Navigation Dots -->
              <div class="flex justify-center pb-4 space-x-2">
                <button
                  v-for="(child, index) in childrenStatusData"
                  :key="child.id"
                  @click="goToSlide(index)"
                  :class="[
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  ]"
                ></button>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <p class="text-sm text-gray-600 mb-6">Common tasks for busy parents</p>

            <!-- Quick Action Buttons -->
            <div class="space-y-3">
              <div 
                v-for="action in quickActions" 
                :key="action.id"
                @click="handleQuickAction(action.id)"
                :class="[
                  'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all',
                  action.color === 'red' ? 'border-red-200 bg-red-50 hover:border-red-300' : 'border-blue-200 hover:border-blue-300'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <div :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    action.color === 'red' ? 'bg-red-100' : 'bg-blue-100'
                  ]">
                    <svg class="w-5 h-5" :class="action.color === 'red' ? 'text-red-600' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <!-- Report Absence Icon -->
                      <path v-if="action.icon === 'exclamation-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      <!-- Message Icon -->
                      <path v-else-if="action.icon === 'envelope'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      <!-- Calendar Icon -->
                      <path v-else-if="action.icon === 'calendar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      <!-- User Icon -->
                      <path v-else-if="action.icon === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      <!-- Bell Icon -->
                      <path v-else-if="action.icon === 'bell'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5c-.5-.5-.5-1.3 0-1.8L21 7H8.4L7 5H3v2h2l3.6 7.5c.2.5.8.8 1.4.8H19v2H9c-1.1 0-2-.9-2-2 0-.2 0-.4.1-.6L8.25 15H6c-.8 0-1.5-.7-1.5-1.5S5.2 12 6 12h.75l2.1-4.5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 :class="['font-medium', action.color === 'red' ? 'text-red-900' : 'text-blue-900']">{{ action.title }}</h3>
                    <p :class="['text-sm', action.color === 'red' ? 'text-red-700' : 'text-blue-700']">{{ action.description }}</p>
                  </div>
                </div>
                <svg class="w-5 h-5" :class="action.color === 'red' ? 'text-red-600' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Notice Board Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold text-gray-900">Notice Board</h2>
              </div>
              <button 
                @click="handleViewAllNotices"
                class="text-purple-600 hover:text-purple-800 transition-colors flex items-center space-x-1"
              >
                <span class="text-sm font-medium">View All</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-600 mb-6">Latest updates from kindergarten</p>

            <!-- Notice Items -->
            <div class="space-y-4">
              <div 
                v-for="notice in noticeBoard" 
                :key="notice.id"
                class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div class="flex items-start justify-between mb-2">
                  <h3 class="font-medium text-gray-900 text-sm">{{ notice.title }}</h3>
                  <div class="flex items-center space-x-2">
                    <span v-if="notice.type === 'activity'" class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      activity
                    </span>
                    <span v-else-if="notice.urgent" class="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      Urgent
                    </span>
                    <span v-else-if="notice.type === 'menu'" class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      menu
                    </span>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ notice.preview }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-xs text-gray-500">📅 {{ formatDate(notice.date) }}</span>
                    <span v-if="notice.hasPhotos" class="text-xs text-gray-500">📷 Photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Applications, My Children, Recent Messages -->
      <div class="col-span-12 mt-6">
        <div class="grid grid-cols-3 gap-6">
          
          <!-- Applications Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold text-gray-900">Applications</h2>
              </div>
              <button 
                @click="handleViewApplications"
                class="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                + New
              </button>
            </div>
            <p class="text-sm text-gray-600 mb-4">Status and progress overview</p>

            <!-- Active Applications -->
            <div class="space-y-3">
              <h3 class="text-sm font-medium text-yellow-800 mb-2">★ Active Applications</h3>
              <div 
                v-for="app in applications" 
                :key="app.id"
                class="p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-900">{{ app.childName }}</h4>
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    ⚡ {{ app.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ app.kindergarten }}</p>
                
                <!-- Progress Bar -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-600">Progress</span>
                    <span class="text-xs font-medium text-gray-900">{{ app.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-gray-900 h-2 rounded-full transition-all duration-300" 
                      :style="`width: ${app.progress}%`"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-600">{{ app.statusText }}</p>
                </div>
              </div>

              <!-- Completed Applications -->
              <div class="pt-4 border-t border-gray-200">
                <h3 class="text-sm font-medium text-green-800 mb-2">✓ Completed</h3>
                <div class="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-medium text-gray-900">Oliver Hansen</h4>
                      <p class="text-sm text-gray-600">Sinsen Kindergarten</p>
                    </div>
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      ✓ Placed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- My Children Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold text-gray-900">My Children</h2>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-4">View detailed profiles</p>

            <!-- Children List -->
            <div class="space-y-3">
              <div 
                v-for="child in children" 
                :key="child.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                @click="handleViewChildren"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ child.initials }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ child.name }}</h4>
                    <p class="text-sm text-gray-600">{{ child.age }} • {{ child.kindergarten }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  <span class="text-xs text-green-600 font-medium">placed</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Messages Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold text-gray-900">Recent Messages</h2>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-4">Latest updates and notifications</p>

            <!-- Messages List -->
            <div class="space-y-3">
              <div 
                v-for="message in recentMessages" 
                :key="message.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                @click="handleViewMessages"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    LK
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 truncate">{{ message.title }}</h4>
                    <p class="text-sm text-gray-600">{{ message.sender }}</p>
                    <p class="text-xs text-gray-500">📅 {{ formatDate(message.date) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span v-if="message.isNew" class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    🔔 New
                  </span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Grid responsive classes */
.grid {
  display: grid;
}

.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.col-span-4 {
  grid-column: span 4 / span 4;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style> 