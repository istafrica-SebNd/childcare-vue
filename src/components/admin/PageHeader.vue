<template>
  <div class="page-header">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <i :class="['header-icon', iconClass]"></i>
        <div class="header-text">
          <h1 class="page-title">{{ title }}</h1>
          <p class="page-subtitle">{{ subtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Controls Section -->
    <div class="controls-section">
      <div class="controls-left">
        <!-- Radio/Checkbox -->
        <div class="control-group">
          <div class="radio-option" v-if="showRadioOption">
            <span class="radio-dot active"></span>
            <span class="radio-label">{{ radioLabel }}</span>
          </div>
          <div class="checkbox-option" v-if="showCheckbox">
            <Checkbox
              v-model="localCheckboxValue"
              :binary="true"
              :inputId="checkboxId"
            />
            <label :for="checkboxId" class="checkbox-label">
              {{ checkboxLabel }}
            </label>
          </div>
        </div>
      </div>

      <div class="controls-right">
        <!-- Tab Control -->
        <div class="tab-control" v-if="tabOptions && tabOptions.length > 0">
          <SelectButton
            v-model="localTabValue"
            :options="tabOptions"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <!-- Dropdown -->
        <div class="dropdown-control" v-if="dropdownOptions && dropdownOptions.length > 0">
          <Dropdown
            v-model="localDropdownValue"
            :options="dropdownOptions"
            :optionLabel="dropdownOptionLabel || 'name'"
            :optionValue="dropdownOptionValue || 'value'"
            :placeholder="dropdownPlaceholder"
            class="control-dropdown"
          >
            <template #value="slotProps" v-if="$slots.dropdownValue">
              <slot name="dropdownValue" :value="slotProps.value"></slot>
            </template>
            <template #option="slotProps" v-if="$slots.dropdownOption">
              <slot name="dropdownOption" :option="slotProps.option"></slot>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons" v-if="actionButtons && actionButtons.length > 0">
      <Button
        v-for="button in actionButtons"
        :key="button.value"
        :label="button.label"
        :class="['action-btn', {
          'action-btn-primary': localActiveAction === button.value,
          'action-btn-secondary': localActiveAction !== button.value
        }]"
        @click="handleActionClick(button.value)"
      />
    </div>

    <!-- Search Section -->
    <div class="search-section" v-if="showSearch">
      <InputText
        v-model="localSearchValue"
        :placeholder="searchPlaceholder"
        class="search-input"
      />
    </div>

    <!-- Filters Panel -->
    <div class="filters-panel" v-if="showFilters">
      <div class="filters-header" @click="toggleFilters">
        <i :class="['pi', filtersExpanded ? 'pi-chevron-down' : 'pi-chevron-right']"></i>
        <span class="filters-title">{{ $t('common.filters') }}</span>
      </div>

      <div class="filters-content" v-if="filtersExpanded">
        <div class="filters-row">
          <div class="filter-label">{{ filterLabel || 'Fields' }}</div>
          <div class="filter-controls">
            <slot name="filters"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectButton from 'primevue/selectbutton'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const { t } = useI18n()

interface TabOption {
  label: string
  value: string
}

interface ActionButton {
  label: string
  value: string
}

interface DropdownOption {
  [key: string]: any
}

const props = defineProps<{
  // Header props
  title: string
  subtitle: string
  iconClass?: string

  // Control props
  showRadioOption?: boolean
  radioLabel?: string
  showCheckbox?: boolean
  checkboxLabel?: string
  checkboxValue?: boolean
  checkboxId?: string

  // Tab props
  tabOptions?: TabOption[]
  tabValue?: string

  // Dropdown props
  dropdownOptions?: DropdownOption[]
  dropdownValue?: any
  dropdownPlaceholder?: string
  dropdownOptionLabel?: string
  dropdownOptionValue?: string

  // Action buttons
  actionButtons?: ActionButton[]
  activeAction?: string

  // Search
  showSearch?: boolean
  searchValue?: string
  searchPlaceholder?: string

  // Filters
  showFilters?: boolean
  filterLabel?: string
}>()

const emit = defineEmits<{
  'update:checkboxValue': [value: boolean]
  'update:tabValue': [value: string]
  'update:dropdownValue': [value: any]
  'update:activeAction': [value: string]
  'update:searchValue': [value: string]
  'action-click': [value: string]
  'apply-filters': []
  'clear-filters': []
}>()

// Local reactive values
const filtersExpanded = ref(false)

const localCheckboxValue = computed({
  get: () => props.checkboxValue || false,
  set: (value) => emit('update:checkboxValue', value)
})

const localTabValue = computed({
  get: () => props.tabValue || '',
  set: (value) => emit('update:tabValue', value)
})

const localDropdownValue = computed({
  get: () => props.dropdownValue,
  set: (value) => emit('update:dropdownValue', value)
})

const localActiveAction = computed({
  get: () => props.activeAction || '',
  set: (value) => emit('update:activeAction', value)
})

const localSearchValue = computed({
  get: () => props.searchValue || '',
  set: (value) => emit('update:searchValue', value)
})

// Methods
const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value
}

const handleActionClick = (value: string) => {
  localActiveAction.value = value
  emit('action-click', value)
}

const handleApplyFilters = () => {
  emit('apply-filters')
}

const handleClearFilters = () => {
  emit('clear-filters')
}
</script>

<style scoped>

/* Header Section */
.header-section {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2.5rem;
  color: #10b981;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

/* Controls Section */
.controls-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1f2937;
  display: inline-block;
}

.radio-label {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Tab Control */
.tab-control :deep(.p-selectbutton) {
  background: transparent;
  border: none;
  gap: 8px;
}

.tab-control :deep(.p-selectbutton .p-button) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin: 0;
}

.tab-control :deep(.p-selectbutton .p-button.p-highlight) {
  background: #10b981;
  border-color: #10b981;
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.tab-control :deep(.p-selectbutton .p-button:hover:not(.p-highlight)) {
  border-color: #9ca3af;
  background: #f9fafb;
}

/* Override any PrimeVue default spacing issues */
.tab-control :deep(.p-selectbutton .p-button:first-child) {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.tab-control :deep(.p-selectbutton .p-button:last-child) {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* Dropdown Control */
.control-dropdown {
  min-width: 240px;
}

.control-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.control-dropdown :deep(.p-dropdown-label) {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.control-dropdown :deep(.p-dropdown-trigger) {
  width: 40px;
  border: none;
  color: #6b7280;
}

.control-dropdown :deep(.p-dropdown-panel) {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin-top: 4px;
  padding: 4px 0;
  z-index: 9999;
  min-width: 280px;
}

.control-dropdown :deep(.p-dropdown-item) {
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  transition: background 0.15s ease;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-dropdown :deep(.p-dropdown-item:hover) {
  background: #f3f4f6;
}

.control-dropdown :deep(.p-dropdown-item.p-highlight) {
  background: #eff6ff;
  color: #1d4ed8;
}

/* Ensure dropdown is properly positioned and sized */
.control-dropdown :deep(.p-dropdown-trigger .p-dropdown-trigger-icon) {
  color: #6b7280;
  font-size: 12px;
}

.control-dropdown :deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #9ca3af;
}

.control-dropdown :deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 0 1.5rem;
}

.action-btn {
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  background: white;
  color: #374151;
}

.action-btn-primary {
  background: #1e40af;
  color: white;
  border-color: #1e40af;
}

.action-btn-secondary:hover {
  background: #f3f4f6;
}

/* Search Section */
.search-section {
  padding: 0 1.5rem;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Filters Panel */
.filters-panel {
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filters-header {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.filters-title {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

.filters-content {
  padding: 1.5rem;
}

.filters-row {
  margin-bottom: 1.5rem;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-left,
  .controls-right {
    justify-content: center;
  }

  .action-buttons {
    justify-content: center;
  }
}
</style>
