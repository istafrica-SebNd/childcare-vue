<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/ui/Sidebar.vue'

interface Props {
  userRole?: 'guardian' | 'educator' | 'admin' | 'case-worker'
  userName?: string
  orgName?: string
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'admin',
  userName: 'Administrator',
  orgName: 'Empower learning'
})

// Define menu items based on user role
const getMenuItems = (role: string) => {
  const commonItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      route: '/dashboard'
    }
  ]

  const adminItems = [
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
        { id: 'applications', label: 'Applications', icon: 'pi pi-file-edit', route: '/admissions/applications', badge: '3' },
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

  const guardianItems = [
    {
      id: 'applications',
      label: 'My Applications',
      icon: 'pi pi-file',
      route: '/guardian/applications'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'pi pi-comments',
      route: '/guardian/messages',
      badge: '2'
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: 'pi pi-calendar',
      route: '/guardian/activities'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'pi pi-user',
      route: '/guardian/profile'
    }
  ]

  const educatorItems = [
    {
      id: 'students',
      label: 'Students',
      icon: 'pi pi-users',
      route: '/educator/students'
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: 'pi pi-calendar',
      route: '/educator/activities'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'pi pi-comments',
      route: '/educator/messages'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      route: '/educator/reports'
    }
  ]

  switch (role) {
    case 'admin':
      return [...commonItems, ...adminItems]
    case 'guardian':
      return [...commonItems, ...guardianItems]
    case 'educator':
      return [...commonItems, ...educatorItems]
    default:
      return commonItems
  }
}

const menuItems = ref(getMenuItems(props.userRole))
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar
      :user-role="userRole"
      :user-name="userName"
      :org-name="orgName"
      :menu-items="menuItems"
      :default-collapsed="false"
    />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">{{ $route.meta.title || 'Dashboard' }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ $route.meta.description || 'Welcome back!' }}</p>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <i class="pi pi-bell text-lg"></i>
            </button>
            
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-sm">{{ userName.charAt(0) }}</span>
              </div>
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ userRole }}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Header styling */
header {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hidden {
    display: none;
  }
}
</style> 