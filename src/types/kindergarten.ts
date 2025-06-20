// Kindergarten Types
export interface Kindergarten {
  id: string
  name: string
  address: Address
  district: string
  type: KindergartenType
  capacity: KindergartenCapacity
  contact: ContactInfo
  services: KindergartenService[]
  operatingHours: OperatingHours
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Address Interface (reusing from user types)
export interface Address {
  street: string
  postalCode: string
  city: string
  district?: string
}

// Kindergarten Type
export type KindergartenType = 'municipal' | 'private' | 'family-daycare' | 'open-kindergarten'

// Capacity Management
export interface KindergartenCapacity {
  total: number
  available: number
  ageGroups: {
    '0-1': number
    '1-2': number
    '2-3': number
    '3-6': number
  }
  specialNeeds: number
}

// Contact Information
export interface ContactInfo {
  phone: string
  email: string
  website?: string
  manager: {
    name: string
    email: string
    phone: string
  }
}

// Services
export interface KindergartenService {
  id: string
  name: string
  description: string
  isIncluded: boolean
  cost?: number
}

// Operating Hours
export interface OperatingHours {
  weekdays: {
    open: string
    close: string
  }
  saturday?: {
    open: string
    close: string
  }
  specialSchedule?: {
    date: Date
    hours: {
      open: string
      close: string
    }
  }[]
}

// Placement
export interface Placement {
  id: string
  childId: string
  kindergartenId: string
  startDate: Date
  endDate?: Date
  status: PlacementStatus
  type: PlacementType
  scheduleType: 'full-time' | 'part-time'
  daysPerWeek: number
  hoursPerDay: number
}

export type PlacementStatus = 'active' | 'pending' | 'terminated' | 'suspended'
export type PlacementType = 'regular' | 'dual-placement' | 'temporary'

// Kindergarten Statistics
export interface KindergartenStats {
  kindergartenId: string
  occupancyRate: number
  waitingListCount: number
  averageWaitTime: number
  satisfactionRating: number
}
