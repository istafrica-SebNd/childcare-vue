import { computed, ref, watch, onMounted, readonly } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { navigationService } from '@/services/navigationService'
import { permissionService } from '@/services/permissionService'
import type { NavigationItem } from '@/types/role.types'

export const useNavigation = () => {
  const authStore = useAuthStore()

  // Reactive state
  const navigationLoading = ref(false)
  const primaryNavigation = ref<NavigationItem[]>([])
  const secondaryNavigation = ref<NavigationItem[]>([])
  const applicationNavigation = ref<NavigationItem[]>([])
  const lastUpdated = ref<Date | null>(null)

  // Computed values
  const userRole = computed(() => authStore.user?.role)
  const userId = computed(() => authStore.user?.id)

  // Load navigation when user changes
  const loadNavigation = async () => {
    if (!userId.value || !userRole.value) {
      clearNavigation()
      return
    }

    navigationLoading.value = true

    try {
      // In development mode, use mock data
      const isDevelopment = import.meta.env.DEV

      if (isDevelopment) {
        // Use mock navigation data
        const mockNav = await navigationService.getMockUserNavigation(userId.value, userRole.value)
        primaryNavigation.value = mockNav.primary
        secondaryNavigation.value = mockNav.secondary
        applicationNavigation.value = mockNav.applications
      } else {
        // Use real API data
        const navigation = await navigationService.buildUserNavigation(userId.value, userRole.value)
        primaryNavigation.value = navigation.primary
        secondaryNavigation.value = navigation.secondary
        applicationNavigation.value = navigation.applications
      }

      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load navigation:', error)
      clearNavigation()
    } finally {
      navigationLoading.value = false
    }
  }

  const clearNavigation = () => {
    primaryNavigation.value = []
    secondaryNavigation.value = []
    applicationNavigation.value = []
    lastUpdated.value = null
  }

  // Permission checking
  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!userId.value) return false

    try {
      return await permissionService.checkPermission(userId.value, permission)
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }

  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    if (!userId.value || permissions.length === 0) return false

    try {
      return await permissionService.checkAnyPermission(userId.value, permissions)
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }

  const hasAllPermissions = async (permissions: string[]): Promise<boolean> => {
    if (!userId.value || permissions.length === 0) return true

    try {
      return await permissionService.checkAllPermissions(userId.value, permissions)
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }

  // Badge management
  const updateBadgeData = (data: Record<string, string | number>) => {
    if (!userId.value) return

    navigationService.updateBadgeData(userId.value, data)
    // Reload navigation to update badges
    loadNavigation()
  }

  const setBadge = (source: string, value: string | number) => {
    if (!userId.value) return

    navigationService.setBadgeData(userId.value, source, value)
    // Reload navigation to update this specific badge
    loadNavigation()
  }

  // Navigation refresh
  const refreshNavigation = async () => {
    if (!userRole.value) return

    // Clear cache and reload
    navigationService.invalidateNavigationCache(userRole.value)
    await loadNavigation()
  }

  // Route validation
  const canAccessRoute = async (route: string, requiredPermissions: string[] = []): Promise<boolean> => {
    if (requiredPermissions.length === 0) return true
    return await hasAnyPermission(requiredPermissions)
  }

  // Watch for user changes
  watch([userId, userRole], () => {
    loadNavigation()
  }, { immediate: true })

  // Lifecycle
  onMounted(() => {
    loadNavigation()
  })

  return {
    // State
    navigationLoading: readonly(navigationLoading),
    primaryNavigation: readonly(primaryNavigation),
    secondaryNavigation: readonly(secondaryNavigation),
    applicationNavigation: readonly(applicationNavigation),
    lastUpdated: readonly(lastUpdated),

    // Methods
    loadNavigation,
    refreshNavigation,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    updateBadgeData,
    setBadge,
    canAccessRoute,

    // Getters
    isLoaded: computed(() => !navigationLoading.value && lastUpdated.value !== null),
    hasNavigation: computed(() =>
      primaryNavigation.value.length > 0 ||
      secondaryNavigation.value.length > 0 ||
      applicationNavigation.value.length > 0
    )
  }
}
