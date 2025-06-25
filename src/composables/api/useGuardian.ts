import { ref, computed } from 'vue'
import { guardianApiService } from '@/services/api/guardian'
import type {
  GuardianDashboardData,
  Child,
  Application,
  Document,
  Payment,
  Message,
  NoticeBoard,
  AttendanceRecord,
  CreateApplicationRequest,
  UpdateChildRequest
} from '@/types/guardian'

// Global state for guardian data
const dashboardData = ref<GuardianDashboardData | null>(null)
const children = ref<Child[]>([])
const applications = ref<Application[]>([])
const messages = ref<Message[]>([])
const documents = ref<Document[]>([])
const payments = ref<Payment[]>([])
const attendance = ref<AttendanceRecord[]>([])
const notices = ref<NoticeBoard[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useGuardian() {
  // Loading states for different operations
  const dashboardLoading = ref(false)
  const childrenLoading = ref(false)
  const applicationsLoading = ref(false)
  const messagesLoading = ref(false)
  const documentsLoading = ref(false)
  const paymentsLoading = ref(false)
  const attendanceLoading = ref(false)
  const noticesLoading = ref(false)

  // Computed getters
  const enrolledChildren = computed(() =>
    children.value.filter(child => child.status === 'enrolled')
  )

  const pendingApplications = computed(() =>
    applications.value.filter(app =>
      ['submitted', 'under_review', 'waiting_list'].includes(app.status)
    )
  )

  const unreadMessages = computed(() =>
    messages.value.filter(msg => !msg.read)
  )

  const urgentNotices = computed(() =>
    notices.value.filter(notice => notice.urgent)
  )

  const overduePayments = computed(() =>
    payments.value.filter(payment =>
      payment.status === 'pending' && new Date(payment.dueDate) < new Date()
    )
  )

  // Dashboard operations
  const loadDashboardData = async (guardianId: string) => {
    dashboardLoading.value = true
    error.value = null

    try {
      dashboardData.value = await guardianApiService.getDashboardData(guardianId)

      // Update local state with dashboard data
      if (dashboardData.value) {
        children.value = dashboardData.value.children || []
        applications.value = dashboardData.value.applications || []
        messages.value = dashboardData.value.recentMessages || []
        notices.value = dashboardData.value.notices || []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load dashboard data'
      console.error('Error loading guardian dashboard:', err)
    } finally {
      dashboardLoading.value = false
    }
  }

  // Children operations
  const loadChildren = async (guardianId: string) => {
    childrenLoading.value = true
    error.value = null

    try {
      children.value = await guardianApiService.getChildren(guardianId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load children'
      console.error('Error loading children:', err)
    } finally {
      childrenLoading.value = false
    }
  }

  const getChild = async (guardianId: string, childId: string): Promise<Child | null> => {
    try {
      return await guardianApiService.getChild(guardianId, childId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load child'
      console.error('Error loading child:', err)
      return null
    }
  }

  const updateChild = async (guardianId: string, childId: string, request: UpdateChildRequest): Promise<Child | null> => {
    loading.value = true
    error.value = null

    try {
      const updatedChild = await guardianApiService.updateChild(guardianId, childId, request)

      // Update local state
      const index = children.value.findIndex(c => c.id === childId)
      if (index !== -1) {
        children.value[index] = updatedChild
      }

      return updatedChild
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update child'
      console.error('Error updating child:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Application operations
  const loadApplications = async (guardianId: string) => {
    applicationsLoading.value = true
    error.value = null

    try {
      applications.value = await guardianApiService.getApplications(guardianId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load applications'
      console.error('Error loading applications:', err)
    } finally {
      applicationsLoading.value = false
    }
  }

  const createApplication = async (guardianId: string, request: CreateApplicationRequest): Promise<Application | null> => {
    loading.value = true
    error.value = null

    try {
      const newApplication = await guardianApiService.createApplication(guardianId, request)

      // Update local state
      applications.value.push(newApplication)

      return newApplication
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create application'
      console.error('Error creating application:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Message operations
  const loadMessages = async (guardianId: string, page = 1, limit = 10) => {
    messagesLoading.value = true
    error.value = null

    try {
      const messageData = await guardianApiService.getMessages(guardianId, page, limit)

      if (page === 1) {
        messages.value = messageData.items
      } else {
        messages.value.push(...messageData.items)
      }

      return messageData.pagination
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load messages'
      console.error('Error loading messages:', err)
    } finally {
      messagesLoading.value = false
    }
  }

  const markMessageAsRead = (messageId: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      message.read = true
    }
  }

  // Document operations
  const loadDocuments = async (guardianId: string, childId?: string) => {
    documentsLoading.value = true
    error.value = null

    try {
      documents.value = await guardianApiService.getDocuments(guardianId, childId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load documents'
      console.error('Error loading documents:', err)
    } finally {
      documentsLoading.value = false
    }
  }

  const uploadDocument = async (guardianId: string, childId: string, file: File, type: string): Promise<Document | null> => {
    loading.value = true
    error.value = null

    try {
      const newDocument = await guardianApiService.uploadDocument(guardianId, childId, file, type)

      // Update local state
      documents.value.push(newDocument)

      return newDocument
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload document'
      console.error('Error uploading document:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Payment operations
  const loadPayments = async (guardianId: string) => {
    paymentsLoading.value = true
    error.value = null

    try {
      payments.value = await guardianApiService.getPayments(guardianId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load payments'
      console.error('Error loading payments:', err)
    } finally {
      paymentsLoading.value = false
    }
  }

  // Attendance operations
  const loadAttendance = async (guardianId: string, childId: string, month?: string) => {
    attendanceLoading.value = true
    error.value = null

    try {
      attendance.value = await guardianApiService.getAttendance(guardianId, childId, month)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load attendance'
      console.error('Error loading attendance:', err)
    } finally {
      attendanceLoading.value = false
    }
  }

  // Notice board operations
  const loadNotices = async (guardianId: string) => {
    noticesLoading.value = true
    error.value = null

    try {
      notices.value = await guardianApiService.getNoticeBoard(guardianId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load notices'
      console.error('Error loading notices:', err)
    } finally {
      noticesLoading.value = false
    }
  }

  // Utility functions
  const clearError = () => {
    error.value = null
  }

  const refreshData = async (guardianId: string) => {
    // Clear cache and reload main data
    guardianApiService.invalidateCache()
    await loadDashboardData(guardianId)
  }

  // Initialize data on first use
  const initialize = async (guardianId: string) => {
    await Promise.all([
      loadDashboardData(guardianId),
      loadPayments(guardianId)
    ])
  }

  // Statistics helpers
  const getChildrenByStatus = (status: string) => {
    return children.value.filter(child => child.status === status)
  }

  const getApplicationsByStatus = (status: string) => {
    return applications.value.filter(app => app.status === status)
  }

  const hasOverduePayments = computed(() => overduePayments.value.length > 0)
  const hasUnreadMessages = computed(() => unreadMessages.value.length > 0)
  const hasUrgentNotices = computed(() => urgentNotices.value.length > 0)

  return {
    // State
    dashboardData,
    children,
    applications,
    messages,
    documents,
    payments,
    attendance,
    notices,

    // Loading states
    loading,
    dashboardLoading,
    childrenLoading,
    applicationsLoading,
    messagesLoading,
    documentsLoading,
    paymentsLoading,
    attendanceLoading,
    noticesLoading,
    error,

    // Computed
    enrolledChildren,
    pendingApplications,
    unreadMessages,
    urgentNotices,
    overduePayments,
    hasOverduePayments,
    hasUnreadMessages,
    hasUrgentNotices,

    // Methods
    loadDashboardData,
    loadChildren,
    getChild,
    updateChild,
    loadApplications,
    createApplication,
    loadMessages,
    markMessageAsRead,
    loadDocuments,
    uploadDocument,
    loadPayments,
    loadAttendance,
    loadNotices,
    clearError,
    refreshData,
    initialize,
    getChildrenByStatus,
    getApplicationsByStatus
  }
}
