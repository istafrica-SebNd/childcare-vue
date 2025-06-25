import { ref, computed } from 'vue'
import { adminApiService } from '@/services/api/admin'
import type {
  AdminDashboardData,
  SystemSettings,
  SettingsUpdateRequest,
  ReportType,
  ReportGenerationRequest,
  GeneratedReport,
  AdminModule
} from '@/types/admin'

// Global state for admin data
const dashboardData = ref<AdminDashboardData | null>(null)
const systemSettings = ref<SystemSettings | null>(null)
const reportTypes = ref<ReportType[]>([])
const adminModules = ref<AdminModule[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useAdmin() {
  // Loading states for different operations
  const dashboardLoading = ref(false)
  const settingsLoading = ref(false)
  const reportsLoading = ref(false)

  // Computed getters
  const statistics = computed(() => dashboardData.value?.statistics)
  const recentActivity = computed(() => dashboardData.value?.recentActivity || [])
  const quickActions = computed(() => dashboardData.value?.quickActions || [])
  const systemAlerts = computed(() => dashboardData.value?.systemAlerts || [])

  // Dashboard operations
  const loadDashboardData = async () => {
    dashboardLoading.value = true
    error.value = null

    try {
      dashboardData.value = await adminApiService.getDashboardData()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load dashboard data'
      console.error('Error loading dashboard data:', err)
    } finally {
      dashboardLoading.value = false
    }
  }

  const refreshStatistics = async () => {
    try {
      const stats = await adminApiService.getSystemStatistics()
      if (dashboardData.value) {
        dashboardData.value.statistics = stats
      }
    } catch (err) {
      console.error('Error refreshing statistics:', err)
    }
  }

  // Settings operations
  const loadSystemSettings = async () => {
    settingsLoading.value = true
    error.value = null

    try {
      systemSettings.value = await adminApiService.getSystemSettings()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load system settings'
      console.error('Error loading system settings:', err)
    } finally {
      settingsLoading.value = false
    }
  }

  const updateSettings = async (request: SettingsUpdateRequest) => {
    settingsLoading.value = true
    error.value = null

    try {
      await adminApiService.updateSystemSettings(request)
      // Reload settings after update
      await loadSystemSettings()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update settings'
      console.error('Error updating settings:', err)
      throw err
    } finally {
      settingsLoading.value = false
    }
  }

  // Report operations
  const loadReportTypes = async () => {
    reportsLoading.value = true
    error.value = null

    try {
      reportTypes.value = await adminApiService.getReportTypes()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load report types'
      console.error('Error loading report types:', err)
    } finally {
      reportsLoading.value = false
    }
  }

  const generateReport = async (request: ReportGenerationRequest): Promise<GeneratedReport | null> => {
    loading.value = true
    error.value = null

    try {
      const report = await adminApiService.generateReport(request)
      return report
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate report'
      console.error('Error generating report:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Admin modules
  const loadAdminModules = async () => {
    loading.value = true
    error.value = null

    try {
      adminModules.value = await adminApiService.getAdminModules()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load admin modules'
      console.error('Error loading admin modules:', err)
    } finally {
      loading.value = false
    }
  }

  // Utility functions
  const clearError = () => {
    error.value = null
  }

  const hasAlert = computed(() => systemAlerts.value.length > 0)
  const warningCount = computed(() =>
    systemAlerts.value.filter(alert => alert.severity === 'warning').length
  )
  const errorCount = computed(() =>
    systemAlerts.value.filter(alert => alert.severity === 'error').length
  )

  // Initialize data on first use
  const initialize = async () => {
    await Promise.all([
      loadDashboardData(),
      loadAdminModules()
    ])
  }

  return {
    // State
    dashboardData,
    systemSettings,
    reportTypes,
    adminModules,

    // Loading states
    loading,
    dashboardLoading,
    settingsLoading,
    reportsLoading,
    error,

    // Computed
    statistics,
    recentActivity,
    quickActions,
    systemAlerts,
    hasAlert,
    warningCount,
    errorCount,

    // Methods
    loadDashboardData,
    refreshStatistics,
    loadSystemSettings,
    updateSettings,
    loadReportTypes,
    generateReport,
    loadAdminModules,
    clearError,
    initialize
  }
}