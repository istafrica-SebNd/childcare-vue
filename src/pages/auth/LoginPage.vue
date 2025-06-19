<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const email = ref('')
const error = ref('')
const isLoading = ref(false)
const loginStep = ref<'email' | 'staff-auth' | 'id-porten' | 'entra-id'>('email')
const domainType = ref<'guardian' | 'public-staff' | 'private-staff' | 'admin' | 'caseworker' | 'educator' | 'district-admin' | 'partner' | 'unknown'>('guardian')

const demoCredentials = [
  { 
    label: 'Guardian (ID-Porten)', 
    email: '', 
    emailDisplay: 'No email required', 
    type: 'guardian',
    authMethod: 'id-porten'
  },
  { 
    label: 'Case Worker (Entra ID)', 
    email: 'caseworker@oslo.kommune.no', 
    emailDisplay: 'caseworker@oslo.kommune.no', 
    type: 'caseworker',
    authMethod: 'entra-id'
  },
  { 
    label: 'Educator (Entra ID)', 
    email: 'educator@oslo.kommune.no', 
    emailDisplay: 'educator@oslo.kommune.no', 
    type: 'educator',
    authMethod: 'entra-id'
  },
  { 
    label: 'Public Kindergarten Staff (Entra ID)', 
    email: 'staff@oslo.kommune.no', 
    emailDisplay: 'staff@oslo.kommune.no', 
    type: 'public-staff',
    authMethod: 'entra-id'
  },
  { 
    label: 'Private Kindergarten Staff (Entra ID)', 
    email: 'partner@ist.com', 
    emailDisplay: 'partner@ist.com', 
    type: 'private-staff',
    authMethod: 'entra-id'
  },
  { 
    label: 'Admin (Entra ID)', 
    email: 'admin@admin.oslo.kommune.no', 
    emailDisplay: 'admin@admin.oslo.kommune.no', 
    type: 'admin',
    authMethod: 'entra-id'
  },
  { 
    label: 'District Admin (Entra ID)', 
    email: 'district@oslo.kommune.no', 
    emailDisplay: 'district@oslo.kommune.no', 
    type: 'district-admin',
    authMethod: 'entra-id'
  }
]

const auth = useAuthStore()
const { t } = useI18n()
const router = useRouter()

// Redirect if already authenticated
if (auth.user) {
  let redirectPath = '/'
  switch (auth.user.role) {
    case 'guardian': redirectPath = '/guardian'; break
    case 'caseworker': redirectPath = '/caseworker'; break
    case 'admin': redirectPath = '/admin'; break
    case 'staff': redirectPath = '/staff'; break
    case 'partner': redirectPath = '/partner'; break
    case 'district-admin': redirectPath = '/district-admin'; break
    case 'educator': redirectPath = '/educator'; break
    default: redirectPath = '/'
  }
  router.replace(redirectPath)
}

watch(email, (val) => {
  if (val) {
    domainType.value = auth.checkDomainType(val)
    error.value = ''
  }
})

function handleEmailSubmit() {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }
  const type = auth.checkDomainType(email.value)
  if (type === 'unknown') {
    error.value = 'Your organization is not currently supported. Please contact support.'
    return
  }
  loginStep.value = type === 'guardian' ? 'id-porten' : 'entra-id'
}

async function handleIDPortenLogin() {
  isLoading.value = true
  try {
    const success = await auth.loginWithIDPorten()
    if (success) {
      router.push('/guardian')
    }
  } catch (err) {
    error.value = 'Failed to connect to ID-Porten. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function handleEntraIDLogin() {
  isLoading.value = true
  try {
    const success = await auth.loginWithEntraID(email.value)
    if (success) {
      // Redirect based on user role
      const user = auth.user
      if (user) {
        switch (user.role) {
          case 'caseworker': router.push('/caseworker'); break
          case 'admin': router.push('/admin'); break
          case 'staff': router.push('/staff'); break
          case 'partner': router.push('/partner'); break
          case 'district-admin': router.push('/district-admin'); break
          case 'educator': router.push('/educator'); break
          default: router.push('/guardian')
        }
      }
    }
  } catch (err) {
    error.value = 'Failed to connect to Microsoft Entra ID. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleDemoLogin = async (credential: typeof demoCredentials[0]) => {
  isLoading.value = true
  
  try {
    let success = false
    
    if (credential.authMethod === 'id-porten') {
      success = await auth.loginWithIDPorten()
    } else {
      success = await auth.loginWithEntraID(credential.email)
    }
    
    if (success) {
      // Redirect based on user role
      const user = auth.user
      if (user) {
        switch (user.role) {
          case 'guardian': router.push('/guardian'); break
          case 'caseworker': router.push('/caseworker'); break
          case 'admin': router.push('/admin'); break
          case 'staff': router.push('/staff'); break
          case 'partner': router.push('/partner'); break
          case 'district-admin': router.push('/district-admin'); break
          case 'educator': router.push('/educator'); break
          default: router.push('/guardian')
        }
      }
    }
  } catch (err) {
    error.value = 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Main Login Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Header with Icon -->
        <div class="text-center py-8 px-6">
          <!-- Blue Graduation Cap Icon -->
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          
          <!-- Title -->
          <h1 class="text-2xl font-bold text-gray-900 mb-2">IST Platform Login</h1>
          <p class="text-gray-600 text-sm">Enter your email to continue</p>
        </div>

        <!-- Form Content -->
        <div class="px-6 pb-8">
          <!-- Email Input Form -->
          <form v-if="loginStep === 'email'" @submit.prevent="handleEmailSubmit" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email address"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                required
              >
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Continue</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            </button>

            <!-- Error Message -->
            <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {{ error }}
            </div>
          </form>

          <!-- ID-Porten Login -->
          <div v-else-if="loginStep === 'id-porten'" class="space-y-4">
            <button
              @click="handleIDPortenLogin"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"></path>
              </svg>
              Login with ID-Porten
            </button>
            <button
              @click="loginStep = 'email'"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Back
            </button>
            <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {{ error }}
            </div>
          </div>

          <!-- Entra ID Login -->
          <div v-else-if="loginStep === 'entra-id'" class="space-y-4">
            <button
              @click="handleEntraIDLogin"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd"></path>
              </svg>
              Login with Microsoft Entra ID
            </button>
            <button
              @click="loginStep = 'email'"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Back
            </button>
            <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {{ error }}
            </div>
          </div>
        </div>

        <!-- Demo Accounts Section -->
        <div class="bg-gray-50 px-6 py-6 border-t border-gray-100">
          <h3 class="text-sm font-medium text-gray-700 mb-4">Demo Accounts:</h3>
          
          <div class="space-y-3">
            <div 
              v-for="credential in demoCredentials" 
              :key="credential.label"
              class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
            >
              <div class="flex-1">
                <div class="font-medium text-gray-900 text-sm">{{ credential.label }}</div>
                <div class="text-xs text-gray-500 mt-1">{{ credential.emailDisplay }}</div>
              </div>
              <button
                @click="handleDemoLogin(credential)"
                :disabled="isLoading"
                class="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-white {
  animation: fadeIn 0.5s ease-out;
}

/* Focus styles for accessibility */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 