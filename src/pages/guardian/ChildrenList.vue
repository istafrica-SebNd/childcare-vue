<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// CHILDREN LIST DATA
const children = ref([
  {
    id: 'emma-hansen',
    name: 'Emma Hansen',
    age: 4,
    group: 'Blue Group',
    status: 'Active',
    kindergarten: 'Rainbow Kindergarten',
    startDate: 'August 2023',
    avatar: 'EH'
  },
  {
    id: 'lucas-hansen',
    name: 'Lucas Hansen', 
    age: 3,
    group: 'Red Group',
    status: 'Active',
    kindergarten: 'Rainbow Kindergarten',
    startDate: 'January 2024',
    avatar: 'LH'
  }
])

// **FUNCTIONAL CTA HANDLERS**
const handleChildSelect = (childId: string) => {
  router.push(`/guardian/child-profile/${childId}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- BREADCRUMB NAVIGATION -->
    <AppBreadcrumb />

    <!-- HEADER SECTION -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('children.myChildren', 'My Children') }}</h1>
      <p class="text-gray-600">{{ t('children.selectChild', 'Select a child to view their profile and information') }}</p>
    </div>

    <!-- CHILDREN GRID -->
    <div class="grid md:grid-cols-2 gap-6 max-w-5xl">
      <!-- CHILD CARD: Emma Hansen -->
      <div 
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-gray-300"
        @click="handleChildSelect('emma-hansen')"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <!-- LEFT: Child Info with Avatar -->
            <div class="flex items-center space-x-4">
              <!-- Avatar Circle -->
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                EH
              </div>
              
              <!-- Child Details -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-1">Emma Hansen</h2>
                <p class="text-gray-600 text-sm mb-2">Age 4 • Blue Group</p>
                <div class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  Active
                </div>
              </div>
            </div>
            
            <!-- RIGHT: Navigation Arrow -->
            <div class="text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <!-- Kindergarten & Date Info -->
          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Rainbow Kindergarten
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Started August 2023
            </div>
          </div>
        </div>
      </div>

      <!-- CHILD CARD: Lucas Hansen -->
      <div 
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-gray-300"
        @click="handleChildSelect('lucas-hansen')"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <!-- LEFT: Child Info with Avatar -->
            <div class="flex items-center space-x-4">
              <!-- Avatar Circle -->
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                LH
              </div>
              
              <!-- Child Details -->
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-1">Lucas Hansen</h2>
                <p class="text-gray-600 text-sm mb-2">Age 3 • Red Group</p>
                <div class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  Active
                </div>
              </div>
            </div>
            
            <!-- RIGHT: Navigation Arrow -->
            <div class="text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          
          <!-- Kindergarten & Date Info -->
          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Rainbow Kindergarten
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Started January 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure consistent grid spacing */
.grid {
  display: grid;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}
</style> 