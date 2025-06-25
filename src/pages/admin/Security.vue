<template>
  <BaseLayout>
    <template #content>
      <div class="security-admin">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Security & Compliance</h1>
            <p class="mt-1 text-gray-600">
              GDPR compliance, audit logs, and security monitoring
            </p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              :loading="loading"
              @click="loadSecurityData"
              class="p-button-outlined"
            />
            <Button
              icon="pi pi-download"
              label="Export Audit Log"
              @click="exportAuditLog"
              class="p-button-primary"
            />
          </div>
        </div>

        <!-- Security Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card class="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-green-700">98.7%</div>
                  <div class="text-sm text-green-600 mt-1">GDPR Compliance</div>
                  <div class="text-xs text-green-500 mt-1">Last audit: 2 days ago</div>
                </div>
                <div class="w-14 h-14 bg-green-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-shield text-green-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-blue-700">{{ auditLogCount }}</div>
                  <div class="text-sm text-blue-600 mt-1">Audit Entries</div>
                  <div class="text-xs text-blue-500 mt-1">Last 30 days</div>
                </div>
                <div class="w-14 h-14 bg-blue-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-history text-blue-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-orange-700">{{ securityIncidents }}</div>
                  <div class="text-sm text-orange-600 mt-1">Security Incidents</div>
                  <div class="text-xs text-orange-500 mt-1">This month</div>
                </div>
                <div class="w-14 h-14 bg-orange-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-exclamation-triangle text-orange-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <template #content>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold text-purple-700">{{ dataRequests }}</div>
                  <div class="text-sm text-purple-600 mt-1">Data Requests</div>
                  <div class="text-xs text-purple-500 mt-1">Pending processing</div>
                </div>
                <div class="w-14 h-14 bg-purple-200 rounded-xl flex items-center justify-center">
                  <i class="pi pi-file-o text-purple-700 text-2xl"></i>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- GDPR Compliance -->
          <div class="lg:col-span-2">
            <Card class="h-full">
              <template #title>
                <div class="flex items-center gap-2">
                  <i class="pi pi-shield text-blue-600"></i>
                  GDPR Compliance Status
                </div>
              </template>
              <template #content>
                <div class="space-y-4">
                  <div
                    v-for="compliance in complianceItems"
                    :key="compliance.id"
                    class="p-4 border border-gray-200 rounded-lg"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <div
                          :class="compliance.status === 'compliant' ? 'bg-green-100 text-green-600' :
                                  compliance.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                                  'bg-red-100 text-red-600'"
                          class="w-10 h-10 rounded-lg flex items-center justify-center"
                        >
                          <i
                            :class="compliance.status === 'compliant' ? 'pi pi-check' :
                                    compliance.status === 'warning' ? 'pi pi-exclamation-triangle' :
                                    'pi pi-times'"
                          ></i>
                        </div>
                        <div>
                          <h3 class="font-semibold text-gray-900">{{ compliance.title }}</h3>
                          <p class="text-sm text-gray-600">{{ compliance.description }}</p>
                        </div>
                      </div>
                      <Tag
                        :value="compliance.status.toUpperCase()"
                        :severity="compliance.status === 'compliant' ? 'success' :
                                  compliance.status === 'warning' ? 'warning' : 'danger'"
                      />
                    </div>
                    <div class="text-xs text-gray-500">
                      Last checked: {{ compliance.lastChecked }}
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Quick Security Actions -->
          <div class="lg:col-span-1">
            <Card class="h-full">
              <template #title>
                <div class="flex items-center gap-2">
                  <i class="pi pi-cog text-blue-600"></i>
                  Security Actions
                </div>
              </template>
              <template #content>
                <div class="space-y-3">
                  <Button
                    label="Run Security Scan"
                    icon="pi pi-search"
                    class="w-full p-button-outlined justify-start"
                    @click="runSecurityScan"
                  />
                  <Button
                    label="Generate GDPR Report"
                    icon="pi pi-file-pdf"
                    class="w-full p-button-outlined justify-start"
                    @click="generateGDPRReport"
                  />
                  <Button
                    label="Review Data Requests"
                    icon="pi pi-eye"
                    class="w-full p-button-outlined justify-start"
                    @click="reviewDataRequests"
                  />
                  <Button
                    label="Security Settings"
                    icon="pi pi-cog"
                    class="w-full p-button-outlined justify-start"
                    @click="goToSecuritySettings"
                  />
                  <Button
                    label="Backup Management"
                    icon="pi pi-database"
                    class="w-full p-button-outlined justify-start"
                    @click="goToBackupManagement"
                  />
                </div>
              </template>
            </Card>
          </div>
        </div>

        <!-- Audit Log -->
        <Card class="mt-6">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-history text-blue-600"></i>
                Security Audit Log
              </div>
              <div class="flex gap-2">
                <Dropdown
                  v-model="selectedLogType"
                  :options="logTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Filter by type"
                  class="w-48"
                />
                <Button
                  label="Clear Filters"
                  class="p-button-text p-button-sm"
                  @click="clearLogFilters"
                />
              </div>
            </div>
          </template>
          <template #content>
            <DataTable
              :value="filteredAuditLogs"
              :loading="loading"
              :paginator="true"
              :rows="10"
              responsive-layout="scroll"
              class="p-datatable-sm"
              sort-field="timestamp"
              :sort-order="-1"
            >
              <Column field="timestamp" header="Timestamp" sortable>
                <template #body="{ data }">
                  <span class="text-sm">{{ formatDate(data.timestamp) }}</span>
                </template>
              </Column>

              <Column field="type" header="Type">
                <template #body="{ data }">
                  <Tag
                    :value="data.type"
                    :class="{
                      'p-tag-info': data.type === 'login',
                      'p-tag-success': data.type === 'data_access',
                      'p-tag-warning': data.type === 'security_scan',
                      'p-tag-danger': data.type === 'security_incident'
                    }"
                  />
                </template>
              </Column>

              <Column field="user" header="User" sortable />
              <Column field="action" header="Action" />
              <Column field="resource" header="Resource" />

              <Column field="severity" header="Severity">
                <template #body="{ data }">
                  <Tag
                    :value="data.severity.toUpperCase()"
                    :severity="data.severity === 'low' ? 'success' :
                              data.severity === 'medium' ? 'warning' : 'danger'"
                  />
                </template>
              </Column>

              <Column header="Actions">
                <template #body="{ data }">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-sm p-button-text"
                    @click="viewAuditDetails(data)"
                    v-tooltip="'View Details'"
                  />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>

        <!-- Audit Details Dialog -->
        <Dialog
          v-model:visible="showAuditDialog"
          :style="{ width: '600px' }"
          header="Audit Log Details"
          :modal="true"
        >
          <div v-if="selectedAuditLog" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                <div class="text-sm">{{ formatDate(selectedAuditLog.timestamp) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <Tag :value="selectedAuditLog.type" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">User</label>
                <div class="text-sm">{{ selectedAuditLog.user }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <Tag
                  :value="selectedAuditLog.severity.toUpperCase()"
                  :severity="selectedAuditLog.severity === 'low' ? 'success' :
                            selectedAuditLog.severity === 'medium' ? 'warning' : 'danger'"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <div class="text-sm">{{ selectedAuditLog.action }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Resource</label>
              <div class="text-sm">{{ selectedAuditLog.resource }}</div>
            </div>

            <div v-if="selectedAuditLog.details">
              <label class="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <div class="text-sm bg-gray-100 p-3 rounded">
                <pre>{{ JSON.stringify(selectedAuditLog.details, null, 2) }}</pre>
              </div>
            </div>
          </div>

          <template #footer>
            <Button
              label="Close"
              icon="pi pi-times"
              class="p-button-outlined"
              @click="showAuditDialog = false"
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
import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()

// State
const loading = ref(false)
const showAuditDialog = ref(false)
const selectedAuditLog = ref(null)
const selectedLogType = ref(null)

// Mock data
const auditLogCount = ref(15847)
const securityIncidents = ref(3)
const dataRequests = ref(12)

const complianceItems = ref([
  {
    id: '1',
    title: 'Data Encryption',
    description: 'All sensitive data encrypted at rest and in transit',
    status: 'compliant',
    lastChecked: '2024-03-18 10:30'
  },
  {
    id: '2',
    title: 'Access Controls',
    description: 'Role-based access control properly configured',
    status: 'compliant',
    lastChecked: '2024-03-18 09:15'
  },
  {
    id: '3',
    title: 'Data Retention',
    description: 'Automated data purging according to retention policies',
    status: 'warning',
    lastChecked: '2024-03-17 14:22'
  },
  {
    id: '4',
    title: 'Audit Logging',
    description: 'Comprehensive audit trail maintained',
    status: 'compliant',
    lastChecked: '2024-03-18 11:45'
  }
])

const auditLogs = ref([
  {
    id: '1',
    timestamp: new Date('2024-03-18T10:30:00'),
    type: 'login',
    user: 'admin@oslo.kommune.no',
    action: 'Successful login',
    resource: 'Admin Dashboard',
    severity: 'low',
    details: { ip: '192.168.1.100', browser: 'Chrome' }
  },
  {
    id: '2',
    timestamp: new Date('2024-03-18T10:25:00'),
    type: 'data_access',
    user: 'caseworker@oslo.kommune.no',
    action: 'Viewed application details',
    resource: 'Application #12345',
    severity: 'low',
    details: { applicationId: '12345' }
  },
  {
    id: '3',
    timestamp: new Date('2024-03-18T09:15:00'),
    type: 'security_incident',
    user: 'unknown',
    action: 'Multiple failed login attempts',
    resource: 'Login system',
    severity: 'high',
    details: { attempts: 5, ip: '192.168.1.150' }
  },
  {
    id: '4',
    timestamp: new Date('2024-03-18T08:45:00'),
    type: 'security_scan',
    user: 'system',
    action: 'Security vulnerability scan completed',
    resource: 'System',
    severity: 'medium',
    details: { vulnerabilities: 0, scanned: 1250 }
  }
])

const logTypeOptions = [
  { label: 'All Types', value: null },
  { label: 'Login', value: 'login' },
  { label: 'Data Access', value: 'data_access' },
  { label: 'Security Incident', value: 'security_incident' },
  { label: 'Security Scan', value: 'security_scan' }
]

// Computed
const filteredAuditLogs = computed(() => {
  if (!selectedLogType.value) return auditLogs.value
  return auditLogs.value.filter(log => log.type === selectedLogType.value)
})

// Methods
const loadSecurityData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Data is already loaded in mock
  } finally {
    loading.value = false
  }
}

const exportAuditLog = () => {
  toast.add({
    severity: 'success',
    summary: 'Export Started',
    detail: 'Audit log export will be ready for download shortly',
    life: 3000
  })
}

const runSecurityScan = () => {
  toast.add({
    severity: 'info',
    summary: 'Security Scan Started',
    detail: 'Security scan is running in the background',
    life: 3000
  })
}

const generateGDPRReport = () => {
  toast.add({
    severity: 'success',
    summary: 'GDPR Report Generated',
    detail: 'GDPR compliance report is ready for download',
    life: 3000
  })
}

const reviewDataRequests = () => {
  router.push('/admin/data-requests')
}

const goToSecuritySettings = () => {
  router.push('/admin/settings?tab=security')
}

const goToBackupManagement = () => {
  router.push('/admin/backup')
}

const viewAuditDetails = (log: any) => {
  selectedAuditLog.value = log
  showAuditDialog.value = true
}

const clearLogFilters = () => {
  selectedLogType.value = null
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('no-NO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize
onMounted(() => {
  loadSecurityData()
})
</script>

<style scoped>
.security-admin {
  @apply p-6 max-w-7xl mx-auto;
}

pre {
  @apply text-xs whitespace-pre-wrap;
}
</style>
