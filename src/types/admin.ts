// Admin-specific type definitions for Oslo Kindergarten System
import type { BaseEntity, PaginatedData } from './common'
import type { User, UserRole } from './user'

// System Statistics and Dashboard Data
export interface SystemStatistics {
  totalApplications: number
  activeKindergartens: number
  totalChildren: number
  systemUptime: number
  pendingApplications: number
  placementRate: number
  avgProcessingTime: number
  userSessions: number
  totalDistricts?: number
  activeUsers?: number
  complianceScore?: number
}

// System Activity and Monitoring
export interface SystemActivity {
  id: string
  type: 'system' | 'security' | 'application' | 'capacity' | 'user'
  message: string
  time: string
  severity: 'info' | 'warning' | 'error'
  details?: Record<string, unknown>
}

// Quick Action Items for Admin Dashboard
export interface QuickAction {
  title: string
  description: string
  icon: string
  link: string
  color: string
}

// Dashboard Data Structure
export interface AdminDashboardData {
  statistics: SystemStatistics
  recentActivity: SystemActivity[]
  quickActions: QuickAction[]
  systemAlerts: SystemActivity[]
}

// System Settings Configuration
export interface GeneralSettings {
  systemName: string
  adminEmail: string
  supportEmail: string
  defaultLanguage: string
  timezone: string
  maintenanceMode: boolean
}

export interface ApplicationSettings {
  maxApplicationsPerChild: number
  applicationDeadline: string
  autoApprovalEnabled: boolean
  documentRequiredDays: number
  reminderEmailDays: number
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  altinnIntegration: boolean
  statusUpdateEmails: boolean
  placementOfferEmails: boolean
}

export interface SecuritySettings {
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  twoFactorRequired: boolean
  apiRateLimit: number
}

export interface IntegrationSettings {
  fregEnabled: boolean
  altinnEnabled: boolean
  idPortenEnabled: boolean
  noarkEnabled: boolean
  qlikSenseUrl: string
}

export interface SystemSettings {
  general: GeneralSettings
  applications: ApplicationSettings
  notifications: NotificationSettings
  security: SecuritySettings
  integrations: IntegrationSettings
}

export interface SettingsUpdateRequest {
  category: keyof SystemSettings
  settings: Partial<
    GeneralSettings |
    ApplicationSettings |
    NotificationSettings |
    SecuritySettings |
    IntegrationSettings
  >
}

// Report Generation
export interface ReportType {
  id: string
  name: string
  description: string
  category: string
  lastGenerated?: string
  icon: string
}

export interface ReportGenerationRequest {
  reportId: string
  dateRange: {
    start: string
    end: string
  }
  format: 'pdf' | 'excel' | 'csv'
  filters?: Record<string, unknown>
  parameters?: Record<string, unknown>
}

export interface GeneratedReport {
  name: string
  type: string
  generatedBy: string
  date: string
  size: string
  format: string
  downloadUrl: string
}

// District Management
export interface District extends BaseEntity {
  name: string
  code: string
  kindergartenCount: number
  capacity: number
  occupancy: number
  manager?: User
  coordinatorEmail?: string
  coordinatorPhone?: string
  settings?: Record<string, unknown>
}

// User Templates
export interface UserTemplate extends BaseEntity {
  name: string
  description: string
  role: UserRole
  permissions: string[]
  defaultSettings: Record<string, unknown>
  isActive: boolean
  usageCount?: number
}

// Feature Flags
export interface FeatureFlag extends BaseEntity {
  name: string
  key: string
  description: string
  isEnabled: boolean
  rolloutPercentage: number
  targetRoles?: UserRole[]
  environment: 'development' | 'staging' | 'production' | 'all'
  startDate?: string
  endDate?: string
}

// Admin Module Definition
export interface AdminModule {
  title: string
  description: string
  icon: string
  href: string
  color: string
  iconColor: string
  category: 'system' | 'governance' | 'security' | 'reports'
}

// Municipality Admin specific
export interface MunicipalityStatistics {
  totalDistricts: number
  totalKindergartens: number
  totalCapacity: number
  currentOccupancy: number
  waitingListTotal: number
  staffCount: number
  complianceRate: number
  budgetUtilization: number
}

export interface MunicipalityDashboardData {
  statistics: MunicipalityStatistics
  districtOverview: District[]
  recentActivity: SystemActivity[]
  pendingActions: QuickAction[]
  alerts: SystemActivity[]
}

// API Response Types
export interface AdminApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

// Service Interface for Admin Operations
export interface AdminService {
  getDashboardData(): Promise<AdminDashboardData>
  getSystemStatistics(): Promise<SystemStatistics>
  getSystemSettings(): Promise<SystemSettings>
  updateSystemSettings(request: SettingsUpdateRequest): Promise<void>
  getReportTypes(): Promise<ReportType[]>
  generateReport(request: ReportGenerationRequest): Promise<GeneratedReport>
  getDistricts(): Promise<PaginatedData<District>>
  getUserTemplates(): Promise<PaginatedData<UserTemplate>>
  getFeatureFlags(): Promise<PaginatedData<FeatureFlag>>
}
