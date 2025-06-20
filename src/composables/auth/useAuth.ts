import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

/**
 * useAuth composable
 *
 * Provides a clean abstraction layer over the auth store.
 * This allows components to interact with authentication
 * without directly coupling to the store implementation.
 *
 * Benefits:
 * - Cleaner component code
 * - Better testability
 * - Consistent API across the app
 * - Future-proof for API changes
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Reactive state
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // User information helpers
  const userRole = computed(() => authStore.user?.role)
  const userName = computed(() => authStore.user?.name)
  const userEmail = computed(() => authStore.user?.email)
  const userDistrict = computed(() => authStore.user?.district)
  const userOrganization = computed(() => authStore.user?.organization)
  const userKindergartenId = computed(() => authStore.user?.kindergartenId)

  // Role checks
  const isGuardian = computed(() => authStore.user?.role === 'guardian')
  const isCaseworker = computed(() => authStore.user?.role === 'caseworker')
  const isEducator = computed(() => authStore.user?.role === 'educator')
  const isAdmin = computed(() => authStore.user?.role === 'admin')
  const isStaff = computed(() => authStore.user?.role === 'staff')
  const isPartner = computed(() => authStore.user?.role === 'partner')
  const isDistrictAdmin = computed(() => authStore.user?.role === 'district-admin')

  // Authentication methods
  const loginWithIDPorten = async (): Promise<boolean> => {
    return await authStore.loginWithIDPorten()
  }

  const loginWithEntraID = async (email?: string): Promise<boolean> => {
    return await authStore.loginWithEntraID(email)
  }

  const login = async (email: string, password?: string): Promise<boolean> => {
    return await authStore.login(email, password)
  }

  const logout = async (): Promise<void> => {
    authStore.logout()

    // Navigate to login page after logout
    await router.push('/login')
  }

  // Utility methods
  const checkDomainType = (email: string) => {
    return authStore.checkDomainType(email)
  }

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  const requireRole = (role: string | string[]) => {
    if (!requireAuth()) return false

    const roles = Array.isArray(role) ? role : [role]
    if (!userRole.value || !roles.includes(userRole.value)) {
      // Redirect to appropriate dashboard or show error
      router.push('/')
      return false
    }
    return true
  }

  return {
    // State
    user,
    isLoading,
    isAuthenticated,

    // User info
    userRole,
    userName,
    userEmail,
    userDistrict,
    userOrganization,
    userKindergartenId,

    // Role checks
    isGuardian,
    isCaseworker,
    isEducator,
    isAdmin,
    isStaff,
    isPartner,
    isDistrictAdmin,

    // Authentication methods
    login,
    loginWithIDPorten,
    loginWithEntraID,
    logout,

    // Utilities
    checkDomainType,
    requireAuth,
    requireRole
  }
}
