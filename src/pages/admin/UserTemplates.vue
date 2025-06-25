<template>
  <BaseLayout>
    <template #content>
      <div class="user-templates">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">User Templates</h1>
            <p class="mt-1 text-gray-600">
              Manage user role templates and permission sets
            </p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              :loading="loading"
              @click="loadData"
              class="p-button-outlined"
            />
            <Button
              icon="pi pi-plus"
              label="New Template"
              @click="createTemplate"
              class="p-button-primary"
            />
          </div>
        </div>

        <!-- Templates Table -->
        <Card>
          <template #content>
            <DataTable
              :value="templates"
              :loading="loading"
              :paginator="true"
              :rows="10"
              responsive-layout="scroll"
              class="p-datatable-sm"
              v-model:filters="filters"
              filter-display="menu"
            >
              <template #header>
                <div class="flex justify-between">
                  <h2 class="text-lg font-semibold">User Role Templates</h2>
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Search templates..."
                    />
                  </span>
                </div>
              </template>

              <Column field="name" header="Template Name" sortable>
                <template #body="{ data }">
                  <div class="font-medium">{{ data.name }}</div>
                  <div class="text-sm text-gray-500">{{ data.description }}</div>
                </template>
              </Column>

              <Column field="role" header="Role" sortable>
                <template #body="{ data }">
                  <Tag
                    :value="data.role"
                    :class="{
                      'p-tag-info': data.role === 'guardian',
                      'p-tag-success': data.role === 'case_manager',
                      'p-tag-warning': data.role === 'kindergarten_staff',
                      'p-tag-danger': data.role === 'admin'
                    }"
                  />
                </template>
              </Column>

              <Column field="permissions" header="Permissions">
                <template #body="{ data }">
                  <div class="text-sm">
                    {{ data.permissions.length }} permissions
                  </div>
                </template>
              </Column>

              <Column field="usageCount" header="Usage" sortable>
                <template #body="{ data }">
                  <div class="text-center">{{ data.usageCount || 0 }}</div>
                </template>
              </Column>

              <Column field="isActive" header="Status">
                <template #body="{ data }">
                  <Tag
                    :value="data.isActive ? 'Active' : 'Inactive'"
                    :severity="data.isActive ? 'success' : 'secondary'"
                  />
                </template>
              </Column>

              <Column header="Actions">
                <template #body="{ data }">
                  <div class="flex gap-2">
                    <Button
                      icon="pi pi-eye"
                      class="p-button-sm p-button-outlined"
                      @click="viewTemplate(data)"
                      v-tooltip="'View Details'"
                    />
                    <Button
                      icon="pi pi-pencil"
                      class="p-button-sm p-button-outlined"
                      @click="editTemplate(data)"
                      v-tooltip="'Edit Template'"
                    />
                    <Button
                      icon="pi pi-trash"
                      class="p-button-sm p-button-outlined p-button-danger"
                      @click="deleteTemplate(data)"
                      v-tooltip="'Delete Template'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>

        <!-- Template Details Dialog -->
        <Dialog
          v-model:visible="showDetailsDialog"
          :style="{ width: '600px' }"
          header="Template Details"
          :modal="true"
        >
          <div v-if="selectedTemplate" class="space-y-4">
            <div>
              <h3 class="font-semibold text-lg">{{ selectedTemplate.name }}</h3>
              <p class="text-gray-600">{{ selectedTemplate.description }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Tag :value="selectedTemplate.role" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Tag
                  :value="selectedTemplate.isActive ? 'Active' : 'Inactive'"
                  :severity="selectedTemplate.isActive ? 'success' : 'secondary'"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div class="space-y-1 max-h-48 overflow-y-auto">
                <div
                  v-for="permission in selectedTemplate.permissions"
                  :key="permission"
                  class="text-sm bg-gray-100 px-2 py-1 rounded"
                >
                  {{ permission }}
                </div>
              </div>
            </div>

            <div v-if="selectedTemplate.usageCount">
              <label class="block text-sm font-medium text-gray-700 mb-1">Usage Statistics</label>
              <div class="text-sm text-gray-600">
                Used by {{ selectedTemplate.usageCount }} users
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
              label="Edit Template"
              icon="pi pi-pencil"
              @click="editSelectedTemplate"
            />
          </template>
        </Dialog>

        <!-- Confirmation Dialog -->
        <ConfirmDialog />
        <Toast />
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { FilterMatchMode } from 'primevue/api'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import type { UserTemplate } from '@/types/admin'
import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

// State
const loading = ref(false)
const templates = ref<UserTemplate[]>([])
const selectedTemplate = ref<UserTemplate | null>(null)
const showDetailsDialog = ref(false)

// Table filters
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// Mock data
const mockTemplates: UserTemplate[] = [
  {
    id: '1',
    name: 'Guardian Template',
    description: 'Standard permissions for guardians/parents',
    role: 'guardian',
    permissions: ['view:application', 'create:application', 'view:child', 'update:child'],
    defaultSettings: { notifications: true },
    isActive: true,
    usageCount: 8429,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    name: 'Case Manager Template',
    description: 'Permissions for case managers handling applications',
    role: 'case_manager',
    permissions: ['view:application', 'update:application', 'create:offer', 'manage:waitlist'],
    defaultSettings: { workload: 50 },
    isActive: true,
    usageCount: 156,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10'
  },
  {
    id: '3',
    name: 'Kindergarten Staff Template',
    description: 'Basic permissions for kindergarten staff',
    role: 'kindergarten_staff',
    permissions: ['view:children', 'update:attendance', 'view:capacity'],
    defaultSettings: { schedule: 'standard' },
    isActive: true,
    usageCount: 892,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28'
  },
  {
    id: '4',
    name: 'System Administrator',
    description: 'Full system administration permissions',
    role: 'admin',
    permissions: ['*'],
    // defaultSettings: { theme: 'admin' },
    isActive: true,
    usageCount: 12,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-18'
  }
]

// Methods
const loadData = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    templates.value = mockTemplates
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Load Failed',
      detail: 'Failed to load user templates',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const viewTemplate = (template: UserTemplate) => {
  selectedTemplate.value = template
  showDetailsDialog.value = true
}

const editTemplate = (template: UserTemplate) => {
  router.push(`/admin/user-templates/${template.id}/edit`)
}

const editSelectedTemplate = () => {
  if (selectedTemplate.value) {
    router.push(`/admin/user-templates/${selectedTemplate.value.id}/edit`)
  }
}

const createTemplate = () => {
  router.push('/admin/user-templates/new')
}

const deleteTemplate = (template: UserTemplate) => {
  confirm.require({
    message: `Are you sure you want to delete the template "${template.name}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      // Simulate API call
      const index = templates.value.findIndex(t => t.id === template.id)
      if (index > -1) {
        templates.value.splice(index, 1)
        toast.add({
          severity: 'success',
          summary: 'Template Deleted',
          detail: `Template "${template.name}" has been deleted`,
          life: 3000
        })
      }
    }
  })
}

// Initialize
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-templates {
  @apply p-6 max-w-7xl mx-auto;
}
</style>
