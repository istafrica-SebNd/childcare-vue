<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Skeleton from 'primevue/skeleton'
import Chip from 'primevue/chip'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

interface Application {
  id: string
  childName: string
  childAge: number
  guardianName: string
  guardianEmail: string
  guardianPhone: string
  submittedDate: string
  district: string
  status: string
  priority: string
  kindergartenPreferences: string[]
  specialNeeds: boolean
  siblingInKindergarten: boolean
  lastUpdate: string
}

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()
const toast = useToast()
const isLoading = ref(false)

// Filters and search
const searchTerm = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const activeTab = ref(0)

// Dialog states
const workflowDialogOpen = ref(false)
const placementDialogOpen = ref(false)
const selectedApplication = ref<Application | null>(null)

// Mock applications data
const applications = ref([
  {
    id: 'APP-2024-001',
    childName: 'Emma Larsen',
    childAge: 3,
    guardianName: 'Maria Larsen',
    guardianEmail: 'maria.larsen@email.com',
    guardianPhone: '+47 123 45 678',
    submittedDate: '2024-03-18',
    district: 'Grünerløkka',
    status: 'new',
    priority: 'normal',
    kindergartenPreferences: ['Løvenskiold Kindergarten', 'Sinsen Kindergarten'],
    specialNeeds: false,
    siblingInKindergarten: false,
    lastUpdate: '2024-03-18'
  },
  {
    id: 'APP-2024-002',
    childName: 'Oliver Hansen',
    childAge: 4,
    guardianName: 'Anna Hansen',
    guardianEmail: 'anna.hansen@email.com',
    guardianPhone: '+47 987 65 432',
    submittedDate: '2024-03-15',
    district: 'Søndre Nordstrand',
    status: 'underReview',
    priority: 'high',
    kindergartenPreferences: ['Bjølsen Kindergarten', 'Sagene Kindergarten'],
    specialNeeds: true,
    siblingInKindergarten: true,
    lastUpdate: '2024-03-17'
  },
  {
    id: 'APP-2024-003',
    childName: 'Sofia Andersen',
    childAge: 2,
    guardianName: 'Erik Andersen',
    guardianEmail: 'erik.andersen@email.com',
    guardianPhone: '+47 456 78 901',
    submittedDate: '2024-03-10',
    district: 'Frogner',
    status: 'missingDocuments',
    priority: 'high',
    kindergartenPreferences: ['Vårtun Kindergarten'],
    specialNeeds: false,
    siblingInKindergarten: false,
    lastUpdate: '2024-03-12'
  }
])

// Filter options
const statusOptions = [
  { label: t('common.all', 'All'), value: 'all' },
  { label: t('caseworker.reviewQueue.new', 'New'), value: 'new' },
  { label: t('caseworker.reviewQueue.underReview', 'Under Review'), value: 'underReview' },
  { label: t('caseworker.reviewQueue.missingDocs', 'Missing Documents'), value: 'missingDocuments' }
]

const priorityOptions = [
  { label: t('common.all', 'All'), value: 'all' },
  { label: t('caseworker.reviewQueue.highPriority', 'High Priority'), value: 'high' },
  { label: t('caseworker.reviewQueue.normalPriority', 'Normal'), value: 'normal' },
  { label: t('caseworker.reviewQueue.lowPriority', 'Low'), value: 'low' }
]

// Computed properties
const stats = computed(() => ({
  total: applications.value.length,
  new: applications.value.filter(app => app.status === 'new').length,
  underReview: applications.value.filter(app => app.status === 'underReview').length,
  missingDocs: applications.value.filter(app => app.status === 'missingDocuments').length,
  avgProcessing: 12
}))

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const matchesSearch =
      app.childName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      app.guardianName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.value.toLowerCase())

    const matchesStatus = statusFilter.value === 'all' || app.status === statusFilter.value
    const matchesPriority = priorityFilter.value === 'all' || app.priority === priorityFilter.value

    return matchesSearch && matchesStatus && matchesPriority
  })
})

// Helper functions
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return { severity: 'info', label: t('caseworker.reviewQueue.new', 'New') }
    case 'underReview':
      return { severity: 'warning', label: t('caseworker.reviewQueue.underReview', 'Under Review') }
    case 'missingDocuments':
      return { severity: 'danger', label: t('caseworker.reviewQueue.missingDocs', 'Missing Documents') }
    default:
      return { severity: 'secondary', label: 'Unknown' }
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return { severity: 'danger', label: t('caseworker.reviewQueue.highPriority', 'High Priority') }
    case 'normal':
      return { severity: 'info', label: t('caseworker.reviewQueue.normalPriority', 'Normal') }
    case 'low':
      return { severity: 'success', label: t('caseworker.reviewQueue.lowPriority', 'Low Priority') }
    default:
      return { severity: 'secondary', label: 'Unknown' }
  }
}

const clearFilters = () => {
  searchTerm.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  toast.add({ severity: 'success', summary: 'Success', detail: 'Filters cleared', life: 3000 })
}

// Action handlers
const handleStatusChange = async (applicationId: string, newStatus: string, reason?: string) => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Changing status for ${applicationId} to ${newStatus}`, reason)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Application status updated to ${newStatus}`,
      life: 3000
    })
    workflowDialogOpen.value = false
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update application status',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const handleBatchAction = async (applicationIds: string[], action: string) => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(`Batch action ${action} for applications:`, applicationIds)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Batch action "${action}" completed for ${applicationIds.length} applications`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to execute batch action',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const openWorkflowDialog = (application: Application) => {
  selectedApplication.value = application
  workflowDialogOpen.value = true
}

const openPlacementDialog = (application: Application) => {
  selectedApplication.value = application
  placementDialogOpen.value = true
}

const handleApplicationClick = (applicationId: string) => {
  router.push(`/caseworker/application/${applicationId}`)
}

const handleContactGuardian = (app: Application) => {
  router.push(`/caseworker/messages?contact=${app.guardianEmail}`)
}

const handleQuickAction = async (action: string) => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))

    switch (action) {
      case 'approve-all-eligible':
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'All eligible applications have been approved',
          life: 3000
        })
        break
      case 'request-missing-docs':
        toast.add({
          severity: 'info',
          summary: 'Sent',
          detail: 'Document requests sent to guardians',
          life: 3000
        })
        break
      case 'generate-report':
        toast.add({
          severity: 'success',
          summary: 'Generated',
          detail: 'Processing report has been generated',
          life: 3000
        })
        break
      case 'export-queue':
        toast.add({
          severity: 'success',
          summary: 'Exported',
          detail: 'Queue data exported successfully',
          life: 3000
        })
        break
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to execute action',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Initialize any needed data
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
          {{ t('caseworker.reviewQueue.title', 'Application Review Queue') }}
        </h1>
        <p class="text-gray-600">
          {{ t('caseworker.reviewQueue.description', 'Review and process kindergarten applications') }}
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <Button
          outlined
          :loading="isLoading"
          @click="handleQuickAction('generate-report')"
        >
          <i class="pi pi-chart-bar mr-2"></i>
          {{ t('caseworker.reviewQueue.generateReport', 'Generate Report') }}
        </Button>
        <Button
          :loading="isLoading"
          @click="handleQuickAction('approve-all-eligible')"
        >
          <i class="pi pi-check mr-2"></i>
          {{ t('caseworker.reviewQueue.quickApprove', 'Quick Approve') }}
        </Button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="bg-blue-50 border-l-4 border-l-blue-500">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 font-medium">{{ t('common.total', 'Total') }}</p>
                <p class="text-3xl font-bold text-blue-900">{{ stats.total }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-folder text-white text-xl"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-yellow-50 border-l-4 border-l-yellow-500">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-yellow-600 font-medium">{{ t('caseworker.reviewQueue.new', 'New') }}</p>
                <p class="text-3xl font-bold text-yellow-900">{{ stats.new }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-plus-circle text-white text-xl"></i>
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
                <p class="text-sm text-orange-600 font-medium">{{ t('caseworker.reviewQueue.underReview', 'Under Review') }}</p>
                <p class="text-3xl font-bold text-orange-900">{{ stats.underReview }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-clock text-white text-xl"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-red-50 border-l-4 border-l-red-500">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-red-600 font-medium">{{ t('caseworker.reviewQueue.missingDocs', 'Missing Docs') }}</p>
                <p class="text-3xl font-bold text-red-900">{{ stats.missingDocs }}</p>
              </div>
              <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <i class="pi pi-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Filters and Search -->
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
                :placeholder="t('caseworker.reviewQueue.searchPlaceholder', 'Search applications...')"
                class="w-full"
              >
                <template #prefix>
                  <i class="pi pi-search text-gray-400"></i>
                </template>
              </InputText>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('common.status', 'Status') }}
              </label>
              <Dropdown
                v-model="statusFilter"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('common.priority', 'Priority') }}
              </label>
              <Dropdown
                v-model="priorityFilter"
                :options="priorityOptions"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>
            <div class="flex gap-2">
              <Button @click="clearFilters" outlined class="flex-1">
                <i class="pi pi-filter-slash mr-2"></i>
                {{ t('common.clear', 'Clear') }}
              </Button>
              <Button
                @click="handleQuickAction('export-queue')"
                outlined
                severity="secondary"
              >
                <i class="pi pi-download mr-2"></i>
                {{ t('common.export', 'Export') }}
              </Button>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Applications Table -->
    <Card>
      <template #header>
        <div class="px-6 pt-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ t('caseworker.reviewQueue.applications', 'Applications') }}
              <span class="text-gray-500">({{ filteredApplications.length }})</span>
            </h3>
            <div class="flex gap-2">
              <Button
                size="small"
                outlined
                @click="handleQuickAction('request-missing-docs')"
                :loading="isLoading"
              >
                <i class="pi pi-envelope mr-2"></i>
                {{ t('caseworker.reviewQueue.requestDocs', 'Request Docs') }}
              </Button>
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <div class="px-6 pb-6">
          <DataTable
            :value="filteredApplications"
            :paginator="true"
            :rows="10"
            :loading="isLoading"
            responsive-layout="scroll"
            class="p-datatable-sm"
          >
            <Column field="id" :header="t('common.id', 'ID')" sortable>
              <template #body="{ data }">
                <Button
                  :label="data.id"
                  link
                  @click="handleApplicationClick(data.id)"
                  class="font-mono text-blue-600"
                />
              </template>
            </Column>
            <Column field="childName" :header="t('common.child', 'Child')" sortable>
              <template #body="{ data }">
                <div>
                  <div class="font-semibold">{{ data.childName }}</div>
                  <div class="text-sm text-gray-500">{{ data.childAge }} years old</div>
                </div>
              </template>
            </Column>
            <Column field="guardianName" :header="t('common.guardian', 'Guardian')" sortable>
              <template #body="{ data }">
                <div>
                  <div class="font-medium">{{ data.guardianName }}</div>
                  <div class="text-sm text-gray-500">{{ data.guardianEmail }}</div>
                </div>
              </template>
            </Column>
            <Column field="district" :header="t('common.district', 'District')" sortable />
            <Column field="status" :header="t('common.status', 'Status')" sortable>
              <template #body="{ data }">
                <Badge
                  :severity="getStatusBadge(data.status).severity"
                  :value="getStatusBadge(data.status).label"
                />
              </template>
            </Column>
            <Column field="priority" :header="t('common.priority', 'Priority')" sortable>
              <template #body="{ data }">
                <Badge
                  :severity="getPriorityBadge(data.priority).severity"
                  :value="getPriorityBadge(data.priority).label"
                />
              </template>
            </Column>
            <Column field="submittedDate" :header="t('common.submitted', 'Submitted')" sortable>
              <template #body="{ data }">
                <div class="text-sm">{{ new Date(data.submittedDate).toLocaleDateString() }}</div>
              </template>
            </Column>
            <Column :header="t('common.actions', 'Actions')">
              <template #body="{ data }">
                <div class="flex gap-1">
                  <Button
                    size="small"
                    outlined
                    severity="secondary"
                    @click="handleApplicationClick(data.id)"
                  >
                    <i class="pi pi-eye"></i>
                  </Button>
                  <Button
                    size="small"
                    outlined
                    severity="secondary"
                    @click="openWorkflowDialog(data)"
                  >
                    <i class="pi pi-cog"></i>
                  </Button>
                  <Button
                    size="small"
                    outlined
                    severity="secondary"
                    @click="handleContactGuardian(data)"
                  >
                    <i class="pi pi-envelope"></i>
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- Workflow Dialog -->
    <Dialog
      v-model:visible="workflowDialogOpen"
      modal
      :header="t('caseworker.reviewQueue.updateStatus', 'Update Application Status')"
      :style="{ width: '500px' }"
    >
      <div v-if="selectedApplication" class="space-y-4">
        <div>
          <h4 class="font-semibold">{{ selectedApplication.childName }}</h4>
          <p class="text-sm text-gray-600">{{ selectedApplication.id }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('common.newStatus', 'New Status') }}
          </label>
          <Dropdown
            :options="statusOptions.filter(s => s.value !== 'all')"
            option-label="label"
            option-value="value"
            placeholder="Select status"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('common.reason', 'Reason') }}
          </label>
          <Textarea
            placeholder="Enter reason for status change..."
            rows="3"
            class="w-full"
          />
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button
            label="Cancel"
            outlined
            @click="workflowDialogOpen = false"
          />
          <Button
            label="Update Status"
            @click="handleStatusChange(selectedApplication.id, 'approved')"
            :loading="isLoading"
          />
        </div>
      </div>
    </Dialog>

    <!-- Placement Dialog -->
    <Dialog
      v-model:visible="placementDialogOpen"
      modal
      :header="t('caseworker.reviewQueue.managePlacement', 'Manage Placement')"
      :style="{ width: '600px' }"
    >
      <div v-if="selectedApplication" class="space-y-4">
        <div>
          <h4 class="font-semibold">{{ selectedApplication.childName }}</h4>
          <p class="text-sm text-gray-600">{{ selectedApplication.id }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('caseworker.reviewQueue.preferences', 'Kindergarten Preferences') }}
          </label>
          <div class="space-y-2">
            <Chip
              v-for="(preference, index) in selectedApplication.kindergartenPreferences"
              :key="index"
              :label="`${index + 1}. ${preference}`"
              class="mr-2"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button
            label="Cancel"
            outlined
            @click="placementDialogOpen = false"
          />
          <Button
            label="Assign Placement"
            @click="placementDialogOpen = false"
          />
        </div>
      </div>
    </Dialog>
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

:deep(.p-button-link) {
  color: #2563eb;
  text-decoration: none;
}

:deep(.p-button-link:hover) {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
