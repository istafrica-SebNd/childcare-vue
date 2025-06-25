<template>
  <BaseLayout>
    <template #content>
      <div class="guarantee-list-page">
        <!-- Header Section -->
        <div class="guarantee-header">
          <div class="header-content">
            <div class="header-icon">
              <i class="pi pi-shield guarantee-icon"></i>
            </div>
            <div class="header-text">
              <h1 class="header-title">Guarantee List</h1>
              <p class="header-subtitle">Manage statutory guarantee rights and create placement offers</p>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <Button
            label="Guarantee List"
            :class="['tab-btn', { 'active': activeTab === 'guaranteeList' }]"
            @click="activeTab = 'guaranteeList'"
          />
          <Button
            label="Create admission offer"
            :class="['tab-btn', { 'active': activeTab === 'createOffer' }]"
            @click="activeTab = 'createOffer'"
          />
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <h2 class="content-title">Guarantee List</h2>

          <!-- Filters Section -->
          <div class="filters-section">
            <Button
              label="Filters"
              icon="pi pi-chevron-down"
              outlined
              class="filters-btn"
              @click="showFilters = !showFilters"
            />
          </div>

          <!-- Data Table -->
          <DataTableWrapper
            :data="guaranteeData"
            title="Guarantee List"
            :subtitle="`${currentStart} - ${currentEnd} of ${totalItems}`"
            :selectable="true"
            v-model:selection="selectedItems"
            :show-index="true"
            :show-refresh="true"
            :show-export="true"
            :show-sort-controls="true"
            sort-label="Sort Order:"
            :sort-options="sortOptions"
            v-model:sort-field="sortOrder"
            v-model:current-page="currentPage"
            :total-pages="totalPages"
            v-model:items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions"
            @refresh="handleRefresh"
            @export="handleExport"
          >
            <template #columns>
              <!-- Review Column -->
              <Column field="review" header="Review" style="width: 5rem" headerClass="table-header-cell">
                <template #body>
                  <Button icon="pi pi-pencil" class="review-btn" text />
                </template>
              </Column>

              <!-- Admissions Column -->
              <Column field="admissions" header="Admissions" style="width: 6rem" headerClass="table-header-cell">
                <template #body>
                  <Button icon="pi pi-users" class="admissions-btn" text />
                </template>
              </Column>

              <!-- Create offer Column -->
              <Column field="createOffer" header="Create offer" style="width: 6rem" headerClass="table-header-cell">
                <template #body>
                  <Button icon="pi pi-plus" class="create-offer-btn" text />
                </template>
              </Column>

              <!-- Guaranteed Column -->
              <Column field="guaranteed" header="Guaranteed" style="width: 8rem" headerClass="table-header-cell" />

              <!-- Priority Column -->
              <Column field="priority" header="Priority" style="width: 8rem" headerClass="table-header-cell">
                <template #body="slotProps">
                  <span v-if="slotProps.data.priority" :class="['priority-badge', slotProps.data.priority.type]">
                    {{ slotProps.data.priority.label }}
                  </span>
                </template>
              </Column>

              <!-- Application Column -->
              <Column field="application" header="Application" style="width: 8rem" headerClass="table-header-cell" />

              <!-- Offer Category Column -->
              <Column field="offerCategory" header="Offer Category" style="width: 10rem" headerClass="table-header-cell" />

              <!-- Civic number Column -->
              <Column field="civicNumber" header="Civic number" style="width: 10rem" headerClass="table-header-cell" />

              <!-- First name Column -->
              <Column field="firstName" header="First name" style="width: 8rem" headerClass="table-header-cell" />

              <!-- Last name Column -->
              <Column field="lastName" header="Last name" style="width: 8rem" headerClass="table-header-cell" />

              <!-- Birthdate Column -->
              <Column field="birthdate" header="Birthdate" style="width: 8rem" headerClass="table-header-cell" />

              <!-- Area code Column -->
              <Column field="areaCode" header="Area code" style="width: 8rem" headerClass="table-header-cell" />

              <!-- Area name Column -->
              <Column field="areaName" header="Area name" style="width: 10rem" headerClass="table-header-cell" />

              <!-- City district Column -->
              <Column field="cityDistrict" header="City district" style="width: 8rem" headerClass="table-header-cell" />

              <!-- Address Column -->
              <Column field="address" header="Address" style="width: 12rem" headerClass="table-header-cell" />
            </template>
          </DataTableWrapper>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              outlined
              class="action-btn"
              @click="handleRefresh"
            />
            <Button
              icon="pi pi-download"
              label="Export"
              outlined
              class="action-btn"
              @click="handleExport"
            />
            <Button
              icon="pi pi-envelope"
              label="Send e-mail"
              class="action-btn send-email-btn"
              @click="handleSendEmail"
            />
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import DataTableWrapper from '@/components/admin/DataTableWrapper.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'

// Types
interface GuaranteeItem {
  id: string
  number: number
  review: boolean
  admissions: boolean
  createOffer: boolean
  guaranteed: string
  priority: { type: string; label: string } | null
  application: string
  offerCategory: string
  civicNumber: string
  firstName: string
  lastName: string
  birthdate: string
  areaCode: string
  areaName: string
  cityDistrict: string
  address: string
}

// Reactive data
const activeTab = ref('guaranteeList')
const showFilters = ref(false)
const sortOrder = ref('queueDate')
const selectedItems = ref<GuaranteeItem[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = ref(15)

// Options
const sortOptions = ref([
  { value: 'queueDate', label: 'Queue date ↑' },
  { value: 'queueDateDesc', label: 'Queue date ↓' },
  { value: 'priority', label: 'Priority' },
  { value: 'firstName', label: 'First name' },
  { value: 'lastName', label: 'Last name' }
])

const itemsPerPageOptions = ref([15, 25, 50, 100])

// Mock data
const guaranteeData = ref<GuaranteeItem[]>([
  {
    id: 'G001',
    number: 1,
    review: true,
    admissions: true,
    createOffer: true,
    guaranteed: '01/01/2025',
    priority: null,
    application: 'Yes',
    offerCategory: 'Childcare application',
    civicNumber: '20200521-....',
    firstName: 'Knurra',
    lastName: 'Björnsson',
    birthdate: '05/21/2020',
    areaCode: '',
    areaName: 'Krugens vä...',
    cityDistrict: '',
    address: ''
  },
  {
    id: 'G002',
    number: 2,
    review: true,
    admissions: true,
    createOffer: true,
    guaranteed: '01/01/2025',
    priority: null,
    application: 'Yes',
    offerCategory: 'Childcare application',
    civicNumber: '20180512-....',
    firstName: 'Lilian',
    lastName: 'Björnsson',
    birthdate: '05/12/2018',
    areaCode: '',
    areaName: 'Lilians väg ...',
    cityDistrict: '',
    address: ''
  },
  {
    id: 'G003',
    number: 3,
    review: true,
    admissions: true,
    createOffer: true,
    guaranteed: '04/11/2025',
    priority: { type: 'first', label: 'FÖRST I KÖN' },
    application: 'Yes',
    offerCategory: 'Childcare application',
    civicNumber: '20221106-....',
    firstName: 'Mikaela',
    lastName: 'Nyström',
    birthdate: '11/06/2022',
    areaCode: '',
    areaName: 'Floristgatan...',
    cityDistrict: '',
    address: ''
  }
])

// Computed
const totalItems = computed(() => guaranteeData.value.length)
const currentStart = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const currentEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

// Methods
const handleRefresh = () => {
  console.log('Refreshing guarantee list...')
}

const handleExport = () => {
  console.log('Exporting guarantee list...')
}

const handleSendEmail = () => {
  console.log('Sending email...')
}
</script>

<style scoped>
.guarantee-list-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 1.5rem;
}

/* Header Section */
.guarantee-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  background: #dbeafe;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guarantee-icon {
  font-size: 2rem;
  color: #2563eb;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.header-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: white;
  color: #6b7280;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-btn.active {
  background: #2563eb;
  color: white;
}

/* Main Content */
.main-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.content-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

/* Filters Section */
.filters-section {
  margin-bottom: 1.5rem;
}

.filters-btn {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
}

/* Sort and Results */
.sort-results-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.sort-dropdown {
  min-width: 150px;
}

.sort-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.results-info {
  font-size: 14px;
  color: #6b7280;
}

/* Table Section */
.table-section {
  margin-bottom: 2rem;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.guarantee-table {
  width: 100%;
  min-width: 1800px;
}

.guarantee-table :deep(.table-header-cell) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 8px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  text-align: left;
}

.guarantee-table :deep(.p-datatable-tbody > tr > td) {
  padding: 12px 8px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.guarantee-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: #f9fafb;
}

/* Table Action Buttons */
.review-btn,
.admissions-btn,
.create-offer-btn {
  padding: 4px;
  color: #3b82f6;
  border-radius: 4px;
}

.review-btn:hover,
.admissions-btn:hover,
.create-offer-btn:hover {
  background: #f3f4f6;
}

/* Priority Badge */
.priority-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.first {
  background: #fef3c7;
  color: #d97706;
}

/* Pagination Footer */
.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #f3f4f6;
}

.pagination-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.items-dropdown {
  min-width: 80px;
}

.items-dropdown :deep(.p-dropdown) {
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #6b7280;
}

.pagination-active {
  padding: 6px 12px;
  border-radius: 4px;
  background: #3b82f6;
  color: white;
  border: none;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
}

.send-email-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.send-email-btn:hover {
  background: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .guarantee-list-page {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .sort-results-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .pagination-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
