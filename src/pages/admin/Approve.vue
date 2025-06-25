<template>
  <BaseLayout>
    <template #content>
      <div class="approval-page">
        <!-- Use Reusable Page Header -->
        <PageHeader
          :title="$t('admin.approvals.title')"
          :subtitle="$t('admin.approvals.subtitle')"
          icon-class="pi-check-circle"
          :show-radio-option="true"
          :radio-label="$t('admin.approvals.requestForReplace')"
          :show-checkbox="true"
          :checkbox-label="$t('admin.approvals.showOnlyCurrentUnits')"
          v-model:checkbox-value="showCurrentUnits"
          checkbox-id="showCurrentUnits"
          :tab-options="tabOptions"
          v-model:tab-value="activeTab"
          :dropdown-options="districtOptions"
          v-model:dropdown-value="selectedDistrict"
          :dropdown-placeholder="$t('common.selectDistrict')"
          dropdown-option-label="name"
          dropdown-option-value="value"
          :action-buttons="actionButtonsData"
          v-model:active-action="activeAction"
          :show-search="true"
          v-model:search-value="searchQuery"
          :search-placeholder="$t('admin.approvals.searchPlaceholder')"
          :show-filters="true"
          @action-click="handleActionClick"
          @apply-filters="handleApplyFilters"
          @clear-filters="handleClearFilters"
        >
          <!-- Custom dropdown value template -->
          <template #dropdownValue="{ value }">
            <div class="dropdown-value-display">
              <i class="pi pi-map-marker dropdown-icon"></i>
              <span class="dropdown-text">{{ getDistrictLabel(value) }}</span>
            </div>
          </template>

          <!-- Custom dropdown option template -->
          <template #dropdownOption="{ option }">
            <div class="dropdown-option">
              <i class="pi pi-map-marker dropdown-option-icon"></i>
              <div class="dropdown-option-content">
                <div class="dropdown-option-name">{{ option.name }}</div>
                <div v-if="option.description" class="dropdown-option-description">
                  {{ option.description }}
                </div>
              </div>
            </div>
          </template>

          <!-- Filters content -->
          <template #filters>
            <FilterForm
              :filter-config="approvalFilterConfig"
              v-model="filterValues"
              :show-actions="true"
              @apply="handleApplyFilters"
              @clear="handleClearFilters"
              @change="handleFilterChange"
            />
          </template>
        </PageHeader>

        <!-- Data Table with Reusable Wrapper -->
        <DataTableWrapper
          :data="filteredData"
          title="Admissions"
          :subtitle="`${filteredData.length} total admissions`"
          :selectable="true"
          v-model:selection="selectedApprovals"
          :show-index="true"
          :show-refresh="true"
          :show-export="true"
          :show-sort-controls="true"
          :sort-options="sortOptions"
          v-model:sort-field="sortField"
          :sort-order="sortOrder"
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          @refresh="handleRefresh"
          @export="handleExport"
        >
          <template #columns>
            <!-- Dynamic Columns Based on Active Action -->
            <template v-if="activeAction === 'endRequest' || activeAction === 'requestForReplace'">
              <Column field="status" header="Status" style="width: 8rem" headerClass="table-header-cell" sortable>
                <template #body="slotProps">
                  <span :class="['status-badge', slotProps.data.status.toLowerCase()]">
                    {{ $t(`common.status.${slotProps.data.status.toLowerCase()}`) }}
                  </span>
                </template>
              </Column>
              <Column field="replaceUnit" header="Replace unit" style="width: 8rem" headerClass="table-header-cell" sortable />
              <Column field="currentUnit" header="Current unit" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="child" header="Child" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="reqAdmissionEndDate" header="Req. admission end date" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="reqNewAdmissionStartDate" header="Req. new admission start date" style="width: 14rem" headerClass="table-header-cell" sortable />
              <Column field="reason" header="Reason" style="width: 8rem" headerClass="table-header-cell" sortable />
              <Column field="submitDate" header="Submit date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="requestedBy" header="Requested by" style="width: 10rem" headerClass="table-header-cell" sortable />
            </template>

            <template v-else-if="activeAction === 'rateCategoryAverageTime'">
              <Column field="status" header="Status" style="width: 8rem" headerClass="table-header-cell" sortable>
                <template #body="slotProps">
                  <span :class="['status-badge', slotProps.data.status.toLowerCase()]">
                    {{ $t(`common.status.${slotProps.data.status.toLowerCase()}`) }}
                  </span>
                </template>
              </Column>
              <Column field="childCivicNumber" header="Child civic number" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="childName" header="Child name" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="startDate" header="Start Date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="changedStartdate" header="Changed startdate" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="currentUnit" header="Current unit" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="submitDate" header="Submit date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="otherInformation" header="Other information" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="currentRateCategory" header="Current rate category" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="newRateCategory" header="New rate category" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="contractedTime" header="Contracted time" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="reason" header="Reason" style="width: 8rem" headerClass="table-header-cell" sortable />
              <Column field="currentAverageTime" header="Current average time" style="width: 12rem" headerClass="table-header-cell" sortable />
            </template>

            <template v-else-if="activeAction === 'timetable'">
              <Column field="timetable" header="Timetable" style="width: 8rem" headerClass="table-header-cell" sortable />
              <Column field="status" header="Status" style="width: 8rem" headerClass="table-header-cell" sortable>
                <template #body="slotProps">
                  <span :class="['status-badge', slotProps.data.status.toLowerCase()]">
                    {{ $t(`common.status.${slotProps.data.status.toLowerCase()}`) }}
                  </span>
                </template>
              </Column>
              <Column field="childCivicNumber" header="Child civic number" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="childName" header="Child name" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="unit" header="Unit" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="startDate" header="Start date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="endDate" header="End date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="timetableType" header="Timetable type" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="reqStartDate" header="Req. start date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="contractedTime" header="Contracted time" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="averageTime" header="Average time" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="rateCategory" header="Rate category" style="width: 10rem" headerClass="table-header-cell" sortable />
            </template>

            <template v-else-if="activeAction === 'reasontype'">
              <Column field="status" header="Status" style="width: 8rem" headerClass="table-header-cell" sortable>
                <template #body="slotProps">
                  <span :class="['status-badge', slotProps.data.status.toLowerCase()]">
                    {{ $t(`common.status.${slotProps.data.status.toLowerCase()}`) }}
                  </span>
                </template>
              </Column>
              <Column field="childCivicNumber" header="Child civic number" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="childFirstName" header="Child first name" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="childLastName" header="Child last name" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="unit" header="Unit" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="admissionStart" header="Admission start" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="endDate" header="End date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="desiredStartdate" header="Desired startdate" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="submitDate" header="Submit date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="reasontype" header="Reasontype" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="rateCategory" header="Rate category" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="contractedTime" header="Contracted time" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="averageTime" header="Average time" style="width: 10rem" headerClass="table-header-cell" sortable />
            </template>

            <template v-else-if="activeAction === 'leave'">
              <Column field="state" header="State" style="width: 8rem" headerClass="table-header-cell" sortable />
              <Column field="civicNumber" header="Civic number" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="childName" header="Child name" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="unit" header="Unit" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="leavetype" header="Leavetype" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="submitDate" header="Submit date" style="width: 10rem" headerClass="table-header-cell" sortable />
              <Column field="desiredStartDate" header="Desired start date" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="desiredEndDate" header="Desired end date" style="width: 12rem" headerClass="table-header-cell" sortable />
              <Column field="reason" header="Reason" style="width: 8rem" headerClass="table-header-cell" sortable />
            </template>
          </template>
        </DataTableWrapper>

        <!-- Approve Button -->
        <Button
          :label="$t('admin.approvals.actions.approveReject')"
          class="approve-button"
        />
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import DataTableWrapper from '@/components/admin/DataTableWrapper.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import PageHeader from '@/components/admin/PageHeader.vue'
import FilterForm from '@/components/admin/FilterForm.vue'
import { approvalFilters } from '@/utils/filterConfigs'

// Composables
const { t } = useI18n()

// Reactive data
const activeTab = ref('foreskola')
const activeAction = ref('endRequest')
const showCurrentUnits = ref(false)
const searchQuery = ref('')
const selectedApprovals = ref([])
const selectedDistrict = ref('all')
const itemsPerPage = ref(15)
const itemsPerPageOptions = ref([15, 25, 50])

// Filter values for the new FilterForm
const filterValues = ref({})

// Pagination and sorting
const currentPage = ref(1)
const totalPages = ref(1)
const sortField = ref('childName')
const sortOrder = ref(1)

// Use the predefined filter configuration
const approvalFilterConfig = ref(approvalFilters)

// Tab options for SelectButton
const tabOptions = ref([
  { value: 'foreskola', label: t('admin.approvals.tabs.foreskola') },
  { value: 'fritidshem', label: t('admin.approvals.tabs.fritidshem') }
])

// Action buttons data
const actionButtonsData = ref([
  { value: 'endRequest', label: t('admin.approvals.actions.endRequest') },
  { value: 'requestForReplace', label: t('admin.approvals.actions.requestForReplace') },
  { value: 'rateCategoryAverageTime', label: t('admin.approvals.actions.rateCategoryAverageTime') },
  { value: 'timetable', label: t('admin.approvals.actions.timetable') },
  { value: 'reasontype', label: t('admin.approvals.actions.reasontype') },
  { value: 'leave', label: t('admin.approvals.actions.leave') }
])

// District options based on Oslo districts
const districtOptions = ref([
  { value: 'all', name: t('common.allDistricts'), description: t('common.showAll') },
  { value: 'gamle-oslo', name: 'Gamle Oslo', description: '45 kindergartens' },
  { value: 'grunerlokka', name: 'Grünerløkka', description: '38 kindergartens' },
  { value: 'sagene', name: 'Sagene', description: '42 kindergartens' },
  { value: 'st-hanshaugen', name: 'St. Hanshaugen', description: '35 kindergartens' },
  { value: 'frogner', name: 'Frogner', description: '41 kindergartens' },
])

// Mock data with realistic values - restore original approval fields
const mockApprovals = ref([
  {
    id: '1',
    status: 'new',
    replaceUnit: '-',
    currentUnit: 'Solbacka Förskola',
    child: 'Emma Andersson',
    childName: 'Emma Andersson',
    childFirstName: 'Emma',
    childLastName: 'Andersson',
    childCivicNumber: '20220315-1234',
    civicNumber: '20220315-1234',
    reqAdmissionEndDate: '2025-06-30',
    reqNewAdmissionStartDate: '2024-08-01',
    reason: '-',
    submitDate: '2024-08-01',
    requestedBy: '-',
    district: 'gamle-oslo',
    type: 'foreskola',
    // Rate category fields
    startDate: '2024-08-01',
    changedStartdate: '-',
    otherInformation: '-',
    currentRateCategory: 'Category A',
    newRateCategory: '-',
    contractedTime: '40h',
    currentAverageTime: '38h',
    // Timetable fields
    timetable: '-',
    unit: 'Solbacka Förskola',
    endDate: '2025-06-30',
    timetableType: 'Full time',
    reqStartDate: '2024-08-01',
    averageTime: '38h',
    rateCategory: 'Category A',
    // Reasontype fields
    admissionStart: '2024-08-01',
    desiredStartdate: '2024-08-01',
    reasontype: '-',
    // Leave fields
    state: '-',
    leavetype: '-',
    desiredStartDate: '2024-08-01',
    desiredEndDate: '2025-06-30'
  },
  {
    id: '2',
    status: 'approved',
    replaceUnit: '-',
    currentUnit: 'Rosengård Förskola',
    child: 'Astrid Johansson',
    childName: 'Astrid Johansson',
    childFirstName: 'Astrid',
    childLastName: 'Johansson',
    childCivicNumber: '20230505-9012',
    civicNumber: '20230505-9012',
    reqAdmissionEndDate: '2025-06-30',
    reqNewAdmissionStartDate: '2024-09-01',
    reason: '-',
    submitDate: '2024-09-01',
    requestedBy: '-',
    district: 'frogner',
    type: 'foreskola',
    // Rate category fields
    startDate: '2024-09-01',
    changedStartdate: '-',
    otherInformation: '-',
    currentRateCategory: 'Category A',
    newRateCategory: '-',
    contractedTime: '40h',
    currentAverageTime: '39h',
    // Timetable fields
    timetable: '-',
    unit: 'Rosengård Förskola',
    endDate: '2025-06-30',
    timetableType: 'Full time',
    reqStartDate: '2024-09-01',
    averageTime: '39h',
    rateCategory: 'Category A',
    // Reasontype fields
    admissionStart: '2024-09-01',
    desiredStartdate: '2024-09-01',
    reasontype: '-',
    // Leave fields
    state: '-',
    leavetype: '-',
    desiredStartDate: '2024-09-01',
    desiredEndDate: '2025-06-30'
  },
  {
    id: '3',
    status: 'new',
    replaceUnit: '-',
    currentUnit: 'Adventure Fritidshem',
    child: 'Erik Nilsson',
    childName: 'Erik Nilsson',
    childFirstName: 'Erik',
    childLastName: 'Nilsson',
    childCivicNumber: '20210820-5678',
    civicNumber: '20210820-5678',
    reqAdmissionEndDate: '2025-06-30',
    reqNewAdmissionStartDate: '2024-08-15',
    reason: '-',
    submitDate: '2024-08-15',
    requestedBy: '-',
    district: 'sagene',
    type: 'fritidshem',
    // Rate category fields
    startDate: '2024-08-15',
    changedStartdate: '-',
    otherInformation: '-',
    currentRateCategory: 'Category B',
    newRateCategory: '-',
    contractedTime: '30h',
    currentAverageTime: '28h',
    // Timetable fields
    timetable: '-',
    unit: 'Adventure Fritidshem',
    endDate: '2025-06-30',
    timetableType: 'Part time',
    reqStartDate: '2024-08-15',
    averageTime: '28h',
    rateCategory: 'Category B',
    // Reasontype fields
    admissionStart: '2024-08-15',
    desiredStartdate: '2024-08-15',
    reasontype: '-',
    // Leave fields
    state: '-',
    leavetype: '-',
    desiredStartDate: '2024-08-15',
    desiredEndDate: '2025-06-30'
  }
])

// Computed properties for filtering
const filteredData = computed(() => {
  let data = mockApprovals.value

  // Filter by tab (foreskola/fritidshem)
  data = data.filter(item => item.type === activeTab.value)

  // Filter by district
  if (selectedDistrict.value && selectedDistrict.value !== 'all') {
    data = data.filter(item => item.district === selectedDistrict.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item =>
      item.currentUnit.toLowerCase().includes(query) ||
      item.child.toLowerCase().includes(query)
    )
  }

  // Filter by current units only
  if (showCurrentUnits.value) {
    // Add logic for current units filter if needed
    data = data.filter(item => item.status !== 'archived')
  }

  return data
})

// Helper function to get district label
const getDistrictLabel = (value: string) => {
  if (value === 'all') return t('common.allDistricts')
  const district = districtOptions.value.find(d => d.value === value)
  return district ? district.name : value
}

// Methods
const handleActionClick = (value: string) => {
  activeAction.value = value
}

const handleApplyFilters = () => {
  // Apply filter logic here
  console.log('Applying filters...')
}

const handleClearFilters = () => {
  // Clear filter logic here
  console.log('Clearing filters...')
}

const handleRefresh = () => {
  // Handle refresh logic here
  console.log('Refreshing data...')
}

const handleExport = () => {
  // Handle export logic here
  console.log('Exporting data...')
}

// Add new filter handling methods
const handleFilterChange = (values: Record<string, any>) => {
  // Handle real-time filter changes if needed
  console.log('Filter values changed:', values)
}
</script>

<script lang="ts">
export default {
  name: 'ApprovalManagementPage'
}
</script>

<style scoped>
.approval-page {
  min-height: 100vh;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.new {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.approved {
  background: #dcfce7;
  color: #15803d;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #dc2626;
}

.approve-button {
  background: #059669;
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  margin-top: 20px;
  margin-left: auto;
  margin-right: 1.5rem;
}

.approve-button:hover {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Custom dropdown template styles */
.dropdown-value-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-icon {
  color: #6b7280;
  font-size: 12px;
}

.dropdown-text {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-option-icon {
  color: #6b7280;
  font-size: 14px;
  width: 16px;
}

.dropdown-option-content {
  flex: 1;
}

.dropdown-option-name {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  line-height: 1.2;
}

.dropdown-option-description {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  line-height: 1.2;
}

/* Filter dropdown styling */
.filter-dropdown {
  min-width: 150px;
}

.filter-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-dropdown :deep(.p-dropdown-label) {
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
}
</style>
