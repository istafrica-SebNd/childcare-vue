<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Badge, Select, Textarea, InputText, InputSwitch, Dropdown, Tag, Tooltip } from 'primevue'
import { 
  FileText, Calendar, User, Shield, Building2, CheckCircle, ArrowRight, 
  HelpCircle, Info, AlertTriangle, Database, Loader2, Sparkles, Upload, ArrowLeftRight 
} from 'lucide-vue-next'
import GuardianInfoManager from '../../components/guardian/GuardianInfoManager.vue'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const router = useRouter()
const { t } = useI18n()

interface ChildInfo {
  firstName: string
  lastName: string
  birthDate: string
  personalNumber: string
  specialNeeds: boolean
  siblings: boolean
  statutoryRight: boolean
}

interface GuardianInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  relationship: string
  idMethod: string
}

interface KindergartenPreference {
  id: number
  name: string
  district: string
  capacity: string
  rating: number
  priority?: number
}

interface ApplicationFormData {
  applicationType: string
  childInfo: ChildInfo
  preferences: {
    kindergartens: KindergartenPreference[]
    startDate: string
    fullTime: boolean
    isDualPlacement: boolean
    dualPlacementReason: string
  }
  guardian: GuardianInfo
  documents: {
    disabilityProof: File | null
    identityDocument: File | null
    residenceProof: File | null
  }
}

const currentStep = ref(1)
const applicationType = ref('')
const fregLookupState = ref({
  isLoading: false,
  isSuccess: false,
  error: null as string | null,
  hasAttempted: false
})

const formData = ref<ApplicationFormData>({
  applicationType: 'new-admission',
  childInfo: {
    firstName: '',
    lastName: '',
    birthDate: '',
    personalNumber: '',
    specialNeeds: false,
    siblings: false,
    statutoryRight: true
  },
  preferences: {
    kindergartens: [],
    startDate: '',
    fullTime: true,
    isDualPlacement: false,
    dualPlacementReason: ''
  },
  guardian: {
    firstName: 'Marie',
    lastName: 'Hansen',
    email: 'marie.hansen@email.com',
    phone: '+47 123 45 678',
    address: 'Storgata 15, 0155 Oslo',
    relationship: 'parent',
    idMethod: 'electronic'
  },
  documents: {
    disabilityProof: null,
    identityDocument: null,
    residenceProof: null
  }
})

const steps = [
  { id: 1, title: 'Application Type', icon: Calendar, description: 'Choose your application intent', completed: false },
  { id: 2, title: 'Child Information', icon: User, description: 'Basic details about your child', completed: false },
  { id: 3, title: 'Guardian Information', icon: Shield, description: 'Your contact and verification details', completed: false },
  { id: 4, title: 'Kindergarten Preferences', icon: Building2, description: 'Choose your preferred kindergartens', completed: false },
  { id: 5, title: 'Documents & Review', icon: FileText, description: 'Upload documents and review application', completed: false }
]

const kindergartenOptions = [
  { id: 1, name: 'Løvenskiold Kindergarten', district: 'Frogner', capacity: 'High', rating: 4.8 },
  { id: 2, name: 'Sinsen Kindergarten', district: 'Grünerløkka', capacity: 'Medium', rating: 4.6 },
  { id: 3, name: 'Sagene Kindergarten', district: 'Sagene', capacity: 'Low', rating: 4.7 },
  { id: 4, name: 'Bjølsen Kindergarten', district: 'Sagene', capacity: 'High', rating: 4.5 }
]

// Watch for changes in personal number to trigger FREG lookup
watch(() => formData.value.childInfo.personalNumber, async (newValue) => {
  // Clean the input - remove any non-digits
  const cleanValue = newValue.replace(/\D/g, '')
  
  // Reset FREG state when personal number changes significantly
  if (cleanValue.length !== 11) {
    fregLookupState.value = {
      isLoading: false,
      isSuccess: false,
      error: null,
      hasAttempted: false
    }
    
    // Clear auto-filled fields if they were previously filled
    if (fregLookupState.value.isSuccess) {
      formData.value.childInfo.firstName = ''
      formData.value.childInfo.lastName = ''
      formData.value.childInfo.birthDate = ''
    }
  }
  
  // Trigger FREG lookup when we have a complete 11-digit number
  if (cleanValue.length === 11 && !fregLookupState.value.hasAttempted) {
    await performFregLookup(cleanValue)
  }
}, { immediate: true })

const performFregLookup = async (personalNumber: string) => {
  fregLookupState.value.isLoading = true
  fregLookupState.value.hasAttempted = true
  fregLookupState.value.error = null
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock FREG data based on personal number pattern
    // In a real implementation, this would be an actual API call to FREG
    const mockData = generateMockChildData(personalNumber)
    
    if (mockData) {
      formData.value.childInfo = {
        ...formData.value.childInfo,
        firstName: mockData.firstName,
        lastName: mockData.lastName,
        birthDate: mockData.birthDate
      }
      fregLookupState.value.isSuccess = true
      fregLookupState.value.error = null
    } else {
      fregLookupState.value.isSuccess = false
      fregLookupState.value.error = 'Could not find person with this personal number in FREG registry'
    }
  } catch (error) {
    fregLookupState.value.isSuccess = false
    fregLookupState.value.error = 'Error connecting to FREG registry. Please try again or enter information manually.'
  }
  
  fregLookupState.value.isLoading = false
}

// Helper function to generate mock child data for demonstration
const generateMockChildData = (personalNumber: string) => {
  // Extract birth date from Norwegian personal number (DDMMYY)
  const day = personalNumber.substring(0, 2)
  const month = personalNumber.substring(2, 4)
  const year = personalNumber.substring(4, 6)
  
  // Determine century based on the individual number (last 5 digits)
  const individualNumber = parseInt(personalNumber.substring(6, 9))
  let fullYear: number
  
  if (individualNumber < 500) {
    fullYear = 1900 + parseInt(year)
  } else if (individualNumber >= 500 && individualNumber < 750 && parseInt(year) >= 54) {
    fullYear = 1800 + parseInt(year)
  } else if (individualNumber >= 500 && individualNumber < 1000 && parseInt(year) < 40) {
    fullYear = 2000 + parseInt(year)
  } else {
    fullYear = 1900 + parseInt(year)
  }
  
  // Mock names for demonstration
  const mockNames = [
    { firstName: 'Emma', lastName: 'Hansen' },
    { firstName: 'Oliver', lastName: 'Nordahl' },
    { firstName: 'Sofia', lastName: 'Berg' },
    { firstName: 'Lucas', lastName: 'Svendsen' },
    { firstName: 'Nora', lastName: 'Eriksen' },
    { firstName: 'William', lastName: 'Larsen' }
  ]
  
  // Use personal number to consistently pick a name
  const nameIndex = parseInt(personalNumber.substring(8, 10)) % mockNames.length
  const selectedName = mockNames[nameIndex]
  
  return {
    firstName: selectedName.firstName,
    lastName: selectedName.lastName,
    birthDate: `${fullYear}-${month}-${day}`
  }
}

const handlePersonalNumberChange = (value: string) => {
  // Clean the input - only allow digits
  const cleanValue = value.replace(/\D/g, '')
  
  // Limit to 11 digits
  if (cleanValue.length <= 11) {
    formData.value.childInfo.personalNumber = cleanValue
  }
  
  // Reset FREG state when personal number changes
  if (cleanValue.length !== 11) {
    fregLookupState.value = {
      isLoading: false,
      isSuccess: false,
      error: null,
      hasAttempted: false
    }
  }
}

const handleKindergartenSelection = (kindergarten: KindergartenPreference, priorityIndex: number) => {
  const maxSelections = formData.value.preferences.isDualPlacement ? 2 : 3
  const newKindergartens = [...formData.value.preferences.kindergartens]
  
  // Remove kindergarten if already selected
  const existingIndex = newKindergartens.findIndex(kg => kg.id === kindergarten.id)
  if (existingIndex !== -1) {
    newKindergartens.splice(existingIndex, 1)
  } else if (newKindergartens.length < maxSelections) {
    // Add kindergarten with priority
    newKindergartens.push({
      ...kindergarten,
      priority: priorityIndex + 1
    })
  }
  
  // Sort by priority
  newKindergartens.sort((a, b) => (a.priority || 0) - (b.priority || 0))
  
  formData.value.preferences.kindergartens = newKindergartens
}

const isKindergartenSelected = (kindergartenId: number) => {
  return formData.value.preferences.kindergartens.some(kg => kg.id === kindergartenId)
}

const getKindergartenPriority = (kindergartenId: number) => {
  const kg = formData.value.preferences.kindergartens.find(kg => kg.id === kindergartenId)
  return kg?.priority || null
}

const handleNext = () => {
  if (currentStep.value < 5) {
    currentStep.value++
  }
}

const handlePrev = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleStepClick = (stepId: number) => {
  // Only allow navigation to completed steps or the current step
  if (stepId <= currentStep.value) {
    currentStep.value = stepId
  }
}

const handleKindergartenSelect = (kindergarten: KindergartenPreference) => {
  const maxSelections = formData.value.preferences.isDualPlacement ? 2 : 3
  const currentSelections = formData.value.preferences.kindergartens.length
  
  // Don't add if already at max capacity
  if (currentSelections >= maxSelections) {
    return
  }
  
  // Add kindergarten with next priority
  const newKindergarten = {
    ...kindergarten,
    priority: currentSelections + 1
  }
  
  formData.value.preferences.kindergartens.push(newKindergarten)
}

const removeKindergarten = (kindergartenId: number) => {
  const index = formData.value.preferences.kindergartens.findIndex(kg => kg.id === kindergartenId)
  if (index !== -1) {
    formData.value.preferences.kindergartens.splice(index, 1)
    
    // Reorder priorities
    formData.value.preferences.kindergartens.forEach((kg, i) => {
      kg.priority = i + 1
    })
  }
}

const getProvisionalRecordingPeriod = (birthDate: string) => {
  if (!birthDate) return null
  
  const childBirthDate = new Date(birthDate)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  
  // Check if child turns 1 by August 31st of current year
  const august31 = new Date(currentYear, 7, 31) // Month is 0-indexed
  const november30 = new Date(currentYear, 10, 30)
  const march1 = new Date(currentYear, 2, 1)
  const august15 = new Date(currentYear, 7, 15)
  
  // Calculate when child turns 1
  const childTurns1 = new Date(childBirthDate.getFullYear() + 1, childBirthDate.getMonth(), childBirthDate.getDate())
  
  if (childTurns1 <= august31 && currentDate <= march1) {
    return {
      period: 'Main Recording Part 1',
      deadline: 'March 1st',
      description: 'Your child has statutory right to a kindergarten place'
    }
  } else if (childTurns1 <= november30 && currentDate <= august15) {
    return {
      period: 'Main Recording Part 2',
      deadline: 'August 15th',
      description: 'Second round of main applications'
    }
  } else {
    return {
      period: 'Ongoing Recording',
      deadline: 'No fixed deadline',
      description: 'Applications processed as places become available'
    }
  }
}

const provisionalPeriod = computed(() => 
  getProvisionalRecordingPeriod(formData.value.childInfo.birthDate)
)

const handleSubmit = () => {
  // Handle form submission
  console.log('Submitting application:', formData.value)
  router.push('/guardian/application-status')
}

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.applicationType !== ''
    case 2:
      return formData.value.childInfo.personalNumber !== '' && 
             formData.value.childInfo.firstName !== '' && 
             formData.value.childInfo.lastName !== ''
    case 3:
      return formData.value.guardian.firstName !== '' && 
             formData.value.guardian.email !== ''
    case 4:
      return formData.value.preferences.kindergartens.length > 0
    case 5:
      return true
    default:
      return false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />
    
    <!-- Header Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">New Kindergarten Application</h1>
          <p class="text-gray-600">Apply for kindergarten placement in Oslo</p>
        </div>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-center space-x-8">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          @click="handleStepClick(step.id)"
          :class="[
            'flex flex-col items-center space-y-3 cursor-pointer transition-all min-w-0 flex-1 max-w-xs',
            currentStep === step.id ? 'opacity-100' : 'opacity-60 hover:opacity-80'
          ]"
        >
          <!-- Step Icon Container -->
          <div 
            :class="[
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
              currentStep === step.id ? 'bg-blue-600 shadow-lg' : 
              step.completed ? 'bg-green-600' : 'bg-gray-200'
            ]"
          >
            <!-- Calendar Icon for Application Type -->
            <svg v-if="step.id === 1" :class="[
              'w-8 h-8',
              currentStep === step.id || step.completed ? 'text-white' : 'text-gray-400'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            
            <!-- User Icon for Child Information -->
            <svg v-else-if="step.id === 2" :class="[
              'w-8 h-8',
              currentStep === step.id || step.completed ? 'text-white' : 'text-gray-400'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            
            <!-- Shield Icon for Guardian Information -->
            <svg v-else-if="step.id === 3" :class="[
              'w-8 h-8',
              currentStep === step.id || step.completed ? 'text-white' : 'text-gray-400'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            
            <!-- Building Icon for Kindergarten Preferences -->
            <svg v-else-if="step.id === 4" :class="[
              'w-8 h-8',
              currentStep === step.id || step.completed ? 'text-white' : 'text-gray-400'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            
            <!-- Document Icon for Documents & Review -->
            <svg v-else :class="[
              'w-8 h-8',
              currentStep === step.id || step.completed ? 'text-white' : 'text-gray-400'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>

          <!-- Step Title -->
          <div class="text-center">
            <p :class="[
              'text-sm font-medium leading-tight',
              currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
            ]">
              {{ step.title }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <!-- Step Content Header -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">{{ steps[currentStep - 1].title }}</h2>
        <p class="text-gray-600 mt-1">{{ steps[currentStep - 1].description }}</p>
      </div>

      <!-- Step 1: Application Type -->
      <div v-if="currentStep === 1" class="p-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div class="flex items-center space-x-3 mb-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-blue-900">What type of application is this?</h3>
          </div>
          <p class="text-blue-800">Choose the option that best describes your situation. The system will automatically determine the appropriate processing period based on your child's age and submission date.</p>
        </div>

        <!-- Application Type Options -->
        <div class="space-y-4">
          <!-- New Admission -->
          <div 
            @click="formData.applicationType = 'new-admission'"
            :class="[
              'border-2 rounded-lg p-6 cursor-pointer transition-all',
              formData.applicationType === 'new-admission' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xl">🏫</span>
                </div>
                <div>
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">New Admission</h3>
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">Most Common</span>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p class="text-gray-700 font-medium mb-1">For children without a current kindergarten placement</p>
                  <p class="text-gray-600 text-sm">First-time application for kindergarten placement in Oslo</p>
                </div>
              </div>
              <div class="flex items-center">
                <div :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  formData.applicationType === 'new-admission' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                ]">
                  <div v-if="formData.applicationType === 'new-admission'" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Transfer Request -->
          <div 
            @click="formData.applicationType = 'transfer-request'"
            :class="[
              'border-2 rounded-lg p-6 cursor-pointer transition-all',
              formData.applicationType === 'transfer-request' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xl">🔄</span>
                </div>
                <div>
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">Transfer Request</h3>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p class="text-gray-700 font-medium mb-1">For changing from one kindergarten to another</p>
                  <p class="text-gray-600 text-sm">Moving your child from their current kindergarten to a new one</p>
                </div>
              </div>
              <div class="flex items-center">
                <div :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  formData.applicationType === 'transfer-request' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                ]">
                  <div v-if="formData.applicationType === 'transfer-request'" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Late/Ongoing Application -->
          <div 
            @click="formData.applicationType = 'late-ongoing'"
            :class="[
              'border-2 rounded-lg p-6 cursor-pointer transition-all',
              formData.applicationType === 'late-ongoing' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span class="text-white text-xl">⏱️</span>
                </div>
                <div>
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">Late/Ongoing Application</h3>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p class="text-gray-700 font-medium mb-1">For applying after main deadlines or under special circumstances</p>
                  <p class="text-gray-600 text-sm">Applications submitted outside standard deadlines or for immediate placement needs</p>
                </div>
              </div>
              <div class="flex items-center">
                <div :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  formData.applicationType === 'late-ongoing' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                ]">
                  <div v-if="formData.applicationType === 'late-ongoing'" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Child Information -->
      <div v-if="currentStep === 2" class="p-6">
        <div class="space-y-6">
          <!-- Personal Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Personal Number (Birth Number) *</label>
            <div class="relative">
              <input 
                :value="formData.childInfo.personalNumber"
                @input="handlePersonalNumberChange($event.target.value)"
                type="text"
                placeholder="11 digits (DDMMYYXXXXX)"
                maxlength="11"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12',
                  fregLookupState.isLoading ? 'border-blue-300' :
                  fregLookupState.isSuccess ? 'border-green-300 bg-green-50' :
                  fregLookupState.error ? 'border-red-300 bg-red-50' :
                  'border-gray-300'
                ]"
              />
              <!-- Loading spinner -->
              <div v-if="fregLookupState.isLoading" class="absolute right-3 top-3">
                <svg class="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <!-- Success checkmark -->
              <div v-else-if="fregLookupState.isSuccess" class="absolute right-3 top-3">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <!-- Error icon -->
              <div v-else-if="fregLookupState.error" class="absolute right-3 top-3">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            
            <!-- Status messages -->
            <div class="mt-2">
              <p v-if="fregLookupState.isLoading" class="text-sm text-blue-600 flex items-center space-x-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Looking up information in FREG registry...</span>
              </p>
              <p v-else-if="fregLookupState.isSuccess" class="text-sm text-green-600 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>✨ Information automatically retrieved from FREG registry</span>
              </p>
              <p v-else-if="fregLookupState.error" class="text-sm text-red-600">
                {{ fregLookupState.error }}
              </p>
              <p v-else class="text-sm text-gray-600">
                Enter the child's 11-digit birth number. If found in the national registry (FREG), we'll fill in the rest automatically.
              </p>
            </div>
          </div>

          <!-- FREG Success Banner -->
          <div v-if="fregLookupState.isSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-green-900">Information Retrieved Successfully</h4>
                <p class="text-green-800 text-sm">Child information has been automatically filled from the national registry (FREG).</p>
              </div>
            </div>
          </div>

          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <div class="relative">
                <input 
                  v-model="formData.childInfo.firstName"
                  type="text"
                  placeholder="Enter child's first name"
                  :readonly="fregLookupState.isSuccess"
                  :class="[
                    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    fregLookupState.isSuccess ? 'bg-green-50 text-gray-700' : ''
                  ]"
                />
                <svg v-if="fregLookupState.isSuccess" class="absolute right-3 top-3 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <div class="relative">
                <input 
                  v-model="formData.childInfo.lastName"
                  type="text"
                  placeholder="Enter child's last name"
                  :readonly="fregLookupState.isSuccess"
                  :class="[
                    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    fregLookupState.isSuccess ? 'bg-green-50 text-gray-700' : ''
                  ]"
                />
                <svg v-if="fregLookupState.isSuccess" class="absolute right-3 top-3 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Date of Birth -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
            <div class="relative">
              <input 
                v-model="formData.childInfo.birthDate"
                type="date"
                :readonly="fregLookupState.isSuccess"
                :class="[
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  fregLookupState.isSuccess ? 'bg-green-50 text-gray-700' : ''
                ]"
              />
              <svg v-if="fregLookupState.isSuccess" class="absolute right-3 top-3 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>

          <!-- Toggle Options -->
          <div class="space-y-4">
            <!-- Statutory Right -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900">Child has statutory right to kindergarten place</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="formData.childInfo.statutoryRight"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            <!-- Special Needs -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900">Child has special needs or requires additional support</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="formData.childInfo.specialNeeds"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <!-- Siblings -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900">Child has siblings already attending kindergarten in Oslo</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="formData.childInfo.siblings"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Guardian Information -->
      <div v-if="currentStep === 3" class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Guardian Information</h3>
        <p class="text-gray-600 mb-6">Your contact and verification details</p>

        <!-- Your Information Section -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-green-900">Your Information</h3>
              <span class="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium ml-2">
                📋 Auto-filled from your digital ID
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <div class="relative">
                <input 
                  v-model="formData.guardian.firstName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readonly
                />
                <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <div class="relative">
                <input 
                  v-model="formData.guardian.lastName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readonly
                />
                <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div class="relative">
                <input 
                  v-model="formData.guardian.email"
                  type="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readonly
                />
                <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div class="relative">
                <input 
                  v-model="formData.guardian.phone"
                  type="tel"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readonly
                />
                <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
            <div class="relative">
              <input 
                v-model="formData.guardian.address"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readonly
              />
              <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Identity Verification Section -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-blue-900">Identity Verification</h3>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Verification Method</label>
            <select 
              v-model="formData.guardian.idMethod"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="electronic">Electronic ID (ID-porten/Entra ID) - Standard</option>
              <option value="manual">Manual verification</option>
              <option value="bank-id">Bank ID</option>
            </select>
          </div>
        </div>

        <!-- Legal Information -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Legal Information</h3>
          </div>
          <p class="text-gray-700">
            According to Oslo municipality regulations, only one guardian is required to submit a kindergarten application. If both 
            guardians wish to be involved, the second guardian can confirm their participation through the invitation system.
          </p>
        </div>
      </div>

      <!-- Step 4: Kindergarten Preferences -->
      <div v-if="currentStep === 4" class="p-6">
        <!-- Choose Your Preferred Kindergartens -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div class="flex items-center space-x-3 mb-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-blue-900">Choose Your Preferred Kindergartens</h3>
          </div>
          <p class="text-blue-800">Select up to 3 kindergartens in order of preference. Higher priority choices have better placement chances.</p>
        </div>

        <!-- Dual Placement Option -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <span class="font-medium text-purple-900">Request Dual Placement</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="formData.preferences.isDualPlacement"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <p class="text-purple-800 mb-3">
            Dual placement allows your child to attend two different kindergartens according to a shared custody schedule or other special arrangements.
          </p>
          <ul class="text-purple-700 text-sm space-y-1 mb-4">
            <li>• Requires approval from both kindergartens</li>
            <li>• Schedule coordination will be arranged with caseworker</li>
            <li>• Additional documentation may be required</li>
          </ul>

          <!-- Reason for Dual Placement Request - Only show when enabled -->
          <div v-if="formData.preferences.isDualPlacement" class="mt-4">
            <label class="block text-sm font-medium text-purple-900 mb-2">
              Reason for Dual Placement Request
            </label>
            <textarea
              v-model="formData.preferences.dualPlacementReason"
              rows="4"
              placeholder="Please explain why you need dual placement (e.g., shared custody arrangement, special circumstances, etc.)"
              class="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Selected Kindergartens -->
        <div v-if="formData.preferences.kindergartens.length > 0" class="mb-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <h3 class="font-semibold text-green-900">Selected Kindergartens</h3>
            </div>
            <div class="mt-3 text-sm text-green-800">
              <div 
                v-for="kg in formData.preferences.kindergartens" 
                :key="kg.id"
                class="flex items-center space-x-2 mb-1"
              >
                <span class="text-gray-900">{{ kg.name }}</span>
                <span class="text-gray-600">({{ kg.district }})</span>
              </div>
            </div>
          </div>

          <!-- Selected Kindergarten Cards -->
          <div class="space-y-4">
            <div 
              v-for="kg in formData.preferences.kindergartens" 
              :key="kg.id"
              class="bg-white border-2 border-blue-500 rounded-lg p-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900">{{ kg.name }}</h4>
                    <div class="flex items-center space-x-4 mt-1">
                      <span class="text-sm text-gray-600">{{ kg.district }} District</span>
                      <span :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        kg.capacity === 'High' ? 'bg-green-100 text-green-800' :
                        kg.capacity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      ]">
                        {{ kg.capacity }} Capacity
                      </span>
                      <div class="flex items-center space-x-1">
                        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span class="text-sm text-gray-600">{{ kg.rating }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Priority {{ kg.priority }}
                  </span>
                  <button 
                    @click="removeKindergarten(kg.id)"
                    class="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Kindergartens -->
        <div class="space-y-4 mb-6">
          <div 
            v-for="kindergarten in kindergartenOptions" 
            :key="kindergarten.id"
            v-show="!isKindergartenSelected(kindergarten.id)"
            class="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ kindergarten.name }}</h4>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-sm text-gray-600">{{ kindergarten.district }} District</span>
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      kindergarten.capacity === 'High' ? 'bg-green-100 text-green-800' :
                      kindergarten.capacity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ kindergarten.capacity }} Capacity
                    </span>
                    <div class="flex items-center space-x-1">
                      <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm text-gray-600">{{ kindergarten.rating }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="handleKindergartenSelect(kindergarten)"
                  :disabled="formData.preferences.kindergartens.length >= (formData.preferences.isDualPlacement ? 2 : 3)"
                  :class="[
                    'px-4 py-2 rounded text-sm font-medium transition-colors',
                    formData.preferences.kindergartens.length >= (formData.preferences.isDualPlacement ? 2 : 3) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  ]"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Preferences -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Start Date *</label>
            <input 
              v-model="formData.preferences.startDate"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Attendance Type *</label>
            <select 
              v-model="formData.preferences.fullTime"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="full-time">Full-time (7:30 - 17:00)</option>
              <option value="part-time">Part-time (8:00 - 14:00)</option>
              <option value="flexible">Flexible hours</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Step 5: Documents & Review -->
      <div v-if="currentStep === 5" class="p-6">
        <!-- Optional Documents -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div class="flex items-center space-x-3 mb-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <h3 class="text-lg font-semibold text-green-900">Optional Documents</h3>
          </div>
          <p class="text-green-800">Upload any supporting documents for your application.</p>
        </div>

        <!-- Application Review -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div class="flex items-center space-x-3 mb-6">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-blue-900">Application Review</h3>
          </div>

          <!-- Application Type -->
          <div class="mb-6 p-4 bg-white border border-blue-200 rounded-lg">
            <div class="flex items-center space-x-3 mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h4 class="font-semibold text-gray-900">Application Type</h4>
            </div>
            <p class="text-gray-700">New Admission</p>
          </div>

          <!-- Child Information -->
          <div class="mb-6 p-4 bg-white border border-blue-200 rounded-lg">
            <div class="flex items-center space-x-3 mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <h4 class="font-semibold text-gray-900">Child Information</h4>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Name:</span>
                <span class="text-gray-900 ml-2">{{ formData.childInfo.firstName }} {{ formData.childInfo.lastName }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Birth Date:</span>
                <span class="text-gray-900 ml-2">{{ formData.childInfo.birthDate || 'Not specified' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Personal Number:</span>
                <span class="text-gray-900 ml-2">{{ formData.childInfo.personalNumber || 'Not provided' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Statutory Right:</span>
                <span class="text-gray-900 ml-2">{{ formData.childInfo.statutoryRight ? 'Yes' : 'No' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Special Needs:</span>
                <span class="text-gray-900 ml-2">{{ formData.childInfo.specialNeeds ? 'Yes' : 'No' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Has Siblings:</span>
                <span class="text-gray-900 ml-2">{{ formData.childInfo.siblings ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>

          <!-- Guardian Information -->
          <div class="mb-6 p-4 bg-white border border-blue-200 rounded-lg">
            <div class="flex items-center space-x-3 mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <h4 class="font-semibold text-gray-900">Guardian Information</h4>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Name:</span>
                <span class="text-gray-900 ml-2">{{ formData.guardian.firstName }} {{ formData.guardian.lastName }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Email:</span>
                <span class="text-gray-900 ml-2">{{ formData.guardian.email }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Phone:</span>
                <span class="text-gray-900 ml-2">{{ formData.guardian.phone }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Address:</span>
                <span class="text-gray-900 ml-2">{{ formData.guardian.address }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Relationship:</span>
                <span class="text-gray-900 ml-2">parent</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">ID Method:</span>
                <span class="text-gray-900 ml-2">{{ formData.guardian.idMethod }}</span>
              </div>
            </div>
          </div>

          <!-- Kindergarten Preferences -->
          <div class="mb-6 p-4 bg-white border border-blue-200 rounded-lg">
            <div class="flex items-center space-x-3 mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h4 class="font-semibold text-gray-900">Kindergarten Preferences</h4>
            </div>
            <div class="space-y-2 text-sm">
              <div>
                <span class="font-medium text-gray-700">Start Date:</span>
                <span class="text-gray-900 ml-2">{{ formData.preferences.startDate || 'Not specified' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Attendance:</span>
                <span class="text-gray-900 ml-2">{{ formData.preferences.fullTime ? 'Full-time' : 'Part-time' }}</span>
              </div>
              <div class="mt-3">
                <span class="font-medium text-gray-700">Selected Kindergartens:</span>
                <div class="mt-2 space-y-1">
                  <div 
                    v-for="kg in formData.preferences.kindergartens" 
                    :key="kg.id"
                    class="flex items-center space-x-2"
                  >
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Priority {{ kg.priority }}</span>
                    <span class="text-gray-900">{{ kg.name }} ({{ kg.district }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Important Information -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div class="flex items-center space-x-3 mb-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-yellow-900">Important Information</h3>
          </div>
          <ul class="text-yellow-800 space-y-1 text-sm">
            <li>• Application will receive a unique ApplicationID upon submission</li>
            <li>• Status will be set to "Draft" initially, then updated based on admission round</li>
            <li>• Processing typically takes 4-6 weeks</li>
            <li>• You will receive email confirmation once submitted</li>
            <li>• Contact us if you need assistance: kindergarten@oslo.kommune.no</li>
          </ul>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button 
            v-if="currentStep > 1"
            @click="handlePrev"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
        </div>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500">Step {{ currentStep }} of 5</span>
          <button 
            v-if="currentStep < 5"
            @click="handleNext"
            :disabled="!canProceed"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2',
              canProceed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <span>Next</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          <button 
            v-else
            @click="handleSubmit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Submit Application</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transition effects */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom checkbox styling */
input[type="checkbox"]:checked + .peer {
  background-color: #3b82f6;
}
</style> 