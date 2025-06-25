<template>
  <div class="table-wrapper">
    <!-- Table Header with Title and Actions -->
    <div class="table-header">
      <div class="table-title-section">
        <h3 class="table-title">{{ title }}</h3>
        <span class="table-subtitle">{{ subtitle }}</span>
      </div>
      <div class="table-actions">
        <Button
          v-if="showRefresh"
          icon="pi pi-refresh"
          :label="$t('common.refresh')"
          outlined
          class="refresh-btn"
          @click="$emit('refresh')"
        />
        <Button
          v-if="showExport"
          icon="pi pi-download"
          :label="$t('common.export')"
          outlined
          class="export-btn"
          @click="$emit('export')"
        />
      </div>
    </div>

    <!-- Sort Controls -->
    <div class="sort-controls" v-if="showSortControls">
      <span class="sort-label">{{ sortLabel || 'Sort Order:' }}</span>
      <Dropdown
        v-model="localSortField"
        :options="sortOptions"
        optionLabel="label"
        optionValue="value"
        class="sort-dropdown"
      />
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <DataTable
        :value="data"
        v-model:selection="localSelection"
        :dataKey="dataKey || 'id'"
        :paginator="false"
        class="data-table"
        :sortField="localSortField"
        :sortOrder="sortOrder"
      >
        <!-- Selection Column -->
        <Column v-if="selectable" selectionMode="multiple" style="width: 4rem" headerClass="table-header-cell">
          <template #header>
            <Checkbox v-model="selectAll" :binary="true" @change="handleSelectAll" />
          </template>
        </Column>

        <!-- Index Column -->
        <Column v-if="showIndex" field="id" header="#" style="width: 4rem" headerClass="table-header-cell" />

        <!-- Dynamic Columns from Slot -->
        <slot name="columns"></slot>
      </DataTable>
    </div>

    <!-- Pagination Footer -->
    <div class="table-footer">
      <div class="pagination-section">
        <span class="pagination-info">Page {{ currentPage || 1 }} of {{ totalPages || 1 }}</span>
        <div class="pagination-controls">
          <Button
            icon="pi pi-angle-left"
            class="p-button-text pagination-btn"
            :disabled="(currentPage || 1) === 1"
            @click="handlePageChange((currentPage || 1) - 1)"
          />
          <Button
            :label="(currentPage || 1).toString()"
            class="pagination-active"
          />
          <Button
            icon="pi pi-angle-right"
            class="p-button-text pagination-btn"
            :disabled="(currentPage || 1) === (totalPages || 1)"
            @click="handlePageChange((currentPage || 1) + 1)"
          />
        </div>
      </div>
      <div class="items-per-page">
        <Dropdown
          v-model="localItemsPerPage"
          :options="itemsPerPageOptions"
          class="items-dropdown"
        />
        <span class="items-label">{{ $t('common.itemsPerPage') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'

interface SortOption {
  value: string
  label: string
}

interface TableItem {
  id: string
  [key: string]: unknown
}

const props = defineProps<{
  // Table data and config
  data: TableItem[]
  title: string
  subtitle?: string
  dataKey?: string

  // Selection
  selectable?: boolean
  selection?: TableItem[]

  // Display options
  showIndex?: boolean
  showRefresh?: boolean
  showExport?: boolean

  // Sorting
  showSortControls?: boolean
  sortLabel?: string
  sortOptions?: SortOption[]
  sortField?: string
  sortOrder?: number

  // Pagination
  currentPage?: number
  totalPages?: number
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
}>()

const emit = defineEmits<{
  'update:selection': [value: TableItem[]]
  'update:sortField': [value: string]
  'update:currentPage': [value: number]
  'update:itemsPerPage': [value: number]
  'refresh': []
  'export': []
  'page-change': [page: number]
}>()

// Local reactive values
const selectAll = ref(false)

const localSelection = computed({
  get: () => props.selection || [],
  set: (value) => emit('update:selection', value)
})

const localSortField = computed({
  get: () => props.sortField || '',
  set: (value) => emit('update:sortField', value)
})

const localItemsPerPage = computed({
  get: () => props.itemsPerPage || 15,
  set: (value) => emit('update:itemsPerPage', value)
})

// Methods
const handleSelectAll = () => {
  if (selectAll.value) {
    localSelection.value = [...props.data]
  } else {
    localSelection.value = []
  }
}

const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
  emit('page-change', page)
}

// Watch for data changes to update selectAll state
watch(() => props.data, () => {
  selectAll.value = localSelection.value.length === props.data.length && props.data.length > 0
}, { immediate: true })

watch(() => localSelection.value, () => {
  selectAll.value = localSelection.value.length === props.data.length && props.data.length > 0
})
</script>

<style scoped>
/* Table Wrapper */
.table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Table Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f3f4f6;
}

.table-title-section {
  display: flex;
  flex-direction: column;
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
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  color: #374151;
  background: white;
}

.refresh-btn:hover,
.export-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* Sort Controls */
.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.sort-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.sort-dropdown {
  min-width: 200px;
}

.sort-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.sort-dropdown :deep(.p-dropdown-label) {
  padding: 8px 12px;
  color: #374151;
}

/* Table Container */
.table-container {
  width: 100%;

}

.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.data-table {
  min-width: 1200px;
  border: none;
}

/* Table Headers */
.data-table :deep(.table-header-cell) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  text-align: left;
  white-space: nowrap;
}

.data-table :deep(.table-header-cell .p-column-header-content) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Sort indicators */
.data-table :deep(.p-sortable-column .p-sortable-column-icon) {
  color: #9ca3af;
  font-size: 0.75rem;
}

.data-table :deep(.p-sortable-column.p-highlight .p-sortable-column-icon) {
  color: #3b82f6;
}

/* Table Body */
.data-table :deep(.p-datatable-tbody > tr > td) {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
  white-space: nowrap;
}

.data-table :deep(.p-datatable-tbody > tr:hover) {
  background: #f9fafb;
}

/* Checkbox styling */
.data-table :deep(.p-checkbox) {
  margin: 0;
}

.data-table :deep(.p-checkbox .p-checkbox-box) {
  border-radius: 4px;
  border: 1px solid #d1d5db;
}

.data-table :deep(.p-checkbox.p-checkbox-checked .p-checkbox-box) {
  background: #3b82f6;
  border-color: #3b82f6;
}

/* Table Footer / Pagination */
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
  align-items: center;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.5rem;
  border-radius: 6px;
  color: #6b7280;
  border: 1px solid #d1d5db;
  background: white;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  color: #374151;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-active {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
  font-weight: 500;
  min-width: 2.5rem;
  text-align: center;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.items-dropdown {
  min-width: 80px;
}

.items-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.items-dropdown :deep(.p-dropdown-label) {
  padding: 8px 12px;
  color: #374151;
}

.items-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .sort-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .table-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pagination-section {
    justify-content: center;
  }

  .items-per-page {
    justify-content: center;
  }
}
</style>
