import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Authentication guard - ensures user is logged in
 */
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const auth = useAuthStore()

  // If route requires auth
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!auth.user) {
      console.log('🛡️ Auth Guard: User not authenticated, redirecting to login')
      next({ name: 'Login' })
      return
    }

    // Check if user has required role
    if (to.meta.role && auth.user.role !== to.meta.role) {
      console.log(`🛡️ Auth Guard: User role '${auth.user.role}' does not match required role '${to.meta.role}'`)
      next({ name: 'Home' })
      return
    }

    console.log('🛡️ Auth Guard: Access granted')
  }

  next()
}

/**
 * Role-based guard - ensures user has specific role
 */
export const roleGuard = (allowedRoles: string[]) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const auth = useAuthStore()

    if (!auth.user) {
      next({ name: 'Login' })
      return
    }

    if (!allowedRoles.includes(auth.user.role)) {
      console.log(`🛡️ Role Guard: User role '${auth.user.role}' not in allowed roles: ${allowedRoles.join(', ')}`)
      next({ name: 'Home' })
      return
    }

    next()
  }
}

/**
 * Admin guard - ensures user is admin
 */
export const adminGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const auth = useAuthStore()

  if (!auth.user) {
    next({ name: 'Login' })
    return
  }

  if (auth.user.role !== 'admin') {
    console.log('🛡️ Admin Guard: Access denied - admin role required')
    next({ name: 'Home' })
    return
  }

  next()
}

/**
 * Guest guard - ensures user is NOT logged in (for login page)
 */
export const guestGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const auth = useAuthStore()

  if (auth.user) {
    // User is already authenticated, redirect to their dashboard
    let redirectPath = '/'
    switch (auth.user.role) {
      case 'guardian': redirectPath = '/guardian'; break
      case 'caseworker': redirectPath = '/caseworker'; break
      case 'admin': redirectPath = '/admin'; break
      case 'staff': redirectPath = '/staff'; break
      case 'partner': redirectPath = '/partner'; break
      case 'district-admin': redirectPath = '/district-admin'; break
      case 'educator': redirectPath = '/educator'; break
      default: redirectPath = '/'
    }

    console.log(`🛡️ Guest Guard: User already authenticated, redirecting to ${redirectPath}`)
    next(redirectPath)
    return
  }

  next()
}
