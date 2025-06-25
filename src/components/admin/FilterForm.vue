<template>
  <div class="filter-form">
    <div class="filter-row" v-for="(row, rowIndex) in filterConfig" :key="rowIndex">
      <div class="filter-label" v-if="row.label">{{ row.label }}</div>
      <div class="filter-controls">
        <div
          v-for="(field, fieldIndex) in row.fields"
          :key="fieldIndex"
          class="filter-field"
        >
          <!-- Dropdown Filter -->
          <Dropdown
            v-if="field.type === 'dropdown'"
            v-model="localValues[field.key]"
            :options="field.options"
            :placeholder="field.placeholder"
            :optionLabel="field.optionLabel || 'label'"
            :optionValue="field.optionValue || 'value'"
            class="clean-dropdown"
            @change="emitFilterChange"
          />

          <!-- Text Input Filter -->
          <InputText
            v-else-if="field.type === 'text'"
            v-model="localValues[field.key]"
            :placeholder="field.placeholder"
            class="clean-input"
            @input="emitFilterChange"
          />

          <!-- Date Picker Filter -->
          <Calendar
            v-else-if="field.type === 'date'"
            v-model="localValues[field.key]"
            :placeholder="field.placeholder"
            class="clean-date"
            @date-select="emitFilterChange"
          />

          <!-- Number Input Filter -->
          <InputNumber
            v-else-if="field.type === 'number'"
            v-model="localValues[field.key]"
            :placeholder="field.placeholder"
            class="clean-number"
            @input="emitFilterChange"
          />

          <!-- Multi-Select Filter -->
          <MultiSelect
            v-else-if="field.type === 'multiselect'"
            v-model="localValues[field.key]"
            :options="field.options"
            :placeholder="field.placeholder"
            :optionLabel="field.optionLabel || 'label'"
            :optionValue="field.optionValue || 'value'"
            class="clean-multiselect"
            @change="emitFilterChange"
          />

          <!-- Checkbox Filter -->
          <div v-else-if="field.type === 'checkbox'" class="filter-checkbox">
            <Checkbox
              v-model="localValues[field.key]"
              :inputId="field.key"
              :binary="true"
              @change="emitFilterChange"
            />
            <label :for="field.key" class="checkbox-label">{{ field.label }}</label>
          </div>

          <!-- Radio Group Filter -->
          <div v-else-if="field.type === 'radio'" class="filter-radio-group">
            <div v-for="option in field.options" :key="option.value" class="radio-option">
              <RadioButton
                v-model="localValues[field.key]"
                :value="option.value"
                :inputId="`${field.key}_${option.value}`"
                @change="emitFilterChange"
              />
              <label :for="`${field.key}_${option.value}`" class="radio-label">{{ option.label }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="filter-actions" v-if="showActions">
      <Button
        :label="applyLabel || 'Apply'"
        class="apply-btn"
        @click="handleApply"
      />
      <Button
        :label="clearLabel || 'Clear'"
        outlined
        class="clear-btn"
        @click="handleClear"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'

interface FilterOption {
  label: string
  value: string | number | boolean
}

interface FilterField {
  key: string
  type: 'dropdown' | 'text' | 'date' | 'number' | 'multiselect' | 'checkbox' | 'radio'
  label?: string
  placeholder?: string
  options?: FilterOption[]
  optionLabel?: string
  optionValue?: string
  class?: string
  defaultValue?: string | number | boolean | string[]
}

interface FilterRow {
  label?: string
  fields: FilterField[]
}

const props = defineProps<{
  filterConfig: FilterRow[]
  modelValue?: Record<string, string | number | boolean | string[]>
  showActions?: boolean
  applyLabel?: string
  clearLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string | number | boolean | string[]>]
  'apply': [values: Record<string, string | number | boolean | string[]>]
  'clear': []
  'change': [values: Record<string, string | number | boolean | string[]>]
}>()

// Initialize local values from all filter fields
const initializeValues = () => {
  const values: Record<string, string | number | boolean | string[]> = {}
  props.filterConfig.forEach(row => {
    row.fields.forEach(field => {
      values[field.key] = field.defaultValue || (field.type === 'multiselect' ? [] : '')
    })
  })
  return values
}

const localValues = ref(props.modelValue || initializeValues())

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    localValues.value = { ...newValue }
  }
}, { deep: true })

// Watch for changes in localValues and emit them
watch(localValues, (newValues) => {
  emit('update:modelValue', newValues)
}, { deep: true })

const emitFilterChange = () => {
  emit('change', localValues.value)
}

const handleApply = () => {
  emit('apply', localValues.value)
}

const handleClear = () => {
  localValues.value = initializeValues()
  emit('clear')
  emit('change', localValues.value)
}
</script>

<style scoped>
.filter-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.filter-row {
  margin-bottom: 1rem;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.75rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-field {
  min-width: 150px;
}

/* Clean Dropdown Styles - Match Reference Design */
.clean-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-shadow: none;
  font-size: 14px;
  min-width: 150px;
}

.clean-dropdown :deep(.p-dropdown-label) {
  padding: 8px 12px;
  color: #374151;
  font-size: 14px;
  font-weight: normal;
}

.clean-dropdown :deep(.p-dropdown-trigger) {
  width: 30px;
  color: #6b7280;
  border: none;
  background: transparent;
}

.clean-dropdown :deep(.p-dropdown-trigger .p-dropdown-trigger-icon) {
  font-size: 12px;
}

.clean-dropdown :deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: #9ca3af;
}

.clean-dropdown :deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.clean-dropdown :deep(.p-dropdown-panel) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 2px;
  padding: 4px 0;
}

.clean-dropdown :deep(.p-dropdown-item) {
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  margin: 0;
  border: none;
}

.clean-dropdown :deep(.p-dropdown-item:hover) {
  background: #f3f4f6;
}

.clean-dropdown :deep(.p-dropdown-item.p-highlight) {
  background: #eff6ff;
  color: #1d4ed8;
}

/* Clean Input Styles */
.clean-input,
.clean-date :deep(.p-inputtext),
.clean-number :deep(.p-inputtext) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  box-shadow: none;
  min-width: 150px;
}

.clean-input:hover,
.clean-date :deep(.p-inputtext:hover),
.clean-number :deep(.p-inputtext:hover) {
  border-color: #9ca3af;
}

.clean-input:focus,
.clean-date :deep(.p-inputtext:focus),
.clean-number :deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
  outline: none;
}

/* Multi-select styles */
.clean-multiselect :deep(.p-multiselect) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.clean-multiselect :deep(.p-multiselect-label) {
  padding: 8px 12px;
  color: #374151;
}

/* Checkbox Styles */
.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

/* Radio Group Styles */
.filter-radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

/* Action Buttons */
.filter-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.apply-btn {
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}

.apply-btn:hover {
  background: #1d4ed8;
}

.clear-btn {
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  color: #374151;
  background: white;
}

.clear-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-field {
    min-width: auto;
  }
}
</style>
