<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Shield, 
  User, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  Database, 
  UserPlus 
} from 'lucide-vue-next'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import Message from 'primevue/message'
import Tooltip from 'primevue/tooltip'

interface GuardianData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  relationship: string
  idMethod: string
}

interface SecondGuardian {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'detected' | 'invited' | 'confirmed' | 'declined'
  invitedAt?: string
}

const props = defineProps<{
  formData: GuardianData
  childPersonalNumber: string
}>()

const emit = defineEmits<{
  (e: 'update:formData', data: GuardianData): void
}>()

const { t } = useI18n()

const isLoadingGuardians = ref(false)
const secondGuardian = ref<SecondGuardian | null>(null)
const inviteSecondGuardian = ref(false)
const inviteEmail = ref('')
const showWarning = ref(false)

const idMethods = [
  { label: 'Electronic ID (ID-porten/Entra ID) - Standard', value: 'electronic' },
  { label: 'Manual verification through Contact Center (OKK)', value: 'manual' },
  { label: 'Foreign ID/Non-Oslo resident', value: 'foreign' }
]

// Watch for changes in childPersonalNumber to fetch second guardian
watch(() => props.childPersonalNumber, async (newValue) => {
  if (newValue.length === 11) {
    await fetchSecondGuardian()
  }
}, { immediate: true })

const fetchSecondGuardian = async () => {
  isLoadingGuardians.value = true
  
  try {
    // Mock API call to get guardians from FREG
    const response = await fetch(`/mock/freg/guardians?birthNumber=${props.childPersonalNumber}`)
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.guardians && data.guardians.length > 1) {
        const secondGuardianData = data.guardians.find((g: any) => g.id !== 'primary')
        secondGuardian.value = {
          id: secondGuardianData.id,
          firstName: secondGuardianData.firstName,
          lastName: secondGuardianData.lastName,
          email: secondGuardianData.email,
          phone: secondGuardianData.phone,
          status: 'detected'
        }
        inviteEmail.value = secondGuardianData.email || ''
      }
    }
  } catch (error) {
    // Mock success for prototype
    const mockSecondGuardian = {
      id: 'guardian-2',
      firstName: 'Lars',
      lastName: 'Hansen',
      email: 'lars.hansen@email.com',
      phone: '+47 987 65 432',
      status: 'detected' as const
    }
    
    secondGuardian.value = mockSecondGuardian
    inviteEmail.value = mockSecondGuardian.email || ''
  }
  
  isLoadingGuardians.value = false
}

const handleInviteToggle = (checked: boolean) => {
  inviteSecondGuardian.value = checked
  
  if (checked && secondGuardian.value) {
    handleSendInvite()
  }
}

const handleSendInvite = async () => {
  if (!secondGuardian.value || !inviteEmail.value) return

  try {
    // Mock API call to send invite
    await fetch('/mock/invite/guardian', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guardianId: secondGuardian.value.id,
        email: inviteEmail.value,
        childPersonalNumber: props.childPersonalNumber
      })
    })

    if (secondGuardian.value) {
      secondGuardian.value = {
        ...secondGuardian.value,
        status: 'invited',
        invitedAt: new Date().toISOString()
      }
    }

    // Start warning timer (7 days simulation - shortened for demo)
    setTimeout(() => {
      if (secondGuardian.value?.status === 'invited') {
        showWarning.value = true
      }
    }, 5000) // 5 seconds for demo, would be 7 days in real implementation

  } catch (error) {
    console.log('Invite error:', error)
  }
}

const getStatusBadge = (status: SecondGuardian['status']) => {
  const statusConfig = {
    detected: { label: 'Detected', severity: 'info', icon: User },
    invited: { label: 'Invitation Sent', severity: 'warning', icon: Clock },
    confirmed: { label: 'Confirmed', severity: 'success', icon: CheckCircle },
    declined: { label: 'Declined', severity: 'danger', icon: AlertCircle }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return {
    severity: config.severity,
    label: config.label,
    icon: Icon
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Primary Guardian (Pre-filled) -->
    <div class="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
      <div class="flex items-center gap-3 mb-4">
        <Shield class="w-6 h-6 text-emerald-600" />
        <h3 class="text-lg font-semibold text-slate-900">Your Information</h3>
        <Tag severity="info" class="text-emerald-600 border-emerald-300 bg-emerald-50">
          <Database class="w-3 h-3 mr-1" />
          Auto-filled from your digital ID
        </Tag>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700">First Name</label>
          <div class="relative">
            <InputText 
              v-model="formData.firstName"
              disabled
              class="w-full bg-slate-50 border-slate-200"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Database class="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700">Last Name</label>
          <div class="relative">
            <InputText 
              v-model="formData.lastName"
              disabled
              class="w-full bg-slate-50 border-slate-200"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Database class="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700">Email Address</label>
          <div class="relative">
            <InputText 
              type="email"
              v-model="formData.email"
              disabled
              class="w-full bg-slate-50 border-slate-200"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Database class="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700">Phone Number</label>
          <div class="relative">
            <InputText 
              type="tel"
              v-model="formData.phone"
              disabled
              class="w-full bg-slate-50 border-slate-200"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Database class="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2 mt-4">
        <label class="text-sm font-semibold text-slate-700">Home Address</label>
        <div class="relative">
          <InputText 
            v-model="formData.address"
            disabled
            class="w-full bg-slate-50 border-slate-200"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Database class="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Identity Verification Method -->
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <Shield class="w-6 h-6 text-oslo-blue" />
        <h3 class="text-lg font-semibold text-slate-900">Identity Verification</h3>
      </div>
      
      <div class="space-y-3">
        <label class="text-sm font-semibold text-slate-700">Verification Method</label>
        <Dropdown
          v-model="formData.idMethod"
          :options="idMethods"
          optionLabel="label"
          optionValue="value"
          placeholder="Select verification method"
          class="w-full"
        />
      </div>
    </div>

    <!-- Second Guardian Detection & Invite -->
    <div v-if="isLoadingGuardians" class="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <div class="flex items-center gap-3">
        <div class="animate-spin w-5 h-5 border-2 border-oslo-blue border-t-transparent rounded-full"></div>
        <span class="text-slate-600">Checking for additional guardians...</span>
      </div>
    </div>

    <Card v-else-if="secondGuardian" class="border-2 border-slate-200">
      <template #title>
        <div class="text-lg flex items-center gap-3">
          <UserPlus class="w-5 h-5 text-oslo-blue" />
          Second Guardian Detected
          <Tag :severity="getStatusBadge(secondGuardian.status).severity">
            <component :is="getStatusBadge(secondGuardian.status).icon" class="w-3 h-3 mr-1" />
            {{ getStatusBadge(secondGuardian.status).label }}
          </Tag>
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-slate-700">Name:</span>
              <span class="ml-2">{{ secondGuardian.firstName }} {{ secondGuardian.lastName }}</span>
            </div>
            <div v-if="secondGuardian.email">
              <span class="font-medium text-slate-700">Email:</span>
              <span class="ml-2">{{ secondGuardian.email }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <div class="flex items-center gap-3">
                <InputSwitch
                  v-model="inviteSecondGuardian"
                  @change="handleInviteToggle"
                />
                <label class="text-sm font-medium text-slate-700">
                  Invite second guardian to confirm this application
                </label>
                <Tooltip>
                  <template #content>
                    <p class="max-w-xs">Only one guardian is required to submit an application, but both can confirm if preferred.</p>
                  </template>
                  <HelpCircle class="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </Tooltip>
              </div>
            </div>

            <div v-if="inviteSecondGuardian" class="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label class="text-sm font-semibold text-slate-700">Email for Invitation</label>
              <InputText 
                type="email"
                v-model="inviteEmail"
                placeholder="second.guardian@email.com"
                class="w-full"
              />
            </div>
          </div>

          <Message v-if="secondGuardian.status === 'invited'" severity="info">
            <template #icon>
              <Clock class="h-4 w-4" />
            </template>
            <div class="flex items-center justify-between">
              <span>Invitation sent. Awaiting confirmation.</span>
              <Button 
                outlined 
                size="small"
                @click="() => {
                  inviteSecondGuardian = false;
                  secondGuardian = secondGuardian ? {...secondGuardian, status: 'detected'} : null;
                }"
              >
                Cancel Invite
              </Button>
            </div>
          </Message>

          <Message v-if="secondGuardian.status === 'confirmed'" severity="success">
            <template #icon>
              <CheckCircle class="h-4 w-4" />
            </template>
            Second guardian has confirmed their participation in this application.
          </Message>
        </div>
      </template>
    </Card>

    <!-- Warning for non-responding second guardian -->
    <Message 
      v-if="showWarning && secondGuardian?.status === 'invited'" 
      severity="error"
    >
      <template #icon>
        <AlertCircle class="h-4 w-4" />
      </template>
      <strong>Second guardian not confirmed.</strong> Application will proceed and may be reviewed by case worker if needed.
    </Message>

    <!-- Legal Information -->
    <div class="space-y-4">
      <div class="flex items-start gap-3">
        <Shield class="w-5 h-5 text-slate-600 mt-0.5" />
        <div>
          <h4 class="font-semibold text-slate-800 mb-2">Legal Information</h4>
          <p class="text-slate-600 text-sm">
            According to Oslo municipality regulations, only one guardian is required to submit a kindergarten application. 
            If both guardians wish to be involved, the second guardian can confirm their participation through the invitation system.
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 