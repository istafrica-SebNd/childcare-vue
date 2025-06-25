import type {
  GuardianDashboardData,
  Child,
  Application,
  ApplicationStatus,
  Document,
  Payment,
  Message,
  NoticeBoard,
  AttendanceRecord,
  CreateApplicationRequest,
  UpdateChildRequest
} from '@/types/guardian'
import type { PaginatedData } from '@/types/common'

// Mock data for development
const mockGuardianDashboard: GuardianDashboardData = {
  children: [
    {
      id: '1',
      name: 'Emma Hansen',
      dateOfBirth: '2020-05-15',
      kindergarten: 'Løvenskiold Kindergarten',
      status: 'enrolled',
      group: 'Bjørnegruppen',
      startDate: '2023-08-15'
    },
    {
      id: '2',
      name: 'Magnus Hansen',
      dateOfBirth: '2021-03-22',
      kindergarten: null,
      status: 'applied',
      group: null,
      startDate: null
    }
  ],
  applications: [
    {
      id: 'app-001',
      childId: '2',
      childName: 'Magnus Hansen',
      status: 'under_review',
      submittedDate: '2024-02-15',
      kindergartens: ['Løvenskiold Kindergarten', 'Grünerløkka Kindergarten'],
      lastUpdated: '2024-03-10'
    }
  ],
  recentMessages: [
    {
      id: 'msg-001',
      from: 'Løvenskiold Kindergarten',
      subject: 'Parent-teacher meeting invitation',
      date: '2024-03-18',
      read: false,
      urgent: false
    }
  ],
  upcomingEvents: [
    {
      id: 'event-001',
      title: 'Spring celebration',
      date: '2024-04-20',
      time: '10:00',
      location: 'Løvenskiold Kindergarten'
    }
  ],
  notices: [
    {
      id: 'notice-001',
      title: 'Easter holiday schedule',
      excerpt: 'Please note the adjusted schedule for Easter week...',
      date: '2024-03-15',
      urgent: false
    }
  ]
}

const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Emma Hansen',
    dateOfBirth: '2020-05-15',
    kindergarten: 'Løvenskiold Kindergarten',
    status: 'enrolled',
    group: 'Bjørnegruppen',
    startDate: '2023-08-15',
    guardians: [
      {
        id: 'g1',
        name: 'Anne Hansen',
        relation: 'mother',
        primary: true,
        phone: '+47 98765432',
        email: 'anne.hansen@example.com'
      },
      {
        id: 'g2',
        name: 'Erik Hansen',
        relation: 'father',
        primary: false,
        phone: '+47 98765433',
        email: 'erik.hansen@example.com'
      }
    ],
    address: {
      street: 'Storgata 15',
      postalCode: '0184',
      city: 'Oslo',
      district: 'Grünerløkka'
    },
    specialNeeds: 'No known allergies',
    emergencyContact: {
      name: 'Grandma Ingrid',
      phone: '+47 98765434',
      relation: 'grandmother'
    }
  }
]

class GuardianApiService {
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

  async getDashboardData(guardianId: string): Promise<GuardianDashboardData> {
    const cacheKey = `guardian-dashboard-${guardianId}`
    const cached = this.getCached<GuardianDashboardData>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      // Mock data for development
      this.setCache(cacheKey, mockGuardianDashboard)
      return mockGuardianDashboard
    }

    // Production API call
    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/dashboard`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getChildren(guardianId: string): Promise<Child[]> {
    const cacheKey = `guardian-children-${guardianId}`
    const cached = this.getCached<Child[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      this.setCache(cacheKey, mockChildren)
      return mockChildren
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/children`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getChild(guardianId: string, childId: string): Promise<Child | null> {
    const cacheKey = `child-${childId}`
    const cached = this.getCached<Child>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      const child = mockChildren.find(c => c.id === childId) || null
      if (child) this.setCache(cacheKey, child)
      return child
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/children/${childId}`)
    if (!response.ok) return null

    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async updateChild(guardianId: string, childId: string, request: UpdateChildRequest): Promise<Child> {
    // Clear cache when child is updated
    this.cache.delete(`child-${childId}`)
    this.cache.delete(`guardian-children-${guardianId}`)

    if (!this.isProduction) {
      // Mock delay for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      const updatedChild = { ...mockChildren[0], ...request }
      console.log('Child updated:', updatedChild)
      return updatedChild
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/children/${childId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error('Failed to update child')
    }

    return await response.json()
  }

  async getApplications(guardianId: string): Promise<Application[]> {
    const cacheKey = `guardian-applications-${guardianId}`
    const cached = this.getCached<Application[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      const mockApps = mockGuardianDashboard.applications
      this.setCache(cacheKey, mockApps)
      return mockApps
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/applications`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async createApplication(guardianId: string, request: CreateApplicationRequest): Promise<Application> {
    // Clear applications cache
    this.cache.delete(`guardian-applications-${guardianId}`)

    if (!this.isProduction) {
      // Mock delay for development
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newApp: Application = {
        id: `app-${Date.now()}`,
        childId: request.childId,
        childName: 'Magnus Hansen',
        status: 'submitted' as ApplicationStatus,
        submittedDate: new Date().toISOString().split('T')[0],
        kindergartens: request.kindergartenPreferences,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
      console.log('Application created:', newApp)
      return newApp
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error('Failed to create application')
    }

    return await response.json()
  }

  async getMessages(guardianId: string, page = 1, limit = 10): Promise<PaginatedData<Message>> {
    const cacheKey = `guardian-messages-${guardianId}-${page}-${limit}`
    const cached = this.getCached<PaginatedData<Message>>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      const mockData: PaginatedData<Message> = {
        items: mockGuardianDashboard.recentMessages,
        pagination: {
          page,
          limit,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      }
      this.setCache(cacheKey, mockData)
      return mockData
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/messages?page=${page}&limit=${limit}`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getDocuments(guardianId: string, childId?: string): Promise<Document[]> {
    const cacheKey = childId ? `documents-${guardianId}-${childId}` : `documents-${guardianId}`
    const cached = this.getCached<Document[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      const mockDocs: Document[] = [
        {
          id: 'doc-001',
          name: 'Application Form.pdf',
          type: 'application',
          size: '250 KB',
          uploadDate: '2024-02-15',
          status: 'approved'
        }
      ]
      this.setCache(cacheKey, mockDocs)
      return mockDocs
    }

    const url = childId
      ? `${this.apiBaseUrl}/guardian/${guardianId}/children/${childId}/documents`
      : `${this.apiBaseUrl}/guardian/${guardianId}/documents`

    const response = await fetch(url)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async uploadDocument(guardianId: string, childId: string, file: File, type: string): Promise<Document> {
    // Clear documents cache
    this.cache.delete(`documents-${guardianId}-${childId}`)

    if (!this.isProduction) {
      // Mock upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type,
        size: `${Math.round(file.size / 1024)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
      console.log('Document uploaded:', newDoc)
      return newDoc
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/children/${childId}/documents`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload document')
    }

    return await response.json()
  }

  async getPayments(guardianId: string): Promise<Payment[]> {
    const cacheKey = `guardian-payments-${guardianId}`
    const cached = this.getCached<Payment[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      const mockPayments: Payment[] = [
        {
          id: 'pay-001',
          childName: 'Emma Hansen',
          amount: 3500,
          dueDate: '2024-04-01',
          status: 'paid',
          paidDate: '2024-03-28',
          type: 'monthly_fee'
        }
      ]
      this.setCache(cacheKey, mockPayments)
      return mockPayments
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/payments`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getAttendance(guardianId: string, childId: string, month?: string): Promise<AttendanceRecord[]> {
    const cacheKey = `attendance-${childId}-${month || 'current'}`
    const cached = this.getCached<AttendanceRecord[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      const mockAttendance: AttendanceRecord[] = [
        {
          id: 'att-001',
          date: '2024-03-18',
          checkIn: '08:30',
          checkOut: '16:15',
          status: 'present',
          notes: 'Normal day'
        }
      ]
      this.setCache(cacheKey, mockAttendance)
      return mockAttendance
    }

    const url = `${this.apiBaseUrl}/guardian/${guardianId}/children/${childId}/attendance${month ? `?month=${month}` : ''}`
    const response = await fetch(url)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
  }

  async getNoticeBoard(guardianId: string): Promise<NoticeBoard[]> {
    const cacheKey = `notice-board-${guardianId}`
    const cached = this.getCached<NoticeBoard[]>(cacheKey)
    if (cached) return cached

    if (!this.isProduction) {
      const mockNotices = mockGuardianDashboard.notices
      this.setCache(cacheKey, mockNotices)
      return mockNotices
    }

    const response = await fetch(`${this.apiBaseUrl}/guardian/${guardianId}/notices`)
    const data = await response.json()
    this.setCache(cacheKey, data)
    return data
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
}

export const guardianApiService = new GuardianApiService()
export default guardianApiService
