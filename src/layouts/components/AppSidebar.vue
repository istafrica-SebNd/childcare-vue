<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationItem } from '@/types/role.types'

interface Props {
  sidebarCollapsed?: boolean
  sidebarVisible?: boolean
  // Dynamic navigation based on user role and permissions
  navigation?: {
    primary: NavigationItem[]      // Main navigation items (filtered by permissions)
    secondary: NavigationItem[]    // Secondary navigation items
    applications: NavigationItem[] // Application-specific items
    loading: boolean
    hasNavigation: boolean
  }
  userRole?: string
  theme?: 'light' | 'dark'
  onToggleSidebar?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  sidebarCollapsed: false,
  sidebarVisible: true,
  theme: 'light'
})

// State for expanded menu items
const expandedItems = ref<Set<string>>(new Set())

// Toggle submenu expansion
const toggleSubmenu = (itemId: string) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId)
  } else {
    expandedItems.value.add(itemId)
  }
}

// Check if item is expanded
const isExpanded = (itemId: string) => {
  return expandedItems.value.has(itemId)
}

// Dynamic navigation rendering based on user role
const sidebarItems = computed(() => {
  if (!props.navigation || props.navigation.loading) {
    return []
  }

  // Combine all navigation types and sort by order
  const allItems = [
    ...props.navigation.primary,
    ...props.navigation.secondary,
    ...props.navigation.applications
  ].sort((a, b) => a.order - b.order)

  return allItems
})

// Role-based styling
const sidebarClasses = computed(() => [
  'app-sidebar',
  `theme-${props.theme}`,
  `role-${props.userRole}`,
  {
    'collapsed': props.sidebarCollapsed,
    'hidden': !props.sidebarVisible
  }
])
</script>

<template>
  <aside :class="sidebarClasses">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">
        Oslo Kindergarten
      </h2>
      <button
        v-if="props.onToggleSidebar"
        @click="props.onToggleSidebar"
        class="toggle-btn"
      >
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <!-- Dynamic Navigation (changes based on role/permissions) -->
    <nav class="sidebar-nav">
      <div v-if="navigation?.loading" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <span>Loading navigation...</span>
      </div>

      <!-- Render navigation items dynamically -->
      <ul v-else class="nav-list">
        <li
          v-for="item in sidebarItems"
          :key="item.id"
          class="nav-item"
        >
          <!-- Items with children (dropdown menu) -->
          <div v-if="item.children && item.children.length > 0">
            <!-- Parent item (clickable to toggle submenu) -->
            <button
              @click="toggleSubmenu(item.id)"
              class="nav-link nav-parent"
              :class="{ 'expanded': isExpanded(item.id) }"
            >
              <i :class="item.icon"></i>
              <span v-if="!sidebarCollapsed" class="nav-label">
                {{ item.label }}
              </span>
              <!-- Dynamic Badge (e.g., notification counts) -->
              <span
                v-if="item.badge && !sidebarCollapsed"
                class="nav-badge"
                :class="`badge-${item.badge.severity || 'info'}`"
              >
                {{ item.badge.text || item.badge.source }}
              </span>
              <!-- Dropdown arrow -->
              <i
                v-if="!sidebarCollapsed"
                class="pi pi-chevron-down dropdown-arrow"
                :class="{ 'rotated': isExpanded(item.id) }"
              ></i>
            </button>

            <!-- Submenu (conditionally visible) -->
            <div
              v-if="isExpanded(item.id) && !sidebarCollapsed"
              class="submenu"
            >
              <ul class="submenu-list">
                <li
                  v-for="child in item.children"
                  :key="child.id"
                  class="submenu-item"
                >
                  <router-link
                    v-if="child.route"
                    :to="child.route"
                    class="submenu-link"
                    active-class="active"
                  >
                    <i :class="child.icon"></i>
                    <span>{{ child.label }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <!-- Regular navigation link (no children) -->
          <router-link
            v-else-if="item.route"
            :to="item.route"
            class="nav-link"
            active-class="active"
          >
            <i :class="item.icon"></i>
            <span v-if="!sidebarCollapsed" class="nav-label">
              {{ item.label }}
            </span>
            <!-- Dynamic Badge (e.g., notification counts) -->
            <span
              v-if="item.badge && !sidebarCollapsed"
              class="nav-badge"
              :class="`badge-${item.badge.severity || 'info'}`"
            >
              {{ item.badge.text || item.badge.source }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Role-specific footer -->
    <div class="sidebar-footer">
      <div v-if="!sidebarCollapsed" class="user-role">
        Role: {{ userRole }}
      </div>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 250px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.app-sidebar.collapsed {
  width: 60px;
}

.app-sidebar.hidden {
  margin-left: -250px;
}

/* Theme variations */
.app-sidebar.theme-dark {
  background: #1f2937;
  border-right-color: #374151;
  color: #f9fafb;
}

.app-sidebar.theme-light {
  background: #ffffff;
  border-right-color: #e5e7eb;
  color: #1f2937;
}

/* Role-specific styling */
.app-sidebar.role-guardian {
  border-right-color: #3b82f6;
}

.app-sidebar.role-caseworker {
  border-right-color: #10b981;
}

.app-sidebar.role-admin {
  border-right-color: #f59e0b;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.toggle-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.375rem;
}

.toggle-btn:hover {
  background: #f3f4f6;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #6b7280;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.nav-link:hover {
  background: #f3f4f6;
}

.nav-link.active {
  background: #3b82f6;
  color: white;
}

/* Parent item with dropdown */
.nav-parent {
  position: relative;
}

.nav-parent.expanded {
  background: #f3f4f6;
}

/* Dropdown arrow */
.dropdown-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.nav-badge {
  margin-left: auto;
  background: #ef4444;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* When both badge and arrow are present, adjust spacing */
.nav-parent .nav-badge {
  margin-left: auto;
  margin-right: 0.5rem;
}

.submenu {
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.submenu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #f9fafb;
}

.submenu-item {
  border-left: 2px solid #e5e7eb;
  margin-left: 1rem;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #6b7280;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.submenu-link:hover {
  background: #f3f4f6;
  color: #374151;
}

.submenu-link.active {
  color: #3b82f6;
  background: #eff6ff;
  border-left-color: #3b82f6;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .app-sidebar {
    position: absolute;
    z-index: 50;
    height: 100vh;
  }

  .app-sidebar.hidden {
    margin-left: -100%;
  }
}
</style>
