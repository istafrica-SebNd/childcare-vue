// User Role Types
export type UserRole = 'guardian' | 'case-manager' | 'kindergarten-staff' | 'admin' | 'municipality-admin'

// User Interface
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: Permission[]
  profile: UserProfile
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// User Profile
export interface UserProfile {
  phoneNumber?: string
  address?: Address
  language: 'no' | 'en'
  timezone: string
  avatar?: string
  preferences: UserPreferences
}

// Address
export interface Address {
  street: string
  postalCode: string
  city: string
  district?: string
}

// User Preferences
export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  theme: 'light' | 'dark' | 'auto'
  language: 'no' | 'en'
}

// Permission System
export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  conditions?: Record<string, unknown>
}

// Authentication
export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  tokenType: 'Bearer'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  token: AuthToken | null
  isAuthenticated: boolean
  isLoading: boolean
}
