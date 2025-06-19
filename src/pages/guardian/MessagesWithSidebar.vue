<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import Messages from './Messages.vue'

// Guardian-specific menu items
const guardianMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'pi pi-th-large',
    route: '/guardian/dashboard'
  },
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
    id: 'noticeboard',
    label: 'Notice Board',
    icon: 'pi pi-megaphone',
    route: '/guardian/noticeboard'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'pi pi-user',
    route: '/guardian/profile'
  }
]
</script>

<template>
  <AppLayout
    user-role="guardian"
    user-name="John Smith"
    org-name="Empower learning"
  >
    <!-- Messages Component -->
    <Messages
      user-role="guardian"
      user-name="John Smith"
    />
  </AppLayout>
</template>

<style scoped>
/* Override the Messages component to fit within the layout */
:deep(.h-screen) {
  height: 100%;
}

:deep(.bg-gray-100) {
  background-color: transparent;
}

:deep(.p-4) {
  padding: 0;
}

:deep(.rounded-2xl) {
  border-radius: 0.75rem;
}
</style> 