<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressBar from 'primevue/progressbar'
import Toast from 'primevue/toast'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()

// Search and filters
const searchTerm = ref('')
const districtFilter = ref('all')
const typeFilter = ref('all')

// Mock kindergarten data
const kindergartens = ref([
  {
    id: 'KG-001',
    name: 'Løvenskiold Kindergarten',
    district: 'Grünerløkka',
    type: 'Municipal',
    totalCapacity: 60,
    occupied: 45,
    available: 15,
    waitingList: 8,
    ageGroups: {
      '1-2': { capacity: 20, occupied: 15 },
      '3-5': { capacity: 40, occupied: 30 }
    }
  },
  {
    id: 'KG-002',
    name: 'Sinsen Kindergarten',
    district: 'Grünerløkka',
    type: 'Private',
    totalCapacity: 45,
    occupied: 38,
    available: 7,
    waitingList: 12,
    ageGroups: {
      '1-2': { capacity: 15, occupied: 13 },
      '3-5': { capacity: 30, occupied: 25 }
    }
  },
  {
    id: 'KG-003',
    name: 'Bjølsen Kindergarten',
    district: 'Sagene',
    type: 'Municipal',
    totalCapacity: 80,
    occupied: 65,
    available: 15,
    waitingList: 5,
    ageGroups: {
      '1-2': { capacity: 25, occupied: 20 },
      '3-5': { capacity: 55, occupied: 45 }
    }
  }
])

// Filter options
const districtOptions = [
  { label: t('common.all', 'All Districts'), value: 'all' },
  { label: 'Grünerløkka', value: 'Grünerløkka' },
  { label: 'Sagene', value: 'Sagene' },
  { label: 'Frogner', value: 'Frogner' }
]

const typeOptions = [
  { label: t('common.all', 'All Types'), value: 'all' },
  { label: t('caseworker.placementManagement.municipal', 'Municipal'), value: 'Municipal' },
  { label: t('caseworker.placementManagement.private', 'Private'), value: 'Private' }
]

// Computed properties
const overallStats = computed(() => {
  const total = kindergartens.value.reduce((sum, kg) => sum + kg.totalCapacity, 0)
  const occupied = kindergartens.value.reduce((sum, kg) => sum + kg.occupied, 0)
  const available = kindergartens.value.reduce((sum, kg) => sum + kg.available, 0)
  const waitingList = kindergartens.value.reduce((sum, kg) => sum + kg.waitingList, 0)

  return {
    totalCapacity: total,
    occupied,
    available,
    waitingList,
    occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0
  }
})

const filteredKindergartens = computed(() => {
  return kindergartens.value.filter(kg => {
    const matchesSearch = kg.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesDistrict = districtFilter.value === 'all' || kg.district === districtFilter.value
    const matchesType = typeFilter.value === 'all' || kg.type === typeFilter.value

    return matchesSearch && matchesDistrict && matchesType
  })
})

// Functions
const getOccupancyRate = (kg: any) => {
  return kg.totalCapacity > 0 ? Math.round((kg.occupied / kg.totalCapacity) * 100) : 0
}

const getOccupancySeverity = (rate: number) => {
  if (rate >= 90) return 'danger'
  if (rate >= 75) return 'warning'
  return 'success'
}

const handleViewDetails = (kindergartenId: string) => {
  router.push(`/caseworker/kindergarten/${kindergartenId}`)
}

const handleAddKindergarten = () => {
  router.push('/caseworker/kindergarten/new')
}

const clearFilters = () => {
  searchTerm.value = ''
  districtFilter.value = 'all'
  typeFilter.value = 'all'
  toast.add({ severity: 'success', summary: 'Success', detail: 'Filters cleared', life: 3000 })
}

onMounted(() => {
  // Initialize data
})
</script>

<template>
  <div class="space-y-6">
    <Toast />
    <AppBreadcrumb />

    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ t('caseworker.placementManagement.title', 'Placement Management') }}
        </h1>
        <p class="text-gray-600">
          {{ t('caseworker.placementManagement.description', 'Monitor and manage kindergarten capacity and placements') }}
        </p>
      </div>
      <Button @click="handleAddKindergarten">
        <i class="pi pi-plus mr-2"></i>
        {{ t('caseworker.placementManagement.addKindergarten', 'Add Kindergarten') }}
      </Button>
    </div>

    <!-- Overall Stats -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="bg-blue-50 border-l-4 border-l-blue-500">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 font-medium">{{ t('caseworker.placementManagement.totalCapacity', 'Total Capacity') }}</p>
                <p class="text-3xl font-bold text-blue-900">{{ overallStats.totalCapacity }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-home text-white text-xl"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-orange-50 border-l-4 border-l-orange-500">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-orange-600 font-medium">{{ t('caseworker.placementManagement.occupied', 'Occupied') }}</p>
                <p class="text-3xl font-bold text-orange-900">{{ overallStats.occupied }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-users text-white text-xl"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-green-50 border-l-4 border-l-green-500">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-600 font-medium">{{ t('caseworker.placementManagement.available', 'Available') }}</p>
                <p class="text-3xl font-bold text-green-900">{{ overallStats.available }}</p>
              </div>
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-check-circle text-white text-xl"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-purple-50 border-l-4 border-l-purple-500">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-purple-600 font-medium">{{ t('caseworker.placementManagement.waitingList', 'Waiting List') }}</p>
                <p class="text-3xl font-bold text-purple-900">{{ overallStats.waitingList }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-clock text-white text-xl"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Filters -->
    <Card>
      <template #content>
        <div class="p-6">
          <div class="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('common.search', 'Search') }}
              </label>
              <InputText
                v-model="searchTerm"
                :placeholder="t('caseworker.placementManagement.searchPlaceholder', 'Search kindergartens...')"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('common.district', 'District') }}
              </label>
              <Dropdown
                v-model="districtFilter"
                :options="districtOptions"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('common.type', 'Type') }}
              </label>
              <Dropdown
                v-model="typeFilter"
                :options="typeOptions"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>
            <div>
              <Button @click="clearFilters" outlined class="w-full">
                <i class="pi pi-filter-slash mr-2"></i>
                {{ t('common.clear', 'Clear') }}
              </Button>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Kindergartens Table -->
    <Card>
      <template #header>
        <div class="px-6 pt-6">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ t('caseworker.placementManagement.kindergartens', 'Kindergartens') }}
            <span class="text-gray-500">({{ filteredKindergartens.length }})</span>
          </h3>
        </div>
      </template>
      <template #content>
        <div class="px-6 pb-6">
          <DataTable
            :value="filteredKindergartens"
            :paginator="true"
            :rows="10"
            responsive-layout="scroll"
            class="p-datatable-sm"
          >
            <Column field="name" :header="t('common.name', 'Name')" sortable>
              <template #body="{ data }">
                <div>
                  <div class="font-semibold">{{ data.name }}</div>
                  <div class="text-sm text-gray-500">{{ data.id }}</div>
                </div>
              </template>
            </Column>
            <Column field="district" :header="t('common.district', 'District')" sortable />
            <Column field="type" :header="t('common.type', 'Type')" sortable>
              <template #body="{ data }">
                <Badge
                  :value="data.type === 'Municipal' ? t('caseworker.placementManagement.municipal', 'Municipal') : t('caseworker.placementManagement.private', 'Private')"
                  :severity="data.type === 'Municipal' ? 'info' : 'secondary'"
                />
              </template>
            </Column>
            <Column field="capacity" :header="t('caseworker.placementManagement.capacity', 'Capacity')" sortable>
              <template #body="{ data }">
                <div>
                  <div class="text-sm font-medium">{{ data.occupied }} / {{ data.totalCapacity }}</div>
                  <ProgressBar
                    :value="getOccupancyRate(data)"
                    :severity="getOccupancySeverity(getOccupancyRate(data))"
                    :show-value="false"
                    class="h-2 mt-1"
                  />
                </div>
              </template>
            </Column>
            <Column field="available" :header="t('caseworker.placementManagement.available', 'Available')" sortable>
              <template #body="{ data }">
                <Badge
                  :value="data.available.toString()"
                  :severity="data.available > 10 ? 'success' : data.available > 5 ? 'warning' : 'danger'"
                />
              </template>
            </Column>
            <Column field="waitingList" :header="t('caseworker.placementManagement.waitingList', 'Waiting List')" sortable>
              <template #body="{ data }">
                <Badge
                  :value="data.waitingList.toString()"
                  :severity="data.waitingList === 0 ? 'success' : data.waitingList < 5 ? 'warning' : 'danger'"
                />
              </template>
            </Column>
            <Column :header="t('common.actions', 'Actions')">
              <template #body="{ data }">
                <div class="flex gap-1">
                  <Button
                    size="small"
                    outlined
                    severity="secondary"
                    @click="handleViewDetails(data.id)"
                  >
                    <i class="pi pi-eye"></i>
                  </Button>
                  <Button
                    size="small"
                    outlined
                    severity="secondary"
                  >
                    <i class="pi pi-pencil"></i>
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- Capacity Overview -->
    <div class="grid lg:grid-cols-2 gap-6">
      <Card>
        <template #header>
          <div class="px-6 pt-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ t('caseworker.placementManagement.overallCapacity', 'Overall Capacity') }}
            </h3>
          </div>
        </template>
        <template #content>
          <div class="px-6 pb-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span>{{ t('caseworker.placementManagement.occupied', 'Occupied') }}</span>
                <span class="font-medium">{{ overallStats.occupied }} / {{ overallStats.totalCapacity }}</span>
              </div>
              <ProgressBar
                :value="overallStats.occupancyRate"
                :severity="getOccupancySeverity(overallStats.occupancyRate)"
              />
              <div class="text-center text-sm text-gray-600">
                {{ overallStats.occupancyRate }}% {{ t('caseworker.placementManagement.full', 'Full') }}
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #header>
          <div class="px-6 pt-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ t('caseworker.placementManagement.ageGroup1to2', 'Age Group 1-2 Years') }}
            </h3>
          </div>
        </template>
        <template #content>
          <div class="px-6 pb-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span>{{ t('caseworker.placementManagement.capacity', 'Capacity') }}:</span>
                <span class="font-medium">60</span>
              </div>
              <div class="flex items-center justify-between">
                <span>{{ t('caseworker.placementManagement.occupied', 'Occupied') }}:</span>
                <span class="font-medium">48</span>
              </div>
              <ProgressBar value="80" severity="warning" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f1f5f9;
  color: #374151;
  font-weight: 600;
  padding: 1rem 0.75rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-progressbar) {
  height: 0.5rem;
}
</style>
