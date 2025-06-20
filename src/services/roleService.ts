import type { Role, Permission, RoleNavigationConfig } from '@/types/role.types'

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

class RoleService {
  private baseUrl = '/api/roles'
  private cache = new Map<string, { data: unknown; timestamp: number }>()
  private cacheTTL = 5 * 60 * 1000 // 5 minutes

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.cacheTTL
  }

  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.isValidCache(key)) {
      return this.cache.get(key)!.data as T
    }

    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  async getRoleById(roleId: string): Promise<Role | null> {
    try {
      return await this.fetchWithCache(`role-${roleId}`, async () => {
        const response = await fetch(`${this.baseUrl}/${roleId}`)
        if (!response.ok) throw new Error(`Failed to fetch role: ${response.statusText}`)

        const result: ApiResponse<Role> = await response.json()
        return result.success ? result.data : null
      })
    } catch (error) {
      console.error('Error fetching role:', error)
      return null
    }
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      return await this.fetchWithCache('all-roles', async () => {
        const response = await fetch(this.baseUrl)
        if (!response.ok) throw new Error(`Failed to fetch roles: ${response.statusText}`)

        const result: ApiResponse<Role[]> = await response.json()
        return result.success ? result.data : []
      })
    } catch (error) {
      console.error('Error fetching roles:', error)
      return []
    }
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      return await this.fetchWithCache(`permissions-${userId}`, async () => {
        const response = await fetch(`/api/users/${userId}/permissions`)
        if (!response.ok) throw new Error(`Failed to fetch permissions: ${response.statusText}`)

        const result: ApiResponse<Permission[]> = await response.json()
        return result.success ? result.data : []
      })
    } catch (error) {
      console.error('Error fetching user permissions:', error)
      return []
    }
  }

  async getRoleNavigationConfig(roleId: string): Promise<RoleNavigationConfig | null> {
    try {
      return await this.fetchWithCache(`nav-config-${roleId}`, async () => {
        const response = await fetch(`${this.baseUrl}/${roleId}/navigation`)
        if (!response.ok) throw new Error(`Failed to fetch navigation config: ${response.statusText}`)

        const result: ApiResponse<RoleNavigationConfig> = await response.json()
        return result.success ? result.data : null
      })
    } catch (error) {
      console.error('Error fetching navigation config:', error)
      return null
    }
  }

  async updateRoleNavigationConfig(roleId: string, config: Partial<RoleNavigationConfig>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${roleId}/navigation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) throw new Error(`Failed to update navigation config: ${response.statusText}`)

      const result: ApiResponse<boolean> = await response.json()

      // Invalidate cache
      this.cache.delete(`nav-config-${roleId}`)

      return result.success
    } catch (error) {
      console.error('Error updating navigation config:', error)
      return false
    }
  }

  clearCache(): void {
    this.cache.clear()
  }

  // Mock data for development (will be removed when API is ready)
  private getMockData() {
    return {
      guardian: {
        id: 'guardian',
        name: 'guardian',
        displayName: 'Guardian',
        description: 'Parent or guardian of children',
        permissions: [
          { id: 'view:dashboard', name: 'View Dashboard', description: 'Access dashboard', resource: 'dashboard', action: 'view' },
          { id: 'view:children', name: 'View Children', description: 'View child information', resource: 'children', action: 'view' },
          { id: 'view:applications', name: 'View Applications', description: 'View applications', resource: 'applications', action: 'view' },
          { id: 'create:application', name: 'Create Application', description: 'Create new applications', resource: 'applications', action: 'create' },
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      caseworker: {
        id: 'caseworker',
        name: 'caseworker',
        displayName: 'Case Worker',
        description: 'Municipal case worker',
        permissions: [
          { id: 'view:dashboard', name: 'View Dashboard', description: 'Access dashboard', resource: 'dashboard', action: 'view' },
          { id: 'view:applications', name: 'View Applications', description: 'View all applications', resource: 'applications', action: 'view' },
          { id: 'review:applications', name: 'Review Applications', description: 'Review and process applications', resource: 'applications', action: 'review' },
          { id: 'manage:placements', name: 'Manage Placements', description: 'Manage kindergarten placements', resource: 'placements', action: 'manage' },
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  }

  // Development mode - returns mock data
  async getMockRole(roleName: string): Promise<Role | null> {
    const mockData = this.getMockData()
    return mockData[roleName as keyof typeof mockData] || null
  }
}

export const roleService = new RoleService()
