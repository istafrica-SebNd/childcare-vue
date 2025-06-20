export type UserRole = 'guardian' | 'caseworker' | 'admin' | 'staff' | 'partner' | 'district-admin' | 'educator'

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
  conditions?: Record<string, string | number | boolean>
}

export interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: Permission[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
  route?: string
  requiredPermissions: string[]
  children?: NavigationItem[]
  badge?: NavigationBadge
  hidden?: boolean
  separator?: boolean
  order: number
  parentId?: string
}

export interface NavigationBadge {
  type?: 'static' | 'dynamic'
  text?: string
  source?: string
  severity?: 'success' | 'info' | 'warning' | 'danger'
  condition?: string
}

export interface RoleNavigationConfig {
  roleId: string
  navigationItems: NavigationItem[]
  layoutSettings: LayoutSettings
  lastUpdated: string
}

export interface LayoutSettings {
  showBreadcrumb: boolean
  showNotifications: boolean
  sidebarCollapsible: boolean
  theme: 'light' | 'dark'
  customComponents?: {
    sidebar?: string
    header?: string
    footer?: string
  }
}

export interface UserPermissionCheck {
  userId: string
  roleId: string
  permissions: string[]
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
}
