/**
 * Generic AppBreadcrumb Component
 * 
 * This component automatically generates breadcrumbs from the current URL path.
 * It eliminates the need to manually maintain route mappings.
 * 
 * ## How it works:
 * 1. Parses URL segments: `/guardian/children/123` → ["guardian", "children", "123"]
 * 2. Generates labels with priority:
 *    - Route meta.breadcrumb (highest priority)
 *    - Route meta.title
 *    - i18n translation key (breadcrumb.{segment})
 *    - Auto-humanized segment (lowest priority)
 * 
 * ## Examples:
 * 
 * ### Basic URL parsing:
 * `/guardian/new-application` → "Guardian" > "New Application"
 * `/admin/user-management` → "Admin" > "User Management"
 * 
 * ### With route meta:
 * ```typescript
 * // In router/index.ts
 * {
 *   path: '/guardian/children',
 *   meta: { breadcrumb: 'My Children' }
 * }
 * ```
 * Result: "Guardian" > "My Children"
 * 
 * ### Dynamic segments:
 * `/guardian/children/123` → "Guardian" > "Children" > "Child Details"
 * 
 * ### With i18n:
 * ```typescript
 * // In i18n files
 * {
 *   "breadcrumb": {
 *     "children": "Barn",
 *     "payments": "Betalinger"
 *   }
 * }
 * ```
 * 
 * ## Props:
 * - `autoGenerate`: Enable automatic breadcrumb generation (default: true)
 * - `showHome`: Show home/dashboard link (default: true)
 * - `maxItems`: Maximum breadcrumb items before ellipsis (default: 5)
 * - `items`: Manual breadcrumb items (overrides auto-generation)
 */

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Home, ChevronRight } from 'lucide-vue-next'

interface BreadcrumbItem {
  label: string
  route?: string
  icon?: string
  disabled?: boolean
}

interface Props {
  items?: BreadcrumbItem[]
  autoGenerate?: boolean
  showHome?: boolean
  homeRoute?: string
  homeLabel?: string
  separator?: string
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoGenerate: true,
  showHome: true,
  homeRoute: '',
  homeLabel: 'Dashboard',
  separator: '/',
  maxItems: 5
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Auto-detect home route based on current path
const detectedHomeRoute = computed(() => {
  if (props.homeRoute) return props.homeRoute
  
  const pathSegments = route.path.split('/').filter(segment => segment)
  if (pathSegments.length > 0) {
    const role = pathSegments[0]
    return `/${role}`
  }
  return '/'
})

/**
 * Humanize a URL segment into a readable label
 * e.g., "new-application" → "New Application"
 * e.g., "children-list" → "Children List"
 */
const humanizeSegment = (segment: string): string => {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get breadcrumb label with priority:
 * 1. Route meta.breadcrumb
 * 2. Route meta.title  
 * 3. i18n translation key
 * 4. Humanized segment
 */
const getBreadcrumbLabel = (segment: string, routePath: string): string => {
  try {
    // Try to find matching route in router
    const matchedRoute = router.getRoutes().find(r => r.path === routePath)
    
    // Priority 1: Route meta.breadcrumb
    if (matchedRoute?.meta?.breadcrumb) {
      return matchedRoute.meta.breadcrumb as string
    }
    
    // Priority 2: Route meta.title
    if (matchedRoute?.meta?.title) {
      return matchedRoute.meta.title as string
    }
    
    // Priority 3: Try i18n translation key
    const translationKey = `breadcrumb.${segment}`
    const translated = t(translationKey)
    if (translated !== translationKey) {
      return translated
    }
    
    // Priority 4: Humanize the segment
    return humanizeSegment(segment)
  } catch (error) {
    // Fallback to humanized segment
    return humanizeSegment(segment)
  }
}

/**
 * Handle dynamic route parameters
 * e.g., "/children/:id" with id="123" → "Child Profile" or "Child 123"
 */
const handleDynamicSegment = (segment: string, routePath: string): string => {
  // If segment is a number or UUID, try to get a better label
  if (/^\d+$/.test(segment)) {
    // It's an ID, try to get parent context
    const pathParts = routePath.split('/')
    const parentSegment = pathParts[pathParts.length - 2]
    
    if (parentSegment) {
      const parentLabel = humanizeSegment(parentSegment)
      // Remove plural 's' and add specific identifier
      const singularParent = parentLabel.endsWith('s') 
        ? parentLabel.slice(0, -1) 
        : parentLabel
      return `${singularParent} Details`
    }
    
    return `Item ${segment}`
  }
  
  // If it looks like a UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
    return 'Details'
  }
  
  // Otherwise treat as normal segment
  return getBreadcrumbLabel(segment, routePath)
}

const breadcrumbItems = computed(() => {
  if (props.items) {
    // Use manually provided items
    return props.items.slice(0, props.maxItems)
  }

  if (!props.autoGenerate) {
    return []
  }

  // Auto-generate breadcrumbs from current route
  const pathSegments = route.path.split('/').filter(segment => segment)
  const breadcrumbs: BreadcrumbItem[] = []

  // Add home breadcrumb if enabled
  if (props.showHome && route.path !== detectedHomeRoute.value) {
    breadcrumbs.push({
      label: props.homeLabel,
      route: detectedHomeRoute.value,
      icon: 'pi pi-home'
    })
  }

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Skip the last segment (current page) as it will be shown separately
    if (index === pathSegments.length - 1) {
      return
    }

    let label: string
    
    // Check if this segment is a dynamic parameter
    if (/^\d+$/.test(segment) || /^[0-9a-f-]{36}$/.test(segment)) {
      label = handleDynamicSegment(segment, currentPath)
    } else {
      label = getBreadcrumbLabel(segment, currentPath)
    }
    
    breadcrumbs.push({
      label,
      route: currentPath,
      disabled: false
    })
  })

  // Limit number of breadcrumbs and add ellipsis if needed
  if (breadcrumbs.length > props.maxItems) {
    const ellipsisIndex = Math.floor(props.maxItems / 2)
    return [
      ...breadcrumbs.slice(0, ellipsisIndex),
      { label: '...', disabled: true },
      ...breadcrumbs.slice(breadcrumbs.length - (props.maxItems - ellipsisIndex - 1))
    ]
  }

  return breadcrumbs
})

const currentPageLabel = computed(() => {
  if (props.items && props.items.length > 0) {
    return props.items[props.items.length - 1].label
  }
  
  // Get current page label from route meta or path
  const currentRoute = route.path
  const currentSegment = route.path.split('/').filter(Boolean).pop() || ''
  
  // Try route meta first
  if (route.meta?.breadcrumb) {
    return route.meta.breadcrumb as string
  }
  
  if (route.meta?.title) {
    return route.meta.title as string
  }
  
  // Handle dynamic segments for current page
  if (/^\d+$/.test(currentSegment) || /^[0-9a-f-]{36}$/.test(currentSegment)) {
    return handleDynamicSegment(currentSegment, currentRoute)
  }
  
  return getBreadcrumbLabel(currentSegment, currentRoute)
})

const navigateToRoute = (routePath: string) => {
  if (routePath && routePath !== route.path) {
    router.push(routePath)
  }
}
</script>

<template>
  <nav class="mb-6" aria-label="Breadcrumb navigation">
    <div class="flex items-center space-x-2 text-sm">
      <!-- Manual breadcrumb items or auto-generated -->
      <template v-if="breadcrumbItems.length > 0">
        <div 
          v-for="(item, index) in breadcrumbItems" 
          :key="index"
          class="flex items-center"
        >
          <router-link 
            v-if="item.route && !item.disabled"
            :to="item.route" 
            class="text-slate-600 hover:text-oslo-blue transition-colors flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50"
            :aria-label="`Navigate to ${item.label}`"
          >
            <Home v-if="item.icon === 'pi pi-home'" class="w-4 h-4" />
            <i v-else-if="item.icon" :class="item.icon" class="w-4 h-4"></i>
            <span>{{ item.label }}</span>
          </router-link>
          
          <span 
            v-else
            class="text-slate-500 flex items-center gap-2 px-2 py-1"
            :class="{ 'opacity-50': item.disabled }"
          >
            <Home v-if="item.icon === 'pi pi-home'" class="w-4 h-4" />
            <i v-else-if="item.icon" :class="item.icon" class="w-4 h-4"></i>
            <span>{{ item.label }}</span>
          </span>
          
          <!-- Separator -->
          <ChevronRight 
            v-if="index < breadcrumbItems.length - 1 || currentPageLabel"
            class="w-4 h-4 text-slate-400 mx-1" 
          />
        </div>
      </template>
      
      <!-- Current page (not clickable) -->
      <span 
        v-if="currentPageLabel"
        class="text-slate-900 font-medium px-2 py-1"
        aria-current="page"
      >
        {{ currentPageLabel }}
      </span>
    </div>
  </nav>
</template>

<style scoped>
/* Custom hover effects */
.router-link-active {
  @apply text-oslo-blue;
}

/* Ensure proper spacing and alignment */
nav {
  font-family: inherit;
}
</style> 