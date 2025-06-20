import type { NavigationItem, RoleNavigationConfig, UserPermissionCheck } from '@/types/role.types'
import { roleService } from './roleService'
import { permissionService } from './permissionService'

class NavigationService {
  private navigationCache = new Map<string, { config: RoleNavigationConfig; timestamp: number }>()
  private cacheTTL = 5 * 60 * 1000 // 5 minutes
  private badgeData = new Map<string, Record<string, string | number>>()

  private isValidCache(roleId: string): boolean {
    const cached = this.navigationCache.get(roleId)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.cacheTTL
  }

  async getNavigationConfig(roleId: string): Promise<RoleNavigationConfig | null> {
    // Try cache first
    if (this.isValidCache(roleId)) {
      return this.navigationCache.get(roleId)!.config
    }

    // Fetch from API
    const config = await roleService.getRoleNavigationConfig(roleId)
    if (config) {
      this.navigationCache.set(roleId, {
        config,
        timestamp: Date.now()
      })
    }

    return config
  }

  async buildUserNavigation(userId: string, roleId: string): Promise<{
    primary: NavigationItem[]
    secondary: NavigationItem[]
    applications: NavigationItem[]
  }> {
    // Get user permissions
    const userPermissions = await permissionService.getUserPermissionCheck(userId, roleId)

    // Get navigation configuration for role
    const navConfig = await this.getNavigationConfig(roleId)

    if (!navConfig) {
      console.warn(`No navigation configuration found for role: ${roleId}`)
      return { primary: [], secondary: [], applications: [] }
    }

    // Filter and build navigation items
    const allItems = navConfig.navigationItems
    const categorizedItems = this.categorizeNavigationItems(allItems)

    return {
      primary: this.filterByPermissions(categorizedItems.primary, userPermissions),
      secondary: this.filterByPermissions(categorizedItems.secondary, userPermissions),
      applications: this.filterByPermissions(categorizedItems.applications, userPermissions)
    }
  }

  private categorizeNavigationItems(items: NavigationItem[]): {
    primary: NavigationItem[]
    secondary: NavigationItem[]
    applications: NavigationItem[]
  } {
    const categorized = {
      primary: [] as NavigationItem[],
      secondary: [] as NavigationItem[],
      applications: [] as NavigationItem[]
    }

    items.forEach(item => {
      // You can implement logic to categorize based on item properties
      // For now, we'll use a simple approach based on item.id patterns
      if (item.id.includes('application')) {
        categorized.applications.push(item)
      } else if (item.id.includes('dashboard') || item.id.includes('main')) {
        categorized.primary.push(item)
      } else {
        categorized.secondary.push(item)
      }
    })

    // Sort by order
    Object.keys(categorized).forEach(key => {
      categorized[key as keyof typeof categorized].sort((a, b) => a.order - b.order)
    })

    return categorized
  }

  private filterByPermissions(items: NavigationItem[], userPermissions: UserPermissionCheck): NavigationItem[] {
    return items
      .filter(item => {
        // Check if user has required permissions
        if (item.requiredPermissions.length === 0) return true
        return userPermissions.hasAnyPermission(item.requiredPermissions)
      })
      .map(item => ({
        ...item,
        badge: this.resolveBadge(item.badge, userPermissions.userId),
        children: item.children ? this.filterByPermissions(item.children, userPermissions) : undefined
      }))
      .filter(item => !item.hidden)
  }

  private resolveBadge(badge: NavigationItem['badge'], userId: string) {
    if (!badge) return undefined

    if (badge.type === 'dynamic' && badge.source) {
      const userBadgeData = this.badgeData.get(userId) || {}
      const value = userBadgeData[badge.source]

      return {
        ...badge,
        text: value?.toString() || '0'
      }
    }

    return badge
  }

  // Badge data management
  setBadgeData(userId: string, source: string, value: string | number): void {
    if (!this.badgeData.has(userId)) {
      this.badgeData.set(userId, {})
    }
    this.badgeData.get(userId)![source] = value
  }

  updateBadgeData(userId: string, data: Record<string, string | number>): void {
    if (!this.badgeData.has(userId)) {
      this.badgeData.set(userId, {})
    }
    Object.assign(this.badgeData.get(userId)!, data)
  }

  getBadgeData(userId: string): Record<string, string | number> {
    return this.badgeData.get(userId) || {}
  }

  // Cache management
  invalidateNavigationCache(roleId: string): void {
    this.navigationCache.delete(roleId)
  }

  clearCache(): void {
    this.navigationCache.clear()
    this.badgeData.clear()
  }

  // Mock navigation data for development
  getMockNavigationItems(roleId: string): NavigationItem[] {
    const mockNavigation: Record<string, NavigationItem[]> = {
      guardian: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'pi pi-th-large',
          route: '/guardian',
          requiredPermissions: ['view:dashboard'],
          order: 1
        },
        {
          id: 'children',
          label: 'My Children',
          icon: 'pi pi-users',
          requiredPermissions: ['view:children'],
          order: 2,
          badge: { type: 'dynamic', source: 'childrenCount' },
          children: [
            {
              id: 'children-list',
              label: 'Children List',
              icon: 'pi pi-list',
              route: '/guardian/children',
              requiredPermissions: ['view:children'],
              order: 1
            },
            {
              id: 'child-profile',
              label: 'Child Profile',
              icon: 'pi pi-user',
              route: '/guardian/child-profile',
              requiredPermissions: ['view:children'],
              order: 2
            }
          ]
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: 'pi pi-file',
          requiredPermissions: ['view:applications'],
          order: 3,
          children: [
            {
              id: 'new-application',
              label: 'New Application',
              icon: 'pi pi-plus',
              route: '/guardian/new-application',
              requiredPermissions: ['create:application'],
              order: 1
            },
            {
              id: 'application-status',
              label: 'Application Status',
              icon: 'pi pi-clock',
              route: '/guardian/application-status',
              requiredPermissions: ['view:applications'],
              order: 2
            }
          ]
        },
        {
          id: 'daily-schedule',
          label: 'Daily Schedule',
          icon: 'pi pi-calendar',
          route: '/guardian/daily-schedule',
          requiredPermissions: ['view:schedule'],
          order: 4
        },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: 'pi pi-clock',
          route: '/guardian/attendance-tracking',
          requiredPermissions: ['view:attendance'],
          order: 5
        },
        {
          id: 'messages',
          label: 'Messages',
          icon: 'pi pi-comments',
          route: '/guardian/messages',
          requiredPermissions: ['view:messages'],
          order: 6,
          badge: { type: 'dynamic', source: 'unreadMessages' }
        },
        {
          id: 'notice-board',
          label: 'Notice Board',
          icon: 'pi pi-megaphone',
          route: '/guardian/notice-board',
          requiredPermissions: ['view:notices'],
          order: 7
        },
        {
          id: 'payments',
          label: 'Payments',
          icon: 'pi pi-credit-card',
          route: '/guardian/payments',
          requiredPermissions: ['view:payments'],
          order: 8
        },
        {
          id: 'documents',
          label: 'Documents',
          icon: 'pi pi-folder',
          route: '/guardian/documents',
          requiredPermissions: ['view:documents'],
          order: 9
        },
        {
          id: 'living-arrangements',
          label: 'Living Arrangements',
          icon: 'pi pi-home',
          route: '/guardian/living-arrangements',
          requiredPermissions: ['manage:profile'],
          order: 10
        },
        // {
        //   id: 'settings',
        //   label: 'Settings',
        //   icon: 'pi pi-cog',
        //   requiredPermissions: ['manage:profile'],
        //   order: 10,
        //   children: [

        //     {
        //       id: 'emergency-contacts',
        //       label: 'Emergency Contacts',
        //       icon: 'pi pi-phone',
        //       route: '/guardian/emergency-contacts',
        //       requiredPermissions: ['manage:profile'],
        //       order: 2
        //     },
        //     {
        //       id: 'consents',
        //       label: 'Consents',
        //       icon: 'pi pi-check-circle',
        //       route: '/guardian/consents',
        //       requiredPermissions: ['manage:profile'],
        //       order: 3
        //     }
        //   ]
        // }
      ],
      caseworker: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'pi pi-th-large',
          route: '/caseworker',
          requiredPermissions: ['view:dashboard'],
          order: 1
        },
        {
          id: 'review-queue',
          label: 'Review Queue',
          icon: 'pi pi-list-check',
          route: '/caseworker/review-queue',
          requiredPermissions: ['review:applications'],
          order: 2,
          badge: { type: 'dynamic', source: 'pendingReviews' }
        },
        {
          id: 'placement-management',
          label: 'Placement Management',
          icon: 'pi pi-home',
          route: '/caseworker/placement-management',
          requiredPermissions: ['manage:placements'],
          order: 3
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: 'pi pi-file',
          requiredPermissions: ['view:applications'],
          order: 4,
          children: [
            {
              id: 'manual-application',
              label: 'Manual Application',
              icon: 'pi pi-plus',
              route: '/caseworker/manual-application',
              requiredPermissions: ['create:application'],
              order: 1
            },
            {
              id: 'applications-in-progress',
              label: 'In Progress',
              icon: 'pi pi-clock',
              route: '/caseworker/applications-in-progress',
              requiredPermissions: ['view:applications'],
              order: 2,
              badge: { type: 'dynamic', source: 'inProgressCount' }
            },
            {
              id: 'applications-submitted',
              label: 'Submitted',
              icon: 'pi pi-check',
              route: '/caseworker/applications-submitted',
              requiredPermissions: ['view:applications'],
              order: 3,
              badge: { type: 'dynamic', source: 'submittedCount' }
            },
            {
              id: 'applications-follow-up',
              label: 'Follow Up',
              icon: 'pi pi-exclamation-triangle',
              route: '/caseworker/applications-follow-up',
              requiredPermissions: ['view:applications'],
              order: 4
            }
          ]
        },
        {
          id: 'messages',
          label: 'Messages',
          icon: 'pi pi-comments',
          route: '/caseworker/messages',
          requiredPermissions: ['view:messages'],
          order: 5,
          badge: { type: 'dynamic', source: 'unreadMessages' }
        },
        {
          id: 'waiting-lists',
          label: 'Waiting Lists',
          icon: 'pi pi-list',
          route: '/caseworker/waiting-lists',
          requiredPermissions: ['view:waiting-lists'],
          order: 6
        },
        {
          id: 'offers',
          label: 'Offers',
          icon: 'pi pi-gift',
          route: '/caseworker/offers',
          requiredPermissions: ['manage:offers'],
          order: 7
        },
        {
          id: 'kindergartens',
          label: 'Kindergartens',
          icon: 'pi pi-building',
          route: '/caseworker/kindergartens',
          requiredPermissions: ['view:kindergartens'],
          order: 8
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: 'pi pi-chart-bar',
          route: '/caseworker/reports',
          requiredPermissions: ['view:reports'],
          order: 9
        }
      ],
      educator: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'pi pi-th-large',
          route: '/educator',
          requiredPermissions: ['view:dashboard'],
          order: 1
        },
        {
          id: 'my-children',
          label: 'My Children',
          icon: 'pi pi-users',
          route: '/educator/children',
          requiredPermissions: ['view:children'],
          order: 2
        },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: 'pi pi-clock',
          route: '/educator/attendance',
          requiredPermissions: ['manage:attendance'],
          order: 3
        },
        {
          id: 'daily-reports',
          label: 'Daily Reports',
          icon: 'pi pi-file-edit',
          route: '/educator/daily-reports',
          requiredPermissions: ['create:reports'],
          order: 4
        },
        {
          id: 'messages',
          label: 'Messages',
          icon: 'pi pi-comments',
          route: '/educator/messages',
          requiredPermissions: ['view:messages'],
          order: 5
        }
      ]
    }

    return mockNavigation[roleId] || []
  }

  // Mock method for development
  async getMockUserNavigation(userId: string, roleId: string) {
    const mockItems = this.getMockNavigationItems(roleId)
    const userPermissions = await permissionService.getUserPermissionCheck(userId, roleId)

    return {
      primary: this.filterByPermissions(mockItems, userPermissions),
      secondary: [] as NavigationItem[],
      applications: [] as NavigationItem[]
    }
  }
}

export const navigationService = new NavigationService()
