<template>
  <BaseLayout>
    <template #content>
      <div class="policies-admin">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Policy Management</h1>
            <p class="mt-1 text-gray-600">
              Define municipality-wide policies and compliance rules
            </p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              :loading="loading"
              @click="loadPolicies"
              class="p-button-outlined"
            />
            <Button
              icon="pi pi-plus"
              label="New Policy"
              @click="createPolicy"
              class="p-button-primary"
            />
          </div>
        </div>

        <!-- Policy Categories -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card class="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer hover:shadow-xl transition-shadow" @click="filterByCategory('admission')">
            <template #content>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-700">{{ admissionPolicies }}</div>
                <div class="text-sm text-blue-600 mt-1">Admission Policies</div>
                <div class="text-xs text-blue-500 mt-1">Application rules</div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 cursor-pointer hover:shadow-xl transition-shadow" @click="filterByCategory('placement')">
            <template #content>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-700">{{ placementPolicies }}</div>
                <div class="text-sm text-green-600 mt-1">Placement Policies</div>
                <div class="text-xs text-green-500 mt-1">Allocation rules</div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 cursor-pointer hover:shadow-xl transition-shadow" @click="filterByCategory('operational')">
            <template #content>
              <div class="text-center">
                <div class="text-3xl font-bold text-orange-700">{{ operationalPolicies }}</div>
                <div class="text-sm text-orange-600 mt-1">Operational Policies</div>
                <div class="text-xs text-orange-500 mt-1">Daily operations</div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 cursor-pointer hover:shadow-xl transition-shadow" @click="filterByCategory('compliance')">
            <template #content>
              <div class="text-center">
                <div class="text-3xl font-bold text-purple-700">{{ compliancePolicies }}</div>
                <div class="text-sm text-purple-600 mt-1">Compliance Policies</div>
                <div class="text-xs text-purple-500 mt-1">Legal requirements</div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Policies List -->
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-flag text-blue-600"></i>
                Policy Library
              </div>
              <div class="flex gap-2">
                <Dropdown
                  v-model="selectedCategory"
                  :options="categoryOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Filter by category"
                  class="w-48"
                  show-clear
                />
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="searchQuery"
                    placeholder="Search policies..."
                    class="w-64"
                  />
                </span>
              </div>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div
                v-for="policy in filteredPolicies"
                :key="policy.id"
                class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-semibold text-gray-900">{{ policy.title }}</h3>
                      <Tag
                        :value="policy.category"
                        :class="{
                          'p-tag-info': policy.category === 'admission',
                          'p-tag-success': policy.category === 'placement',
                          'p-tag-warning': policy.category === 'operational',
                          'p-tag-danger': policy.category === 'compliance'
                        }"
                      />
                      <Tag
                        :value="policy.status"
                        :severity="policy.status === 'active' ? 'success' :
                                  policy.status === 'draft' ? 'warning' : 'secondary'"
                      />
                      <Tag
                        v-if="policy.mandatory"
                        value="MANDATORY"
                        severity="danger"
                      />
                    </div>
                    <p class="text-gray-600 text-sm mb-3">{{ policy.description }}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                      <span>Version: {{ policy.version }}</span>
                      <span>Effective: {{ formatDate(policy.effectiveDate) }}</span>
                      <span v-if="policy.expiryDate">Expires: {{ formatDate(policy.expiryDate) }}</span>
                      <span>Updated: {{ formatDate(policy.updatedAt) }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 ml-4">
                    <Button
                      icon="pi pi-eye"
                      class="p-button-sm p-button-outlined"
                      @click="viewPolicy(policy)"
                      v-tooltip="'View Policy'"
                    />
                    <Button
                      icon="pi pi-pencil"
                      class="p-button-sm p-button-outlined"
                      @click="editPolicy(policy)"
                      v-tooltip="'Edit Policy'"
                    />
                    <Button
                      icon="pi pi-copy"
                      class="p-button-sm p-button-outlined"
                      @click="duplicatePolicy(policy)"
                      v-tooltip="'Duplicate Policy'"
                    />
                    <Button
                      icon="pi pi-download"
                      class="p-button-sm p-button-outlined"
                      @click="downloadPolicy(policy)"
                      v-tooltip="'Download PDF'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Policy Details Dialog -->
        <Dialog
          v-model:visible="showDetailsDialog"
          :style="{ width: '900px' }"
          header="Policy Details"
          :modal="true"
          maximizable
        >
          <div v-if="selectedPolicy" class="space-y-6">
            <!-- Header Info -->
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-xl font-bold">{{ selectedPolicy.title }}</h2>
                <p class="text-gray-600 mt-1">{{ selectedPolicy.description }}</p>
              </div>
              <div class="flex gap-2">
                <Tag
                  :value="selectedPolicy.category"
                  :class="{
                    'p-tag-info': selectedPolicy.category === 'admission',
                    'p-tag-success': selectedPolicy.category === 'placement',
                    'p-tag-warning': selectedPolicy.category === 'operational',
                    'p-tag-danger': selectedPolicy.category === 'compliance'
                  }"
                />
                <Tag
                  :value="selectedPolicy.status"
                  :severity="selectedPolicy.status === 'active' ? 'success' :
                            selectedPolicy.status === 'draft' ? 'warning' : 'secondary'"
                />
              </div>
            </div>

            <!-- Metadata -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-3">Policy Information</h3>
                <div class="space-y-2 text-sm">
                  <div><strong>Version:</strong> {{ selectedPolicy.version }}</div>
                  <div><strong>Policy ID:</strong> {{ selectedPolicy.policyId }}</div>
                  <div><strong>Mandatory:</strong> {{ selectedPolicy.mandatory ? 'Yes' : 'No' }}</div>
                  <div><strong>Effective Date:</strong> {{ formatDate(selectedPolicy.effectiveDate) }}</div>
                  <div v-if="selectedPolicy.expiryDate"><strong>Expiry Date:</strong> {{ formatDate(selectedPolicy.expiryDate) }}</div>
                </div>
              </div>
              <div>
                <h3 class="font-semibold mb-3">Approval Information</h3>
                <div class="space-y-2 text-sm">
                  <div><strong>Approved By:</strong> {{ selectedPolicy.approvedBy || 'Pending' }}</div>
                  <div><strong>Approval Date:</strong> {{ selectedPolicy.approvalDate ? formatDate(selectedPolicy.approvalDate) : 'Pending' }}</div>
                  <div><strong>Review Date:</strong> {{ selectedPolicy.reviewDate ? formatDate(selectedPolicy.reviewDate) : 'Not set' }}</div>
                </div>
              </div>
            </div>

            <!-- Policy Content -->
            <div>
              <h3 class="font-semibold mb-3">Policy Content</h3>
              <div class="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <div class="prose prose-sm max-w-none">
                  <div v-html="selectedPolicy.content"></div>
                </div>
              </div>
            </div>

            <!-- Attachments -->
            <div v-if="selectedPolicy.attachments && selectedPolicy.attachments.length > 0">
              <h3 class="font-semibold mb-3">Attachments</h3>
              <div class="space-y-2">
                <div
                  v-for="attachment in selectedPolicy.attachments"
                  :key="attachment.id"
                  class="flex items-center gap-3 p-2 border rounded"
                >
                  <i class="pi pi-file text-blue-600"></i>
                  <span class="flex-1">{{ attachment.name }}</span>
                  <span class="text-sm text-gray-500">{{ attachment.size }}</span>
                  <Button
                    icon="pi pi-download"
                    class="p-button-sm p-button-text"
                    @click="downloadAttachment(attachment)"
                  />
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
              label="Edit Policy"
              icon="pi pi-pencil"
              @click="editSelectedPolicy"
            />
          </template>
        </Dialog>

        <!-- Create/Edit Policy Dialog -->
        <Dialog
          v-model:visible="showEditDialog"
          :style="{ width: '800px' }"
          :header="editingPolicy ? 'Edit Policy' : 'Create Policy'"
          :modal="true"
          class="p-fluid"
          maximizable
        >
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Policy Title</label>
                <InputText
                  v-model="policyForm.title"
                  placeholder="Enter policy title"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Policy ID</label>
                <InputText
                  v-model="policyForm.policyId"
                  placeholder="POL-001"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                v-model="policyForm.description"
                rows="3"
                placeholder="Brief description of the policy"
              />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Dropdown
                  v-model="policyForm.category"
                  :options="categoryOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select category"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Dropdown
                  v-model="policyForm.status"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select status"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Version</label>
                <InputText
                  v-model="policyForm.version"
                  placeholder="1.0"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                <Calendar
                  v-model="policyForm.effectiveDate"
                  date-format="yy-mm-dd"
                  placeholder="Select effective date"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                <Calendar
                  v-model="policyForm.expiryDate"
                  date-format="yy-mm-dd"
                  placeholder="Select expiry date"
                  show-clear
                />
              </div>
            </div>

            <div>
              <div class="flex items-center gap-3">
                <InputSwitch
                  v-model="policyForm.mandatory"
                  input-id="policy-mandatory"
                />
                <label for="policy-mandatory" class="text-sm font-medium text-gray-700">
                  Mandatory Policy
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Mandatory policies must be acknowledged by all affected users
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Policy Content</label>
              <Textarea
                v-model="policyForm.content"
                rows="10"
                placeholder="Enter the full policy content here..."
              />
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
              :label="editingPolicy ? 'Update' : 'Create'"
              icon="pi pi-check"
              :loading="saving"
              @click="savePolicy"
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
import { useToast } from 'primevue/usetoast'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import InputSwitch from 'primevue/inputswitch'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'

const toast = useToast()

// Types
interface Policy {
  id: string
  title: string
  description: string
  category: 'admission' | 'placement' | 'operational' | 'compliance'
  status: 'active' | 'draft' | 'archived'
  version: string
  policyId: string
  mandatory: boolean
  effectiveDate: string
  expiryDate?: string
  content: string
  approvedBy?: string
  approvalDate?: string
  reviewDate?: string
  attachments?: Array<{
    id: string
    name: string
    size: string
  }>
  createdAt: string
  updatedAt: string
}

// State
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const selectedCategory = ref(null)
const showDetailsDialog = ref(false)
const showEditDialog = ref(false)
const selectedPolicy = ref<Policy | null>(null)
const editingPolicy = ref<Policy | null>(null)

// Form data
const policyForm = ref({
  title: '',
  description: '',
  category: 'admission' as const,
  status: 'draft' as const,
  version: '1.0',
  policyId: '',
  mandatory: false,
  effectiveDate: null as Date | null,
  expiryDate: null as Date | null,
  content: ''
})

// Options
const categoryOptions = [
  { label: 'All Categories', value: null },
  { label: 'Admission', value: 'admission' },
  { label: 'Placement', value: 'placement' },
  { label: 'Operational', value: 'operational' },
  { label: 'Compliance', value: 'compliance' }
]

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' }
]

// Mock data
const policies = ref<Policy[]>([
  {
    id: '1',
    title: 'Kindergarten Admission Criteria',
    description: 'Defines the criteria and process for kindergarten admissions across Oslo',
    category: 'admission',
    status: 'active',
    version: '2.1',
    policyId: 'POL-ADM-001',
    mandatory: true,
    effectiveDate: '2024-01-01',
    content: '<h2>Admission Criteria</h2><p>Children residing in Oslo municipality have priority for admission...</p>',
    approvedBy: 'Oslo Municipality Board',
    approvalDate: '2023-12-15',
    reviewDate: '2024-12-31',
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Placement Priority Rules',
    description: 'Guidelines for placement prioritization and allocation',
    category: 'placement',
    status: 'active',
    version: '1.5',
    policyId: 'POL-PLC-002',
    mandatory: true,
    effectiveDate: '2024-02-01',
    content: '<h2>Priority Rules</h2><p>Siblings receive priority for placement in the same kindergarten...</p>',
    approvedBy: 'Child Services Director',
    approvalDate: '2024-01-20',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Daily Operations Standard',
    description: 'Standard operating procedures for kindergarten daily operations',
    category: 'operational',
    status: 'active',
    version: '3.0',
    policyId: 'POL-OPS-003',
    mandatory: false,
    effectiveDate: '2024-03-01',
    content: '<h2>Daily Operations</h2><p>Kindergartens must maintain a child-to-staff ratio of...</p>',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'GDPR Data Protection Policy',
    description: 'Data protection and privacy compliance for child and family data',
    category: 'compliance',
    status: 'active',
    version: '1.2',
    policyId: 'POL-GDP-004',
    mandatory: true,
    effectiveDate: '2024-01-15',
    content: '<h2>Data Protection</h2><p>All personal data must be processed in accordance with GDPR...</p>',
    approvedBy: 'Data Protection Officer',
    approvalDate: '2024-01-10',
    attachments: [
      { id: '1', name: 'GDPR_Compliance_Checklist.pdf', size: '245 KB' },
      { id: '2', name: 'Data_Retention_Schedule.xlsx', size: '156 KB' }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
])

// Computed
const filteredPolicies = computed(() => {
  let filtered = policies.value

  if (selectedCategory.value) {
    filtered = filtered.filter(policy => policy.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(policy =>
      policy.title.toLowerCase().includes(query) ||
      policy.description.toLowerCase().includes(query) ||
      policy.policyId.toLowerCase().includes(query)
    )
  }

  return filtered
})

const admissionPolicies = computed(() =>
  policies.value.filter(p => p.category === 'admission').length
)
const placementPolicies = computed(() =>
  policies.value.filter(p => p.category === 'placement').length
)
const operationalPolicies = computed(() =>
  policies.value.filter(p => p.category === 'operational').length
)
const compliancePolicies = computed(() =>
  policies.value.filter(p => p.category === 'compliance').length
)

// Methods
const loadPolicies = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Data already loaded in mock
  } finally {
    loading.value = false
  }
}

const filterByCategory = (category: string) => {
  selectedCategory.value = category
}

const viewPolicy = (policy: Policy) => {
  selectedPolicy.value = policy
  showDetailsDialog.value = true
}

const editPolicy = (policy: Policy) => {
  editingPolicy.value = policy
  policyForm.value = {
    title: policy.title,
    description: policy.description,
    category: policy.category,
    status: policy.status,
    version: policy.version,
    policyId: policy.policyId,
    mandatory: policy.mandatory,
    effectiveDate: new Date(policy.effectiveDate),
    expiryDate: policy.expiryDate ? new Date(policy.expiryDate) : null,
    content: policy.content
  }
  showEditDialog.value = true
}

const editSelectedPolicy = () => {
  if (selectedPolicy.value) {
    editPolicy(selectedPolicy.value)
    showDetailsDialog.value = false
  }
}

const createPolicy = () => {
  editingPolicy.value = null
  policyForm.value = {
    title: '',
    description: '',
    category: 'admission',
    status: 'draft',
    version: '1.0',
    policyId: '',
    mandatory: false,
    effectiveDate: null,
    expiryDate: null,
    content: ''
  }
  showEditDialog.value = true
}

const savePolicy = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const policyData = {
      ...policyForm.value,
      effectiveDate: policyForm.value.effectiveDate?.toISOString().split('T')[0] || '',
      expiryDate: policyForm.value.expiryDate?.toISOString().split('T')[0] || undefined
    }

    if (editingPolicy.value) {
      // Update existing policy
      Object.assign(editingPolicy.value, policyData, {
        updatedAt: new Date().toISOString()
      })
    } else {
      // Create new policy
      const newPolicy: Policy = {
        id: String(Date.now()),
        ...policyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      policies.value.push(newPolicy)
    }

    showEditDialog.value = false
    toast.add({
      severity: 'success',
      summary: editingPolicy.value ? 'Policy Updated' : 'Policy Created',
      detail: `Policy "${policyForm.value.title}" has been ${editingPolicy.value ? 'updated' : 'created'}`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save policy',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const duplicatePolicy = (policy: Policy) => {
  const duplicated: Policy = {
    ...policy,
    id: String(Date.now()),
    title: `${policy.title} (Copy)`,
    policyId: `${policy.policyId}-COPY`,
    status: 'draft',
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  policies.value.push(duplicated)

  toast.add({
    severity: 'success',
    summary: 'Policy Duplicated',
    detail: `Policy "${policy.title}" has been duplicated`,
    life: 3000
  })
}

const downloadPolicy = (policy: Policy) => {
  toast.add({
    severity: 'info',
    summary: 'Download Started',
    detail: `Downloading policy "${policy.title}" as PDF`,
    life: 3000
  })
}

const downloadAttachment = (attachment: any) => {
  toast.add({
    severity: 'info',
    summary: 'Download Started',
    detail: `Downloading ${attachment.name}`,
    life: 3000
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('no-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Initialize
onMounted(() => {
  loadPolicies()
})
</script>

<style scoped>
.policies-admin {
  @apply p-6 max-w-7xl mx-auto;
}

.prose h2 {
  @apply text-lg font-semibold mb-2;
}

.prose p {
  @apply mb-2;
}
</style>
