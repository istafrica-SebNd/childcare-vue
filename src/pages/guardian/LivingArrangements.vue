<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()

// Tab Management
const activeTab = ref('other-arrangement') // Default to Other Arrangement as shown in first image

const tabs = [
  {
    id: 'shared-custody',
    title: 'Shared Custody',
    description: 'Child alternates between two homes',
    icon: 'shared-custody'
  },
  {
    id: 'fixed-residence',
    title: 'Fixed Residence',
    description: 'One primary home with authorized pickup',
    icon: 'fixed-residence'
  },
  {
    id: 'other-arrangement',
    title: 'Other Arrangement',
    description: 'Custom situation requiring documentation',
    icon: 'other-arrangement'
  }
]

// Common status data
const arrangementStatus = ref({
  addressVerified: true,
  contactVerified: true,
  documentsComplete: true,
  emergencyContactNeeded: true
})

// Other Arrangement Data (First Image)
const otherArrangementData = ref({
  lastUpdated: '2024-03-18',
  nextReview: '2025-09-01',
  status: 'selected',
  documentationRequired: true,
  setupCustom: false
})

// Fixed Residence Data (Second Image)
const fixedResidenceData = ref({
  lastUpdated: '2024-03-18',
  nextReview: '2025-09-01',
  status: 'selected',
  currentSetup: '4 authorized persons',
  primaryAddress: {
    street: 'Trondheimsveien 235',
    postalCode: '0586 Oslo',
    guardian: 'Mother (Anna Hansen)',
    role: 'Primary Guardian',
    phone: '+47 23 33 44 55',
    email: 'anna.hansen@email.com'
  },
  pickupSchedule: {
    days: ['M', 'T', 'W', 'T', 'F'],
    description: 'Monday - Thursday (Kindergarten pickup at 16:00)'
  },
  authorizedPersons: [
    {
      id: 'AH',
      name: 'Astrid Hansen',
      relationship: 'Grandmother',
      phone: '+47 23 11 22 33',
      purpose: 'Emergency backup for sick days',
      status: 'Active',
      restrictions: 'Emergency only'
    },
    {
      id: 'EO',
      name: 'Erik Olsen',
      relationship: 'Neighbor',
      phone: '+47 22 44 55 66',
      purpose: 'School holiday pickup when parents work',
      status: 'Active',
      restrictions: 'Weekdays only'
    },
    {
      id: 'MJ',
      name: 'Maria Johannsen',
      relationship: 'Babysitter',
      phone: '+47 22 77 88 99',
      purpose: 'Evening event pickup',
      status: 'Expires Soon',
      expiryDate: '2025-07-15',
      restrictions: 'After 17:00 only'
    },
    {
      id: 'NH',
      name: 'Nils Hansen',
      relationship: 'Uncle',
      phone: '+47 22 99 00 11',
      purpose: 'Authorized for Father\'s custody days',
      status: 'Active',
      restrictions: 'Friday-Sunday only'
    }
  ]
})

// Shared Custody Data (Third Image)
const sharedCustodyData = ref({
  lastUpdated: '2024-03-18',
  nextReview: '2025-09-01',
  status: 'selected',
  currentSchedule: {
    motherDays: 'Mon-Thu',
    fatherDays: 'Fri-Sun'
  },
  primaryAddress: {
    street: 'Trondheimsveien 235',
    postalCode: '0586 Oslo',
    guardian: 'Mother (Anna Hansen)',
    role: 'Primary Guardian',
    phone: '+47 23 33 44 55',
    email: 'anna.hansen@email.com'
  },
  secondaryAddress: {
    street: 'Bygdøy Allé 15',
    postalCode: '0262 Oslo',
    guardian: 'Father (Lars Hansen)',
    role: 'Secondary Guardian',
    phone: '+47 22 66 77 88',
    email: 'lars.hansen@email.com'
  },
  kindergartenPickupSchedule: {
    description: 'Friday - Sunday (Kindergarten pickup at 15:30)',
    days: ['F', 'S', 'S']
  },
  authorizedPersons: [
    {
      id: 'AH',
      name: 'Astrid Hansen',
      relationship: 'Grandmother',
      phone: '+47 23 11 22 33',
      purpose: 'Emergency backup for sick days',
      status: 'Active',
      restrictions: 'Emergency only'
    },
    {
      id: 'EO',
      name: 'Erik Olsen',
      relationship: 'Neighbor',
      phone: '+47 22 44 55 66',
      purpose: 'School holiday pickup when parents work',
      status: 'Active',
      restrictions: 'Weekdays only'
    },
    {
      id: 'MJ',
      name: 'Maria Johannsen',
      relationship: 'Babysitter',
      phone: '+47 22 77 88 99',
      purpose: 'Evening event pickup',
      status: 'Expires Soon',
      expiryDate: '2025-07-15',
      restrictions: 'After 17:00 only'
    },
    {
      id: 'NH',
      name: 'Nils Hansen',
      relationship: 'Uncle',
      phone: '+47 22 99 00 11',
      purpose: 'Authorized for Father\'s custody days',
      status: 'Active',
      restrictions: 'Friday-Sunday only'
    }
  ]
})

// Legal Documentation
const legalDocumentation = ref({
  custodyAgreement: {
    filename: 'custody-agreement.pdf',
    title: 'Custody Agreement - Verified',
    verified: true
  }
})

// Special Notes
const specialNotes = ref({
  holidaySchedule: 'Holiday schedule rotates annually. Christmas 2024: Mother, Easter 2025: Father. Child has special dietary requirements documented separately.'
})

// Methods
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
}

const handleManagePickup = () => {
  router.push('/guardian/pickup-authorization')
}

const handleAddPerson = () => {
  toast.add({
    severity: 'info',
    summary: 'Add Person',
    detail: 'Opening add person dialog...',
    life: 3000
  })
}

const handleSetupCustom = () => {
  otherArrangementData.value.setupCustom = true
  toast.add({
    severity: 'info',
    summary: 'Setup Custom',
    detail: 'Opening custom arrangement setup...',
    life: 3000
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'text-green-700 bg-green-50 border-green-200'
    case 'Expires Soon': return 'text-orange-700 bg-orange-50 border-orange-200'
    default: return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}
</script>

<template>
  <!-- Header Section -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('livingArrangements.title', 'Living Arrangements') }}</h1>
    <p class="text-gray-600">{{ t('livingArrangements.description', 'Manage living arrangement details') }}</p>
  </div>

  <!-- Detailed View -->
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Living Arrangements</h1>
          <p class="text-gray-600">Manage custody schedules, addresses, and pickup authorization</p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-6 text-sm text-gray-600">
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Last updated: 2024-03-18</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Next review: 2025-09-01</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Arrangement Status -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Arrangement Status</h2>

      <div class="grid grid-cols-4 gap-6">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700">Address Verified</span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700">Contact Verified</span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700">Documents Complete</span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700">Emergency Contact Needed</span>
        </div>
      </div>
    </div>

    <!-- Arrangement Type Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Arrangement Type</h2>

      <!-- Tab Navigation -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <!-- Shared Custody Tab -->
        <button
          @click="setActiveTab('shared-custody')"
          :class="[
            'border rounded-lg p-6 text-left transition-all duration-200',
            activeTab === 'shared-custody'
              ? 'border-2 border-blue-600 bg-blue-50'
              : 'border border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <div :class="[
              'flex items-center justify-center w-12 h-12 rounded-lg',
              activeTab === 'shared-custody' ? 'bg-blue-600' : 'bg-gray-100'
            ]">
              <svg :class="[
                'w-6 h-6',
                activeTab === 'shared-custody' ? 'text-white' : 'text-gray-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <span v-if="activeTab === 'shared-custody'" class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Selected</span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Shared Custody</h3>
          <p class="text-sm text-gray-600 mb-4">Child alternates between two homes</p>
          <div v-if="activeTab === 'shared-custody'" class="text-sm">
            <div class="text-blue-700 bg-blue-100 px-3 py-2 rounded mb-3">
              <div class="font-medium">Current Schedule:</div>
              <div class="flex items-center space-x-2 mt-1">
                <span>● Mon-Thu: Mother</span>
              </div>
              <div class="flex items-center space-x-2">
                <span>● Fri-Sun: Father</span>
              </div>
            </div>
          </div>
        </button>

        <!-- Fixed Residence Tab -->
        <button
          @click="setActiveTab('fixed-residence')"
          :class="[
            'border rounded-lg p-6 text-left transition-all duration-200',
            activeTab === 'fixed-residence'
              ? 'border-2 border-blue-600 bg-blue-50'
              : 'border border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <div :class="[
              'flex items-center justify-center w-12 h-12 rounded-lg',
              activeTab === 'fixed-residence' ? 'bg-blue-600' : 'bg-gray-100'
            ]">
              <svg :class="[
                'w-6 h-6',
                activeTab === 'fixed-residence' ? 'text-white' : 'text-gray-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <span v-if="activeTab === 'fixed-residence'" class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Selected</span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Fixed Residence</h3>
          <p class="text-sm text-gray-600 mb-4">One primary home with authorized pickup</p>
          <div v-if="activeTab === 'fixed-residence'" class="text-sm">
            <div class="text-blue-700 bg-blue-100 px-3 py-2 rounded mb-3">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Current setup:</span>
              </div>
              <div class="font-medium">4 authorized persons</div>
            </div>
            <button
              @click="handleManagePickup"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Manage Pickup
            </button>
          </div>
        </button>

        <!-- Other Arrangement Tab -->
        <button
          @click="setActiveTab('other-arrangement')"
          :class="[
            'border rounded-lg p-6 text-left transition-all duration-200',
            activeTab === 'other-arrangement'
              ? 'border-2 border-blue-600 bg-blue-50'
              : 'border border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <div :class="[
              'flex items-center justify-center w-12 h-12 rounded-lg',
              activeTab === 'other-arrangement' ? 'bg-blue-600' : 'bg-gray-100'
            ]">
              <svg :class="[
                'w-6 h-6',
                activeTab === 'other-arrangement' ? 'text-white' : 'text-gray-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <span v-if="activeTab === 'other-arrangement'" class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Selected</span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Other Arrangement</h3>
          <p class="text-sm text-gray-600 mb-4">Custom situation requiring documentation</p>
          <div v-if="activeTab === 'other-arrangement'" class="space-y-3">
            <div class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded font-medium">
              Documentation Required
            </div>
            <button
              @click="handleSetupCustom"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Setup Custom
            </button>
          </div>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="mt-8">
        <!-- Other Arrangement Content -->
        <div v-if="activeTab === 'other-arrangement'" class="space-y-6">
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Custom Arrangement Setup Required</h3>
            <p class="text-gray-600 mb-6">Please provide documentation for your specific living arrangement to proceed.</p>
            <button
              @click="handleSetupCustom"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Setup Custom Arrangement
            </button>
          </div>
        </div>

        <!-- Fixed Residence Content -->
        <div v-if="activeTab === 'fixed-residence'" class="space-y-6">
          <!-- Primary Address -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <h3 class="text-lg font-semibold text-gray-900">Primary Address</h3>
                <span class="text-sm text-gray-600">Main residence where child lives</span>
              </div>
              <button class="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Edit Address</span>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-8">
              <!-- Guardian Information -->
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  AH
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h4 class="font-semibold text-gray-900">{{ fixedResidenceData.primaryAddress.guardian }}</h4>
                    <span class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">{{ fixedResidenceData.primaryAddress.role }}</span>
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>

                  <div class="space-y-2 text-sm">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="font-medium text-gray-900">{{ fixedResidenceData.primaryAddress.street }}</span>
                    </div>
                    <div class="pl-6 text-gray-600">{{ fixedResidenceData.primaryAddress.postalCode }}</div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="space-y-4">
                <h4 class="font-semibold text-gray-900 flex items-center space-x-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>Contact Information</span>
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-500 w-12">Phone:</span>
                    <span class="text-gray-900">{{ fixedResidenceData.primaryAddress.phone }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-500 w-12">Email:</span>
                    <span class="text-gray-900">{{ fixedResidenceData.primaryAddress.email }}</span>
                  </div>
                </div>

                <!-- Pickup Schedule -->
                <div class="mt-6">
                  <h4 class="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Pickup Schedule</span>
                  </h4>
                  <div class="flex space-x-1 mb-2">
                    <div v-for="(day, index) in ['M', 'T', 'W', 'T', 'F']" :key="index"
                         :class="[
                           'w-6 h-6 rounded text-xs flex items-center justify-center',
                           fixedResidenceData.pickupSchedule.days.includes(day)
                             ? 'bg-green-500 text-white'
                             : 'bg-gray-100 text-gray-400'
                         ]">
                      {{ day }}
                    </div>
                  </div>
                  <p class="text-sm text-green-700">{{ fixedResidenceData.pickupSchedule.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shared Custody Content -->
        <div v-if="activeTab === 'shared-custody'" class="space-y-6">
          <!-- Primary Address -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <h3 class="text-lg font-semibold text-gray-900">Primary Address</h3>
                <span class="text-sm text-gray-600">Main residence where child lives</span>
              </div>
              <button class="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <span>Edit Address</span>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-8">
              <!-- Guardian Information -->
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  AH
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h4 class="font-semibold text-gray-900">{{ sharedCustodyData.primaryAddress.guardian }}</h4>
                    <span class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">{{ sharedCustodyData.primaryAddress.role }}</span>
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>

                  <div class="space-y-2 text-sm">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="font-medium text-gray-900">{{ sharedCustodyData.primaryAddress.street }}</span>
                    </div>
                    <div class="pl-6 text-gray-600">{{ sharedCustodyData.primaryAddress.postalCode }}</div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="space-y-4">
                <h4 class="font-semibold text-gray-900 flex items-center space-x-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>Contact Information</span>
                </h4>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-500 w-12">Phone:</span>
                    <span class="text-gray-900">{{ sharedCustodyData.primaryAddress.phone }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-500 w-12">Email:</span>
                    <span class="text-gray-900">{{ sharedCustodyData.primaryAddress.email }}</span>
                  </div>
                </div>

                <!-- Pickup Schedule -->
                <div class="mt-6">
                  <h4 class="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Pickup Schedule</span>
                  </h4>
                  <div class="flex space-x-1 mb-2">
                    <div v-for="(day, index) in ['M', 'T', 'W', 'T']" :key="index"
                         :class="[
                           'w-6 h-6 rounded text-xs flex items-center justify-center',
                           ['M', 'T', 'W', 'T'].includes(day)
                             ? 'bg-green-500 text-white'
                             : 'bg-gray-100 text-gray-400'
                         ]">
                      {{ day }}
                    </div>
                  </div>
                  <p class="text-sm text-green-700">Monday - Thursday (Kindergarten pickup at 16:00)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Address -->
          <div class="mt-8">
            <div class="flex items-center space-x-3 mb-6">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"></path>
              </svg>
              <h3 class="text-lg font-semibold text-gray-900">Secondary Address</h3>
              <span class="text-sm text-gray-600">Secondary residence where child lives Friday through Sunday</span>
            </div>

            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                LH
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h4 class="font-semibold text-gray-900">{{ sharedCustodyData.secondaryAddress.guardian }}</h4>
                  <span class="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">{{ sharedCustodyData.secondaryAddress.role }}</span>
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <button class="p-1 text-gray-400 hover:text-gray-600 ml-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>

                <div class="space-y-2 text-sm">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="font-medium text-gray-900">{{ sharedCustodyData.secondaryAddress.street }}</span>
                  </div>
                  <div class="pl-6 text-gray-600">{{ sharedCustodyData.secondaryAddress.postalCode }}</div>
                  <div class="pl-6 text-gray-600">
                    <div class="flex items-center space-x-4 mt-2">
                      <span>📞 {{ sharedCustodyData.secondaryAddress.phone }}</span>
                      <span>✉️ {{ sharedCustodyData.secondaryAddress.email }}</span>
                    </div>
                  </div>
                </div>

                <!-- Kindergarten Pickup Schedule -->
                <div class="mt-4">
                  <h4 class="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Kindergarten Pickup Schedule</span>
                  </h4>
                  <div class="flex space-x-1 mb-2">
                    <div v-for="(day, index) in ['F', 'S', 'S']" :key="index"
                         :class="[
                           'w-6 h-6 rounded text-xs flex items-center justify-center',
                           ['F', 'S', 'S'].includes(day)
                             ? 'bg-green-500 text-white'
                             : 'bg-gray-100 text-gray-400'
                         ]">
                      {{ day }}
                    </div>
                  </div>
                  <p class="text-sm text-green-700">{{ sharedCustodyData.kindergartenPickupSchedule.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Authorized Pickup Persons (Shared across all tabs) -->
    <div v-if="activeTab !== 'other-arrangement'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Authorized Pickup Persons</h2>
        <button
          @click="handleAddPerson"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Add Person</span>
        </button>
      </div>
      <p class="text-gray-600 text-sm mb-6">People authorized to collect your child when you cannot</p>

      <!-- Table Header -->
      <div class="grid grid-cols-6 gap-4 pb-3 mb-4 border-b border-gray-200 text-sm font-medium text-gray-700">
        <div>Person</div>
        <div>Contact</div>
        <div>Purpose</div>
        <div>Status</div>
        <div>Restrictions</div>
        <div class="text-right">Actions</div>
      </div>

      <!-- Authorized Persons List -->
      <div class="space-y-4">
        <div
          v-for="person in (activeTab === 'fixed-residence' ? fixedResidenceData.authorizedPersons : sharedCustodyData.authorizedPersons)"
          :key="person.id"
          class="grid grid-cols-6 gap-4 py-4 border-b border-gray-100 last:border-b-0"
        >
          <!-- Person Info -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {{ person.id }}
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ person.name }}</p>
              <p class="text-sm text-gray-600">{{ person.relationship }}</p>
            </div>
          </div>

          <!-- Contact -->
          <div class="flex items-center">
            <div>
              <p class="text-sm text-gray-900">{{ person.phone }}</p>
            </div>
          </div>

          <!-- Purpose -->
          <div class="flex items-center">
            <p class="text-sm text-gray-700">{{ person.purpose }}</p>
          </div>

          <!-- Status -->
          <div class="flex items-center">
            <span :class="[
              'text-xs font-medium px-2 py-1 rounded-full border',
              getStatusColor(person.status)
            ]">
              {{ person.status }}
            </span>
            <div v-if="person.expiryDate" class="ml-2 text-xs text-gray-500">
              Expires: {{ person.expiryDate }}
            </div>
          </div>

          <!-- Restrictions -->
          <div class="flex items-center">
            <p class="text-sm text-gray-600">{{ person.restrictions }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-2">
            <button class="p-1 text-gray-400 hover:text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            <button class="p-1 text-gray-400 hover:text-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Legal Documentation (Shared across all tabs) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Legal Documentation</h2>
      <p class="text-gray-600 text-sm mb-6">Custody agreements and supporting documents</p>

      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ legalDocumentation.custodyAgreement.filename }}</p>
              <p class="text-sm text-gray-600">{{ legalDocumentation.custodyAgreement.title }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-xs text-green-600 font-medium">Document verified</span>
              </div>
            </div>
          </div>
          <button class="flex items-center space-x-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>View Document</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Special Notes & Holiday Schedule (Shared across all tabs) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Special Notes & Holiday Schedule</h2>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm text-blue-700">{{ specialNotes.holidaySchedule }}</p>
        </div>
      </div>

      <!-- Important Information -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 class="flex items-center space-x-2 font-semibold text-green-900 mb-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Important Information</span>
        </h3>

        <div class="grid grid-cols-2 gap-6 text-sm text-green-800">
          <div>
            <ul class="space-y-1">
              <li>• Changes to living arrangements affect pickup authorization and emergency procedures</li>
              <li>• All pickup persons must provide valid ID when collecting your child</li>
              <li>• Holiday schedules may override regular custody arrangements</li>
            </ul>
          </div>
          <div>
            <ul class="space-y-1">
              <li>• Custody documents require annual review and updates</li>
              <li>• Emergency contacts are checked regularly for accuracy</li>
              <li>• Processing time for arrangement changes: 2-3 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4">
      <button class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
        Cancel
      </button>
      <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Save Changes
      </button>
    </div>
  </div>
</template>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Tab animations */
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.tab-enter-from,
.tab-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Enhanced button hover states */
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}

/* Card hover effects */
.arrangement-card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
  transition: all 0.3s ease-in-out;
}

/* Status badge styles */
.status-badge {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
  border-radius: 9999px;
  border-width: 1px;
  padding: 0.25rem 0.5rem;
}

/* Custom scrollbar for tables */
.table-container::-webkit-scrollbar {
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
