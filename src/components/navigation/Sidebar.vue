<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import { useRouter, useRoute } from 'vue-router'

interface MenuItem {
  id: string
  label: string
  icon: string
  route?: string
  children?: MenuItem[]
  badge?: string | number
  roles?: string[]
}

interface Props {
  userRole?: 'guardian' | 'educator' | 'admin' | 'case-worker'
  userName?: string
  userAvatar?: string
  orgName?: string
  orgLogo?: string
  menuItems: MenuItem[]
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'admin',
  userName: 'User',
  orgName: 'Empower learning',
  defaultCollapsed: false,
  menuItems: () => []
})

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(props.defaultCollapsed)
const expandedItems = ref<Set<string>>(new Set())
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleExpanded = (itemId: string) => {
  if (isCollapsed.value) return
  
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId)
  } else {
    expandedItems.value.add(itemId)
  }
}

const isExpanded = (itemId: string) => {
  return expandedItems.value.has(itemId)
}

const isActive = (item: MenuItem) => {
  if (item.route) {
    return route.path === item.route
  }
  return false
}

const navigateTo = (item: MenuItem) => {
  if (item.route) {
    router.push(item.route)
  }
}

const hasPermission = (item: MenuItem) => {
  if (!item.roles || item.roles.length === 0) return true
  return item.roles.includes(props.userRole)
}

const filteredMenuItems = computed(() => {
  return props.menuItems.filter(item => hasPermission(item))
})

// Default menu structure based on Figma
const defaultMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'pi pi-th-large',
    route: '/dashboard'
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: 'pi pi-users',
    children: [
      { id: 'activity-plans', label: 'Activity plans', icon: 'pi pi-calendar', route: '/admin/activity-plans' },
      { id: 'parent-teacher', label: 'Parent teacher meeting', icon: 'pi pi-comments', route: '/admin/meetings' },
      { id: 'organization', label: 'Organization', icon: 'pi pi-building', route: '/admin/organization' },
      { id: 'schools', label: 'Schools', icon: 'pi pi-home', route: '/admin/schools' },
      { id: 'staff', label: 'Staff', icon: 'pi pi-user', route: '/admin/staff' }
    ]
  },
  {
    id: 'admissions',
    label: 'Admissions',
    icon: 'pi pi-file',
    children: [
      { id: 'applications', label: 'Applications', icon: 'pi pi-file-edit', route: '/admissions/applications' },
      { id: 'admissions-list', label: 'Admissions', icon: 'pi pi-list', route: '/admissions/list' }
    ]
  },
  {
    id: 'person-register',
    label: 'Person register',
    icon: 'pi pi-user-plus',
    route: '/person-register'
  },
  {
    id: 'reports',
    label: 'Report & export data',
    icon: 'pi pi-chart-bar',
    route: '/reports'
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: 'pi pi-comments',
    route: '/communication'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'pi pi-cog',
    route: '/settings'
  }
]

const menuItems = computed(() => {
  return filteredMenuItems.value.length > 0 ? filteredMenuItems.value : defaultMenuItems
})
</script>

<template>
  <div :class="[
    'h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col',
    isCollapsed ? 'w-16' : 'w-72'
  ]">
    <!-- Header -->
    <div class="p-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <!-- Logo and Org Name -->
        <div :class="['flex items-center gap-3', isCollapsed && 'justify-center']">
          <div class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-sm">1ST</span>
          </div>
          <span v-if="!isCollapsed" class="text-gray-700 font-medium text-sm">
            {{ orgName }}
          </span>
        </div>
        
        <!-- Collapse Toggle -->
        <Button
          :icon="isCollapsed ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'"
          text
          rounded
          size="small"
          class="text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 p-0"
          @click="toggleSidebar"
        />
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-4">
      <div class="px-3 space-y-1">
        <!-- Menu Items -->
        <div v-for="item in menuItems" :key="item.id" class="space-y-1">
          <!-- Parent Item -->
          <div
            :class="[
              'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors',
              isActive(item) 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="item.children ? toggleExpanded(item.id) : navigateTo(item)"
          >
            <!-- Icon -->
            <i :class="[
              item.icon,
              'w-5 h-5 flex-shrink-0',
              isActive(item) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
            ]"></i>
            
            <!-- Label and Expand Icon -->
            <div v-if="!isCollapsed" class="flex items-center justify-between w-full ml-3">
              <span class="truncate">{{ item.label }}</span>
              
              <!-- Expand/Collapse Icon for parent items -->
              <i 
                v-if="item.children"
                :class="[
                  'pi w-4 h-4 flex-shrink-0 transition-transform',
                  isExpanded(item.id) ? 'pi-chevron-up' : 'pi-chevron-down',
                  isActive(item) ? 'text-blue-600' : 'text-gray-400'
                ]"
              ></i>
              
              <!-- Badge -->
              <span
                v-else-if="item.badge"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {{ item.badge }}
              </span>
            </div>
          </div>

          <!-- Children Items -->
          <div 
            v-if="item.children && !isCollapsed && isExpanded(item.id)"
            class="ml-6 space-y-1 animate-fadeIn"
          >
            <div
              v-for="child in item.children"
              :key="child.id"
              :class="[
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors',
                isActive(child)
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="navigateTo(child)"
            >
              <span class="truncate">{{ child.label }}</span>
              
              <!-- Child Badge -->
              <span
                v-if="child.badge"
                class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                {{ child.badge }}
              </span>
            </div>
          </div>

          <!-- Collapsed State - Show only icon with tooltip -->
          <div
            v-if="isCollapsed && item.children"
            class="space-y-1"
          >
            <div
              v-for="child in item.children"
              :key="`collapsed-${child.id}`"
              :class="[
                'group flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-colors mx-auto',
                isActive(child)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              ]"
              :title="child.label"
              @click="navigateTo(child)"
            >
              <i :class="[child.icon || 'pi pi-circle', 'w-4 h-4']"></i>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Support Section -->
    <div class="border-t border-gray-100 p-4">
      <div
        :class="[
          'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900',
          isCollapsed && 'justify-center'
        ]"
      >
        <i class="pi pi-question-circle w-5 h-5 flex-shrink-0 text-gray-500"></i>
        <span v-if="!isCollapsed" class="ml-3 truncate">Support / Documentation</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Fade in animation for children */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Button overrides */
:deep(.p-button-text) {
  background-color: transparent;
  border: none;
  color: inherit;
}

:deep(.p-button-text:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}

:deep(.p-button-rounded) {
  border-radius: 50%;
}

/* Icon alignment */
.pi {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Active state styling */
.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-blue-600 {
  color: #2563eb;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

/* Hover improvements */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.group-hover\:text-gray-700:hover {
  color: #374151;
}

/* Typography improvements */
.font-medium {
  font-weight: 500;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Spacing consistency */
.space-y-1 > * + * {
  margin-top: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .w-72 {
    width: 16rem;
  }
}
</style> 
