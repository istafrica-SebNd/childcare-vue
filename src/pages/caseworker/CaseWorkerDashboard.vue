<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

const router = useRouter()
const isLoading = ref(true)

onMounted(() => {
  const timer = setTimeout(() => {
    isLoading.value = false
  }, 1000)
  return () => clearTimeout(timer)
})

// Recent activity data
const recentActivity = ref([
  {
    id: 1,
    type: 'application_submitted',
    title: 'New Application',
    description: 'Emma Larsen submitted kindergarten application',
    applicant: 'Emma Larsen',
    time: '2 hours ago',
    priority: 'normal',
    actionRequired: false
  },
  {
    id: 2,
    type: 'document_missing',
    title: 'Missing Documents',
    description: 'Oliver Hansen application requires additional documentation',
    applicant: 'Oliver Hansen',
    time: '4 hours ago',
    priority: 'high',
    actionRequired: true
  },
  {
    id: 3,
    type: 'placement_confirmed',
    title: 'Placement Confirmed',
    description: 'Successful placement at Løvenskiold Kindergarten',
    applicant: 'Sofia Nielsen',
    time: '1 day ago',
    priority: 'normal',
    actionRequired: false
  },
  {
    id: 4,
    type: 'message_received',
    title: 'Guardian Message',
    description: 'Question about application APP-125 status',
    applicant: 'Maria Olsen',
    time: '1 day ago',
    priority: 'normal',
    actionRequired: true
  }
])

// Utility functions
const getPriorityBadge = (priority: string, actionRequired: boolean) => {
  if (priority === 'high') {
    return { severity: 'danger', label: 'Urgent' }
  }
  if (actionRequired) {
    return { severity: 'warning', label: 'Action Required' }
  }
  return null
}

const handleManualApplication = () => {
  router.push('/caseworker/manual-application')
}

const handleStartReview = () => {
  router.push('/caseworker/review-queue')
}

const handleTakeAction = (activityId: number) => {
  console.log('Taking action for activity:', activityId)
}

const handleViewDetails = (activityId: number) => {
  router.push(`/caseworker/activity/${activityId}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppBreadcrumb />

    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div class="flex items-center">
          <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
            <i class="pi pi-graduation-cap text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">
              Welcome, Erik Johansen
            </h1>
            <p class="text-gray-600">
              Manage applications and support families in their kindergarten journey
            </p>
            <div class="flex items-center gap-3 mt-2">
              <Badge value="Case Worker Account" severity="info" class="text-xs">
                <i class="pi pi-shield mr-1"></i>
              </Badge>
              <Badge value="✓ Verified" severity="success" class="text-xs">
                <i class="pi pi-check-circle mr-1"></i>
              </Badge>
              <Badge value="Søndre Nordstrand" severity="secondary" class="text-xs" />
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <Button outlined class="text-sm">
            <i class="pi pi-filter mr-2"></i>
            Quick Filters
          </Button>
          <Button @click="handleStartReview" class="text-sm">
            <i class="pi pi-folder-open mr-2"></i>
            Review Applications
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <!-- New Applications -->
        <Card class="border-0 shadow-sm hover:shadow-md transition-shadow">
          <template #content>
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i class="pi pi-file-text text-blue-600 text-lg"></i>
                </div>
                <div class="flex items-center text-green-600 text-sm font-medium">
                  <i class="pi pi-arrow-up text-xs mr-1"></i>
                  +5
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-medium">New Applications</p>
                <p class="text-3xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Urgent Tasks -->
        <Card class="border-0 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <template #content>
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <i class="pi pi-exclamation-triangle text-red-600 text-lg"></i>
                </div>
                <div class="flex items-center text-green-600 text-sm font-medium">
                  <i class="pi pi-arrow-down text-xs mr-1"></i>
                  -2
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-medium">Urgent Tasks</p>
                <p class="text-3xl font-bold text-red-600">5</p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Average Processing -->
        <Card class="border-0 shadow-sm hover:shadow-md transition-shadow">
          <template #content>
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <i class="pi pi-clock text-yellow-600 text-lg"></i>
                </div>
                <div class="flex items-center text-green-600 text-sm font-medium">
                  <i class="pi pi-arrow-down text-xs mr-1"></i>
                  -1
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-medium">Average Processing</p>
                <p class="text-3xl font-bold text-yellow-600">12d</p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Completion Rate -->
        <Card class="border-0 shadow-sm hover:shadow-md transition-shadow">
          <template #content>
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <i class="pi pi-chart-line text-green-600 text-lg"></i>
                </div>
                <div class="flex items-center text-green-600 text-sm font-medium">
                  <i class="pi pi-arrow-up text-xs mr-1"></i>
                  +3%
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-medium">Completion Rate</p>
                <p class="text-3xl font-bold text-green-600">87%</p>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Quick Actions -->
        <Card class="col-span-2 border-0 shadow-sm">
          <template #header>
            <div class="px-6 pt-6">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i class="pi pi-bolt text-blue-600"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <p class="text-sm text-gray-600">Access frequently used caseworker tools and workflows</p>
                </div>
              </div>
            </div>
          </template>
          <template #content>
            <div class="px-6 pb-6">
              <!-- Manual Application Registration -->
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div class="flex items-start justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <i class="pi pi-user-plus text-orange-600"></i>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900">Register Application (No e-ID)</h4>
                      <p class="text-sm text-gray-600 mt-1">Manual submission for guardians without digital ID</p>
                      <div class="text-sm text-gray-600 mt-2">
                        <p class="mb-1">Use when guardians:</p>
                        <ul class="text-xs text-gray-500 ml-4">
                          <li>• Don't have BankID or ID-porten access</li>
                          <li>• Are new residents without digital credentials</li>
                          <li>• Need immediate application assistance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Badge value="Manual Entry" severity="warning" class="text-xs" />
                </div>
                <Button
                  @click="handleManualApplication"
                  class="w-full mt-4 bg-orange-600 hover:bg-orange-700 border-orange-600"
                >
                  <i class="pi pi-plus mr-2"></i>
                  Start Manual Application
                </Button>
              </div>

              <!-- Review Applications Section -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <i class="pi pi-folder-open text-blue-600"></i>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900">Review Applications</h4>
                      <p class="text-sm text-gray-600">Process pending applications</p>
                      <p class="text-xs text-gray-500 mt-1">23 pending items</p>
                    </div>
                  </div>
                  <Button
                    @click="handleStartReview"
                    size="small"
                    class="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Review
                    <i class="pi pi-arrow-right ml-2"></i>
                  </Button>
                </div>
              </div>

              <!-- Quick Action Buttons Grid -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <i class="pi pi-users text-green-600 text-sm"></i>
                  </div>
                  <p class="text-xs font-medium text-gray-900">Manage Placements</p>
                  <p class="text-xs text-gray-500">8</p>
                </div>

                <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <i class="pi pi-comments text-purple-600 text-sm"></i>
                  </div>
                  <p class="text-xs font-medium text-gray-900">Send Messages</p>
                  <p class="text-xs text-gray-500">12</p>
                </div>

                <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <i class="pi pi-chart-bar text-orange-600 text-sm"></i>
                  </div>
                  <p class="text-xs font-medium text-gray-900">Generate Reports</p>
                  <p class="text-xs text-gray-500">3</p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Recent Activity -->
        <Card class="border-0 shadow-sm">
          <template #header>
            <div class="px-6 pt-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <i class="pi pi-clock text-gray-600"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <p class="text-sm text-gray-600">Latest updates requiring your attention</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <Button size="small" outlined severity="secondary">
                    <i class="pi pi-filter mr-1"></i>
                    Filter
                  </Button>
                  <Button size="small" outlined severity="secondary">
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </template>
          <template #content>
            <div class="px-6 pb-6">
              <div class="space-y-4">
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="border-l-4 border-gray-200 pl-4 hover:border-blue-300 transition-colors cursor-pointer"
                  :class="{
                    'border-red-300': activity.priority === 'high',
                    'border-orange-300': activity.actionRequired
                  }"
                  @click="handleViewDetails(activity.id)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 text-sm">{{ activity.title }}</h4>
                      <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                      <div class="flex items-center justify-between mt-2">
                        <p class="text-xs text-gray-500">{{ activity.applicant }}</p>
                        <p class="text-xs text-gray-500">{{ activity.time }}</p>
                      </div>
                    </div>
                    <Button
                      v-if="activity.actionRequired"
                      size="small"
                      @click.stop="handleTakeAction(activity.id)"
                      class="ml-2"
                    >
                      Take Action
                    </Button>
                    <Button
                      v-else
                      size="small"
                      outlined
                      severity="secondary"
                      @click.stop="handleViewDetails(activity.id)"
                      class="ml-2"
                    >
                      <i class="pi pi-eye"></i>
                      View Details
                    </Button>
                  </div>
                  <div v-if="getPriorityBadge(activity.priority, activity.actionRequired)" class="mt-2">
                    <Badge
                      :severity="getPriorityBadge(activity.priority, activity.actionRequired)?.severity"
                      :value="getPriorityBadge(activity.priority, activity.actionRequired)?.label"
                      class="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles matching the design */
.dashboard-sidebar {
  width: 256px;
  background: white;
  border-right: 1px solid #e5e7eb;
}

.nav-item {
  @apply flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors;
}

.nav-item.active {
  @apply bg-blue-50 text-blue-600 font-medium;
}

.stat-card {
  @apply bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow;
}

.quick-action-card {
  @apply bg-white rounded-xl shadow-sm border-0;
}

.activity-item {
  @apply border-l-4 border-gray-200 pl-4 hover:border-blue-300 transition-colors cursor-pointer;
}

.activity-item.urgent {
  @apply border-red-300;
}

.activity-item.action-required {
  @apply border-orange-300;
}
</style>
