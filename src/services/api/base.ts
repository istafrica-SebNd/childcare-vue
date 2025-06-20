import type { ApiResponse, ApiError } from '@/types/api'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const DEFAULT_TIMEOUT = 10000

// Request configuration interface
interface RequestConfig extends RequestInit {
  timeout?: number
}

// Create a fetch wrapper with authentication and error handling
export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchConfig } = config

  // Setup headers with auth token
  const headers = new Headers(fetchConfig.headers)
  headers.set('Content-Type', 'application/json')

  const token = localStorage.getItem('auth_token')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  // Create AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchConfig,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const apiError: ApiError = {
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        code: errorData.code || 'HTTP_ERROR',
        statusCode: response.status,
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }

      throw apiError
    }

    const data: ApiResponse<T> = await response.json()
    return data
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      const timeoutError: ApiError = {
        message: 'Request timeout',
        code: 'TIMEOUT',
        statusCode: 408,
      }
      throw timeoutError
    }

    throw error
  }
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    apiRequest<T>(endpoint, { method: 'GET', ...config }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...config }),
}
