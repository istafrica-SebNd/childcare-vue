<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { FileCheck, Camera, MapPin, Stethoscope, Clock, Download, Edit } from 'lucide-vue-next'
import Badge from 'primevue/badge'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const { t } = useI18n()

interface Consent {
  id: number
  type: string
  title: string
  description: string
  status: 'active' | 'expires_soon' | 'expired' | 'pending'
  signed: string | null
  expires: string | null
  icon: any
}

const consents = ref<Consent[]>([
  {
    id: 1,
    type: 'photo',
    title: t('guardian.consents.types.photo.title'),
    description: t('guardian.consents.types.photo.description'),
    status: 'active',
    signed: '2024-01-15',
    expires: '2024-12-31',
    icon: Camera
  },
  {
    id: 2,
    type: 'medical',
    title: t('guardian.consents.types.medical.title'),
    description: t('guardian.consents.types.medical.description'),
    status: 'active',
    signed: '2024-01-15',
    expires: '2025-01-15',
    icon: Stethoscope
  },
  {
    id: 3,
    type: 'trips',
    title: t('guardian.consents.types.trips.title'),
    description: t('guardian.consents.types.trips.description'),
    status: 'expires_soon',
    signed: '2024-01-15',
    expires: '2024-04-01',
    icon: MapPin
  },
  {
    id: 4,
    type: 'data',
    title: t('guardian.consents.types.data.title'),
    description: t('guardian.consents.types.data.description'),
    status: 'pending',
    signed: null,
    expires: null,
    icon: FileCheck
  }
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700'
    case 'expires_soon': return 'bg-yellow-100 text-yellow-700'
    case 'expired': return 'bg-red-100 text-red-700'
    case 'pending': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusText = (status: string) => {
  return t(`guardian.consents.status.${status}`)
}

const formatDate = (date: string | null) => {
  if (!date) return ''
  return format(new Date(date), 'd. MMM yyyy', { locale: nb })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />
    
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('guardian.consents.title') }}</h1>
        <p class="text-slate-600 mt-2">{{ t('guardian.consents.description') }}</p>
      </div>
      <span class="px-3 py-1 rounded-full bg-oslo-blue/5 text-oslo-blue border border-oslo-blue/20 flex items-center">
        <FileCheck class="w-4 h-4 mr-2" />
        {{ t('guardian.consents.badge') }}
      </span>
    </div>

    <!-- Pending Consents Alert -->
    <Card class="border-yellow-200 bg-yellow-50">
      <template #header>
        <div class="flex items-center gap-2 text-yellow-800">
          <Clock class="w-5 h-5" />
          {{ t('guardian.consents.actionsRequired') }}
        </div>
      </template>
      <template #content>
        <p class="text-yellow-700 mb-4">
          {{ t('guardian.consents.pendingMessage') }}
        </p>
        <Button class="bg-yellow-600 hover:bg-yellow-700">
          {{ t('guardian.consents.completeMissing') }}
        </Button>
      </template>
    </Card>

    <!-- Consents List -->
    <Card>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">{{ t('guardian.consents.allConsents') }}</h2>
          <p class="text-sm text-slate-600">{{ t('guardian.consents.consentOverview') }}</p>
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div 
            v-for="consent in consents" 
            :key="consent.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <component :is="consent.icon" class="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 class="font-semibold">{{ consent.title }}</h3>
                <p class="text-sm text-slate-600">{{ consent.description }}</p>
                <p v-if="consent.signed" class="text-xs text-slate-500 mt-1">
                  {{ t('guardian.consents.signed') }}: {{ formatDate(consent.signed) }}
                  <template v-if="consent.expires">
                    • {{ t('guardian.consents.expires') }}: {{ formatDate(consent.expires) }}
                  </template>
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <span 
                class="px-2 py-1 rounded-full text-sm"
                :class="getStatusColor(consent.status)"
              >
                {{ getStatusText(consent.status) }}
              </span>
              
              <div class="flex gap-1">
                <template v-if="consent.status === 'pending'">
                  <Button size="small">
                    <Edit class="w-4 h-4 mr-1" />
                    {{ t('guardian.consents.sign') }}
                  </Button>
                </template>
                <template v-else>
                  <Button text severity="secondary" size="small">
                    <Download class="w-4 h-4" />
                  </Button>
                  <Button text severity="secondary" size="small">
                    <Edit class="w-4 h-4" />
                  </Button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Important Information -->
    <Card class="border-blue-200 bg-blue-50">
      <template #header>
        <h2 class="text-xl font-semibold text-blue-800">{{ t('guardian.consents.importantInfo') }}</h2>
      </template>
      <template #content>
        <div class="space-y-2 text-sm text-blue-700">
          <p>• {{ t('guardian.consents.info.legally') }}</p>
          <p>• {{ t('guardian.consents.info.reminder') }}</p>
          <p>• {{ t('guardian.consents.info.participation') }}</p>
          <p>• {{ t('guardian.consents.info.digital') }}</p>
        </div>
      </template>
    </Card>
  </div>
</template> 