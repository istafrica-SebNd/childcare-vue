<template>
  <BaseLayout>
    <template #content>
      <div class="districts-admin">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">District Oversight</h1>
            <p class="mt-1 text-gray-600">
              Monitor and manage all districts across the municipality
            </p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              :loading="loading"
              @click="loadDistricts"
              class="p-button-outlined"
            />
            <Button
              icon="pi pi-plus"
              label="New District"
              @click="createDistrict"
              class="p-button-primary"
            />
          </div>
        </div>

        <!-- District Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card class="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-blue-700">{{ totalDistricts }}</div>
                  <div class="text-sm text-blue-600 mt-1">Total Districts</div>
                  <div class="text-xs text-blue-500 mt-1">Active across Oslo</div>
                </div>
                <div class="w-14 h-14 bg-blue-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-map text-blue-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-green-700">{{ totalKindergartens }}</div>
                  <div class="text-sm text-green-600 mt-1">Kindergartens</div>
                  <div class="text-xs text-green-500 mt-1">Across all districts</div>
                </div>
                <div class="w-14 h-14 bg-green-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-building text-green-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-orange-700">{{ totalCapacity }}</div>
                  <div class="text-sm text-orange-600 mt-1">Total Capacity</div>
                  <div class="text-xs text-orange-500 mt-1">{{ Math.round(occupancyRate) }}% occupied</div>
                </div>
                <div class="w-14 h-14 bg-orange-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-users text-orange-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-purple-700">{{ avgUtilization }}%</div>
                  <div class="text-sm text-purple-600 mt-1">Avg Utilization</div>
                  <div class="text-xs text-purple-500 mt-1">Across districts</div>
                </div>
                <div class="w-14 h-14 bg-purple-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-chart-pie text-purple-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Districts Table -->
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-map text-blue-600"></i>
                District Management
              </div>
              <div class="flex gap-2">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="searchQuery"
                    placeholder="Search districts..."
                    class="w-64"
                  />
                </span>
              </div>
            </div>
          </template>
          <template #content>
            <DataTable
              :value="filteredDistricts"
              :loading="loading"
              :paginator="true"
              :rows="10"
              responsive-layout="scroll"
              class="p-datatable-sm"
              sort-field="name"
              :sort-order="1"
            >
              <Column field="name" header="District" sortable>
                <template #body="{ data }">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i class="pi pi-map-marker text-blue-600"></i>
                    </div>
                    <div>
                      <div class="font-medium">{{ data.name }}</div>
                      <div class="text-sm text-gray-500">Code: {{ data.code }}</div>
                    </div>
                  </div>
                </template>
              </Column>

              <Column field="kindergartenCount" header="Kindergartens" sortable>
                <template #body="{ data }">
                  <div class="text-center">{{ data.kindergartenCount }}</div>
                </template>
              </Column>

              <Column field="capacity" header="Capacity" sortable>
                <template #body="{ data }">
                  <div class="text-center">{{ data.capacity.toLocaleString() }}</div>
                </template>
              </Column>

              <Column field="occupancy" header="Occupancy" sortable>
                <template #body="{ data }">
                  <div class="text-center">{{ data.occupancy.toLocaleString() }}</div>
                </template>
              </Column>

              <Column header="Utilization">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <ProgressBar
                      :value="Math.round((data.occupancy / data.capacity) * 100)"
                      class="flex-1"
                      :class="{
                        'custom-success': (data.occupancy / data.capacity) < 0.8,
                        'custom-warning': (data.occupancy / data.capacity) >= 0.8 && (data.occupancy / data.capacity) < 0.95,
                        'custom-danger': (data.occupancy / data.capacity) >= 0.95
                      }"
                    />
                    <span class="text-sm font-medium w-12">
                      {{ Math.round((data.occupancy / data.capacity) * 100) }}%
                    </span>
                  </div>
                </template>
              </Column>

              <Column field="manager" header="Manager">
                <template #body="{ data }">
                  <div v-if="data.manager" class="text-sm">
                    <div class="font-medium">{{ data.manager.name }}</div>
                    <div class="text-gray-500">{{ data.manager.email }}</div>
                  </div>
                  <Tag v-else value="No Manager" severity="warning" />
                </template>
              </Column>

              <Column header="Actions">
                <template #body="{ data }">
                  <div class="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      class="p-button-sm p-button-outlined"
                      @click="viewDistrict(data)"
                      v-tooltip="'View Details'"
                    />
                    <Button
                      icon="pi pi-pencil"
                      class="p-button-sm p-button-outlined"
                      @click="editDistrict(data)"
                      v-tooltip="'Edit District'"
                    />
                    <Button
                      icon="pi pi-chart-bar"
                      class="p-button-sm p-button-outlined"
                      @click="viewAnalytics(data)"
                      v-tooltip="'View Analytics'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>

        <!-- District Details Dialog -->
        <Dialog
          v-model:visible="showDetailsDialog"
          :style="{ width: '800px' }"
          header="District Details"
          :modal="true"
        >
          <div v-if="selectedDistrict" class="space-y-6">
            <!-- Basic Info -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Basic Information</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">District Name</label>
                  <div class="text-sm">{{ selectedDistrict.name }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">District Code</label>
                  <div class="text-sm">{{ selectedDistrict.code }}</div>
                </div>
              </div>
            </div>

            <!-- Statistics -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Statistics</h3>
              <div class="grid grid-cols-3 gap-4">
                <Card class="border">
                  <template #content>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ selectedDistrict.kindergartenCount }}</div>
                      <div class="text-sm text-gray-600">Kindergartens</div>
                    </div>
                  </template>
                </Card>
                <Card class="border">
                  <template #content>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-green-600">{{ selectedDistrict.capacity }}</div>
                      <div class="text-sm text-gray-600">Total Capacity</div>
                    </div>
                  </template>
                </Card>
                <Card class="border">
                  <template #content>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-orange-600">{{ selectedDistrict.occupancy }}</div>
                      <div class="text-sm text-gray-600">Current Occupancy</div>
                    </div>
                  </template>
                </Card>
              </div>
            </div>

            <!-- Manager Info -->
            <div v-if="selectedDistrict.manager">
              <h3 class="font-semibold text-lg mb-4">District Manager</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div class="text-sm">{{ selectedDistrict.manager.name }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div class="text-sm">{{ selectedDistrict.manager.email }}</div>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Contact Information</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Coordinator Email</label>
                  <div class="text-sm">{{ selectedDistrict.coordinatorEmail || 'Not set' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Coordinator Phone</label>
                  <div class="text-sm">{{ selectedDistrict.coordinatorPhone || 'Not set' }}</div>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <Button
              label="Close"
              icon="pi pi-times"
              class="p-button-outlined"
              @click="showDetailsDialog = false"
            />
            <Button
              label="Edit District"
              icon="pi pi-pencil"
              @click="editSelectedDistrict"
            />
          </template>
        </Dialog>

        <!-- Create/Edit District Dialog -->
        <Dialog
          v-model:visible="showEditDialog"
          :style="{ width: '600px' }"
          :header="editingDistrict ? 'Edit District' : 'Create District'"
          :modal="true"
          class="p-fluid"
        >
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">District Name</label>
                <InputText
                  v-model="districtForm.name"
                  placeholder="Enter district name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">District Code</label>
                <InputText
                  v-model="districtForm.code"
                  placeholder="Enter district code"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Coordinator Email</label>
                <InputText
                  v-model="districtForm.coordinatorEmail"
                  type="email"
                  placeholder="coordinator@oslo.kommune.no"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Coordinator Phone</label>
                <InputText
                  v-model="districtForm.coordinatorPhone"
                  placeholder="+47 123 45 678"
                />
              </div>
            </div>
          </div>

          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-outlined"
              @click="showEditDialog = false"
            />
            <Button
              :label="editingDistrict ? 'Update' : 'Create'"
              icon="pi pi-check"
              :loading="saving"
              @click="saveDistrict"
            />
          </template>
        </Dialog>

        <Toast />
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import type { District } from '@/types/admin'
import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()

// State
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const showDetailsDialog = ref(false)
const showEditDialog = ref(false)
const selectedDistrict = ref<District | null>(null)
const editingDistrict = ref<District | null>(null)

// Form data
const districtForm = ref({
  name: '',
  code: '',
  coordinatorEmail: '',
  coordinatorPhone: ''
})

// Mock data
const districts = ref<District[]>([
  {
    id: '1',
    name: 'Gamle Oslo',
    code: 'GO',
    kindergartenCount: 45,
    capacity: 2800,
    occupancy: 2650,
    manager: {
      id: '1',
      name: 'Anna Larsen',
      email: 'anna.larsen@oslo.kommune.no',
      role: 'district-manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    coordinatorEmail: 'gamle-oslo@oslo.kommune.no',
    coordinatorPhone: '+47 23 46 16 00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Grünerløkka',
    code: 'GL',
    kindergartenCount: 38,
    capacity: 2400,
    occupancy: 2350,
    manager: {
      id: '2',
      name: 'Erik Hansen',
      email: 'erik.hansen@oslo.kommune.no',
      role: 'district-manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    coordinatorEmail: 'grunerlokka@oslo.kommune.no',
    coordinatorPhone: '+47 23 46 16 01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Sagene',
    code: 'SA',
    kindergartenCount: 42,
    capacity: 2600,
    occupancy: 2480,
    coordinatorEmail: 'sagene@oslo.kommune.no',
    coordinatorPhone: '+47 23 46 16 02',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'St. Hanshaugen',
    code: 'SH',
    kindergartenCount: 35,
    capacity: 2200,
    occupancy: 2100,
    manager: {
      id: '3',
      name: 'Maria Nilsen',
      email: 'maria.nilsen@oslo.kommune.no',
      role: 'district-manager',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    coordinatorEmail: 'st-hanshaugen@oslo.kommune.no',
    coordinatorPhone: '+47 23 46 16 03',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
])

// Computed
const filteredDistricts = computed(() => {
  if (!searchQuery.value) return districts.value
  return districts.value.filter(district =>
    district.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    district.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalDistricts = computed(() => districts.value.length)
const totalKindergartens = computed(() =>
  districts.value.reduce((sum, d) => sum + d.kindergartenCount, 0)
)
const totalCapacity = computed(() =>
  districts.value.reduce((sum, d) => sum + d.capacity, 0)
)
const totalOccupancy = computed(() =>
  districts.value.reduce((sum, d) => sum + d.occupancy, 0)
)
const occupancyRate = computed(() =>
  (totalOccupancy.value / totalCapacity.value) * 100
)
const avgUtilization = computed(() => {
  const utilizations = districts.value.map(d => (d.occupancy / d.capacity) * 100)
  return Math.round(utilizations.reduce((sum, u) => sum + u, 0) / utilizations.length)
})

// Methods
const loadDistricts = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Data already loaded in mock
  } finally {
    loading.value = false
  }
}

const viewDistrict = (district: District) => {
  selectedDistrict.value = district
  showDetailsDialog.value = true
}

const editDistrict = (district: District) => {
  editingDistrict.value = district
  districtForm.value = {
    name: district.name,
    code: district.code,
    coordinatorEmail: district.coordinatorEmail || '',
    coordinatorPhone: district.coordinatorPhone || ''
  }
  showEditDialog.value = true
}

const editSelectedDistrict = () => {
  if (selectedDistrict.value) {
    editDistrict(selectedDistrict.value)
    showDetailsDialog.value = false
  }
}

const createDistrict = () => {
  editingDistrict.value = null
  districtForm.value = {
    name: '',
    code: '',
    coordinatorEmail: '',
    coordinatorPhone: ''
  }
  showEditDialog.value = true
}

const saveDistrict = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingDistrict.value) {
      // Update existing district
      Object.assign(editingDistrict.value, districtForm.value)
    } else {
      // Create new district
      const newDistrict: District = {
        id: String(Date.now()),
        ...districtForm.value,
        kindergartenCount: 0,
        capacity: 0,
        occupancy: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      districts.value.push(newDistrict)
    }

    showEditDialog.value = false
    toast.add({
      severity: 'success',
      summary: editingDistrict.value ? 'District Updated' : 'District Created',
      detail: `District "${districtForm.value.name}" has been ${editingDistrict.value ? 'updated' : 'created'}`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save district',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const viewAnalytics = (district: District) => {
  router.push(`/admin/analytics/district/${district.id}`)
}

// Initialize
onMounted(() => {
  loadDistricts()
})
</script>

<style scoped>
.districts-admin {
  @apply p-6 max-w-7xl mx-auto;
}

.custom-success :deep(.p-progressbar-value) {
  @apply bg-green-500;
}

.custom-warning :deep(.p-progressbar-value) {
  @apply bg-yellow-500;
}

.custom-danger :deep(.p-progressbar-value) {
  @apply bg-red-500;
}
</style>
