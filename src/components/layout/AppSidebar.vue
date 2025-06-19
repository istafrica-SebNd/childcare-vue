<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { 
  Home,
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  GraduationCap,
  Shield,
  Building2,
  UserCog,
  Clock,
  CreditCard,
  FolderOpen,
  Plus,
  AlertCircle,
  UserCheck,
  Globe,
  MapPin,
  Flag,
  Monitor,
  Database,
  Activity,
  Eye,
  BookOpen,
  HelpCircle,
  Bell
} from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
}>()

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()

const guardianPrimaryNavigation = [
  {
    title: 'navigation.dashboard',
    url: '/guardian',
    icon: Home,
    description: 'navigation.descriptions.dashboard'
  },
  {
    title: 'navigation.myApplications',
    url: '/guardian/application-status',
    icon: FileText,
    description: 'navigation.descriptions.myApplications'
  },
  {
    title: 'navigation.childrenList',
    url: '/guardian/children',
    icon: Users,
    description: 'navigation.descriptions.childrenList'
  },
  {
    title: 'navigation.dailySchedule',
    url: '/guardian/daily-schedule',
    icon: Clock,
    description: 'navigation.descriptions.dailySchedule'
  },
  {
    title: 'navigation.attendanceTracking',
    url: '/guardian/attendance-tracking',
    icon: Activity,
    description: 'navigation.descriptions.attendanceTracking'
  },
  {
    title: 'navigation.messages',
    url: '/guardian/messages', 
    icon: MessageSquare,
    description: 'navigation.descriptions.messages'
  },
  {
    title: 'navigation.payments',
    url: '/guardian/payments',
    icon: CreditCard,
    description: 'navigation.descriptions.payments'
  }
]

const guardianSecondaryNavigation = [
  {
    title: 'navigation.documents',
    url: '/guardian/documents',
    icon: FolderOpen
  },
  {
    title: 'navigation.holidayRegistration',
    url: '/guardian/holiday-registration',
    icon: Calendar
  },
  {
    title: 'navigation.emergencyContacts',
    url: '/guardian/emergency-contacts',
    icon: AlertCircle
  },
  {
    title: 'navigation.noticeBoard',
    url: '/guardian/notice-board',
    icon: Bell
  },
  {
    title: 'navigation.absenceReporting',
    url: '/guardian/absence-reporting',
    icon: Clock
  },
  {
    title: 'navigation.consents',
    url: '/guardian/consents',
    icon: HelpCircle
  }
]

const isActive = (url: string) => {
  return route.path === url
}

const getSidebarTitle = () => {
  switch (auth.user?.role) {
    case 'guardian':
      return 'Guardian Portal'
    case 'caseworker':
      return 'Case Worker Dashboard'
    case 'admin':
      return 'Municipality Administration'
    case 'educator':
      return 'Educator Portal'
    case 'staff':
      return 'Public Kindergarten'
    case 'partner':
      return 'Private Kindergarten'
    case 'district-admin':
      return 'District Administration'
    default:
      return 'Platform'
  }
}
</script>

<template>
  <aside
    :class="[
      'bg-white border-r border-slate-200 flex flex-col min-h-screen',
      open ? 'w-64' : 'w-20'
    ]"
    v-if="open"
  >
    <!-- Sidebar Header -->
    <div class="border-b border-slate-200 p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <GraduationCap class="w-6 h-6 text-white" />
        </div>
        <div class="min-w-0 flex-1" v-if="open">
          <h2 class="text-lg font-bold text-blue-600">IST Platform</h2>
          <p class="text-xs text-slate-600 -mt-1">Oslo Municipality</p>
        </div>
      </div>
    </div>

    <!-- Sidebar Content -->
    <div class="flex-1 p-4 overflow-y-auto">
      <!-- Guardian Navigation -->
      <div v-if="auth.user?.role === 'guardian'">
        <!-- Primary Navigation - Daily Essentials -->
        <div class="mb-6">
          <div class="text-blue-600 font-bold text-xs mb-3 px-2 uppercase tracking-wider">
            {{ t('navigation.dailyEssentials', 'Daily Essentials') }}
          </div>
          <nav class="space-y-1">
            <router-link
              v-for="item in guardianPrimaryNavigation"
              :key="item.title"
              :to="item.url"
              :class="[
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                'focus:shadow-lg focus:bg-blue-50',
                isActive(item.url) 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-blue-50 text-slate-700 hover:text-blue-600 hover:shadow-sm'
              ]"
            >
              <component 
                :is="item.icon" 
                :class="[
                  'h-5 w-5 flex-shrink-0 transition-colors duration-200',
                  isActive(item.url) ? 'text-white' : 'text-slate-500 group-hover:text-blue-600 group-focus:text-blue-600'
                ]" 
              />
              <div class="flex-1 min-w-0" v-if="open">
                <span :class="[
                  'font-medium text-sm block transition-colors duration-200',
                  isActive(item.url) ? 'text-white' : 'text-slate-900 group-focus:text-blue-700'
                ]">{{ t(item.title) }}</span>
                <p v-if="item.description" :class="[
                  'text-xs mt-0.5 transition-colors duration-200',
                  isActive(item.url) ? 'text-blue-100' : 'text-slate-500 group-hover:text-blue-500 group-focus:text-blue-600'
                ]">{{ t(item.description) }}</p>
              </div>
              <!-- Focus indicator line -->
              <div :class="[
                'absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-200',
                isActive(item.url) ? 'bg-blue-200' : 'bg-transparent group-focus:bg-blue-400'
              ]"></div>
            </router-link>
          </nav>
        </div>

        <div class="border-t border-slate-200 my-4"></div>

        <!-- Secondary Navigation - Administrative -->
        <div>
          <div class="text-slate-600 font-bold text-xs mb-3 px-2 uppercase tracking-wider">
            {{ t('navigation.administrative', 'Administrative') }}
          </div>
          <nav class="space-y-1">
            <router-link
              v-for="item in guardianSecondaryNavigation"
              :key="item.title"
              :to="item.url"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative',
                'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50',
                'focus:shadow-md focus:bg-slate-50',
                isActive(item.url) 
                  ? 'bg-slate-100 text-slate-900 shadow-sm' 
                  : 'hover:bg-slate-50 text-slate-700 hover:shadow-sm'
              ]"
            >
              <component 
                :is="item.icon" 
                :class="[
                  'h-4 w-4 flex-shrink-0 transition-colors duration-200',
                  isActive(item.url) ? 'text-slate-700' : 'text-slate-500 group-hover:text-slate-700 group-focus:text-slate-700'
                ]" 
              />
              <span :class="[
                'font-medium text-sm transition-colors duration-200',
                isActive(item.url) ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900 group-focus:text-slate-900'
              ]" v-if="open">{{ t(item.title) }}</span>
              <!-- Focus indicator line -->
              <div :class="[
                'absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-200',
                isActive(item.url) ? 'bg-slate-400' : 'bg-transparent group-focus:bg-slate-500'
              ]"></div>
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Enhanced focus and hover states */
.router-link-active {
  position: relative;
}

/* Smooth transitions for all interactive elements */
a, button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus ring improvements */
.group:focus {
  transform: translateX(2px);
}

/* Ensure focus ring is visible above other elements */
.group:focus-visible {
  z-index: 10;
}

/* Remove default browser focus outline on router links */
router-link:focus {
  outline: none;
}

/* Enhance shadow depth on focus for better visual hierarchy */
.group:focus {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Subtle animation for the focus indicator line */
.group:focus .absolute {
  animation: focusSlide 0.2s ease-out;
}

@keyframes focusSlide {
  from {
    width: 0;
  }
  to {
    width: 0.25rem;
  }
}

/* Improve accessibility with reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  a, button, .group {
    transition: none;
    animation: none;
  }
}
</style> 