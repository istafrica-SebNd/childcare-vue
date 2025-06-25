<template>
  <BaseLayout>
    <template #content>
      <div class="debt-management-page">
        <!-- Header Section -->
        <div class="debt-header">
          <div class="header-content">
            <div class="header-icon">
              <i class="pi pi-dollar debt-icon"></i>
            </div>
            <div class="header-text">
              <h1 class="header-title">Manage debts, queue</h1>
              <p class="header-subtitle">Comprehensive debt management and collection system with AI-powered insights</p>
            </div>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-section">
          <!-- Municipality Tabs -->
          <div class="municipality-section">
            <label class="control-label">Municipality:</label>
            <div class="municipality-tabs">
              <Button
                label="Förskola"
                :class="['municipality-btn', { 'active': activeMunicipality === 'foreskola' }]"
                @click="activeMunicipality = 'foreskola'"
              />
              <Button
                label="Fritidshem"
                :class="['municipality-btn', { 'active': activeMunicipality === 'fritidshem' }]"
                @click="activeMunicipality = 'fritidshem'"
              />
            </div>
          </div>

          <!-- District and Checkbox -->
          <div class="district-section">
            <div class="district-control">
              <label class="control-label">District:</label>
              <Dropdown
                v-model="selectedDistrict"
                :options="districtOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Norra Distriktet"
                class="district-dropdown"
              />
            </div>
            <div class="checkbox-control">
              <Checkbox
                v-model="showOnlyCurrentUnits"
                inputId="currentUnits"
                :binary="true"
              />
              <label for="currentUnits" class="checkbox-label">Show only current units</label>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <Button
            label="Debt Queue"
            :class="['tab-btn', { 'active': activeTab === 'debtQueue' }]"
            @click="activeTab = 'debtQueue'"
          />
          <Button
            label="Analytics & Insights"
            :class="['tab-btn', { 'active': activeTab === 'analytics' }]"
            @click="activeTab = 'analytics'"
          />
          <Button
            label="Legal Actions"
            :class="['tab-btn', { 'active': activeTab === 'legalActions' }]"
            @click="activeTab = 'legalActions'"
          />
        </div>

        <!-- Debt Queue Content -->
        <div v-if="activeTab === 'debtQueue'" class="debt-queue-content">
          <!-- Search and Filters -->
          <div class="search-filters-section">
            <div class="search-section">
              <div class="search-input-wrapper">
                <i class="pi pi-search search-icon"></i>
                <InputText
                  v-model="searchQuery"
                  placeholder="Search by guardian name, child name, or civic number..."
                  class="search-input"
                />
              </div>
              <div class="status-filters">
                <Dropdown
                  v-model="statusFilter"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="All Status"
                  class="filter-dropdown"
                />
                <Dropdown
                  v-model="levelFilter"
                  :options="levelOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="All Levels"
                  class="filter-dropdown"
                />
                <Button
                  label="Advanced Filters"
                  icon="pi pi-filter"
                  outlined
                  class="advanced-filters-btn"
                  @click="showAdvancedFilters = !showAdvancedFilters"
                />
              </div>
            </div>

            <!-- Quick Filters -->
            <div class="quick-filters">
              <span class="quick-filters-label">Quick Filters:</span>
              <Button
                icon="pi pi-star"
                label="High Risk Debts"
                :class="['quick-filter-btn', { 'active': activeQuickFilter === 'highRisk' }]"
                @click="toggleQuickFilter('highRisk')"
              />
              <Button
                icon="pi pi-gavel"
                label="Legal Action Ready"
                :class="['quick-filter-btn', { 'active': activeQuickFilter === 'legalReady' }]"
                @click="toggleQuickFilter('legalReady')"
              />
              <Button
                icon="pi pi-credit-card"
                label="Payment Plans"
                :class="['quick-filter-btn', { 'active': activeQuickFilter === 'paymentPlans' }]"
                @click="toggleQuickFilter('paymentPlans')"
              />
            </div>
          </div>

          <!-- Outstanding Debts Table -->
          <div class="debts-table-section">
            <DataTableWrapper
              :data="filteredDebts"
              title="Outstanding Debts"
              :subtitle="`${filteredDebts.length} debts • ${totalOutstanding} outstanding`"
              :selectable="true"
              v-model:selection="selectedDebts"
              :show-refresh="true"
              :show-export="true"
              v-model:current-page="currentPage"
              :total-pages="totalPages"
              v-model:items-per-page="itemsPerPage"
              :items-per-page-options="itemsPerPageOptions"
              @refresh="handleRefresh"
              @export="handleExport"
            >
              <template #columns>
                <!-- Relation Column -->
                <Column field="relation" header="Relation" style="width: 10rem" headerClass="table-header-cell">
                  <template #body="slotProps">
                    <div class="relation-cell">
                      <i class="pi pi-users relation-icon"></i>
                      <span>{{ slotProps.data.relation }}</span>
                    </div>
                  </template>
                </Column>

                <!-- Civic Number Column -->
                <Column field="civicNumber" header="Civic Number" style="width: 10rem" headerClass="table-header-cell" />

                <!-- Name Column -->
                <Column field="name" header="Name" style="width: 12rem" headerClass="table-header-cell" />

                <!-- Child Civic Number Column -->
                <Column field="childCivicNumber" header="Child Civic Number" style="width: 12rem" headerClass="table-header-cell" />

                <!-- Child Name Column -->
                <Column field="childName" header="Child Name" style="width: 10rem" headerClass="table-header-cell" />

                <!-- Unit Column -->
                <Column field="unit" header="Unit" style="width: 12rem" headerClass="table-header-cell" />

                <!-- Amount Column -->
                <Column field="amount" header="Amount" style="width: 10rem" headerClass="table-header-cell">
                  <template #body="slotProps">
                    <div class="amount-cell">
                      <span class="amount-main">{{ slotProps.data.amount }}</span>
                      <span class="amount-detail">{{ slotProps.data.amountDetail }}</span>
                    </div>
                  </template>
                </Column>

                <!-- Due Date Column -->
                <Column field="dueDate" header="Due Date" style="width: 8rem" headerClass="table-header-cell" />

                <!-- Days Overdue -->
                <Column field="daysOverdue" header="Days Overdue" style="width: 8rem" headerClass="table-header-cell">
                  <template #body="slotProps">
                    <span :class="['days-overdue', getDaysOverdueClass(slotProps.data.daysOverdue)]">
                      {{ slotProps.data.daysOverdue }}
                    </span>
                  </template>
                </Column>

                <!-- Status -->
                <Column field="status" header="Status" style="width: 8rem" headerClass="table-header-cell">
                  <template #body="slotProps">
                    <span :class="['status-badge', slotProps.data.status.toLowerCase()]">
                      {{ slotProps.data.status }}
                    </span>
                  </template>
                </Column>

                <!-- Escalation -->
                <Column field="escalation" header="Escalation" style="width: 8rem" headerClass="table-header-cell">
                  <template #body="slotProps">
                    <span :class="['escalation-badge', slotProps.data.escalation.type]">
                      {{ slotProps.data.escalation.label }}
                    </span>
                  </template>
                </Column>

                <!-- Manage -->
                <Column field="manage" header="Manage" style="width: 6rem" headerClass="table-header-cell">
                  <template #body>
                    <Button
                      label="Manage"
                      class="manage-btn"
                      text
                    />
                  </template>
                </Column>
              </template>
            </DataTableWrapper>
          </div>

          <!-- Bottom Info Cards -->
          <div class="bottom-cards">
            <div class="info-card">
              <div class="card-icon">
                <i class="pi pi-chart-line"></i>
              </div>
              <div class="card-content">
                <h4 class="card-title">Escalation Workflow</h4>
                <p class="card-description">Automated debt escalation</p>
              </div>
            </div>

            <div class="info-card">
              <div class="card-icon">
                <i class="pi pi-brain"></i>
              </div>
              <div class="card-content">
                <h4 class="card-title">AI Insights</h4>
                <p class="card-description">Smart debt predictions</p>
              </div>
            </div>

            <div class="info-card">
              <div class="card-icon">
                <i class="pi pi-gavel"></i>
              </div>
              <div class="card-content">
                <h4 class="card-title">Legal Actions</h4>
                <p class="card-description">Court proceedings</p>
              </div>
            </div>
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
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

// Types
interface Debt {
  id: string
  relation: string
  civicNumber: string
  name: string
  childCivicNumber: string
  childName: string
  unit: string
  amount: string
  amountDetail: string
  dueDate: string
  daysOverdue: string
  status: string
  escalation: { type: string; label: string }
  manage: string
}

// Reactive data
const activeMunicipality = ref('foreskola')
const selectedDistrict = ref('norra')
const showOnlyCurrentUnits = ref(false)
const activeTab = ref('debtQueue')
const searchQuery = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const showAdvancedFilters = ref(false)
const activeQuickFilter = ref('')
const selectedDebts = ref<Debt[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = ref(25)

// Options
const districtOptions = ref([
  { value: 'norra', name: 'Norra Distriktet' },
  { value: 'sodra', name: 'Södra Distriktet' },
  { value: 'ostra', name: 'Östra Distriktet' },
  { value: 'vastra', name: 'Västra Distriktet' }
])

const statusOptions = ref([
  { value: '', label: 'All Status' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' }
])

const levelOptions = ref([
  { value: '', label: 'All Levels' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
])

const itemsPerPageOptions = ref([25, 50, 100])

// Mock data
const mockDebts = ref<Debt[]>([
  {
    id: 'D001',
    relation: 'Guardian/Child',
    civicNumber: '19850315-****',
    name: 'Anna Johansson',
    childCivicNumber: '20180620-****',
    childName: 'Erik Johansson',
    unit: 'Sunflower Preschool\nFörskola',
    amount: '€ 2 500,00 kr',
    amountDetail: 'of 2 500,00 kr',
    dueDate: '2024-11-01',
    daysOverdue: '46 days',
    status: 'Overdue',
    escalation: { type: 'final', label: 'Final Notice' },
    manage: 'Stan'
  },
  {
    id: 'D002',
    relation: 'Guardian/Child',
    civicNumber: '19790822-****',
    name: 'Maria Andersson',
    childCivicNumber: '20200315-****',
    childName: 'Liam Andersson',
    unit: 'Rainbow After-School\nFritidshem',
    amount: '€ 900,00 kr',
    amountDetail: 'of 1 800,00 kr',
    dueDate: '2024-12-01',
    daysOverdue: '16 days',
    status: 'Overdue',
    escalation: { type: 'warning', label: 'Early Warning' },
    manage: 'Harc'
  }
])

// Computed
const filteredDebts = computed(() => {
  let data = mockDebts.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(debt =>
      debt.name.toLowerCase().includes(query) ||
      debt.childName.toLowerCase().includes(query) ||
      debt.civicNumber.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    data = data.filter(debt => debt.status.toLowerCase() === statusFilter.value)
  }

  return data
})

const totalOutstanding = computed(() => {
  return '3.400 SEK'
})

// Methods
const toggleQuickFilter = (filter: string) => {
  activeQuickFilter.value = activeQuickFilter.value === filter ? '' : filter
}

const getDaysOverdueClass = (days: string) => {
  const dayNumber = parseInt(days)
  if (dayNumber > 30) return 'critical'
  if (dayNumber > 15) return 'warning'
  return 'normal'
}

const handleRefresh = () => {
  console.log('Refreshing debts...')
}

const handleExport = () => {
  console.log('Exporting debts...')
}
</script>

<style scoped>
.debt-management-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 1.5rem;
}

/* Header Section */
.debt-header {
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
  background: #fee2e2;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.debt-icon {
  font-size: 2rem;
  color: #dc2626;
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

/* Controls Section */
.controls-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.municipality-section {
  margin-bottom: 1.5rem;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

.municipality-tabs {
  display: flex;
  gap: 0.5rem;
}

.municipality-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
}

.municipality-btn.active {
  background: #1e40af;
  color: white;
  border-color: #1e40af;
}

.district-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.district-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.district-dropdown {
  min-width: 200px;
}

.district-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.checkbox-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
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
  background: #1e40af;
  color: white;
}

/* Search and Filters */
.search-filters-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.status-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-dropdown {
  min-width: 120px;
}

.filter-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.advanced-filters-btn {
  padding: 8px 16px;
  font-size: 14px;
}

/* Quick Filters */
.quick-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quick-filters-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.quick-filter-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
}

.quick-filter-btn.active {
  background: #dbeafe;
  color: #1e40af;
  border-color: #3b82f6;
}

/* Table Section */
.debts-table-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f3f4f6;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.table-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.table-actions {
  display: flex;
  gap: 0.75rem;
}

.refresh-btn,
.export-btn {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

/* Table */
.debts-table {
  width: 100%;
  min-width: 1400px;
}

.debts-table :deep(.table-header-cell) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

.debts-table :deep(.p-datatable-tbody > tr > td) {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

/* Table Cell Styles */
.relation-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.relation-icon {
  color: #6b7280;
  font-size: 14px;
}

.amount-cell {
  display: flex;
  flex-direction: column;
}

.amount-main {
  font-weight: 600;
  color: #dc2626;
}

.amount-detail {
  font-size: 12px;
  color: #6b7280;
}

.days-overdue {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.days-overdue.critical {
  background: #fee2e2;
  color: #dc2626;
}

.days-overdue.warning {
  background: #fef3c7;
  color: #d97706;
}

.days-overdue.normal {
  background: #f3f4f6;
  color: #374151;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.overdue {
  background: #fee2e2;
  color: #dc2626;
}

.escalation-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.escalation-badge.final {
  background: #fce7f3;
  color: #be185d;
}

.escalation-badge.warning {
  background: #fef3c7;
  color: #d97706;
}

.manage-btn {
  color: #3b82f6;
  font-weight: 500;
  padding: 4px 8px;
}

/* Table Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-top: 1px solid #f3f4f6;
  background: #fafbfc;
}

.pagination-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
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

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-dropdown {
  min-width: 80px;
}

.items-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Bottom Cards */
.bottom-cards {
  display: flex;
  gap: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-icon {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon i {
  font-size: 1.25rem;
  color: #6b7280;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .debt-management-page {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .district-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .bottom-cards {
    flex-direction: column;
  }
}
</style>
