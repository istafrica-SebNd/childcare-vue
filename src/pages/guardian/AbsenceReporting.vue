<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, addDays } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Plus } from 'lucide-vue-next'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'

const { t } = useI18n()
const selectedReason = ref('')
const isSubmitting = ref(false)

const absenceReasons = [
  { id: 'sick', label: t('guardian.absence.reasons.sick') },
  { id: 'holiday', label: t('guardian.absence.reasons.holiday') },
  { id: 'doctor', label: t('guardian.absence.reasons.doctor') },
  { id: 'other', label: t('guardian.absence.reasons.other') }
]

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement absence reporting logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    selectedReason.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Quick Report -->
    <Card>
      <template #title>
        {{ t('guardian.absence.quickReport') }}
      </template>
      <template #content>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Button
            v-for="reason in absenceReasons"
            :key="reason.id"
            :outlined="selectedReason !== reason.id"
            @click="selectedReason = reason.id"
            class="h-auto py-3 px-4"
          >
            {{ reason.label }}
          </Button>
        </div>
        
        <div v-if="selectedReason" class="space-y-4 border-t pt-4">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">
                {{ t('guardian.absence.additionalInfo') }}
              </label>
              <Textarea 
                :placeholder="t('guardian.absence.additionalInfoPlaceholder')"
                class="w-full p-3 border rounded-lg resize-none h-20"
              />
            </div>
          </div>
          
          <div class="flex gap-3">
            <Button 
              :loading="isSubmitting"
              @click="handleSubmit"
              class="flex-1"
            >
              {{ t('guardian.absence.reportAbsence') }}
            </Button>
            <Button 
              outlined
              @click="selectedReason = ''"
            >
              {{ t('common.cancel') }}
            </Button>
          </div>
        </div>
      </template>
    </Card>

    <!-- Schedule Absence -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          {{ t('guardian.absence.scheduleAbsence') }}
          <Button outlined size="small">
            <Plus class="w-4 h-4 mr-2" />
            {{ t('guardian.absence.scheduleNew') }}
          </Button>
        </div>
      </template>
      <template #subtitle>
        {{ t('guardian.absence.scheduleDescription') }}
      </template>
      <template #content>
        <div class="grid md:grid-cols-7 gap-4">
          <div 
            v-for="i in 7" 
            :key="i"
            class="border rounded-lg p-3 text-center hover:bg-slate-50 cursor-pointer"
          >
            <div class="text-xs text-slate-600 mb-1">
              {{ format(addDays(new Date(), i - 1), 'EEE', { locale: nb }) }}
            </div>
            <div class="font-semibold">
              {{ format(addDays(new Date(), i - 1), 'd', { locale: nb }) }}
            </div>
            <div class="text-xs text-slate-500 mt-1">
              {{ format(addDays(new Date(), i - 1), 'MMM', { locale: nb }) }}
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Recent Absences -->
    <Card>
      <template #title>
        {{ t('guardian.absence.recentAbsences') }}
      </template>
      <template #content>
        <div class="space-y-3">
          <div 
            v-for="absence in recentAbsences" 
            :key="absence.id"
            class="flex items-center justify-between p-3 border rounded-lg"
          >
            <div class="flex items-center gap-4">
              <div class="text-sm font-medium">{{ absence.date }}</div>
              <span 
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  {
                    'bg-red-100 text-red-800': absence.type === 'sick',
                    'bg-blue-100 text-blue-800': absence.type === 'holiday',
                    'bg-yellow-100 text-yellow-800': absence.type === 'doctor',
                    'bg-gray-100 text-gray-800': absence.type === 'other'
                  }
                ]"
              >
                {{ absence.reason }}
              </span>
            </div>
            <div class="text-sm text-slate-600">
              {{ absence.duration }}
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
// Mock data for recent absences
const recentAbsences = [
  {
    id: 1,
    date: '2024-03-18',
    type: 'sick',
    reason: 'Sick',
    duration: '1 day'
  },
  {
    id: 2,
    date: '2024-03-15',
    type: 'holiday',
    reason: 'Holiday',
    duration: '3 days'
  },
  {
    id: 3,
    date: '2024-03-10',
    type: 'doctor',
    reason: 'Doctor Appointment',
    duration: '2 hours'
  }
]
</script> 
