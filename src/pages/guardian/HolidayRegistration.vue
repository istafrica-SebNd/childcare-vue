<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, addDays, isAfter } from 'date-fns'
import { nb } from 'date-fns/locale'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import {
  Calendar as LucideCalendar,
  Check,
  AlertTriangle,
  Plus,
  Save,
  Edit,
  Trash2,
  Flag
} from 'lucide-vue-next'

defineOptions({
  name: 'HolidayRegistration'
})

const { t } = useI18n()

const showForm = ref(false)
const isSubmitting = ref(false)

const today = new Date()
const twoWeeksLater = addDays(today, 14)

// Mock data
const registeredHolidays = ref([
  {
    id: 1,
    type: 'vacation',
    startDate: '2024-06-24',
    endDate: '2024-07-15',
    description: t('guardian.holidayRegistration.examples.summerVacation'),
    status: 'confirmed',
    submittedDate: '2024-03-01'
  },
  {
    id: 2,
    type: 'travel',
    startDate: '2024-04-10',
    endDate: '2024-04-16',
    description: t('guardian.holidayRegistration.examples.easterVacation'),
    status: 'pending',
    submittedDate: '2024-03-15'
  }
])

const holidayTypes = [
  { id: 'vacation', label: t('guardian.holidayRegistration.types.vacation') },
  { id: 'travel', label: t('guardian.holidayRegistration.types.travel') },
  { id: 'family', label: t('guardian.holidayRegistration.types.family') },
  { id: 'absence', label: t('guardian.holidayRegistration.types.other') }
]

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Show toast notification (implement your toast system)
  console.log('Holiday registration submitted')

  isSubmitting.value = false
  showForm.value = false
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-700 border-green-200'
    case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getStatusText = (status: string) => {
  return t(`guardian.holidayRegistration.status.${status}`)
}

const isDateTooClose = (dateStr: string) => {
  const date = new Date(dateStr)
  return !isAfter(date, twoWeeksLater)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('guardian.holidayRegistration.title') }}</h1>
        <p class="text-slate-600 mt-2">{{ t('guardian.holidayRegistration.description') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-2 py-1 rounded-full bg-oslo-blue/5 text-oslo-blue border border-oslo-blue/20 flex items-center">
          <LucideCalendar class="w-4 h-4 mr-2" />
          {{ t('guardian.holidayRegistration.planningBadge') }}
        </span>
        <Button @click="showForm = true" :disabled="showForm">
          <Plus class="w-4 h-4 mr-2" />
          {{ t('guardian.holidayRegistration.registerAbsence') }}
        </Button>
      </div>
    </div>

    <!-- Upcoming Important Dates Alert -->
    <Card class="border-yellow-200 bg-yellow-50">
      <template #header>
        <div class="flex items-center gap-2 text-yellow-800">
          <AlertTriangle class="w-5 h-5" />
          <h2 class="text-xl font-semibold">{{ t('guardian.holidayRegistration.importantDeadlines') }}</h2>
        </div>
      </template>
      <template #content>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200">
            <LucideCalendar class="w-5 h-5 text-yellow-600" />
            <div>
              <p class="font-medium text-yellow-800">{{ t('guardian.holidayRegistration.deadlines.summer') }}</p>
              <p class="text-sm text-yellow-700">{{ t('guardian.holidayRegistration.deadlines.summerDate') }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200">
            <LucideCalendar class="w-5 h-5 text-yellow-600" />
            <div>
              <p class="font-medium text-yellow-800">{{ t('guardian.holidayRegistration.deadlines.christmas') }}</p>
              <p class="text-sm text-yellow-700">{{ t('guardian.holidayRegistration.deadlines.christmasDate') }}</p>
            </div>
          </div>

          <p class="text-sm text-yellow-700 pt-2">
            <span class="font-semibold">{{ t('guardian.holidayRegistration.note') }}:</span> {{ t('guardian.holidayRegistration.minimumNotice') }}
          </p>
        </div>
      </template>
    </Card>

    <!-- Registration Form -->
    <Card v-if="showForm">
      <template #header>
        <h2 class="text-xl font-semibold">{{ t('guardian.holidayRegistration.registerAbsence') }}</h2>
        <p class="text-gray-600">{{ t('guardian.holidayRegistration.formDescription') }}</p>
      </template>
      <template #content>
        <form @submit="handleSubmit" class="space-y-6">
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">{{ t('guardian.holidayRegistration.absenceType') }}</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                v-for="type in holidayTypes"
                :key="type.id"
                class="border rounded-lg p-3 flex items-center justify-center text-center hover:border-oslo-blue hover:bg-oslo-blue/5 cursor-pointer transition-colors"
              >
                <span class="font-medium">{{ type.label }}</span>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label for="start-date" class="block text-sm font-medium text-gray-700">{{ t('guardian.holidayRegistration.firstAbsenceDay') }}</label>
              <InputText
                id="start-date"
                type="date"
                :min="format(twoWeeksLater, 'yyyy-MM-dd')"
                required
                class="w-full"
              />
              <p class="text-xs text-slate-500 mt-1">
                {{ t('guardian.holidayRegistration.minimumDays') }}
              </p>
            </div>

            <div>
              <label for="end-date" class="block text-sm font-medium text-gray-700">{{ t('guardian.holidayRegistration.lastAbsenceDay') }}</label>
              <InputText
                id="end-date"
                type="date"
                :min="format(twoWeeksLater, 'yyyy-MM-dd')"
                required
                class="w-full"
              />
            </div>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">{{ t('guardian.holidayRegistration.descriptionOptional') }}</label>
            <Textarea
              id="description"
              :placeholder="t('guardian.holidayRegistration.descriptionPlaceholder')"
              rows="3"
              class="w-full"
            />
          </div>

          <div>
            <label for="contact" class="block text-sm font-medium text-gray-700">{{ t('guardian.holidayRegistration.contactOptional') }}</label>
            <InputText
              id="contact"
              :placeholder="t('guardian.holidayRegistration.contactPlaceholder')"
              class="w-full"
            />
          </div>

          <div class="flex gap-3">
            <Button type="submit" :disabled="isSubmitting">
              <template v-if="isSubmitting">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                {{ t('guardian.holidayRegistration.sending') }}
              </template>
              <template v-else>
                <Save class="w-4 h-4 mr-2" />
                {{ t('guardian.holidayRegistration.registerAbsence') }}
              </template>
            </Button>
            <Button type="button" outlined @click="showForm = false">
              {{ t('common.cancel') }}
            </Button>
          </div>
        </form>
      </template>
    </Card>

    <!-- Registered Holidays -->
    <Card>
      <template #header>
        <h2 class="text-xl font-semibold">{{ t('guardian.holidayRegistration.registeredAbsences') }}</h2>
        <p class="text-gray-600">{{ t('guardian.holidayRegistration.absencesOverview') }}</p>
      </template>
      <template #content>
        <div class="space-y-4">
          <div
            v-for="holiday in registeredHolidays"
            :key="holiday.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <LucideCalendar class="w-6 h-6 text-slate-600" />
              </div>

              <div>
                <h3 class="font-semibold">
                  {{ format(new Date(holiday.startDate), 'd. MMM', { locale: nb }) }} -
                  {{ format(new Date(holiday.endDate), 'd. MMM yyyy', { locale: nb }) }}
                </h3>
                <p class="text-sm text-slate-600">
                  {{ holiday.description }}
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ t('guardian.holidayRegistration.registered') }}:
                  {{ format(new Date(holiday.submittedDate), 'd. MMM yyyy', { locale: nb }) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span
                class="px-2 py-1 rounded-full text-sm border"
                :class="getStatusColor(holiday.status)"
              >
                {{ getStatusText(holiday.status) }}
              </span>

              <span
                v-if="isDateTooClose(holiday.startDate) && holiday.status === 'pending'"
                class="px-2 py-1 rounded-full text-sm border bg-red-50 text-red-700 border-red-200 flex items-center"
              >
                <AlertTriangle class="w-3 h-3 mr-1" />
                {{ t('guardian.holidayRegistration.lessThan14Days') }}
              </span>

              <div class="flex gap-1">
                <Button text>
                  <Edit class="w-4 h-4" />
                </Button>
                <Button text>
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Kindergarten Holiday Calendar -->
    <Card>
      <template #header>
        <div class="flex items-center gap-2">
          <Flag class="w-5 h-5" />
          <h2 class="text-xl font-semibold">{{ t('guardian.holidayRegistration.kindergartenCalendar') }}</h2>
        </div>
        <p class="text-gray-600">{{ t('guardian.holidayRegistration.closedDaysOverview') }}</p>
      </template>
      <template #content>
        <div class="space-y-3">
          <div class="p-3 border rounded-lg flex justify-between items-center hover:bg-slate-50">
            <div>
              <p class="font-medium">{{ t('guardian.holidayRegistration.closedDays.easter') }}</p>
              <p class="text-sm text-slate-600">{{ t('guardian.holidayRegistration.closedDays.easterDates') }}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-sm border">{{ t('guardian.holidayRegistration.kindergartenClosed') }}</span>
          </div>

          <div class="p-3 border rounded-lg flex justify-between items-center hover:bg-slate-50">
            <div>
              <p class="font-medium">{{ t('guardian.holidayRegistration.closedDays.summer') }}</p>
              <p class="text-sm text-slate-600">{{ t('guardian.holidayRegistration.closedDays.summerDates') }}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-sm border">{{ t('guardian.holidayRegistration.kindergartenClosed') }}</span>
          </div>

          <div class="p-3 border rounded-lg flex justify-between items-center hover:bg-slate-50">
            <div>
              <p class="font-medium">{{ t('guardian.holidayRegistration.closedDays.planning') }}</p>
              <p class="text-sm text-slate-600">{{ t('guardian.holidayRegistration.closedDays.planningDate') }}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-sm border">{{ t('guardian.holidayRegistration.kindergartenClosed') }}</span>
          </div>

          <div class="p-3 border rounded-lg flex justify-between items-center hover:bg-slate-50">
            <div>
              <p class="font-medium">{{ t('guardian.holidayRegistration.closedDays.christmas') }}</p>
              <p class="text-sm text-slate-600">{{ t('guardian.holidayRegistration.closedDays.christmasDates') }}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-sm border">{{ t('guardian.holidayRegistration.kindergartenClosed') }}</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Policy Information -->
    <Card class="border-blue-200 bg-blue-50">
      <template #header>
        <div class="flex items-center gap-2 text-blue-800">
          <Check class="w-5 h-5" />
          <h2 class="text-xl font-semibold">{{ t('guardian.holidayRegistration.policyTitle') }}</h2>
        </div>
      </template>
      <template #content>
        <div class="space-y-2 text-sm text-blue-700">
          <p>• {{ t('guardian.holidayRegistration.policy.minimum14Days') }}</p>
          <p>• {{ t('guardian.holidayRegistration.policy.summerDeadline') }}</p>
          <p>• {{ t('guardian.holidayRegistration.policy.christmasDeadline') }}</p>
          <p>• {{ t('guardian.holidayRegistration.policy.dispensation') }}</p>
          <p>• {{ t('guardian.holidayRegistration.policy.planning') }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>
