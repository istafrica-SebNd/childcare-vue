<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { format, addDays, startOfWeek } from 'date-fns'
import { nb } from 'date-fns/locale'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { ArrowLeft, ArrowLeftRight, Calendar, Clock, MapPin, User, Phone, MessageCircle, AlertCircle, CheckCircle } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// Mock data - in a real app, this would come from an API
const mockApplications = [
  {
    id: '1',
    childName: 'Emma Johansen',
    status: 'approved',
    isDualPlacement: true,
    dualPlacementId: 'DP-2024-001',
    kindergartenPreference: 'Frogner Barnehage',
    secondaryKindergartenPreference: 'Majorstuen Barnehage',
    notes: 'Special dietary requirements noted'
  }
]

const application = computed(() => 
  mockApplications.find(app => app.id === route.params.id && app.isDualPlacement)
)

// Mock schedule data for the dual placement
const scheduleData = {
  monday: { kindergarten: 'primary', location: application.value?.kindergartenPreference },
  tuesday: { kindergarten: 'primary', location: application.value?.kindergartenPreference },
  wednesday: { kindergarten: 'secondary', location: application.value?.secondaryKindergartenPreference },
  thursday: { kindergarten: 'secondary', location: application.value?.secondaryKindergartenPreference },
  friday: { kindergarten: 'primary', location: application.value?.kindergartenPreference }
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })

const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted': return 'text-blue-600 border-blue-300'
    case 'approved': return 'text-green-600 border-green-300'
    default: return 'text-yellow-600 border-yellow-300'
  }
}

const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMMM do', { locale: nb })
}

const formatDateWithYear = (date: string | Date) => {
  return format(new Date(date), 'MMMM do, yyyy', { locale: nb })
}

const navigateBack = () => {
  router.back()
}
</script>

<template>
  <div v-if="!application" class="min-h-screen flex items-center justify-center">
    <Card class="w-full max-w-md">
      <template #content>
        <div class="text-center py-12">
          <h2 class="text-xl font-semibold mb-2">{{ t('guardian.dualPlacement.notFound') }}</h2>
          <p class="text-gray-600 mb-4">{{ t('guardian.dualPlacement.notFoundDescription') }}</p>
          <Button @click="navigateBack">
            <ArrowLeft class="h-4 w-4 mr-2" />
            {{ t('common.goBack') }}
          </Button>
        </div>
      </template>
    </Card>
  </div>

  <div v-else class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-6">
        <Button outlined @click="navigateBack" class="mb-4">
          <ArrowLeft class="h-4 w-4 mr-2" />
          {{ t('guardian.dualPlacement.backToApplications') }}
        </Button>
        <div class="flex items-center gap-3 mb-2">
          <ArrowLeftRight class="h-8 w-8 text-purple-600" />
          <h1 class="text-3xl font-bold text-gray-900">{{ t('guardian.dualPlacement.title') }}</h1>
        </div>
        <p class="text-gray-600">
          {{ t('guardian.dualPlacement.description', { name: application.childName }) }}
        </p>
      </div>

      <!-- Application Overview -->
      <Card class="mb-6 border-l-4 border-l-purple-500">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold flex items-center gap-2">
                {{ application.childName }}
                <span class="px-2 py-1 rounded-full text-purple-600 border border-purple-300 text-sm flex items-center">
                  <ArrowLeftRight class="h-3 w-3 mr-1" />
                  {{ t('guardian.dualPlacement.badge') }}
                </span>
                <span 
                  class="px-2 py-1 rounded-full text-sm border"
                  :class="getStatusColor(application.status)"
                >
                  {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
                </span>
              </h2>
              <p class="text-gray-600 text-sm">
                {{ t('guardian.dualPlacement.applicationId', { id: application.id }) }} • 
                {{ t('guardian.dualPlacement.dualPlacementId', { id: application.dualPlacementId }) }}
              </p>
            </div>
            <div class="flex gap-2">
              <Button outlined size="small">
                <MessageCircle class="h-4 w-4 mr-2" />
                {{ t('guardian.dualPlacement.contactSupport') }}
              </Button>
              <Button outlined size="small">
                <Phone class="h-4 w-4 mr-2" />
                {{ t('guardian.dualPlacement.callCaseWorker') }}
              </Button>
            </div>
          </div>
        </template>
        <template #content>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <MapPin class="h-4 w-4 text-blue-600" />
                <span class="font-semibold text-blue-800">{{ t('guardian.dualPlacement.primaryKindergarten') }}</span>
              </div>
              <p class="font-medium text-blue-900">{{ application.kindergartenPreference }}</p>
              <p class="text-sm text-blue-600 mt-1">{{ t('guardian.dualPlacement.primaryDays') }}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <div class="flex items-center gap-2 mb-2">
                <MapPin class="h-4 w-4 text-green-600" />
                <span class="font-semibold text-green-800">{{ t('guardian.dualPlacement.secondaryKindergarten') }}</span>
              </div>
              <p class="font-medium text-green-900">{{ application.secondaryKindergartenPreference }}</p>
              <p class="text-sm text-green-600 mt-1">{{ t('guardian.dualPlacement.secondaryDays') }}</p>
            </div>
          </div>
          <div v-if="application.notes" class="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p class="text-purple-800">
              <strong>{{ t('guardian.dualPlacement.specialNotes') }}:</strong> {{ application.notes }}
            </p>
          </div>
        </template>
      </Card>

      <TabView>
        <TabPanel header="Weekly Schedule">
          <!-- Current Week Schedule -->
          <Card class="mb-6">
            <template #header>
              <div class="flex items-center gap-2">
                <Calendar class="h-5 w-5 text-oslo-blue" />
                <h3 class="text-xl font-semibold">{{ t('guardian.dualPlacement.thisWeekSchedule') }}</h3>
              </div>
              <p class="text-gray-600 text-sm">
                {{ formatDate(currentWeek) }} - {{ formatDateWithYear(addDays(currentWeek, 6)) }}
              </p>
            </template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div 
                  v-for="day in weekDays" 
                  :key="day"
                  :class="[
                    'p-4 rounded-lg border-2',
                    scheduleData[day.toLowerCase()].kindergarten === 'primary'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-green-50 border-green-200'
                  ]"
                >
                  <h4 class="font-semibold text-center mb-2">{{ day }}</h4>
                  <div class="text-center">
                    <div 
                      class="w-3 h-3 rounded-full mx-auto mb-2"
                      :class="scheduleData[day.toLowerCase()].kindergarten === 'primary' ? 'bg-blue-500' : 'bg-green-500'"
                    ></div>
                    <p 
                      class="text-sm font-medium"
                      :class="scheduleData[day.toLowerCase()].kindergarten === 'primary' ? 'text-blue-800' : 'text-green-800'"
                    >
                      {{ scheduleData[day.toLowerCase()].location }}
                    </p>
                    <p 
                      class="text-xs"
                      :class="scheduleData[day.toLowerCase()].kindergarten === 'primary' ? 'text-blue-600' : 'text-green-600'"
                    >
                      {{ scheduleData[day.toLowerCase()].kindergarten === 'primary' ? t('guardian.dualPlacement.primary') : t('guardian.dualPlacement.secondary') }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex items-center justify-center gap-6">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">{{ t('guardian.dualPlacement.primaryKindergarten') }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm text-gray-600">{{ t('guardian.dualPlacement.secondaryKindergarten') }}</span>
                </div>
              </div>
            </template>
          </Card>

          <!-- Schedule Changes -->
          <Card>
            <template #header>
              <h3 class="text-xl font-semibold">{{ t('guardian.dualPlacement.scheduleChanges') }}</h3>
              <p class="text-gray-600 text-sm">{{ t('guardian.dualPlacement.scheduleChangesDescription') }}</p>
            </template>
            <template #content>
              <div class="text-center py-8">
                <Clock class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-4">{{ t('guardian.dualPlacement.noScheduleChanges') }}</p>
                <Button outlined>
                  {{ t('guardian.dualPlacement.requestScheduleChange') }}
                </Button>
              </div>
            </template>
          </Card>
        </TabPanel>

        <TabPanel header="Logistics">
          <!-- Transportation -->
          <Card class="mb-6">
            <template #header>
              <h3 class="text-xl font-semibold">{{ t('guardian.dualPlacement.transportation') }}</h3>
              <p class="text-gray-600 text-sm">{{ t('guardian.dualPlacement.transportationDescription') }}</p>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 border rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">{{ t('guardian.dualPlacement.primaryKindergarten') }}</h4>
                    <p class="font-medium">{{ application.kindergartenPreference }}</p>
                    <div class="mt-2 space-y-1 text-sm text-gray-600">
                      <p>📍 {{ t('guardian.dualPlacement.address') }}: Frognerveien 12, 0266 Oslo</p>
                      <p>📞 {{ t('guardian.dualPlacement.phone') }}: +47 23 45 67 89</p>
                      <p>🚌 {{ t('guardian.dualPlacement.distance') }}: 0.8 km {{ t('guardian.dualPlacement.fromHome') }}</p>
                    </div>
                  </div>
                  <div class="p-4 border rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">{{ t('guardian.dualPlacement.secondaryKindergarten') }}</h4>
                    <p class="font-medium">{{ application.secondaryKindergartenPreference }}</p>
                    <div class="mt-2 space-y-1 text-sm text-gray-600">
                      <p>📍 {{ t('guardian.dualPlacement.address') }}: Majorstugata 15, 0267 Oslo</p>
                      <p>📞 {{ t('guardian.dualPlacement.phone') }}: +47 23 45 67 90</p>
                      <p>🚌 {{ t('guardian.dualPlacement.distance') }}: 1.2 km {{ t('guardian.dualPlacement.fromHome') }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div class="flex items-start gap-3">
                    <AlertCircle class="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 class="font-semibold text-yellow-800 mb-2">{{ t('guardian.dualPlacement.importantPickupInfo') }}</h4>
                      <ul class="text-yellow-700 text-sm space-y-1">
                        <li>• {{ t('guardian.dualPlacement.pickupInfo1') }}</li>
                        <li>• {{ t('guardian.dualPlacement.pickupInfo2') }}</li>
                        <li>• {{ t('guardian.dualPlacement.pickupInfo3') }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Supplies & Belongings -->
          <Card>
            <template #header>
              <h3 class="text-xl font-semibold">{{ t('guardian.dualPlacement.supplies') }}</h3>
              <p class="text-gray-600 text-sm">{{ t('guardian.dualPlacement.suppliesDescription') }}</p>
            </template>
            <template #content>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-3">
                  <h4 class="font-semibold text-blue-800">{{ t('guardian.dualPlacement.itemsAtPrimary') }}</h4>
                  <div class="space-y-2">
                    <div 
                      v-for="item in ['Spare clothes', 'Indoor shoes', 'Blanket', 'Water bottle']" 
                      :key="item"
                      class="flex items-center gap-2 p-2 bg-blue-50 rounded"
                    >
                      <CheckCircle class="h-4 w-4 text-blue-600" />
                      <span class="text-sm">{{ item }}</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <h4 class="font-semibold text-green-800">{{ t('guardian.dualPlacement.itemsAtSecondary') }}</h4>
                  <div class="space-y-2">
                    <div 
                      v-for="item in ['Spare clothes', 'Indoor shoes', 'Comfort toy', 'Art supplies']" 
                      :key="item"
                      class="flex items-center gap-2 p-2 bg-green-50 rounded"
                    >
                      <CheckCircle class="h-4 w-4 text-green-600" />
                      <span class="text-sm">{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </TabPanel>

        <TabPanel header="Contacts">
          <!-- Contact Information -->
          <Card>
            <template #header>
              <h3 class="text-xl font-semibold">{{ t('guardian.dualPlacement.contactInformation') }}</h3>
              <p class="text-gray-600 text-sm">{{ t('guardian.dualPlacement.contactInformationDescription') }}</p>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 border rounded-lg">
                    <h4 class="font-semibold mb-3">{{ t('guardian.dualPlacement.primaryKindergarten') }}</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex items-center gap-2">
                        <User class="h-4 w-4 text-gray-500" />
                        <span><strong>{{ t('guardian.dualPlacement.director') }}:</strong> Anna Larsen</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Phone class="h-4 w-4 text-gray-500" />
                        <span>+47 23 45 67 89</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <MessageCircle class="h-4 w-4 text-gray-500" />
                        <span>anna.larsen@frogner.barnehage.oslo.no</span>
                      </div>
                    </div>
                  </div>
                  <div class="p-4 border rounded-lg">
                    <h4 class="font-semibold mb-3">{{ t('guardian.dualPlacement.secondaryKindergarten') }}</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex items-center gap-2">
                        <User class="h-4 w-4 text-gray-500" />
                        <span><strong>{{ t('guardian.dualPlacement.director') }}:</strong> Erik Hansen</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Phone class="h-4 w-4 text-gray-500" />
                        <span>+47 23 45 67 90</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <MessageCircle class="h-4 w-4 text-gray-500" />
                        <span>erik.hansen@majorstuen.barnehage.oslo.no</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 class="font-semibold text-purple-800 mb-2">{{ t('guardian.dualPlacement.caseWorker') }}</h4>
                  <div class="space-y-1 text-sm text-purple-700">
                    <div class="flex items-center gap-2">
                      <User class="h-4 w-4" />
                      <span><strong>Erik Johansen</strong> - {{ t('guardian.dualPlacement.dualPlacementSpecialist') }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Phone class="h-4 w-4" />
                      <span>+47 21 80 21 80</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <MessageCircle class="h-4 w-4" />
                      <span>erik.johansen@bfd.oslo.kommune.no</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </TabPanel>

        <TabPanel header="Documents">
          <!-- Documents -->
          <Card>
            <template #header>
              <h3 class="text-xl font-semibold">{{ t('guardian.dualPlacement.documents') }}</h3>
              <p class="text-gray-600 text-sm">{{ t('guardian.dualPlacement.documentsDescription') }}</p>
            </template>
            <template #content>
              <div class="space-y-3">
                <div 
                  v-for="doc in [
                    { name: t('guardian.dualPlacement.documents.agreement'), status: 'signed', date: '2024-06-01' },
                    { name: t('guardian.dualPlacement.documents.custody'), status: 'verified', date: '2024-06-01' },
                    { name: t('guardian.dualPlacement.documents.transportation'), status: 'approved', date: '2024-06-02' },
                    { name: t('guardian.dualPlacement.documents.emergency'), status: 'pending', date: t('guardian.dualPlacement.documents.notSubmitted') }
                  ]"
                  :key="doc.name"
                  class="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <span class="font-medium">{{ doc.name }}</span>
                    <p class="text-sm text-gray-500">{{ doc.date }}</p>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-full text-sm border"
                    :class="doc.status === 'signed' || doc.status === 'verified' || doc.status === 'approved'
                      ? 'text-green-600 border-green-300'
                      : 'text-yellow-600 border-yellow-300'"
                  >
                    {{ doc.status.charAt(0).toUpperCase() + doc.status.slice(1) }}
                  </span>
                </div>
              </div>
              
              <div class="mt-6 text-center">
                <Button outlined>
                  {{ t('guardian.dualPlacement.uploadDocuments') }}
                </Button>
              </div>
            </template>
          </Card>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template> 