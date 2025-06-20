import type { Permission, UserPermissionCheck } from '@/types/role.types'
import { roleService } from './roleService'

class PermissionService {
  private userPermissionsCache = new Map<string, { permissions: Permission[]; timestamp: number }>()
  private cacheTTL = 5 * 60 * 1000 // 5 minutes

  private isValidCache(userId: string): boolean {
    const cached = this.userPermissionsCache.get(userId)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.cacheTTL
  }

  async getUserPermissionCheck(userId: string, roleId: string): Promise<UserPermissionCheck> {
    let permissions: Permission[] = []

    // Try cache first
    if (this.isValidCache(userId)) {
      permissions = this.userPermissionsCache.get(userId)!.permissions
    } else {
      // In development mode, use mock data
      const isDevelopment = import.meta.env.DEV

      if (isDevelopment) {
        // Use mock permissions
        const mockPermissionIds = this.getMockPermissions(roleId)
        permissions = mockPermissionIds.map(id => ({
          id,
          name: id.replace(':', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Permission to ${id.replace(':', ' ')}`,
          resource: id.split(':')[1] || 'unknown',
          action: id.split(':')[0] || 'unknown'
        }))
      } else {
        // Fetch from API
        permissions = await roleService.getUserPermissions(userId)
      }

      this.userPermissionsCache.set(userId, {
        permissions,
        timestamp: Date.now()
      })
    }

    const permissionIds = permissions.map(p => p.id)

    return {
      userId,
      roleId,
      permissions: permissionIds,
      hasPermission: (permission: string) => permissionIds.includes(permission),
      hasAnyPermission: (requiredPermissions: string[]) =>
        requiredPermissions.some(p => permissionIds.includes(p)),
      hasAllPermissions: (requiredPermissions: string[]) =>
        requiredPermissions.every(p => permissionIds.includes(p))
    }
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions.some(p => p.id === permission)
  }

  async checkAnyPermission(userId: string, permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId)
    const userPermissionIds = userPermissions.map(p => p.id)
    return permissions.some(p => userPermissionIds.includes(p))
  }

  async checkAllPermissions(userId: string, permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId)
    const userPermissionIds = userPermissions.map(p => p.id)
    return permissions.every(p => userPermissionIds.includes(p))
  }

  private async getUserPermissions(userId: string): Promise<Permission[]> {
    if (this.isValidCache(userId)) {
      return this.userPermissionsCache.get(userId)!.permissions
    }

    const permissions = await roleService.getUserPermissions(userId)
    this.userPermissionsCache.set(userId, {
      permissions,
      timestamp: Date.now()
    })

    return permissions
  }

  // Permission validation helpers
  validateRoutePermissions(requiredPermissions: string[], userPermissions: string[]): boolean {
    if (requiredPermissions.length === 0) return true
    return requiredPermissions.every(permission => userPermissions.includes(permission))
  }

  validateComponentPermissions(requiredPermissions: string[], userPermissions: string[]): boolean {
    if (requiredPermissions.length === 0) return true
    return requiredPermissions.some(permission => userPermissions.includes(permission))
  }

  // Cache management
  invalidateUserCache(userId: string): void {
    this.userPermissionsCache.delete(userId)
  }

  clearAllCache(): void {
    this.userPermissionsCache.clear()
  }

  // For development - mock permission checking
  getMockPermissions(roleName: string): string[] {
    const mockPermissions: Record<string, string[]> = {
      guardian: [
        'view:dashboard',
        'view:children',
        'view:applications',
        'create:application',
        'view:schedule',
        'view:attendance',
        'view:messages',
        'view:notices',
        'view:payments',
        'view:documents',
        'manage:profile'
      ],
      caseworker: [
        'view:dashboard',
        'view:applications',
        'create:application',
        'review:applications',
        'manage:placements',
        'view:messages',
        'view:waiting-lists',
        'manage:offers',
        'view:kindergartens',
        'view:reports'
      ],
      educator: [
        'view:dashboard',
        'view:children',
        'manage:attendance',
        'create:reports',
        'view:messages'
      ],
      admin: [
        'view:dashboard',
        'manage:users',
        'manage:roles',
        'manage:permissions',
        'view:reports',
        'manage:system',
        'view:audit'
      ]
    }

    return mockPermissions[roleName] || []
  }
}

export const permissionService = new PermissionService()
