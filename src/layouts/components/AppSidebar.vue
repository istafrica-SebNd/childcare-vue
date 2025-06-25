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

// Admin navigation starts with sections expanded by default
if (props.userRole === 'admin') {
  expandedItems.value.add('administration')
  expandedItems.value.add('access-right')
  expandedItems.value.add('admissions')
}

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
          :class="{ 'has-children': item.children && item.children.length > 0 }"
        >
          <!-- Items with children (accordion menu) -->
          <div v-if="item.children && item.children.length > 0">
            <!-- Parent item (clickable to toggle submenu) -->
            <button
              @click="toggleSubmenu(item.id)"
              class="nav-link nav-parent"
              :class="{
                'expanded': isExpanded(item.id),
                'dashboard-active': item.id === 'dashboard' && $route.path.includes('/admin/dashboard')
              }"
            >
              <i :class="item.icon" class="nav-icon"></i>
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

            <!-- Submenu (conditionally visible with smooth animation) -->
            <transition name="submenu-slide">
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
                      <i :class="child.icon" class="submenu-icon"></i>
                      <span>{{ child.label }}</span>
                    </router-link>
                    <!-- For items without routes (just labels) -->
                    <div
                      v-else
                      class="submenu-label"
                    >
                      <i :class="child.icon" class="submenu-icon"></i>
                      <span>{{ child.label }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- Regular navigation link (no children) -->
          <router-link
            v-else-if="item.route"
            :to="item.route"
            class="nav-link"
            active-class="active"
            :class="{
              'dashboard-active': item.id === 'dashboard' && $route.path.includes('/admin/dashboard')
            }"
          >
            <i :class="item.icon" class="nav-icon"></i>
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

          <!-- Non-clickable items (categories or separators) -->
          <div
            v-else
            class="nav-link nav-category"
          >
            <i :class="item.icon" class="nav-icon"></i>
            <span v-if="!sidebarCollapsed" class="nav-label">
              {{ item.label }}
            </span>
          </div>
        </li>
      </ul>
    </nav>


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
  color: #374151;
  transition: all 0.2s ease;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 0.375rem;
  margin: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-link.active,
.nav-link.dashboard-active {
  background: #1e40af;
  color: white;
}

.nav-link.active .nav-icon,
.nav-link.dashboard-active .nav-icon {
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

/* Admin-specific nav styling */
.role-admin .nav-item.has-children .nav-parent {
  background: #f8fafc;
  border-radius: 0.375rem;
  margin: 0.25rem 0.5rem;
}

.role-admin .nav-item.has-children .nav-parent:hover {
  background: #f1f5f9;
}

.role-admin .nav-item.has-children .nav-parent.expanded {
  background: #e2e8f0;
  color: #334155;
}

.submenu {
  overflow: hidden;
  margin: 0 0.5rem 0.5rem 0.5rem;
  border-radius: 0.375rem;
  background: #f8fafc;
}

.submenu-list {
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
}

.submenu-item {
  margin: 0;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #64748b;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border-radius: 0.25rem;
  margin: 0 0.5rem;
}

.submenu-link:hover {
  background: #e2e8f0;
  color: #475569;
}

.submenu-link.active {
  color: #1e40af;
  background: #dbeafe;
  font-weight: 500;
}

.submenu-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0.5rem;
}

.submenu-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #94a3b8;
}

/* Submenu animations */
.submenu-slide-enter-active,
.submenu-slide-leave-active {
  transition: all 0.3s ease;
}

.submenu-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.submenu-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.submenu-slide-enter-to,
.submenu-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 1000px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Icon styling */
.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: #6b7280;
}

.nav-link:hover .nav-icon {
  color: #374151;
}

.nav-category {
  cursor: default;
  opacity: 0.7;
}

.nav-category:hover {
  background: none;
}

/* Icon alignment */
.pi {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
