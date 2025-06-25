import type {
  AdminDashboardData,
  SystemStatistics,
  SystemSettings,
  SettingsUpdateRequest,
  ReportType,
  ReportGenerationRequest,
  GeneratedReport,
  District,
  UserTemplate,
  FeatureFlag,
  AdminModule,
  SystemActivity,
  QuickAction
} from '@/types/admin'
import type { PaginatedData } from '@/types/common'

// Mock data for development
const mockSystemStatistics: SystemStatistics = {
  totalApplications: 2847,
  activeKindergartens: 680,
  totalChildren: 34567,
  systemUptime: 99.94,
  pendingApplications: 234,
  placementRate: 92.3,
  avgProcessingTime: 8.5,
  userSessions: 1423,
  totalDistricts: 15,
  activeUsers: 8429,
  complianceScore: 96.8
}

const mockRecentActivity: SystemActivity[] = [
  {
    id: '1',
    type: 'system',
    message: 'System backup completed successfully',
    time: '5 minutes ago',
    severity: 'info'
  },
  {
    id: '2',
    type: 'security',
    message: 'Multiple failed login attempts detected',
    time: '1 hour ago',
    severity: 'warning'
  },
  {
    id: '3',
    type: 'application',
    message: '45 new applications submitted today',
    time: '2 hours ago',
    severity: 'info'
  },
  {
    id: '4',
    type: 'capacity',
    message: 'Løvenskiold Kindergarten reached full capacity',
    time: '4 hours ago',
    severity: 'warning'
  }
]

const mockQuickActions: QuickAction[] = [
  {
    title: 'System Reports',
    description: 'Generate system reports and analytics',
    icon: 'BarChart3',
    link: '/admin/reports',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'System Settings',
    description: 'Configure system parameters',
    icon: 'Settings',
    link: '/admin/settings',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    icon: 'Users',
    link: '/admin/users',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'System Logs',
    description: 'View system and security logs',
    icon: 'Shield',
    link: '/admin/logs',
    color: 'bg-orange-100 text-orange-600'
  }
]

const mockSystemSettings: SystemSettings = {
  general: {
    systemName: 'Oslo Kindergarten Portal',
    adminEmail: 'admin@oslo.kommune.no',
    supportEmail: 'support@oslo.kommune.no',
    defaultLanguage: 'no',
    timezone: 'Europe/Oslo',
    maintenanceMode: false
  },
  applications: {
    maxApplicationsPerChild: 5,
    applicationDeadline: '2024-04-15',
    autoApprovalEnabled: false,
    documentRequiredDays: 14,
    reminderEmailDays: 7
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    altinnIntegration: true,
    statusUpdateEmails: true,
    placementOfferEmails: true
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    twoFactorRequired: false,
    apiRateLimit: 1000
  },
  integrations: {
    fregEnabled: true,
    altinnEnabled: true,
    idPortenEnabled: true,
    noarkEnabled: true,
    qlikSenseUrl: 'https://qlik.oslo.kommune.no'
  }
}

const mockReportTypes: ReportType[] = [
  {
    id: 'applications-status',
    name: 'Applications by Status',
    description: 'Overview of application statuses over time',
    category: 'Applications',
    lastGenerated: '2024-03-18',
    icon: 'FileText'
  },
  {
    id: 'placement-rates',
    name: 'Placement Response Rates',
    description: 'Success rates for placement offers',
    category: 'Placements',
    lastGenerated: '2024-03-17',
    icon: 'TrendingUp'
  },
  {
    id: 'capacity-utilization',
    name: 'Kindergarten Capacity',
    description: 'Capacity utilization by kindergarten and district',
    category: 'Capacity',
    lastGenerated: '2024-03-16',
    icon: 'Building'
  }
]

const mockAdminModules: AdminModule[] = [
  {
    title: 'Global System Configuration',
    description: 'System-wide parameters, feature flags, and global settings',
    icon: 'Globe',
    href: '/admin/global-config',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    iconColor: 'text-blue-600',
    category: 'system'
  },
  {
    title: 'District Oversight',
    description: 'Monitor and manage all districts across the municipality',
    icon: 'MapPin',
    href: '/admin/districts',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
    iconColor: 'text-green-600',
    category: 'governance'
  },
  {
    title: 'Policy Management',
    description: 'Define municipality-wide policies and compliance rules',
    icon: 'Flag',
    href: '/admin/policies',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    iconColor: 'text-purple-600',
    category: 'governance'
  },
  {
    title: 'User & Role Templates',
    description: 'Manage system-wide user roles and permission templates',
    icon: 'UserCheck',
    href: '/admin/user-templates',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    iconColor: 'text-orange-600',
    category: 'security'
  }
]

class AdminApiService {
  private cache = new Map<string, { data: unknown; timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private isProduction = import.meta.env.PROD
  private apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T
    }
    return null
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getDashboardData(): Promise<AdminDashboardData> {
    const cacheKey = 'admin-dashboard-data'
    const cached = this.getCached<AdminDashboardData>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Mock data for development
      const data: AdminDashboardData = {
        statistics: mockSystemStatistics,
        recentActivity: mockRecentActivity,
        quickActions: mockQuickActions,
        systemAlerts: mockRecentActivity.filter(a => a.severity === 'warning')
      }
      this.setCache(cacheKey, data)
      return data
    }

    // Production API call
    const response = await fetch(`${this.apiBaseUrl}/admin/dashboard`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getSystemStatistics(): Promise<SystemStatistics> {
    const cacheKey = 'system-statistics'
    const cached = this.getCached<SystemStatistics>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      this.setCache(cacheKey, mockSystemStatistics)
      return mockSystemStatistics
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/statistics`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getSystemSettings(): Promise<SystemSettings> {
    const cacheKey = 'system-settings'
    const cached = this.getCached<SystemSettings>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      this.setCache(cacheKey, mockSystemSettings)
      return mockSystemSettings
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/settings`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async updateSystemSettings(request: SettingsUpdateRequest): Promise<void> {
    // Clear cache when settings are updated
    this.cache.delete('system-settings')

    if (!this.isProduction) {
      // Mock delay for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings updated:', request)
      return
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error('Failed to update settings')
    }
  }

  async getReportTypes(): Promise<ReportType[]> {
    const cacheKey = 'report-types'
    const cached = this.getCached<ReportType[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      this.setCache(cacheKey, mockReportTypes)
      return mockReportTypes
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/reports/types`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async generateReport(request: ReportGenerationRequest): Promise<GeneratedReport> {
    if (!this.isProduction) {
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      return {
        name: `${request.reportId}-${new Date().getTime()}`,
        type: 'Generated Report',
        generatedBy: 'System',
        date: new Date().toISOString().split('T')[0],
        size: '2.3 MB',
        format: request.format,
        downloadUrl: '/mock-download-url'
      }
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error('Failed to generate report')
    }

    return await response.json()
  }

  async getAdminModules(): Promise<AdminModule[]> {
    const cacheKey = 'admin-modules'
    const cached = this.getCached<AdminModule[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      this.setCache(cacheKey, mockAdminModules)
      return mockAdminModules
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/modules`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  // Additional methods for other admin functionality
  async getDistricts(): Promise<PaginatedData<District>> {
    // Implementation similar to above
    if (!this.isProduction) {
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/districts`)
    return await response.json()
  }

  async getUserTemplates(): Promise<PaginatedData<UserTemplate>> {
    // Implementation similar to above
    if (!this.isProduction) {
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/user-templates`)
    return await response.json()
  }

  async getFeatureFlags(): Promise<PaginatedData<FeatureFlag>> {
    // Implementation similar to above
    if (!this.isProduction) {
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }

    const response = await fetch(`${this.apiBaseUrl}/admin/feature-flags`)
    return await response.json()
  }
}

export const adminApiService = new AdminApiService()
export default adminApiService
