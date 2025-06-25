<template>
  <BaseLayout>
    <template #content>
      <div class="childcare-member-page">
        <!-- Use Reusable Page Header -->
        <PageHeader
          :title="$t('admin.childcare.title', 'Childcare Member Management')"
          :subtitle="$t('admin.childcare.subtitle', 'Comprehensive management of childcare admissions and placements')"
          icon-class="pi-users"
          :show-radio-option="true"
          :radio-label="$t('admin.childcare.manageAdmissions', 'Manage admissions')"
          :show-checkbox="true"
          :checkbox-label="$t('admin.childcare.showCurrentUnits', 'Show only current units')"
          v-model:checkbox-value="showCurrentUnits"
          checkbox-id="showCurrentUnits"
          :tab-options="childcareTabOptions"
          v-model:tab-value="activeTab"
          :dropdown-options="unitOptions"
          v-model:dropdown-value="selectedUnit"
          :dropdown-placeholder="$t('common.selectUnit')"
          dropdown-option-label="name"
          dropdown-option-value="value"
          :action-buttons="childcareActionButtons"
          v-model:active-action="activeAction"
          :show-search="false"
          :show-filters="true"
          filter-label="Filters"
          @action-click="handleActionClick"
          @apply-filters="handleApplyFilters"
          @clear-filters="handleClearFilters"
        >
          <!-- Custom dropdown option template -->
          <template #dropdownOption="{ option }">
            <div class="unit-option">
              <i class="pi pi-building unit-option-icon"></i>
              <div class="unit-option-content">
                <div class="unit-option-name">{{ option.name }}</div>
                <div v-if="option.description" class="unit-option-description">
                  {{ option.description }}
                </div>
              </div>
            </div>
          </template>

          <!-- Filters content -->
          <template #filters>
            <FilterForm
              :filter-config="memberFilterConfig"
              v-model="filterValues"
              :show-actions="true"
              @apply="handleApplyFilters"
              @clear="handleClearFilters"
              @change="handleFilterChange"
            />
          </template>
        </PageHeader>

        <!-- Use Reusable Data Table -->
        <DataTableWrapper
          :data="filteredMembers"
          title="Admissions"
          :subtitle="`${filteredMembers.length} total admissions`"
          :selectable="true"
          v-model:selection="selectedMembers"
          :show-index="true"
          :show-refresh="true"
          :show-export="true"
          :show-sort-controls="true"
          sort-label="Sort Order:"
          :sort-options="memberSortOptions"
          v-model:sort-field="sortField"
          :sort-order="1"
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          @refresh="handleRefresh"
          @export="handleExport"
        >
          <template #columns>
            <Column field="createOffer" header="Create Offer" style="width: 8rem" headerClass="table-header-cell">
              <template #body>
                <Button icon="pi pi-plus" class="p-button-text action-btn" title="Create Offer" />
              </template>
            </Column>
            <Column field="edit" header="Edit" style="width: 6rem" headerClass="table-header-cell">
              <template #body>
                <Button icon="pi pi-pencil" class="p-button-text action-btn" title="Edit" />
              </template>
            </Column>
            <Column field="childInfo" header="Child info" style="width: 8rem" headerClass="table-header-cell">
              <template #body>
                <Button icon="pi pi-eye" class="p-button-text action-btn view-btn" :label="$t('common.view', 'View')" />
              </template>
            </Column>
            <Column field="childCivicNumber" header="Child civic number" style="width: 12rem" headerClass="table-header-cell" sortable />
            <Column field="childName" header="Child name" style="width: 10rem" headerClass="table-header-cell" sortable />
            <Column field="department" header="Department" style="width: 12rem" headerClass="table-header-cell" sortable />
            <Column field="admissionStart" header="Admission start" style="width: 10rem" headerClass="table-header-cell" sortable />
            <Column field="endDate" header="End date" style="width: 10rem" headerClass="table-header-cell" sortable />
            <Column field="startDate" header="Start date" style="width: 10rem" headerClass="table-header-cell" sortable />
            <Column field="changeStop" header="Change stop" style="width: 10rem" headerClass="table-header-cell" sortable />
            <Column field="ratecategory" header="Ratecategory" style="width: 10rem" headerClass="table-header-cell" sortable />
          </template>
        </DataTableWrapper>

        <!-- Bottom Action Buttons -->
        <div class="bottom-actions">
          <!-- First Row of Action Buttons -->
          <div class="action-buttons-row">
            <Button
              icon="pi pi-plus"
              :label="$t('admin.childcare.actions.createAddons', 'Create addons')"
              class="action-button secondary-btn"
            />
            <Button
              icon="pi pi-users"
              :label="$t('admin.childcare.actions.enrollment', 'Enrollment')"
              class="action-button secondary-btn"
            />
            <Button
              icon="pi pi-refresh"
              :label="$t('admin.childcare.actions.requestReplace', 'Request replace')"
              class="action-button secondary-btn"
            />
            <Button
              icon="pi pi-sync"
              :label="$t('admin.childcare.actions.replace', 'Replace')"
              class="action-button secondary-btn"
            />
            <Button
              icon="pi pi-pencil"
              :label="$t('admin.childcare.actions.changeAdmission', 'Change admission')"
              class="action-button secondary-btn"
            />
            <Button
              icon="pi pi-calendar"
              :label="$t('admin.childcare.actions.changeAdmissionEvents', 'Change admission events')"
              class="action-button secondary-btn"
            />
            <Button
              icon="pi pi-send"
              :label="$t('admin.childcare.actions.sendEmail', 'Send e-mail')"
              class="action-button secondary-btn"
            />
          </div>

          <!-- Second Row of Management Buttons -->
          <div class="management-buttons-row">
            <Button
              icon="pi pi-check-square"
              :label="$t('admin.childcare.management.workWithSelection', 'Work with a selection')"
              class="management-button primary-btn"
            />
            <Button
              icon="pi pi-user"
              :label="$t('admin.childcare.management.manageChildInfo', 'Manage child info')"
              class="management-button primary-btn"
            />
            <Button
              icon="pi pi-clock"
              :label="$t('admin.childcare.management.scheduleTermination', 'Schedule termination')"
              class="management-button primary-btn"
            />
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import PageHeader from '@/components/admin/PageHeader.vue'
import DataTableWrapper from '@/components/admin/DataTableWrapper.vue'
import { memberFilters } from '@/utils/filterConfigs'
import FilterForm from '@/components/admin/FilterForm.vue'

const { t } = useI18n()

// Reactive data
const activeTab = ref('foreskola')
const activeAction = ref('manageCurrentAdmissions')
const showCurrentUnits = ref(true)
const selectedMembers = ref([])
const selectedUnit = ref('ArnoldPreSchool2')
const itemsPerPage = ref(15)
const itemsPerPageOptions = ref([15, 25, 50])

// Filter values for the new FilterForm
const filterValues = ref({})

// Table pagination and sorting
const currentPage = ref(1)
const totalPages = ref(1)
const sortField = ref('childName')

// Use the predefined member filter configuration
const memberFilterConfig = ref(memberFilters)

// Sort options for table
const memberSortOptions = ref([
  { value: 'childName', label: 'Child last name ↑' },
  { value: 'childCivicNumber', label: 'Child civic number' },
  { value: 'department', label: 'Department' },
  { value: 'admissionStart', label: 'Admission start' },
  { value: 'endDate', label: 'End date' }
])

// Childcare-specific tab options (7 tabs as shown in image)
const childcareTabOptions = ref([
  { value: 'foreskola', label: t('admin.childcare.tabs.foreskola', 'Förskola') },
  { value: 'fritidshem', label: t('admin.childcare.tabs.fritidshem', 'Fritidshem') }
])

// Childcare-specific action buttons (7 buttons as shown in image)
const childcareActionButtons = ref([
  { value: 'manageCurrentAdmissions', label: t('admin.childcare.actions.manageCurrentAdmissions', 'Manage current admissions') },
  { value: 'futureAdmissions', label: t('admin.childcare.actions.futureAdmissions', 'Future admissions') },
  { value: 'futureAdmissionsChanges', label: t('admin.childcare.actions.futureAdmissionsChanges', 'Future admissions changes') },
  { value: 'manageHistoricalAdmissions', label: t('admin.childcare.actions.manageHistoricalAdmissions', 'Manage historical admissions') },
  { value: 'manageAllAdmissions', label: t('admin.childcare.actions.manageAllAdmissions', 'Manage all admissions') },
  { value: 'deletedAdmissions', label: t('admin.childcare.actions.deletedAdmissions', 'Deleted admissions') },
  { value: 'terminatedAdmissions', label: t('admin.childcare.actions.terminatedAdmissions', 'Terminated admissions') }
])

// Unit options
const unitOptions = ref([
  { value: 'all', name: t('common.allUnits'), description: t('common.showAll') },
  { value: 'ArnoldPreSchool2', name: 'ArnoldPreSchool2', description: 'Primary Unit' },
  { value: 'unit1', name: 'Sunshine Kindergarten', description: 'Central Oslo' },
  { value: 'unit2', name: 'Rainbow Preschool', description: 'Grünerløkka' },
  { value: 'unit3', name: 'Happy Kids Center', description: 'Frogner' },
  { value: 'unit4', name: 'Little Explorers', description: 'Sagene' }
])

// Mock data for childcare members (matching the table structure)
const mockMembers = ref([
  {
    id: 'M001',
    childCivicNumber: '20180315-1234',
    childName: 'Emma Andersson',
    department: 'Sunflower Group ArnoldPreSchool2',
    admissionStart: '2024-08-01',
    endDate: '2025-06-30',
    startDate: '2024-08-01',
    changeStop: '-',
    ratecategory: 'Full Time',
    status: 'Active'
  }
])

// Computed
const filteredMembers = computed(() => {
  let data = mockMembers.value

  if (showCurrentUnits.value) {
    data = data.filter(member => member.status === 'Active')
  }

  return data
})

// Methods
const handleActionClick = (value: string) => {
  activeAction.value = value
  console.log('Action clicked:', value)
}

const handleApplyFilters = () => {
  console.log('Applying member filters...')
}

const handleClearFilters = () => {
  console.log('Clearing member filters...')
}

const handleRefresh = () => {
  console.log('Refreshing table...')
}

const handleExport = () => {
  console.log('Exporting data...')
}

// Add new filter handling methods
const handleFilterChange = (values: Record<string, string | number | boolean | string[]>) => {
  // Handle real-time filter changes if needed
  console.log('Member filter values changed:', values)
}
</script>

<style scoped>
.childcare-member-page {
  background: #f8fafc;
  min-height: 100vh;
}

/* Action buttons styling */
.action-btn {
  padding: 0.375rem;
  border-radius: 4px;
  color: #6b7280;
  margin-right: 0.25rem;
}

.action-btn:hover {
  color: #3b82f6;
  background: #eff6ff;
}

.view-btn {
  color: #3b82f6;
  font-weight: 500;
}

.view-btn:hover {
  color: #2563eb;
  background: #eff6ff;
}

/* Bottom action buttons */
.bottom-actions {
  margin: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-buttons-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.management-buttons-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-button {
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.secondary-btn {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.secondary-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.management-button {
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-btn {
  background: #1e40af;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

/* Unit option template styles */
.unit-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.unit-option-icon {
  color: #6b7280;
  font-size: 14px;
  width: 16px;
}

.unit-option-content {
  flex: 1;
}

.unit-option-name {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  line-height: 1.2;
}

.unit-option-description {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  line-height: 1.2;
}

/* Responsive */
@media (max-width: 768px) {
  .action-buttons-row,
  .management-buttons-row {
    flex-direction: column;
    align-items: stretch;
  }

  .action-button,
  .management-button {
    justify-content: center;
  }
}
</style>
