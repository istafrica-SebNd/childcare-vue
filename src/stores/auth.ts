import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type UserRole = 'guardian' | 'caseworker' | 'admin' | 'staff' | 'partner' | 'district-admin' | 'educator'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  district?: string
  kindergartenId?: string
  organization?: string
  authMethod?: 'id-porten' | 'entra-id'
}

// Domain whitelist configuration
const DOMAIN_CONFIG = {
  publicStaff: ['oslo.kommune.no'],
  privateStaff: ['ist.com', 'privbarnehage.no'],
  admin: ['admin.oslo.kommune.no', 'admin.ist.com'],
}

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'guardian@example.com': {
    id: '1',
    name: 'Anna Hansen',
    email: 'guardian@example.com',
    role: 'guardian',
    authMethod: 'id-porten'
  },
  'caseworker@oslo.kommune.no': {
    id: '2',
    name: 'Erik Johansen',
    email: 'caseworker@oslo.kommune.no',
    role: 'caseworker',
    district: 'Søndre Nordstrand',
    authMethod: 'entra-id'
  },
  'admin@admin.oslo.kommune.no': {
    id: '3',
    name: 'Ingrid Andersen',
    email: 'admin@admin.oslo.kommune.no',
    role: 'admin',
    authMethod: 'entra-id'
  },
  'staff@oslo.kommune.no': {
    id: '4',
    name: 'Kari Olsen',
    email: 'staff@oslo.kommune.no',
    role: 'staff',
    organization: 'Oslo Kommune',
    authMethod: 'entra-id'
  },
  'partner@ist.com': {
    id: '5',
    name: 'Lars Bjørn',
    email: 'partner@ist.com',
    role: 'partner',
    organization: 'IST Private Kindergarten',
    authMethod: 'entra-id'
  },
  'partner@privbarnehage.no': {
    id: '6',
    name: 'Silje Nordahl',
    email: 'partner@privbarnehage.no',
    role: 'partner',
    organization: 'Private Barnehage AS',
    authMethod: 'entra-id'
  },
  'district@oslo.kommune.no': {
    id: '7',
    name: 'Ola Nordmann',
    email: 'district@oslo.kommune.no',
    role: 'district-admin',
    district: 'Bydel Sentrum',
    authMethod: 'entra-id'
  },
  'educator@oslo.kommune.no': {
    id: '8',
    name: 'Maria Educator',
    email: 'educator@oslo.kommune.no',
    role: 'educator',
    organization: 'Sunshine Kindergarten',
    kindergartenId: 'sunshine-kg',
    authMethod: 'entra-id'
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(true)

  // Initialize from localStorage only - no default user
  const initializeAuth = () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        user.value = JSON.parse(savedUser)
      }
    } catch (error) {
      console.error('Error parsing saved user:', error)
      localStorage.removeItem('user')
    }
    isLoading.value = false
  }

  // Initialize auth on store creation
  initializeAuth()

  const checkDomainType = (email: string): 'guardian' | 'public-staff' | 'private-staff' | 'admin' | 'unknown' => {
    const domain = email.split('@')[1]?.toLowerCase()

    if (DOMAIN_CONFIG.admin.includes(domain)) {
      return 'admin'
    }

    if (DOMAIN_CONFIG.publicStaff.includes(domain)) {
      return 'public-staff'
    }

    if (DOMAIN_CONFIG.privateStaff.includes(domain)) {
      return 'private-staff'
    }

    if (email === 'guardian@example.com' || domain) {
      return 'guardian'
    }

    return 'unknown'
  }

  const loginWithIDPorten = async (): Promise<boolean> => {
    isLoading.value = true

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock guardian user from ID-Porten
    const guardianUser: User = {
      id: 'id-porten-' + Date.now(),
      name: 'Anna Hansen',
      email: 'anna.hansen@example.com',
      role: 'guardian',
      authMethod: 'id-porten'
    }

    user.value = guardianUser
    localStorage.setItem('user', JSON.stringify(guardianUser))
    isLoading.value = false
    return true
  }

  const loginWithEntraID = async (email?: string): Promise<boolean> => {
    isLoading.value = true

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const defaultEmail = email || 'caseworker@oslo.kommune.no'
    const staffUser = mockUsers[defaultEmail] || {
      id: 'entra-id-' + Date.now(),
      name: 'Staff User',
      email: defaultEmail,
      role: 'caseworker',
      authMethod: 'entra-id'
    }

    user.value = staffUser
    localStorage.setItem('user', JSON.stringify(staffUser))
    isLoading.value = false
    return true
  }

  const login = async (email: string, password?: string): Promise<boolean> => {
    isLoading.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const foundUser = mockUsers[email]
    if (foundUser && (password === 'password' || foundUser.authMethod === 'entra-id')) {
      user.value = foundUser
      localStorage.setItem('user', JSON.stringify(foundUser))
      isLoading.value = false
      return true
    }

    isLoading.value = false
    return false
  }

  const logout = () => {
    console.log('Logging out')
    user.value = null
    localStorage.removeItem('user')
  }

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithIDPorten,
    loginWithEntraID,
    logout,
    checkDomainType
  }
})