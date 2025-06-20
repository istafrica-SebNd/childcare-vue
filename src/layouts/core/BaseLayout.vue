<script setup lang="ts">
import { computed, provide } from 'vue'
import { useLayout } from '@/composables/layout/useLayout'
import { useNavigation } from '@/composables/layout/useNavigation'
import AppSidebar from '@/layouts/components/AppSidebar.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'
import AppBreadcrumb from '@/layouts/components/AppBreadcrumb.vue'

// Simple props - no complex component registry needed
interface Props {
  variant?: 'default' | 'minimal' | 'compact'
  showSidebar?: boolean
  showHeader?: boolean
  showBreadcrumb?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showSidebar: true,
  showHeader: true,
  showBreadcrumb: true
})

// Keep the valuable composables (these are essential)
const layout = useLayout()
const navigation = useNavigation()

// Simple layout configuration based on role and variant
const layoutConfig = computed(() => ({
  ...layout.getLayoutProps(),
  // Override with props (use correct property names)
  showSidebar: props.showSidebar && layout.sidebarVisible.value,
  showHeader: props.showHeader && layout.headerVisible.value,
  showBreadcrumb: props.showBreadcrumb && layout.showBreadcrumb.value,
  // Pass navigation data to components
  navigation: {
    primary: navigation.primaryNavigation.value,
    secondary: navigation.secondaryNavigation.value,
    applications: navigation.applicationNavigation.value,
    loading: navigation.navigationLoading.value,
    hasNavigation: navigation.hasNavigation.value
  },
  // Layout actions
  onToggleSidebar: layout.toggleSidebar,
  onToggleSidebarVisibility: layout.toggleSidebarVisibility
}))

// Provide layout context to children (keep this - it's useful)
provide('layoutContext', {
  layout,
  navigation,
  layoutProps: layoutConfig.value
})

// Dynamic classes based on theme and variant
const containerClasses = computed(() => [
  'layout-container min-h-screen flex',
  `theme-${layout.currentTheme.value}`,
  `variant-${props.variant}`,
  layout.currentTheme.value === 'dark' ? 'bg-gray-900' : 'bg-slate-50'
])

const mainClasses = computed(() => [
  'layout-main flex-1 overflow-auto',
  layout.showBreadcrumb.value ? 'pt-0' : 'pt-4'
])
</script>

<template>
  <div :class="containerClasses">
    <!-- Reusable Sidebar (same component, dynamic navigation) -->
    <AppSidebar
      v-if="layoutConfig.showSidebar"
      v-bind="layoutConfig"
      :key="`sidebar-${layout.userRole || 'default'}`"
    />

    <!-- Main Content Area -->
    <div class="layout-content flex-1 flex flex-col min-w-0">
      <!-- Reusable Header (same component, dynamic navigation) -->
      <AppHeader
        v-if="layoutConfig.showHeader"
        v-bind="layoutConfig"
        :key="`header-${layout.userRole || 'default'}`"
      />

      <!-- Reusable Breadcrumb -->
      <AppBreadcrumb
        v-if="layoutConfig.showBreadcrumb"
        class="px-6 py-2 border-b border-gray-200"
      />

      <!-- Main Content -->
      <main :class="mainClasses">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <!-- Loading State -->
          <div
            v-if="navigation.navigationLoading.value || layout.layoutLoading.value"
            class="flex items-center justify-center py-8"
          >
            <div class="flex items-center gap-3 text-gray-600">
              <i class="pi pi-spin pi-spinner text-lg"></i>
              <span>Loading layout...</span>
            </div>
          </div>

          <!-- Main Content Slot -->
          <slot
            v-else
            name="content"
            :layout-props="layoutConfig"
          >
            <router-view />
          </slot>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Layout base styles */
.layout-container {
  display: flex;
  min-height: 100vh;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.layout-main {
  flex: 1;
  overflow-y: auto;
}

/* Variant styles (simpler than component registry) */
.variant-minimal .layout-main {
  padding: 0.5rem;
}

.variant-compact .layout-main {
  padding: 1rem;
}

.variant-default .layout-main {
  padding: 1.5rem;
}

/* Theme support */
.theme-light {
  background: #ffffff;
  color: #1f2937;
}

.theme-dark {
  background: #1f2937;
  color: #f9fafb;
}

/* Responsive design */
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }
}
</style>
