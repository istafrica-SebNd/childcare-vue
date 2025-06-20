<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// ROUTE PARAMS
const childId = computed(() => route.params.childId as string)

// STATE
const activeTab = ref('overview')

// CHILD PROFILE DATA for Emma Hansen
const childProfile = ref({
  name: 'Emma Hansen',
  initials: 'EH',
  group: 'Blue Group',
  age: 4,
  status: 'Active',
  isDualPlacement: true,
  fullName: 'Emma Hansen',
  birthDate: '2020-03-15',
  startDate: '2023-08-15',
  primaryAddress: 'Pilestredet 42, 0167 Oslo',
  primaryGuardian: 'Anna Hansen (Mother)',
  secondaryGuardian: 'Erik Hansen (Father)',
  attendanceThisMonth: 85,
  documentsCompleted: { completed: 7, total: 8 },
  consentsSigned: { completed: 3, total: 4 },
  dualPlacement: {
    primaryKindergarten: 'Grünerløkka Barnehage',
    primaryDays: ['Monday', 'Tuesday', 'Friday'],
    primaryPercentage: 60,
    secondaryKindergarten: 'Sagene Barnehage', 
    secondaryDays: ['Wednesday', 'Thursday'],
    secondaryPercentage: 40,
    justification: 'Split custody arrangement - parents live in different districts',
    approvedDate: '6/10/2024'
  },
  application: {
    number: 'APP-2023-001234',
    date: '2023-06-15',
    desiredStartDate: '2023-08-15',
    status: 'Approved & Active',
    preferredKindergarten: 'Rainbow Kindergarten (1st choice)',
    specialRequirements: ['Allergy - Nuts', 'Dietary - Vegetarian'],
    priorityPoints: '15 points (Sibling bonus: 5, Distance: 10)'
  },
  consents: [
    {
      id: 1,
      title: 'Photo Permission',
      icon: '📷',
      status: 'Signed',
      signedDate: '2023-08-15',
      expiresDate: '2024-08-15'
    },
    {
      id: 2,
      title: 'Medical Treatment',
      icon: '💊',
      status: 'Signed',
      signedDate: '2023-08-15',
      expiresDate: '2025-08-15'
    },
    {
      id: 3,
      title: 'Field Trip Authorization',
      icon: '🚌',
      status: 'Expires Soon',
      signedDate: '2023-08-15',
      expiresDate: '2024-04-01'
    },
    {
      id: 4,
      title: 'Data Processing Consent',
      icon: '📋',
      status: 'Pending'
    }
  ],
  documents: {
    total: 24,
    recentUploads: 3,
    pendingReviews: 1,
    categories: [
      { name: 'Medical Records', count: 6, color: 'blue' },
      { name: 'Educational Reports', count: 8, color: 'green' },
      { name: 'Legal Documents', count: 4, color: 'purple' },
      { name: 'Photos & Activities', count: 6, color: 'orange' }
    ],
    recent: [
      {
        name: 'Development Report - March 2024',
        type: 'PDF',
        size: '2.1 MB',
        date: '2024-03-15'
      },
      {
        name: 'Health Certificate',
        type: 'PDF',
        size: '890 KB',
        date: '2024-03-10'
      },
      {
        name: 'Activity Photos - Week 11',
        type: 'ZIP',
        size: '15.2 MB',
        date: '2024-03-08'
      },
      {
        name: 'Vaccination Record Update',
        type: 'PDF',
        size: '645 KB',
        date: '2024-03-05'
      }
    ]
  },
  contacts: {
    primary: [
      {
        name: 'Anna Hansen',
        role: 'Mother (Primary Guardian)',
        phone: '+47 123 45 678',
        email: 'anna.hansen@email.com',
        pickupAuthorized: true,
        status: 'Primary'
      },
      {
        name: 'Erik Hansen',
        role: 'Father (Secondary Guardian)',
        phone: '+47 987 65 432',
        email: 'erik.hansen@email.com',
        pickupAuthorized: true,
        status: 'Primary'
      }
    ],
    emergency: [
      {
        name: 'Grandma Astrid',
        role: 'Grandmother',
        phone: '+47 456 78 901',
        pickupAuthorized: true
      },
      {
        name: 'Uncle Lars',
        role: 'Uncle',
        phone: '+47 234 56 789',
        pickupAuthorized: false
      }
    ],
    staff: [
      {
        name: 'Maria Eriksen',
        role: 'Lead Educator - Blue Group',
        phone: '+47 555 12 34'
      },
      {
        name: 'Thomas Berg',
        role: 'Assistant Educator',
        phone: '+47 555 56 78'
      },
      {
        name: 'Lisa Andersen',
        role: 'Kindergarten Manager',
        phone: '+47 555 90 12'
      }
    ]
  },
  attendance: {
    thisWeek: { attended: 4, total: 5 },
    thisMonth: { attended: 17, total: 20 },
    averageHours: '7.5h',
    recent: [
      {
        date: '2024-03-18',
        status: 'Present',
        timeIn: '08:15',
        timeOut: '15:30',
        hours: '7h 15m'
      },
      {
        date: '2024-03-17',
        status: 'Present',
        timeIn: '08:20',
        timeOut: '15:45',
        hours: '7h 25m'
      },
      {
        date: '2024-03-16',
        status: 'Absent',
        timeIn: '-',
        timeOut: '-',
        hours: '-'
      },
      {
        date: '2024-03-15',
        status: 'Present',
        timeIn: '08:10',
        timeOut: '16:00',
        hours: '7h 50m'
      },
      {
        date: '2024-03-14',
        status: 'Present',
        timeIn: '08:25',
        timeOut: '15:30',
        hours: '7h 5m'
      }
    ]
  }
})

// NAVIGATION ITEMS
const navigationItems = ref([
  { id: 'overview', label: 'Overview', icon: 'user', active: true, route: `/guardian/child-profile/${childId.value}` },
  { id: 'application', label: 'Application Details', icon: 'file-text', active: false, route: `/guardian/application-status` },
  { id: 'attendance', label: 'Attendance', icon: 'clock', active: false, route: `/guardian/attendance-tracking` },
  { id: 'consents', label: 'Consents', icon: 'check-circle', active: false, route: `/guardian/consents` },
  { id: 'living', label: 'Living Arrangements', icon: 'home', active: false, route: `/guardian/living-arrangements` },
  { id: 'documents', label: 'Documents', icon: 'folder', active: false, route: `/guardian/documents` },
  { id: 'contacts', label: 'Contacts', icon: 'users', active: false, route: `/guardian/emergency-contacts` }
])

// **FUNCTIONAL HANDLERS**
const handleBackToChildren = () => {
  router.push('/guardian/children')
}

const handleNavigationClick = (item: any) => {
  // Update active state
  navigationItems.value.forEach(navItem => navItem.active = navItem.id === item.id)
  activeTab.value = item.id
  
  // No redirections - all content shows within the same page
}

const handleViewLivingArrangements = () => {
  // Switch to living arrangements tab within the same page
  navigationItems.value.forEach(navItem => navItem.active = navItem.id === 'living')
  activeTab.value = 'living'
}

const handleViewFullLivingArrangements = () => {
  // Navigate to the full living arrangements page
  router.push('/guardian/living-arrangements')
}

const handleManageDualPlacement = () => {
  // Navigate to dual placement management page
  // Using a placeholder ID - in real app this would be the actual dual placement ID
  router.push('/guardian/dual-placement/dp-2024-001')
}

const handleCompletePendingConsents = () => {
  // Navigate to the consents page
  router.push('/guardian/consents')
}

const handleViewDocument = (document: any) => {
  // Navigate to documents page or open document viewer
  router.push('/guardian/documents')
}

const handleDownloadDocument = (document: any) => {
  // In a real app, this would trigger a download
  console.log('Downloading document:', document.name)
  // For now, we can navigate to documents page
  router.push('/guardian/documents')
}

const handleSignConsent = (consentId: number) => {
  // Navigate to the specific consent signing page
  router.push('/guardian/consents')
}

const handleManagePickupAuthorization = () => {
  // Navigate to pickup authorization page
  router.push('/guardian/pickup-authorization')
}

const getConsentStatusColor = (status: string) => {
  switch (status) {
    case 'Signed': return 'bg-gray-900 text-white'
    case 'Expires Soon': return 'bg-red-100 text-red-800'
    case 'Pending': return 'bg-blue-600 text-white'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getCategoryColor = (color: string) => {
  switch (color) {
    case 'blue': return 'text-blue-600 bg-blue-100'
    case 'green': return 'text-green-600 bg-green-100'
    case 'purple': return 'text-purple-600 bg-purple-100'
    case 'orange': return 'text-orange-600 bg-orange-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getAttendanceStatusColor = (status: string) => {
  switch (status) {
    case 'Present': return 'bg-gray-900 text-white'
    case 'Absent': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Back Button -->
    <div class="mb-6">
      <button 
        @click="handleBackToChildren"
        class="flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Children
      </button>
    </div>

    <!-- Child Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex items-center space-x-4">
        <!-- Avatar -->
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {{ childProfile.initials }}
        </div>
        
        <!-- Child Info -->
        <div>
          <div class="flex items-center space-x-3 mb-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ childProfile.name }}</h1>
            <div class="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              Dual Placement
            </div>
          </div>
          <p class="text-gray-600">{{ childProfile.group }} • Age {{ childProfile.age }}</p>
          <div class="mt-2">
            <span class="inline-block px-2 py-1 bg-gray-900 text-white rounded text-xs font-medium">
              {{ childProfile.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-12 gap-8">
      <!-- Left Sidebar Navigation -->
      <div class="col-span-3">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Child Profile</h3>
          
          <nav class="space-y-2">
            <button
              v-for="item in navigationItems"
              :key="item.id"
              @click="handleNavigationClick(item)"
              :class="[
                'w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-colors duration-200',
                item.active 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <!-- Icon based on item type -->
              <svg v-if="item.icon === 'user'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <svg v-else-if="item.icon === 'file-text'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <svg v-else-if="item.icon === 'clock'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else-if="item.icon === 'check-circle'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else-if="item.icon === 'home'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <svg v-else-if="item.icon === 'folder'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <svg v-else-if="item.icon === 'users'" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              
              <span class="font-medium">{{ item.label }}</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="col-span-9">
        <!-- Overview Tab Content -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Dual Placement Arrangement -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                <h2 class="text-lg font-semibold text-gray-900">Dual Placement Arrangement</h2>
                <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  Active
                </span>
              </div>
              <button 
                @click="handleManageDualPlacement"
                class="flex items-center px-3 py-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Manage
              </button>
            </div>
            
            <p class="text-gray-600 text-sm mb-4">This child attends two kindergartens based on custody arrangements</p>
            
            <!-- Kindergarten Split -->
            <div class="grid grid-cols-2 gap-6 mb-4">
              <!-- Primary Kindergarten -->
              <div>
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="font-medium text-gray-900">Primary Kindergarten</span>
                  <span class="text-sm font-medium text-blue-600">{{ childProfile.dualPlacement.primaryPercentage }}%</span>
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">{{ childProfile.dualPlacement.primaryKindergarten }}</h4>
                <div class="flex items-center space-x-1 text-sm text-purple-600 mb-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Days: {{ childProfile.dualPlacement.primaryDays.join(', ') }}</span>
                </div>
              </div>
              
              <!-- Secondary Kindergarten -->
              <div>
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="font-medium text-gray-900">Secondary Kindergarten</span>
                  <span class="text-sm font-medium text-green-600">{{ childProfile.dualPlacement.secondaryPercentage }}%</span>
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">{{ childProfile.dualPlacement.secondaryKindergarten }}</h4>
                <div class="flex items-center space-x-1 text-sm text-purple-600 mb-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Days: {{ childProfile.dualPlacement.secondaryDays.join(', ') }}</span>
                </div>
              </div>
            </div>
            
            <!-- Justification -->
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-purple-800 mb-1"><strong>Justification:</strong> {{ childProfile.dualPlacement.justification }}</p>
              <p class="text-xs text-purple-600">Approved on {{ childProfile.dualPlacement.approvedDate }}</p>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="grid grid-cols-2 gap-8">
              <!-- Left: Basic Information -->
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-1">Basic Information</h2>
                <p class="text-gray-600 text-sm mb-4">Child's basic details and kindergarten information</p>
                
                <div class="grid grid-cols-2 gap-6">
                  <!-- Left Column -->
                  <div class="space-y-4">
                    <div>
                      <label class="text-sm font-medium text-gray-700 block">Full Name</label>
                      <p class="text-gray-900 font-medium">{{ childProfile.fullName }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 block">Birth Date</label>
                      <p class="text-gray-900">{{ childProfile.birthDate }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 block">Group</label>
                      <p class="text-gray-900">{{ childProfile.group }}</p>
                    </div>
                  </div>
                  
                  <!-- Right Column -->
                  <div class="space-y-4">
                    <div>
                      <label class="text-sm font-medium text-gray-700 block">Age</label>
                      <p class="text-gray-900 font-medium">{{ childProfile.age }} years old</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 block">Start Date</label>
                      <p class="text-gray-900">{{ childProfile.startDate }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700 block">Status</label>
                      <div class="flex items-center space-x-2">
                        <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          {{ childProfile.status }}
                        </span>
                        <span class="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                          </svg>
                          Dual
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Quick Stats -->
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-1">Quick Stats</h2>
                <p class="text-gray-600 text-sm mb-4">Recent activity and attendance summary</p>
                
                <div class="space-y-6">
                  <!-- Attendance This Month -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700">Attendance This Month</span>
                      <span class="text-sm font-bold text-gray-900">{{ childProfile.attendanceThisMonth }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        :style="{ width: childProfile.attendanceThisMonth + '%' }"
                      ></div>
                    </div>
                  </div>

                  <!-- Documents Completed -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700">Documents Completed</span>
                      <span class="text-sm font-bold text-gray-900">
                        {{ childProfile.documentsCompleted.completed }}/{{ childProfile.documentsCompleted.total }}
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        :style="{ width: (childProfile.documentsCompleted.completed / childProfile.documentsCompleted.total) * 100 + '%' }"
                      ></div>
                    </div>
                  </div>

                  <!-- Consents Signed -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700">Consents Signed</span>
                      <span class="text-sm font-bold text-gray-900">
                        {{ childProfile.consentsSigned.completed }}/{{ childProfile.consentsSigned.total }}
                      </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        :style="{ width: (childProfile.consentsSigned.completed / childProfile.consentsSigned.total) * 100 + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Living Arrangements Summary -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Living Arrangements Summary</h2>
            <p class="text-gray-600 text-sm mb-4">Primary address and guardian information</p>
            
            <div class="grid grid-cols-2 gap-6">
              <!-- Primary Address -->
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-2">Primary Address</label>
                <p class="text-gray-900">{{ childProfile.primaryAddress }}</p>
              </div>
              
              <!-- Primary Guardians -->
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-2">Primary Guardians</label>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-900">{{ childProfile.primaryGuardian }}</span>
                    <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      Primary
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-900">{{ childProfile.secondaryGuardian }}</span>
                    <span class="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      Secondary
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action Button -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <button 
                @click="handleViewLivingArrangements"
                class="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                View Complete Living Arrangements
              </button>
            </div>
          </div>
        </div>

        <!-- Living Arrangements Section -->
        <div v-if="activeTab === 'living'" class="space-y-6">
          <!-- Primary Residence -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Primary Residence</h2>
            <p class="text-gray-600 text-sm mb-6">Main living arrangement details</p>
            
            <div class="grid grid-cols-2 gap-8">
              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Address</h4>
                <p class="text-gray-900">{{ childProfile.primaryAddress }}</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Custody Arrangement</h4>
                <p class="text-gray-900">Joint custody</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Primary Guardian</h4>
                <p class="text-gray-900">{{ childProfile.primaryGuardian }}</p>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                <p class="text-gray-900">{{ childProfile.secondaryGuardian }}</p>
              </div>
            </div>
            
            <div class="mt-8">
              <button 
                @click="handleViewFullLivingArrangements"
                class="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                <span>View More Details</span>
              </button>
            </div>
          </div>

          <!-- Alternative Arrangements -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Alternative Arrangements</h2>
            <p class="text-gray-600 text-sm mb-6">Other custody and living arrangements</p>
            
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="font-semibold text-gray-900">Weekend Custody</h4>
                  <p class="text-gray-600">Every other weekend</p>
                </div>
                <span class="text-sm text-gray-500">Every other weekend</span>
              </div>
              
              <div class="grid grid-cols-2 gap-8">
                <div>
                  <h5 class="font-medium text-gray-700 mb-2">Guardian</h5>
                  <p class="text-gray-900">Erik Hansen (Father)</p>
                </div>
                <div>
                  <h5 class="font-medium text-gray-700 mb-2">Address</h5>
                  <p class="text-gray-900">Storgata 15, 0155 Oslo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Consents Section -->
        <div v-if="activeTab === 'consents'" class="space-y-6">
          <!-- Action Required Banner -->
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">
                <h3 class="font-semibold text-orange-900">Action Required</h3>
                <p class="text-orange-700">1 consent form requires your signature</p>
              </div>
              <button 
                @click="handleCompletePendingConsents"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Complete Pending Consents
              </button>
            </div>
          </div>

          <!-- Consent Forms -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Consent Forms</h2>
            <p class="text-gray-600 text-sm mb-6">All consent forms and their current status</p>

            <div class="space-y-4">
              <div 
                v-for="consent in childProfile.consents" 
                :key="consent.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <div class="text-2xl">{{ consent.icon }}</div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ consent.title }}</h3>
                    <p v-if="consent.signedDate" class="text-sm text-gray-600">
                      Signed: {{ consent.signedDate }} • Expires: {{ consent.expiresDate }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getConsentStatusColor(consent.status)
                  ]">
                    {{ consent.status }}
                  </span>
                  <button class="p-2 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button v-if="consent.status === 'Pending'" @click="handleSignConsent(consent.id)" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Sign
                  </button>
                  <button v-else class="p-2 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div v-if="activeTab === 'documents'" class="space-y-6">
          <!-- Document Statistics -->
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="font-semibold text-gray-900 mb-2">Total Documents</h3>
              <div class="text-3xl font-bold text-gray-900">{{ childProfile.documents.total }}</div>
              <p class="text-gray-600 text-sm">Available documents</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="font-semibold text-gray-900 mb-2">Recent Uploads</h3>
              <div class="text-3xl font-bold text-gray-900">{{ childProfile.documents.recentUploads }}</div>
              <p class="text-gray-600 text-sm">This month</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="font-semibold text-gray-900 mb-2">Pending Reviews</h3>
              <div class="text-3xl font-bold text-gray-900">{{ childProfile.documents.pendingReviews }}</div>
              <p class="text-gray-600 text-sm">Requires attention</p>
            </div>
          </div>

          <!-- Document Categories -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Document Categories</h2>
            <p class="text-gray-600 text-sm mb-6">Organized by document type</p>

            <div class="grid grid-cols-2 gap-4">
              <div 
                v-for="category in childProfile.documents.categories" 
                :key="category.name"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="font-medium text-gray-900">{{ category.name }}</span>
                </div>
                <span :class="[
                  'px-2 py-1 rounded-full text-sm font-medium',
                  getCategoryColor(category.color)
                ]">
                  {{ category.count }} files
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Documents -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Recent Documents</h2>
            <p class="text-gray-600 text-sm mb-6">Latest uploads and updates</p>

            <div class="space-y-4">
              <div 
                v-for="document in childProfile.documents.recent" 
                :key="document.name"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ document.name }}</h3>
                    <p class="text-sm text-gray-600">{{ document.type }} • {{ document.size }} • {{ document.date }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="handleViewDocument(document)"
                    class="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="handleDownloadDocument(document)"
                    class="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contacts Section -->
        <div v-if="activeTab === 'contacts'" class="space-y-6">
          <!-- Primary Contacts -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Primary Contacts</h2>
            <p class="text-gray-600 text-sm mb-6">Main guardians and emergency contacts</p>

            <div class="space-y-4">
              <div 
                v-for="contact in childProfile.contacts.primary" 
                :key="contact.name"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ contact.name }}</h3>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {{ contact.status }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ contact.role }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <span>{{ contact.phone }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span>{{ contact.email }}</span>
                    </div>
                  </div>
                  <div class="mt-2 flex items-center space-x-2">
                    <span class="text-sm text-gray-600">Pickup authorized:</span>
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      contact.pickupAuthorized ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]">
                      {{ contact.pickupAuthorized ? 'Yes' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Contacts -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-1">
              <h2 class="text-lg font-semibold text-gray-900">Emergency Contacts</h2>
              <button 
                @click="handleManagePickupAuthorization"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Manage Pickup Authorization
              </button>
            </div>
            <p class="text-gray-600 text-sm mb-6">Additional emergency contact persons</p>

            <div class="space-y-4">
              <div 
                v-for="contact in childProfile.contacts.emergency" 
                :key="contact.name"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 class="font-semibold text-gray-900">{{ contact.name }}</h3>
                  <p class="text-sm text-gray-600 mb-1">{{ contact.role }}</p>
                  <div class="flex items-center space-x-1 text-sm text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>{{ contact.phone }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-600">Pickup:</span>
                  <span :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    contact.pickupAuthorized ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ contact.pickupAuthorized ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Kindergarten Staff -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Kindergarten Staff</h2>
            <p class="text-gray-600 text-sm mb-6">Primary educators and support staff</p>

            <div class="space-y-4">
              <div 
                v-for="staff in childProfile.contacts.staff" 
                :key="staff.name"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 class="font-semibold text-gray-900">{{ staff.name }}</h3>
                  <p class="text-sm text-gray-600">{{ staff.role }}</p>
                </div>
                <div class="flex items-center space-x-1 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>{{ staff.phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Application Details Section -->
        <div v-if="activeTab === 'application'" class="space-y-6">
          <!-- Application Information -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Application Information</h2>
            <p class="text-gray-600 text-sm mb-6">Details about the kindergarten application</p>

            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block">Application Number</label>
                  <p class="text-gray-900">{{ childProfile.application.number }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 block">Desired Start Date</label>
                  <p class="text-gray-900">{{ childProfile.application.desiredStartDate }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 block">Application Date</label>
                  <p class="text-gray-900">{{ childProfile.application.date }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 block">Application Status</label>
                  <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    {{ childProfile.application.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences & Requirements -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Preferences & Requirements</h2>
            <p class="text-gray-600 text-sm mb-6">Selected preferences during application</p>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-2">Preferred Kindergarten</label>
                <p class="text-gray-900">{{ childProfile.application.preferredKindergarten }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-2">Special Requirements</label>
                <div class="flex space-x-2">
                  <span 
                    v-for="requirement in childProfile.application.specialRequirements"
                    :key="requirement"
                    class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {{ requirement }}
                  </span>
                </div>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-2">Priority Points</label>
                <p class="text-gray-900">{{ childProfile.application.priorityPoints }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance Section -->
        <div v-if="activeTab === 'attendance'" class="space-y-6">
          <!-- Attendance Statistics -->
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="font-semibold text-gray-900 mb-2">This Week</h3>
              <div class="text-3xl font-bold text-green-600">{{ childProfile.attendance.thisWeek.attended }}/{{ childProfile.attendance.thisWeek.total }}</div>
              <p class="text-gray-600 text-sm">Days attended</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="font-semibold text-gray-900 mb-2">This Month</h3>
              <div class="text-3xl font-bold text-blue-600">{{ childProfile.attendance.thisMonth.attended }}/{{ childProfile.attendance.thisMonth.total }}</div>
              <p class="text-gray-600 text-sm">Days attended</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="font-semibold text-gray-900 mb-2">Average Hours</h3>
              <div class="text-3xl font-bold text-purple-600">{{ childProfile.attendance.averageHours }}</div>
              <p class="text-gray-600 text-sm">Per day</p>
            </div>
          </div>

          <!-- Recent Attendance -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-1">Recent Attendance</h2>
            <p class="text-gray-600 text-sm mb-6">Last 7 days attendance record</p>

            <div class="space-y-3">
              <div 
                v-for="record in childProfile.attendance.recent" 
                :key="record.date"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <span class="font-medium text-gray-900">{{ record.date }}</span>
                  <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getAttendanceStatusColor(record.status)
                  ]">
                    {{ record.status }}
                  </span>
                </div>
                <div v-if="record.status === 'Present'" class="text-sm text-gray-600">
                  In: {{ record.timeIn }} &nbsp;&nbsp; Out: {{ record.timeOut }} &nbsp;&nbsp; Hours: {{ record.hours }}
                </div>
                <div v-else class="text-sm text-gray-400">
                  In: {{ record.timeIn }} &nbsp;&nbsp; Out: {{ record.timeOut }} &nbsp;&nbsp; Hours: {{ record.hours }}
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
/* Custom styling for grid layout */
.grid {
  display: grid;
}

.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.col-span-3 {
  grid-column: span 3 / span 3;
}

.col-span-9 {
  grid-column: span 9 / span 9;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style> 
