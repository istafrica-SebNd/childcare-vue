import type {
  ReportType,
  ReportGenerationRequest,
  GeneratedReport,
  ReportTemplate,
  ChartConfig,
  DashboardWidget
} from '@/types/reports'
import type { PaginatedData } from '@/types/common'

// Mock data for development
const mockReportTypes: ReportType[] = [
  // Admin Reports
  {
    id: 'system-overview',
    name: 'System Overview Report',
    description: 'Comprehensive system statistics and performance metrics',
    category: 'System',
    lastGenerated: '2024-03-18',
    icon: 'BarChart3',
    availableRoles: ['admin'],
    estimatedTime: '2-3 minutes'
  },
  {
    id: 'applications-status',
    name: 'Applications by Status',
    description: 'Overview of application statuses over time',
    category: 'Applications',
    lastGenerated: '2024-03-18',
    icon: 'FileText',
    availableRoles: ['admin', 'caseworker'],
    estimatedTime: '1-2 minutes'
  },
  {
    id: 'placement-rates',
    name: 'Placement Success Rates',
    description: 'Success rates for placement offers by district and kindergarten',
    category: 'Placements',
    lastGenerated: '2024-03-17',
    icon: 'TrendingUp',
    availableRoles: ['admin', 'caseworker'],
    estimatedTime: '2-3 minutes'
  },
  {
    id: 'capacity-utilization',
    name: 'Kindergarten Capacity Report',
    description: 'Capacity utilization by kindergarten and district',
    category: 'Capacity',
    lastGenerated: '2024-03-16',
    icon: 'Building',
    availableRoles: ['admin', 'district-admin'],
    estimatedTime: '1-2 minutes'
  },
  // Guardian Reports
  {
    id: 'child-attendance',
    name: 'Child Attendance Report',
    description: 'Detailed attendance records for your child',
    category: 'Personal',
    lastGenerated: '2024-03-15',
    icon: 'Calendar',
    availableRoles: ['guardian'],
    estimatedTime: '30 seconds'
  },
  {
    id: 'payment-history',
    name: 'Payment History',
    description: 'Complete payment history and receipts',
    category: 'Financial',
    lastGenerated: '2024-03-14',
    icon: 'CreditCard',
    availableRoles: ['guardian'],
    estimatedTime: '30 seconds'
  },
  // Caseworker Reports
  {
    id: 'waiting-list',
    name: 'Waiting List Analysis',
    description: 'Current waiting list statistics and projections',
    category: 'Operations',
    lastGenerated: '2024-03-17',
    icon: 'Users',
    availableRoles: ['caseworker', 'admin'],
    estimatedTime: '1-2 minutes'
  },
  // District Admin Reports
  {
    id: 'district-performance',
    name: 'District Performance Report',
    description: 'District-specific performance metrics and analytics',
    category: 'Management',
    lastGenerated: '2024-03-16',
    icon: 'MapPin',
    availableRoles: ['district-admin', 'admin'],
    estimatedTime: '2-3 minutes'
  }
]

const mockChartConfigs: ChartConfig[] = [
  {
    id: 'applications-trend',
    type: 'line',
    title: 'Application Submissions Trend',
    description: 'Monthly application submissions over the past year',
    dataSource: 'applications',
    availableRoles: ['admin', 'caseworker'],
    defaultPeriod: '12months'
  },
  {
    id: 'placement-success',
    type: 'bar',
    title: 'Placement Success Rate by District',
    description: 'Success rates for placement offers across all districts',
    dataSource: 'placements',
    availableRoles: ['admin', 'district-admin'],
    defaultPeriod: '6months'
  },
  {
    id: 'capacity-overview',
    type: 'doughnut',
    title: 'System-wide Capacity Overview',
    description: 'Current capacity utilization across all kindergartens',
    dataSource: 'capacity',
    availableRoles: ['admin'],
    defaultPeriod: 'current'
  },
  {
    id: 'child-attendance-pattern',
    type: 'heatmap',
    title: 'Child Attendance Pattern',
    description: 'Weekly attendance patterns for your child',
    dataSource: 'attendance',
    availableRoles: ['guardian'],
    defaultPeriod: '3months'
  }
]

const mockDashboardWidgets: DashboardWidget[] = [
  {
    id: 'quick-stats',
    type: 'stats',
    title: 'Quick Statistics',
    size: 'medium',
    availableRoles: ['admin', 'caseworker', 'district-admin'],
    refreshInterval: 300000 // 5 minutes
  },
  {
    id: 'recent-applications',
    type: 'list',
    title: 'Recent Applications',
    size: 'large',
    availableRoles: ['caseworker', 'admin'],
    refreshInterval: 60000 // 1 minute
  },
  {
    id: 'my-children-status',
    type: 'cards',
    title: 'My Children Status',
    size: 'large',
    availableRoles: ['guardian'],
    refreshInterval: 300000 // 5 minutes
  },
  {
    id: 'capacity-alerts',
    type: 'alerts',
    title: 'Capacity Alerts',
    size: 'small',
    availableRoles: ['admin', 'district-admin'],
    refreshInterval: 120000 // 2 minutes
  }
]

class ReportsService {
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

  async getReportTypes(userRole: string): Promise<ReportType[]> {
    const cacheKey = `report-types-${userRole}`
    const cached = this.getCached<ReportType[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Filter reports by user role
      const filteredReports = mockReportTypes.filter(report =>
        report.availableRoles.includes(userRole)
      )
      this.setCache(cacheKey, filteredReports)
      return filteredReports
    }

    const response = await fetch(`${this.apiBaseUrl}/reports/types?role=${userRole}`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async generateReport(
    request: ReportGenerationRequest,
    userRole: string
  ): Promise<GeneratedReport> {
    if (!this.isProduction) {
      // Mock report generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const reportType = mockReportTypes.find(r => r.id === request.reportId)
      const timestamp = new Date().getTime()

      return {
        id: `report-${timestamp}`,
        name: `${reportType?.name || 'Report'}-${new Date().toISOString().split('T')[0]}`,
        type: reportType?.name || 'Generated Report',
        generatedBy: 'System',
        generatedAt: new Date().toISOString(),
        size: `${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)} MB`,
        format: request.format || 'PDF',
        downloadUrl: `/mock-download/${timestamp}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: 'completed',
        parameters: request.parameters
      }
    }

    const response = await fetch(`${this.apiBaseUrl}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': userRole
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error('Failed to generate report')
    }

    return await response.json()
  }

  async getGeneratedReports(
    userId: string,
    userRole: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedData<GeneratedReport>> {
    const cacheKey = `generated-reports-${userId}-${page}-${limit}`
    const cached = this.getCached<PaginatedData<GeneratedReport>>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Mock generated reports
      const mockReports: GeneratedReport[] = [
        {
          id: 'report-1',
          name: 'Child Attendance Report - March 2024',
          type: 'Child Attendance Report',
          generatedBy: 'System',
          generatedAt: '2024-03-15T10:30:00Z',
          size: '1.2 MB',
          format: 'PDF',
          downloadUrl: '/mock-download/1',
          expiresAt: '2024-03-22T10:30:00Z',
          status: 'completed'
        }
      ]

      const result: PaginatedData<GeneratedReport> = {
        items: mockReports,
        pagination: {
          page,
          limit,
          total: mockReports.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      this.setCache(cacheKey, result)
      return result
    }

    const response = await fetch(
      `${this.apiBaseUrl}/reports/generated?page=${page}&limit=${limit}`,
      {
        headers: { 'X-User-Role': userRole }
      }
    )
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getChartConfigs(userRole: string): Promise<ChartConfig[]> {
    const cacheKey = `chart-configs-${userRole}`
    const cached = this.getCached<ChartConfig[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Filter charts by user role
      const filteredCharts = mockChartConfigs.filter(chart =>
        chart.availableRoles.includes(userRole)
      )
      this.setCache(cacheKey, filteredCharts)
      return filteredCharts
    }

    const response = await fetch(`${this.apiBaseUrl}/charts/configs?role=${userRole}`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getChartData(
    chartId: string,
    period: string,
    userRole: string,
    filters?: Record<string, unknown>
  ): Promise<unknown> {
    const cacheKey = `chart-data-${chartId}-${period}-${JSON.stringify(filters)}`
    const cached = this.getCached<unknown>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Mock chart data based on chart type
      let mockData
      const chartConfig = mockChartConfigs.find(c => c.id === chartId)

      if (chartConfig?.type === 'line') {
        mockData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Applications',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }]
        }
      } else if (chartConfig?.type === 'bar') {
        mockData = {
          labels: ['District 1', 'District 2', 'District 3', 'District 4'],
          datasets: [{
            label: 'Success Rate %',
            data: [85, 92, 78, 88],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        }
      } else if (chartConfig?.type === 'doughnut') {
        mockData = {
          labels: ['Available', 'Occupied', 'Maintenance'],
          datasets: [{
            data: [300, 450, 50],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
          }]
        }
      } else {
        mockData = { message: 'Chart data not available' }
      }

      this.setCache(cacheKey, mockData)
      return mockData
    }

    const params = new URLSearchParams({
      period,
      role: userRole,
      ...(filters && { filters: JSON.stringify(filters) })
    })

    const response = await fetch(`${this.apiBaseUrl}/charts/${chartId}/data?${params}`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getDashboardWidgets(userRole: string): Promise<DashboardWidget[]> {
    const cacheKey = `dashboard-widgets-${userRole}`
    const cached = this.getCached<DashboardWidget[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Filter widgets by user role
      const filteredWidgets = mockDashboardWidgets.filter(widget =>
        widget.availableRoles.includes(userRole)
      )
      this.setCache(cacheKey, filteredWidgets)
      return filteredWidgets
    }

    const response = await fetch(`${this.apiBaseUrl}/dashboard/widgets?role=${userRole}`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getWidgetData(
    widgetId: string,
    userRole: string,
    userId?: string
  ): Promise<unknown> {
    const cacheKey = `widget-data-${widgetId}-${userRole}-${userId || 'global'}`
    const cached = this.getCached<unknown>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Mock widget data based on widget type
      let mockData

      switch (widgetId) {
        case 'quick-stats':
          mockData = {
            totalApplications: 2847,
            pendingReviews: 234,
            placementsToday: 12,
            systemUptime: 99.94
          }
          break
        case 'recent-applications':
          mockData = [
            { id: 'app-1', childName: 'Emma Hansen', status: 'under_review', submittedAt: '2024-03-18' },
            { id: 'app-2', childName: 'Magnus Olsen', status: 'approved', submittedAt: '2024-03-17' }
          ]
          break
        case 'my-children-status':
          mockData = [
            { id: 'child-1', name: 'Emma', status: 'enrolled', kindergarten: 'Løvenskiold' },
            { id: 'child-2', name: 'Magnus', status: 'applied', kindergarten: null }
          ]
          break
        case 'capacity-alerts':
          mockData = [
            { kindergarten: 'Grünerløkka Kindergarten', capacity: 95, alert: 'Near Full' },
            { kindergarten: 'Majorstuen Kindergarten', capacity: 100, alert: 'Full' }
          ]
          break
        default:
          mockData = { message: 'Widget data not available' }
      }

      this.setCache(cacheKey, mockData)
      return mockData
    }

    const params = new URLSearchParams({
      role: userRole,
      ...(userId && { userId })
    })

    const response = await fetch(`${this.apiBaseUrl}/dashboard/widgets/${widgetId}/data?${params}`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async downloadReport(reportId: string, userRole: string): Promise<Blob> {
    if (!this.isProduction) {
      // Mock PDF download
      const mockPdfContent = 'Mock PDF content for report: ' + reportId
      return new Blob([mockPdfContent], { type: 'application/pdf' })
    }

    const response = await fetch(`${this.apiBaseUrl}/reports/${reportId}/download`, {
      headers: { 'X-User-Role': userRole }
    })

    if (!response.ok) {
      throw new Error('Failed to download report')
    }

    return await response.blob()
  }

  // Cache management
  invalidateCache(pattern?: string): void {
    if (pattern) {
      const keys = Array.from(this.cache.keys()).filter(key => key.includes(pattern))
      keys.forEach(key => this.cache.delete(key))
    } else {
      this.cache.clear()
    }
  }

  // Utility methods
  getEstimatedGenerationTime(reportId: string): string {
    const reportType = mockReportTypes.find(r => r.id === reportId)
    return reportType?.estimatedTime || '1-2 minutes'
  }

  isReportAvailableForRole(reportId: string, userRole: string): boolean {
    const reportType = mockReportTypes.find(r => r.id === reportId)
    return reportType?.availableRoles.includes(userRole) || false
  }

  getReportCategories(userRole: string): string[] {
    const availableReports = mockReportTypes.filter(r => r.availableRoles.includes(userRole))
    return [...new Set(availableReports.map(r => r.category))]
  }
}

export const reportsService = new ReportsService()
export default reportsService