import { ref, computed, reactive, readonly, toRefs, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { roleService } from '@/services/roleService'
import type { LayoutSettings } from '@/types/role.types'

export const useLayout = () => {
  const authStore = useAuthStore()

  // Layout state
  const state = reactive({
    sidebarCollapsed: false,
    sidebarVisible: true,
    headerVisible: true,
    breadcrumbVisible: true,
    footerVisible: false
  })

  // Loading state
  const layoutLoading = ref(false)
  const layoutSettings = ref<LayoutSettings | null>(null)

  // Computed values
  const userRole = computed(() => authStore.user?.role)

  // Load layout settings for current user role
  const loadLayoutSettings = async () => {
    if (!userRole.value) {
      layoutSettings.value = null
      return
    }

    layoutLoading.value = true

    try {
      // In development mode, use mock settings
      const isDevelopment = import.meta.env.DEV

      if (isDevelopment) {
        // Mock layout settings
        layoutSettings.value = getMockLayoutSettings(userRole.value)
      } else {
        // Fetch from API
        const navConfig = await roleService.getRoleNavigationConfig(userRole.value)
        layoutSettings.value = navConfig?.layoutSettings || getDefaultLayoutSettings()
      }
    } catch (error) {
      console.error('Failed to load layout settings:', error)
      layoutSettings.value = getDefaultLayoutSettings()
    } finally {
      layoutLoading.value = false
    }
  }

  // Default layout settings
  const getDefaultLayoutSettings = (): LayoutSettings => ({
    showBreadcrumb: true,
    showNotifications: true,
    sidebarCollapsible: true,
    theme: 'light'
  })

  // Mock layout settings for development
  const getMockLayoutSettings = (role: string): LayoutSettings => {
    const roleSettings: Record<string, LayoutSettings> = {
      guardian: {
        showBreadcrumb: true,
        showNotifications: true,
        sidebarCollapsible: true,
        theme: 'light'
      },
      caseworker: {
        showBreadcrumb: true,
        showNotifications: true,
        sidebarCollapsible: true,
        theme: 'light'
      },
      educator: {
        showBreadcrumb: true,
        showNotifications: false,
        sidebarCollapsible: true,
        theme: 'light'
      },
      admin: {
        showBreadcrumb: true,
        showNotifications: true,
        sidebarCollapsible: true,
        theme: 'light'
      }
    }

    return roleSettings[role] || getDefaultLayoutSettings()
  }

  // Layout actions
  const toggleSidebar = () => {
    if (layoutSettings.value?.sidebarCollapsible !== false) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    }
  }

  const toggleSidebarVisibility = () => {
    state.sidebarVisible = !state.sidebarVisible
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    if (layoutSettings.value?.sidebarCollapsible !== false) {
      state.sidebarCollapsed = collapsed
    }
  }

  const setHeaderVisible = (visible: boolean) => {
    state.headerVisible = visible
  }

  const setBreadcrumbVisible = (visible: boolean) => {
    state.breadcrumbVisible = visible
  }

  // Layout configuration getters
  const effectiveLayoutSettings = computed(() => ({
    ...getDefaultLayoutSettings(),
    ...layoutSettings.value
  }))

  const showBreadcrumb = computed(() =>
    state.breadcrumbVisible && effectiveLayoutSettings.value.showBreadcrumb
  )

  const showNotifications = computed(() =>
    effectiveLayoutSettings.value.showNotifications
  )

  const sidebarCollapsible = computed(() =>
    effectiveLayoutSettings.value.sidebarCollapsible
  )

  const currentTheme = computed(() =>
    effectiveLayoutSettings.value.theme
  )

  const customComponents = computed(() =>
    effectiveLayoutSettings.value.customComponents
  )

  // Layout props for components
  const getLayoutProps = () => ({
    showSidebar: state.sidebarVisible,
    showHeader: state.headerVisible,
    showBreadcrumb: showBreadcrumb.value,
    showFooter: state.footerVisible,
    sidebarCollapsed: state.sidebarCollapsed,
    sidebarCollapsible: sidebarCollapsible.value,
    showNotifications: showNotifications.value,
    theme: currentTheme.value,
    customComponents: customComponents.value
  })

  // Initialize layout settings when user role changes
  watch(userRole, () => {
    loadLayoutSettings()
  }, { immediate: true })

  return {
    // State (reactive refs)
    ...toRefs(state),
    layoutLoading: readonly(layoutLoading),
    layoutSettings: readonly(layoutSettings),

    // Computed
    userRole: readonly(userRole),
    effectiveLayoutSettings: readonly(effectiveLayoutSettings),
    showBreadcrumb: readonly(showBreadcrumb),
    showNotifications: readonly(showNotifications),
    sidebarCollapsible: readonly(sidebarCollapsible),
    currentTheme: readonly(currentTheme),
    customComponents: readonly(customComponents),

    // Methods
    toggleSidebar,
    toggleSidebarVisibility,
    setSidebarCollapsed,
    setHeaderVisible,
    setBreadcrumbVisible,
    loadLayoutSettings,
    getLayoutProps,

    // Status
    isLayoutLoaded: computed(() => !layoutLoading.value && layoutSettings.value !== null)
  }
}
