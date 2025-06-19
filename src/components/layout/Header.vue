<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { ref, computed } from 'vue'
import { 
  Bell, 
  Menu as MenuIcon, 
  User, 
  LogOut, 
  Settings, 
  GraduationCap, 
  CheckCircle, 
  Shield,
  Globe,
  ChevronDown
} from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()
const { t, locale } = useI18n()

// Dropdown states
const showUserMenu = ref(false)
const showLanguageMenu = ref(false)

const languages = ref([
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' }
])

const currentLanguage = computed(() => 
  languages.value.find(lang => lang.code === locale.value) || languages.value[0]
)

const handleLogout = () => {
  auth.logout()
  router.push('/')
  showUserMenu.value = false
}

const handleSettings = () => {
  // Navigate to settings page if it exists
  console.log('Navigate to settings')
  showUserMenu.value = false
}

const handleProfile = () => {
  // Navigate to profile page if it exists
  console.log('Navigate to profile')
  showUserMenu.value = false
}

const changeLanguage = (language: any) => {
  locale.value = language.code
  localStorage.setItem('language', language.code)
  showLanguageMenu.value = false
}

const getRoleLabel = (role?: string) => {
  switch(role) {
    case 'guardian': return 'Guardian'
    case 'caseworker': return 'Case Worker'
    case 'admin': return 'Administrator'
    case 'educator': return 'Educator'
    case 'staff': return 'Public Kindergarten Staff'
    case 'partner': return 'Private Kindergarten Staff'
    case 'district-admin': return 'District Administrator'
    default: return ''
  }
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showUserMenu.value = false
  showLanguageMenu.value = false
}

defineEmits(['toggle-sidebar'])
</script>

<template>
  <header class="bg-white border-b border-slate-200">
    <div class="flex items-center justify-between px-6 py-3">
      <!-- Left side - Menu toggle and IST Platform logo -->
      <div class="flex items-center gap-4">
        <Button
          icon="pi pi-bars"
          text
          rounded
          size="small"
          class="text-slate-600 hover:bg-slate-100"
          @click="$emit('toggle-sidebar')"
        />
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900">IST Platform</h1>
            <p class="text-xs text-slate-600 -mt-1">Oslo Municipality</p>
          </div>
        </div>
      </div>

      <!-- Right side - Welcome message and user info -->
      <div class="flex items-center gap-6">
        <!-- Welcome message section -->
        <div class="text-center">
          <div class="text-lg font-semibold text-slate-900">{{ t('auth.welcome', 'Welcome') }}, {{ auth.user?.name || 'Anna Hansen' }}</div>
          <div class="text-sm text-slate-600">{{ locale === 'no' ? 'Administrer kontoen din og få tilgang til tjenester' : 'Manage your account and access services' }}</div>
        </div>
        
        <!-- Oslo District badge -->
        <div class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Oslo District
        </div>

        <!-- Language selector -->
        <div class="relative">
          <button 
            @click="showLanguageMenu = !showLanguageMenu"
            class="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <Globe class="w-4 h-4 text-gray-500" />
            <span class="text-sm font-medium">{{ currentLanguage.name }}</span>
            <ChevronDown class="w-4 h-4 text-gray-400" />
          </button>

          <!-- Language Dropdown Menu -->
          <div 
            v-if="showLanguageMenu"
            class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            @click.stop
          >
            <div class="py-1">
              <button
                v-for="language in languages"
                :key="language.code"
                @click="changeLanguage(language)"
                class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                :class="{ 'bg-blue-50 text-blue-700': language.code === locale }"
              >
                <span class="text-base">{{ language.flag }}</span>
                <span class="text-sm font-medium">{{ language.name }}</span>
                <CheckCircle v-if="language.code === locale" class="w-4 h-4 text-blue-600 ml-auto" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- User info dropdown -->
        <div class="relative">
          <button 
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <User class="w-4 h-4 text-white" />
            </div>
            <div class="text-left">
              <div class="text-sm font-semibold text-slate-900">{{ auth.user?.name || 'Anna Hansen' }}</div>
              <div class="text-xs text-slate-600">{{ getRoleLabel(auth.user?.role) || 'Guardian' }}</div>
            </div>
            <ChevronDown class="w-4 h-4 text-gray-400" />
          </button>

          <!-- User Dropdown Menu -->
          <div 
            v-if="showUserMenu"
            class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            @click.stop
          >
            <div class="py-1">
              <button
                @click="handleProfile"
                class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <User class="w-4 h-4 text-gray-500" />
                <span class="text-sm font-medium text-gray-700">Profile</span>
              </button>
              
              <button
                @click="handleSettings"
                class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <Settings class="w-4 h-4 text-gray-500" />
                <span class="text-sm font-medium text-gray-700">Settings</span>
              </button>
              
              <div class="border-t border-gray-100 my-1"></div>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 text-red-600"
              >
                <LogOut class="w-4 h-4 text-red-500" />
                <span class="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop to close dropdowns -->
    <div 
      v-if="showUserMenu || showLanguageMenu"
      class="fixed inset-0 z-40"
      @click="closeDropdowns"
    ></div>
  </header>
</template>

<style scoped>
/* Custom dropdown animations */
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Focus styles for accessibility */
button:focus {
  outline: none;
  ring: 2px;
  ring-color: rgb(59 130 246 / 0.5);
  ring-offset: 2px;
}

/* Smooth hover transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style> 