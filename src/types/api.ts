// API Response Types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Request Types
export interface ApiRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Common API Endpoints
export interface ApiEndpoints {
  auth: {
    login: string
    logout: string
    refresh: string
    profile: string
  }
  applications: {
    list: string
    create: string
    update: string
    delete: string
    get: string
  }
  kindergartens: {
    list: string
    get: string
    search: string
  }
  users: {
    list: string
    create: string
    update: string
    delete: string
    get: string
  }
}
