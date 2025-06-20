// Common Utility Types

// Generic Status Types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'

// Loading and Error States
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// Generic API Response
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  timestamp: Date
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedData<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter and Search
export interface FilterOption {
  key: string
  value: unknown
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in'
}

export interface SearchParams {
  query?: string
  filters?: FilterOption[]
  pagination?: PaginationParams
}

// Form Validation
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface FormState<T> {
  data: T
  errors: ValidationError[]
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

// File Upload
export interface FileUpload {
  file: File
  name: string
  size: number
  type: string
  uploadProgress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  autoHide?: boolean
  duration?: number
}

// Modal State
export interface ModalState {
  isOpen: boolean
  title?: string
  content?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

// Theme and UI
export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'no' | 'en'

// Generic ID Types
export type EntityId = string | number
export type UUID = string

// Date Range
export interface DateRange {
  start: Date
  end: Date
}

// Coordinates (for maps, locations)
export interface Coordinates {
  latitude: number
  longitude: number
}

// Generic Entity Base
export interface BaseEntity {
  id: EntityId
  createdAt: Date
  updatedAt: Date
  createdBy?: EntityId
  updatedBy?: EntityId
}
