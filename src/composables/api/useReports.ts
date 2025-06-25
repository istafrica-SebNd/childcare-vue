import { ref, computed } from 'vue'
import { reportsService } from '@/services/api/reports'
import { useAuth } from '@/composables/auth/useAuth'
import type {
  ReportType,
  ReportGenerationRequest,
  GeneratedReport,
  ChartConfig,
  DashboardWidget
} from '@/types/reports'

// Global state for reports data
const reportTypes = ref<ReportType[]>([])
const generatedReports = ref<GeneratedReport[]>([])
const chartConfigs = ref<ChartConfig[]>([])
const dashboardWidgets = ref<DashboardWidget[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useReports() {
  const { userRole, user } = useAuth()

  // Loading states for different operations
  const reportTypesLoading = ref(false)
  const generatedReportsLoading = ref(false)
  const chartConfigsLoading = ref(false)
  const widgetsLoading = ref(false)
  const generatingReport = ref(false)
  const downloadingReport = ref(false)

  // Computed getters
  const availableReportCategories = computed(() => {
    if (!userRole.value) return []
    return reportsService.getReportCategories(userRole.value)
  })

  const recentReports = computed(() =>
    generatedReports.value
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, 5)
  )

  const expiredReports = computed(() =>
    generatedReports.value.filter(report =>
      report.expiresAt && new Date(report.expiresAt) < new Date()
    )
  )

  const completedReports = computed(() =>
    generatedReports.value.filter(report => report.status === 'completed')
  )

  const processingReports = computed(() =>
    generatedReports.value.filter(report => report.status === 'processing')
  )

  // Report Types operations
  const loadReportTypes = async () => {
    if (!userRole.value) {
      reportTypes.value = []
      return
    }

    reportTypesLoading.value = true
    error.value = null

    try {
      reportTypes.value = await reportsService.getReportTypes(userRole.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load report types'
      console.error('Error loading report types:', err)
    } finally {
      reportTypesLoading.value = false
    }
  }

  const getReportTypesByCategory = (category: string): ReportType[] => {
    return reportTypes.value.filter(report => report.category === category)
  }

  const isReportAvailable = (reportId: string): boolean => {
    if (!userRole.value) return false
    return reportsService.isReportAvailableForRole(reportId, userRole.value)
  }

  // Report Generation operations
  const generateReport = async (request: ReportGenerationRequest): Promise<GeneratedReport | null> => {
    if (!userRole.value) {
      error.value = 'User role not available'
      return null
    }

    generatingReport.value = true
    error.value = null

    try {
      const newReport = await reportsService.generateReport(request, userRole.value)

      // Update local state
      generatedReports.value.unshift(newReport)

      return newReport
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate report'
      console.error('Error generating report:', err)
      throw err
    } finally {
      generatingReport.value = false
    }
  }

  const getEstimatedGenerationTime = (reportId: string): string => {
    return reportsService.getEstimatedGenerationTime(reportId)
  }

  // Generated Reports operations
  const loadGeneratedReports = async (page = 1, limit = 10) => {
    if (!userRole.value || !user.value?.id) {
      generatedReports.value = []
      return
    }

    generatedReportsLoading.value = true
    error.value = null

    try {
      const reportData = await reportsService.getGeneratedReports(
        user.value.id,
        userRole.value,
        page,
        limit
      )

      if (page === 1) {
        generatedReports.value = reportData.items
      } else {
        generatedReports.value.push(...reportData.items)
      }

      return reportData.pagination
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load generated reports'
      console.error('Error loading generated reports:', err)
    } finally {
      generatedReportsLoading.value = false
    }
  }

  const downloadReport = async (reportId: string): Promise<Blob | null> => {
    if (!userRole.value) {
      error.value = 'User role not available'
      return null
    }

    downloadingReport.value = true
    error.value = null

    try {
      const blob = await reportsService.downloadReport(reportId, userRole.value)
      return blob
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to download report'
      console.error('Error downloading report:', err)
      throw err
    } finally {
      downloadingReport.value = false
    }
  }

  const deleteExpiredReports = () => {
    generatedReports.value = generatedReports.value.filter(report =>
      !report.expiresAt || new Date(report.expiresAt) >= new Date()
    )
  }

  // Chart operations
  const loadChartConfigs = async () => {
    if (!userRole.value) {
      chartConfigs.value = []
      return
    }

    chartConfigsLoading.value = true
    error.value = null

    try {
      chartConfigs.value = await reportsService.getChartConfigs(userRole.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load chart configs'
      console.error('Error loading chart configs:', err)
    } finally {
      chartConfigsLoading.value = false
    }
  }

  const getChartData = async (
    chartId: string,
    period: string,
    filters?: Record<string, unknown>
  ): Promise<unknown> => {
    if (!userRole.value) {
      error.value = 'User role not available'
      return null
    }

    try {
      return await reportsService.getChartData(chartId, period, userRole.value, filters)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load chart data'
      console.error('Error loading chart data:', err)
      throw err
    }
  }

  const getChartsByType = (type: string): ChartConfig[] => {
    return chartConfigs.value.filter(chart => chart.type === type)
  }

  // Dashboard Widget operations
  const loadDashboardWidgets = async () => {
    if (!userRole.value) {
      dashboardWidgets.value = []
      return
    }

    widgetsLoading.value = true
    error.value = null

    try {
      dashboardWidgets.value = await reportsService.getDashboardWidgets(userRole.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load dashboard widgets'
      console.error('Error loading dashboard widgets:', err)
    } finally {
      widgetsLoading.value = false
    }
  }

  const getWidgetData = async (widgetId: string): Promise<unknown> => {
    if (!userRole.value) {
      error.value = 'User role not available'
      return null
    }

    try {
      return await reportsService.getWidgetData(widgetId, userRole.value, user.value?.id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load widget data'
      console.error('Error loading widget data:', err)
      throw err
    }
  }

  const getWidgetsBySize = (size: string): DashboardWidget[] => {
    return dashboardWidgets.value.filter(widget => widget.size === size)
  }

  // Utility functions
  const clearError = () => {
    error.value = null
  }

  const refreshData = async () => {
    if (!userRole.value) return

    // Clear cache and reload all data
    reportsService.invalidateCache()
    await Promise.all([
      loadReportTypes(),
      loadGeneratedReports(),
      loadChartConfigs(),
      loadDashboardWidgets()
    ])
  }

  // Initialize data on first use
  const initialize = async () => {
    if (!userRole.value) return

    await Promise.all([
      loadReportTypes(),
      loadGeneratedReports(),
      loadChartConfigs(),
      loadDashboardWidgets()
    ])
  }

  // Statistics helpers
  const getTotalReportsGenerated = computed(() => generatedReports.value.length)
  const getTotalReportsExpired = computed(() => expiredReports.value.length)
  const getReportsGeneratedToday = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return generatedReports.value.filter(report =>
      report.generatedAt.split('T')[0] === today
    ).length
  })

  // Format helpers
  const formatReportSize = (sizeString: string): string => {
    return sizeString // Already formatted as "1.2 MB"
  }

  const formatGeneratedDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    // State
    reportTypes,
    generatedReports,
    chartConfigs,
    dashboardWidgets,

    // Loading states
    loading,
    reportTypesLoading,
    generatedReportsLoading,
    chartConfigsLoading,
    widgetsLoading,
    generatingReport,
    downloadingReport,
    error,

    // Computed
    availableReportCategories,
    recentReports,
    expiredReports,
    completedReports,
    processingReports,
    getTotalReportsGenerated,
    getTotalReportsExpired,
    getReportsGeneratedToday,

    // Report Types methods
    loadReportTypes,
    getReportTypesByCategory,
    isReportAvailable,

    // Report Generation methods
    generateReport,
    getEstimatedGenerationTime,

    // Generated Reports methods
    loadGeneratedReports,
    downloadReport,
    deleteExpiredReports,

    // Chart methods
    loadChartConfigs,
    getChartData,
    getChartsByType,

    // Dashboard Widget methods
    loadDashboardWidgets,
    getWidgetData,
    getWidgetsBySize,

    // Utility methods
    clearError,
    refreshData,
    initialize,
    formatReportSize,
    formatGeneratedDate
  }
}