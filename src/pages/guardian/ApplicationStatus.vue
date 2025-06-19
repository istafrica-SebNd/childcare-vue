<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const router = useRouter()
const { t } = useI18n()

// Application data
const applications = ref([
  {
    id: 'AAP-2024-001',
    childName: 'Lina Berg',
    status: 'draft',
    age: '1 Year',
    submittedDate: '2024-06-17',
    admissionRound: 'Main Recording Part 1',
    deadline: '2024-09-30',
    progressPercentage: 25,
    caseWorker: 'Erik Johansen',
    lastUpdated: '2024-06-15',
    kindergartenPreference: 'Main Recording Part 1',
    queuePosition: null,
    timeline: [
      { status: 'Application received', date: '2024-06-17', completed: true },
      { status: 'Identity verification completed', date: '', completed: true },
      { status: 'Document review in progress', date: '2024-06-15', completed: false, current: true },
      { status: 'Expected decision', date: '2024-04-15', completed: false }
    ]
  },
  {
    id: 'AAP-2024-002', 
    childName: 'Emma Nordahl',
    status: 'draft',
    age: '1 Year',
    submittedDate: '2024-06-10',
    admissionRound: 'Main Recording Part 1',
    deadline: '2024-09-30',
    progressPercentage: 25,
    caseWorker: 'Erik Johansen',
    lastUpdated: '2024-06-14',
    kindergartenPreference: 'Main Recording Part 1',
    queuePosition: null,
    timeline: [
      { status: 'Application received', date: '2024-05-10', completed: true },
      { status: 'Identity verification completed', date: '', completed: true },
      { status: 'Document review in progress', date: '2024-06-14', completed: false, current: true },
      { status: 'Expected decision', date: '2024-04-15', completed: false }
    ]
  },
  {
    id: 'DP-2024-001',
    childName: 'Erik Svendsen',
    status: 'submitted',
    age: 'Submitted',
    submittedDate: '2024-06-01',
    admissionRound: 'Main Recording Part 1',
    deadline: '2024-09-30',
    progressPercentage: 67,
    caseWorker: 'Erik Johansen',
    lastUpdated: '2024-06-05',
    kindergartenPreference: 'Dual Placement',
    queuePosition: 234,
    estimatedDecision: '2024-04-15',
    dualPlacement: true,
    dualPlacementId: 'DP-2024-001',
    primaryKindergarten: 'Frogner Barnehage',
    secondaryKindergarten: 'Majorstuen Barnehage',
    timeline: [
      { status: 'Application received', date: '2024-06-01', completed: true },
      { status: 'Identity verification completed', date: '', completed: true },
      { status: 'Document review in progress', date: '2024-06-05', completed: false, current: true },
      { status: 'Expected decision', date: '2024-04-15', completed: false }
    ]
  }
])

// Tab state for each application
const activeTab = ref<Record<string, string>>({
  'AAP-2024-001': 'timeline',
  'AAP-2024-002': 'timeline', 
  'DP-2024-001': 'timeline'
})

// Handlers
const handleNotifications = () => {
  router.push('/guardian/notifications')
}

const handleNewApplication = () => {
  router.push('/guardian/new-application')
}

const handleUploadDocuments = () => {
  router.push('/guardian/documents/upload')
}

const handleContactSupport = () => {
  router.push('/guardian/support/contact')
}

const handleMessage = (childId: string) => {
  router.push(`/guardian/messages/new?child=${childId}`)
}

const handleViewDetails = (applicationId: string) => {
  router.push(`/guardian/application/${applicationId}`)
}

const handleManageSchedule = (dualPlacementId: string) => {
  router.push(`/guardian/dual-placement/${dualPlacementId}/schedule`)
}

const handleContactCaseWorker = () => {
  console.log('Contact case worker')
}

const handleContactOICSupport = () => {
  router.push('/guardian/support/oic')
}

const handleTabClick = (applicationId: string, tabName: string) => {
  activeTab.value[applicationId] = tabName
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />
    
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Application Status</h1>
        <p class="text-gray-600">Track the status of your kindergarten applications across different recording periods</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center space-x-3">
        <!-- Notifications Button -->
        <button 
          @click="handleNotifications"
          class="relative p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5c-.5-.5-.5-1.3 0-1.8L21 7H8.4L7 5H3v2h2l3.6 7.5c.2.5.8.8 1.4.8H19v2H9c-1.1 0-2-.9-2-2 0-.2 0-.4.1-.6L8.25 15H6c-.8 0-1.5-.7-1.5-1.5S5.2 12 6 12h.75l2.1-4.5"></path>
          </svg>
          <!-- Notification Badge -->
          <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            3
          </div>
        </button>
        
        <!-- New Application Button -->
        <button 
          @click="handleNewApplication"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          New Application
        </button>
      </div>
    </div>

    <!-- Urgent Actions Alert -->
    <div class="bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-lg p-4 mb-8">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-red-900 mb-1">Urgent Actions Required</h3>
          <p class="text-red-800 text-sm mb-3">You have 2 urgent action(s) that need your attention.</p>
          <div class="flex space-x-3">
            <button 
              @click="handleUploadDocuments"
              class="flex items-center px-3 py-1 border border-red-300 text-red-700 rounded text-sm hover:bg-red-100 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Upload Documents
            </button>
            <button 
              @click="handleContactSupport"
              class="flex items-center px-3 py-1 border border-red-300 text-red-700 rounded text-sm hover:bg-red-100 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications List -->
    <div class="space-y-6">
      <!-- Application 1: Lina Berg -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <!-- Avatar -->
              <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {{ getInitials(applications[0].childName) }}
              </div>
              
              <!-- Child Info -->
              <div>
                <div class="flex items-center space-x-3 mb-1">
                  <h2 class="text-xl font-semibold text-gray-900">{{ applications[0].childName }}</h2>
                  <span class="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm font-medium">
                    Draft
                  </span>
                  <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {{ applications[0].age }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-1">
                  Application #2024-001 • {{ applications[0].admissionRound }} • Submitted: {{ applications[0].submittedDate }}
                </p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button 
                @click="handleMessage('lina-berg')"
                class="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button 
                @click="handleViewDetails(applications[0].id)"
                class="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
          
          <!-- Progress Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700">Application Progress</span>
              <span class="text-sm font-semibold text-gray-900">{{ applications[0].progressPercentage }}% Complete</span>
            </div>
            
            <!-- Progress Steps -->
            <div class="flex items-center justify-between mb-4">
              <!-- Step 1: Submitted -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-gray-900">Application Submitted</span>
              </div>
              
              <!-- Progress Line 1 -->
              <div class="flex-1 h-0.5 bg-blue-500 mx-2"></div>
              
              <!-- Step 2: Under Review -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <div class="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span class="text-xs font-medium text-blue-900">Under Review</span>
              </div>
              
              <!-- Progress Line 2 -->
              <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <!-- Step 3: Decision -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span class="text-gray-600 text-xs font-bold">3</span>
                </div>
                <span class="text-xs font-medium text-gray-600">Decision Made</span>
              </div>
              
              <!-- Progress Line 3 -->
              <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <!-- Step 4: Placement -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span class="text-gray-600 text-xs font-bold">4</span>
                </div>
                <span class="text-xs font-medium text-gray-600">Placement Assigned</span>
              </div>
            </div>
          </div>
          
          <!-- Kindergarten Preference -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h3 class="font-semibold text-blue-900">{{ applications[0].kindergartenPreference }}</h3>
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                High Priority
              </span>
            </div>
            <p class="text-sm text-blue-800 mb-2">Children with statutory right or without place by Sept 30</p>
            <p class="text-xs text-blue-700">
              <strong>Deadline:</strong> March 1, 2024
            </p>
          </div>
          
          <!-- Tabs Section -->
          <div class="border-b border-gray-200 mb-4">
            <div class="flex space-x-8">
              <button 
                @click="handleTabClick(applications[0].id, 'timeline')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[0].id] === 'timeline' ? 'border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Timeline</button>
              <button 
                @click="handleTabClick(applications[0].id, 'preferences')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[0].id] === 'preferences' ? 'border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Preferences</button>
              <button 
                @click="handleTabClick(applications[0].id, 'documents')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[0].id] === 'documents' ? 'border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Documents</button>
              <button 
                @click="handleTabClick(applications[0].id, 'verification')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[0].id] === 'verification' ? 'border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Verification</button>
              <button 
                @click="handleTabClick(applications[0].id, 'tools')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[0].id] === 'tools' ? 'border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Tools</button>
            </div>
          </div>
          
          <!-- Processing Timeline -->
          <div v-if="activeTab[applications[0].id] === 'timeline'">
            <h4 class="font-semibold text-gray-900 mb-4">Processing Timeline</h4>
            <div class="space-y-3">
              <div v-for="(item, index) in applications[0].timeline" :key="index" class="flex items-center space-x-3">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  item.completed ? 'bg-green-500' : item.current ? 'bg-yellow-500' : 'bg-gray-300'
                ]"></div>
                <div class="flex-1 flex items-center justify-between">
                  <span :class="[
                    'text-sm',
                    item.completed ? 'text-gray-900 font-medium' : item.current ? 'text-gray-900' : 'text-gray-500'
                  ]">{{ item.status }}</span>
                  <span class="text-xs text-gray-500">{{ item.date }}</span>
                </div>
              </div>
            </div>
            
            <!-- Contact Info -->
            <div class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Case Worker: {{ applications[0].caseWorker }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <button 
                  @click="handleContactCaseWorker"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  Contact
                </button>
                <span class="text-xs text-gray-500">Last updated: {{ applications[0].lastUpdated }}</span>
              </div>
            </div>
          </div>

          <!-- Preferences Tab Content -->
          <div v-else-if="activeTab[applications[0].id] === 'preferences'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Kindergarten Preferences</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">1st Choice:</span>
                  <span class="text-gray-700">Grünerløkka Barnehage</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">2nd Choice:</span>
                  <span class="text-gray-700">Sagene Barnehage</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">3rd Choice:</span>
                  <span class="text-gray-700">Bislett Barnehage</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">Priority:</span>
                  <span class="text-green-600 font-medium">High Priority</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents Tab Content -->
          <div v-else-if="activeTab[applications[0].id] === 'documents'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Required Documents</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-900">Birth Certificate</span>
                </div>
                <span class="text-green-600 text-sm font-medium">Uploaded</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-900">Guardian ID</span>
                </div>
                <span class="text-green-600 text-sm font-medium">Verified</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span class="text-gray-900">Income Statement</span>
                </div>
                <span class="text-red-600 text-sm font-medium">Required</span>
              </div>
            </div>
          </div>

          <!-- Verification Tab Content -->
          <div v-else-if="activeTab[applications[0].id] === 'verification'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Identity Verification</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span class="text-gray-900">Guardian Identity</span>
                <span class="text-green-600 text-sm font-medium">Verified ✓</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span class="text-gray-900">Child Identity</span>
                <span class="text-green-600 text-sm font-medium">Verified ✓</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span class="text-gray-900">Address Verification</span>
                <span class="text-blue-600 text-sm font-medium">In Progress</span>
              </div>
            </div>
          </div>

          <!-- Tools Tab Content -->
          <div v-else-if="activeTab[applications[0].id] === 'tools'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Application Tools</h4>
            <div class="grid grid-cols-2 gap-4">
              <button class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="font-medium">Download PDF</span>
                </div>
              </button>
              <button class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                  <span class="font-medium">Share Application</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Application 2: Emma Nordahl (Similar structure) -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <!-- Avatar -->
              <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {{ getInitials(applications[1].childName) }}
              </div>
              
              <!-- Child Info -->
              <div>
                <div class="flex items-center space-x-3 mb-1">
                  <h2 class="text-xl font-semibold text-gray-900">{{ applications[1].childName }}</h2>
                  <span class="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm font-medium">
                    Draft
                  </span>
                  <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {{ applications[1].age }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-1">
                  Application #2024-002 • {{ applications[1].admissionRound }} • Submitted: {{ applications[1].submittedDate }}
                </p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button 
                @click="handleMessage('emma-nordahl')"
                class="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button 
                @click="handleViewDetails(applications[1].id)"
                class="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
          
          <!-- Progress Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700">Application Progress</span>
              <span class="text-sm font-semibold text-gray-900">{{ applications[1].progressPercentage }}% Complete</span>
            </div>
            
            <!-- Progress Steps -->
            <div class="flex items-center justify-between mb-4">
              <!-- Step 1: Submitted -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-gray-900">Application Submitted</span>
              </div>
              
              <!-- Progress Line 1 -->
              <div class="flex-1 h-0.5 bg-blue-500 mx-2"></div>
              
              <!-- Step 2: Under Review -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <div class="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span class="text-xs font-medium text-blue-900">Under Review</span>
              </div>
              
              <!-- Progress Line 2 -->
              <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <!-- Step 3: Decision -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span class="text-gray-600 text-xs font-bold">3</span>
                </div>
                <span class="text-xs font-medium text-gray-600">Decision Made</span>
              </div>
              
              <!-- Progress Line 3 -->
              <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <!-- Step 4: Placement -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span class="text-gray-600 text-xs font-bold">4</span>
                </div>
                <span class="text-xs font-medium text-gray-600">Placement Assigned</span>
              </div>
            </div>
          </div>
          
          <!-- Tabs Section -->
          <div class="border-b border-gray-200 mb-4">
            <div class="flex space-x-8">
              <button 
                @click="handleTabClick(applications[1].id, 'timeline')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[1].id] === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Timeline</button>
              <button 
                @click="handleTabClick(applications[1].id, 'preferences')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[1].id] === 'preferences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Preferences</button>
              <button 
                @click="handleTabClick(applications[1].id, 'documents')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[1].id] === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Documents</button>
              <button 
                @click="handleTabClick(applications[1].id, 'verification')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[1].id] === 'verification' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Verification</button>
              <button 
                @click="handleTabClick(applications[1].id, 'tools')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[1].id] === 'tools' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Tools</button>
            </div>
          </div>
          
          <!-- Simplified Timeline for second application -->
          <div v-if="activeTab[applications[1].id] === 'timeline'">
            <h4 class="font-semibold text-gray-900 mb-4">Processing Timeline</h4>
            <div class="space-y-3">
              <div v-for="(item, index) in applications[1].timeline" :key="index" class="flex items-center space-x-3">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  item.completed ? 'bg-green-500' : item.current ? 'bg-yellow-500' : 'bg-gray-300'
                ]"></div>
                <div class="flex-1 flex items-center justify-between">
                  <span :class="[
                    'text-sm',
                    item.completed ? 'text-gray-900 font-medium' : item.current ? 'text-gray-900' : 'text-gray-500'
                  ]">{{ item.status }}</span>
                  <span class="text-xs text-gray-500">{{ item.date }}</span>
                </div>
              </div>
            </div>
            
            <!-- Contact Info -->
            <div class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Case Worker: {{ applications[1].caseWorker }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <button 
                  @click="handleContactCaseWorker"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  Contact
                </button>
                <span class="text-xs text-gray-500">Last updated: {{ applications[1].lastUpdated }}</span>
              </div>
            </div>
          </div>

          <!-- Preferences Tab Content -->
          <div v-else-if="activeTab[applications[1].id] === 'preferences'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Kindergarten Preferences</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">1st Choice:</span>
                  <span class="text-gray-700">Bislett Barnehage</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">2nd Choice:</span>
                  <span class="text-gray-700">Frogner Barnehage</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900">Priority:</span>
                  <span class="text-green-600 font-medium">High Priority</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab[applications[1].id] === 'documents'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Required Documents</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-900">Birth Certificate</span>
                </div>
                <span class="text-green-600 text-sm font-medium">Uploaded</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span class="text-gray-900">Guardian ID</span>
                </div>
                <span class="text-yellow-600 text-sm font-medium">Pending</span>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab[applications[1].id] === 'verification'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Identity Verification</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span class="text-gray-900">Child Identity</span>
                <span class="text-green-600 text-sm font-medium">Verified ✓</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span class="text-gray-900">Guardian Identity</span>
                <span class="text-yellow-600 text-sm font-medium">In Progress</span>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab[applications[1].id] === 'tools'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Application Tools</h4>
            <div class="grid grid-cols-2 gap-4">
              <button class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="font-medium">Download PDF</span>
                </div>
              </button>
              <button class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  <span class="font-medium">Upload Documents</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Application 3: Erik Svendsen (Dual Placement) -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <!-- Avatar -->
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {{ getInitials(applications[2].childName) }}
              </div>
              
              <!-- Child Info -->
              <div>
                <div class="flex items-center space-x-3 mb-1">
                  <h2 class="text-xl font-semibold text-gray-900">{{ applications[2].childName }}</h2>
                  <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    Submitted
                  </span>
                  <span class="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    Dual Placement
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-1">
                  Application #2024-010 • {{ applications[2].admissionRound }} • Submitted: {{ applications[2].submittedDate }}
                </p>
                <p class="text-sm text-gray-600">
                  Queue position: #{{ applications[2].queuePosition }} • Est. decision: {{ applications[2].estimatedDecision }}
                </p>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button 
                @click="handleMessage('erik-svendsen')"
                class="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button 
                @click="handleViewDetails(applications[2].id)"
                class="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              <button 
                @click="handleManageSchedule(applications[2].dualPlacementId)"
                class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                Manage Schedule
              </button>
            </div>
          </div>
          
          <!-- Progress Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700">Application Progress</span>
              <span class="text-sm font-semibold text-gray-900">{{ applications[2].progressPercentage }}% Complete</span>
            </div>
            
            <!-- Progress Steps -->
            <div class="flex items-center justify-between mb-4">
              <!-- Step 1: Submitted -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-gray-900">Application Submitted</span>
              </div>
              
              <!-- Progress Line 1 -->
              <div class="flex-1 h-0.5 bg-green-500 mx-2"></div>
              
              <!-- Step 2: Under Review -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-gray-900">Under Review</span>
              </div>
              
              <!-- Progress Line 2 -->
              <div class="flex-1 h-0.5 bg-blue-500 mx-2"></div>
              
              <!-- Step 3: Decision -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <div class="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span class="text-xs font-medium text-blue-900">Decision Made</span>
              </div>
              
              <!-- Progress Line 3 -->
              <div class="flex-1 h-0.5 bg-gray-300 mx-2"></div>
              
              <!-- Step 4: Placement -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span class="text-gray-600 text-xs font-bold">4</span>
                </div>
                <span class="text-xs font-medium text-gray-600">Placement Assigned</span>
              </div>
            </div>
          </div>
          
          <!-- Tabs Section -->
          <div class="border-b border-gray-200 mb-4">
            <div class="flex space-x-8">
              <button 
                @click="handleTabClick(applications[2].id, 'timeline')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[2].id] === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Timeline</button>
              <button 
                @click="handleTabClick(applications[2].id, 'preferences')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[2].id] === 'preferences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Preferences</button>
              <button 
                @click="handleTabClick(applications[2].id, 'documents')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[2].id] === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Documents</button>
              <button 
                @click="handleTabClick(applications[2].id, 'verification')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[2].id] === 'verification' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Verification</button>
              <button 
                @click="handleTabClick(applications[2].id, 'tools')"
                :class="[
                  'py-2 text-sm font-medium',
                  activeTab[applications[2].id] === 'tools' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                ]"
              >Tools</button>
            </div>
          </div>
          
          <!-- Timeline Tab Content -->
          <div v-if="activeTab[applications[2].id] === 'timeline'">
            <h4 class="font-semibold text-gray-900 mb-4">Processing Timeline</h4>
            <div class="space-y-3">
              <div v-for="(item, index) in applications[2].timeline" :key="index" class="flex items-center space-x-3">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  item.completed ? 'bg-green-500' : item.current ? 'bg-yellow-500' : 'bg-gray-300'
                ]"></div>
                <div class="flex-1 flex items-center justify-between">
                  <span :class="[
                    'text-sm',
                    item.completed ? 'text-gray-900 font-medium' : item.current ? 'text-gray-900' : 'text-gray-500'
                  ]">{{ item.status }}</span>
                  <span class="text-xs text-gray-500">{{ item.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences Tab Content for Dual Placement -->
          <div v-else-if="activeTab[applications[2].id] === 'preferences'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Dual Placement Preferences</h4>
            <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div class="space-y-4">
                <div>
                  <h5 class="font-medium text-purple-900 mb-2">Primary Kindergarten (60%)</h5>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-700">{{ applications[2].primaryKindergarten }}</span>
                      <span class="text-purple-600 text-sm font-medium">Mon, Tue, Fri</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 class="font-medium text-purple-900 mb-2">Secondary Kindergarten (40%)</h5>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-700">{{ applications[2].secondaryKindergarten }}</span>
                      <span class="text-purple-600 text-sm font-medium">Wed, Thu</span>
                    </div>
                  </div>
                </div>
                <div class="pt-3 border-t border-purple-200">
                  <span class="text-sm text-purple-800"><strong>Reason:</strong> Split custody arrangement</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents Tab Content -->
          <div v-else-if="activeTab[applications[2].id] === 'documents'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Required Documents</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-900">Birth Certificate</span>
                </div>
                <span class="text-green-600 text-sm font-medium">Uploaded</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-900">Custody Agreement</span>
                </div>
                <span class="text-green-600 text-sm font-medium">Verified</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-gray-900">Both Parents ID</span>
                </div>
                <span class="text-green-600 text-sm font-medium">Complete</span>
              </div>
            </div>
          </div>

          <!-- Verification Tab Content -->
          <div v-else-if="activeTab[applications[2].id] === 'verification'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Identity Verification</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span class="text-gray-900">Child Identity</span>
                <span class="text-green-600 text-sm font-medium">Verified ✓</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span class="text-gray-900">Primary Guardian</span>
                <span class="text-green-600 text-sm font-medium">Verified ✓</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span class="text-gray-900">Secondary Guardian</span>
                <span class="text-green-600 text-sm font-medium">Verified ✓</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <span class="text-gray-900">Dual Placement Approval</span>
                <span class="text-green-600 text-sm font-medium">Approved ✓</span>
              </div>
            </div>
          </div>

          <!-- Tools Tab Content -->
          <div v-else-if="activeTab[applications[2].id] === 'tools'" class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">Application Tools</h4>
            <div class="grid grid-cols-2 gap-4">
              <button class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="font-medium">Download Agreement</span>
                </div>
              </button>
              <button 
                @click="handleManageSchedule(applications[2].dualPlacementId)"
                class="p-4 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="font-medium text-purple-700">Manage Schedule</span>
                </div>
              </button>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Case Worker: {{ applications[2].caseWorker }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <button 
                @click="handleContactCaseWorker"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Contact
              </button>
              <span class="text-xs text-gray-500">Last updated: {{ applications[2].lastUpdated }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Important Information Section -->
    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="font-semibold text-blue-900 mb-4">Important Information</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Application Deadlines -->
        <div>
          <h4 class="font-medium text-blue-900 mb-2">Application Deadlines</h4>
          <ul class="space-y-1 text-sm text-blue-800">
            <li>• Main Part 1: March 1 (new admissions)</li>
            <li>• Main Part 2: August 15 (new admissions)</li>
            <li>• Ongoing: year round for ongoing places</li>
          </ul>
        </div>
        
        <!-- Important Notes -->
        <div>
          <h4 class="font-medium text-blue-900 mb-2">Important Notes</h4>
          <ul class="space-y-1 text-sm text-blue-800">
            <li>• Save documents early for faster processing</li>
            <li>• Update preferences before processing deadline</li>
            <li>• Contact case worker for questions</li>
            <li>• Email notifications for status changes</li>
          </ul>
        </div>
      </div>
      
      <!-- Support Contact -->
      <div class="mt-6 pt-4 border-t border-blue-200">
        <p class="text-sm text-blue-800 mb-2">
          <strong>Need Help?</strong> Contact Oslo Contact Center (OCC) for assistance with ID verification or manual submission.
        </p>
        <button 
          @click="handleContactOICSupport"
          class="flex items-center px-3 py-1 border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          Contact OCC Support
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styling for progress animations */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Grid responsive classes */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style> 