<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <BaseLayout>
    <template #content>
      <div class="user-role-templates-page">
        <!-- Header Section -->
        <div class="header-section">
          <div class="header-content">
            <div class="header-icon">
              <i class="pi pi-user-edit role-icon"></i>
            </div>
            <div class="header-text">
              <h1 class="header-title">User & Role Templates</h1>
              <p class="header-subtitle">Manage user permissions and role assignments across the system</p>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <Button
            icon="pi pi-users"
            label="Roles"
            :class="['tab-btn', { 'active': $route.name === 'AdminRoles' }]"
            @click="$router.push('/admin/roles')"
          />
          <Button
            icon="pi pi-shield"
            label="Limited Roles"
            :class="['tab-btn', { 'active': $route.name === 'AdminLimitedRoles' }]"
            @click="$router.push('/admin/limited-roles')"
          />
          <Button
            icon="pi pi-th-large"
            label="Module Groups"
            :class="['tab-btn', { 'active': $route.name === 'AdminModuleGroups' }]"
            @click="$router.push('/admin/module-groups')"
          />
          <Button
            icon="pi pi-cog"
            label="Modules"
            :class="['tab-btn', { 'active': $route.name === 'AdminModules' }]"
            @click="$router.push('/admin/modules')"
          />
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Search and Filter Bar -->
          <div class="search-actions-bar">
            <div class="search-section">
              <div class="search-input-wrapper">
                <i class="pi pi-search search-icon"></i>
                <InputText
                  v-model="searchQuery"
                  placeholder="Search modules..."
                  class="search-input"
                />
              </div>
            </div>
            <div class="filter-section">
              <Dropdown
                v-model="sourceFilter"
                :options="sourceOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Filter by source"
                class="filter-dropdown"
                showClear
              />
            </div>
          </div>

          <!-- Data Table -->
          <div class="table-section">
            <DataTable
              :value="filteredModules"
              class="modules-table"
              :scrollable="false"
            >
              <Column field="moduleName" header="Module Name" style="width: 15rem" headerClass="table-header-cell" />
              <Column field="group" header="Group" style="width: 12rem" headerClass="table-header-cell">
                <template #body="slotProps">
                  <button class="group-link" @click="handleGroupClick(slotProps.data.group)">
                    {{ slotProps.data.group }}
                  </button>
                </template>
              </Column>
              <Column field="source" header="Source" style="width: 10rem" headerClass="table-header-cell" />
              <Column field="version" header="Version" style="width: 8rem" headerClass="table-header-cell">
                <template #body="slotProps">
                  <span class="version-text">{{ slotProps.data.version }}</span>
                </template>
              </Column>
              <Column field="status" header="Status" style="width: 8rem" headerClass="table-header-cell">
                <template #body="slotProps">
                  <span :class="['status-badge', slotProps.data.status.toLowerCase()]">
                    {{ slotProps.data.status }}
                  </span>
                </template>
              </Column>
              <Column field="actions" header="Actions" style="width: 8rem" headerClass="table-header-cell">
                <template #body="slotProps">
                  <div class="action-icons">
                    <Button
                      icon="pi pi-cog"
                      class="p-button-text action-icon config-icon"
                      @click="handleConfigure(slotProps.data)"
                    />
                    <Button
                      icon="pi pi-ban"
                      class="p-button-text action-icon disable-icon"
                      @click="handleDisable(slotProps.data)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

// Types
interface Module {
  id: string
  moduleName: string
  group: string
  source: string
  version: string
  status: string
}

// Reactive data
const searchQuery = ref('')
const sourceFilter = ref('')

// Source filter options
const sourceOptions = ref([
  { value: 'Core System', label: 'Core System' },
  { value: 'Third Party', label: 'Third Party' },
  { value: 'External API', label: 'External API' }
])

// Modules data
const modulesData = ref<Module[]>([
  {
    id: 'M001',
    moduleName: 'User Registration',
    group: 'User Management',
    source: 'Core System',
    version: '2.1.0',
    status: 'Active'
  },
  {
    id: 'M002',
    moduleName: 'Role Assignment',
    group: 'User Management',
    source: 'Core System',
    version: '2.1.0',
    status: 'Active'
  },
  {
    id: 'M003',
    moduleName: 'Daily Attendance',
    group: 'Child Care Operations',
    source: 'Third Party',
    version: '1.8.3',
    status: 'Active'
  },
  {
    id: 'M004',
    moduleName: 'Parent Communication',
    group: 'Child Care Operations',
    source: 'Core System',
    version: '2.0.5',
    status: 'Active'
  },
  {
    id: 'M005',
    moduleName: 'Payment Processing',
    group: 'Financial Management',
    source: 'External API',
    version: '3.2.1',
    status: 'Active'
  },
  {
    id: 'M006',
    moduleName: 'Monthly Reports',
    group: 'Reporting & Analytics',
    source: 'Core System',
    version: '1.9.2',
    status: 'Active'
  },
  {
    id: 'M007',
    moduleName: 'Backup Management',
    group: 'User Management',
    source: 'Core System',
    version: '1.5.0',
    status: 'Active'
  },
  {
    id: 'M008',
    moduleName: 'Security Audit',
    group: 'User Management',
    source: 'Third Party',
    version: '2.3.1',
    status: 'Active'
  }
])

// Computed
const filteredModules = computed(() => {
  let data = modulesData.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(module =>
      module.moduleName.toLowerCase().includes(query) ||
      module.group.toLowerCase().includes(query)
    )
  }

  if (sourceFilter.value) {
    data = data.filter(module => module.source === sourceFilter.value)
  }

  return data
})

// Methods
const handleGroupClick = (group: string) => {
  console.log('Navigating to group:', group)
  // Navigate to module groups page with filter
}

const handleConfigure = (module: Module) => {
  console.log('Configuring module:', module)
}

const handleDisable = (module: Module) => {
  console.log('Disabling module:', module)
}
</script>

<style scoped>
.user-role-templates-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 1.5rem;
}

/* Header Section */
.header-section {
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
  background: #fef3c7;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-icon {
  font-size: 2rem;
  color: #d97706;
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
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: transparent;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
}

/* Main Content */
.main-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Search and Actions Bar */
.search-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 0.875rem;
  z-index: 10;
}

.search-input {
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  width: 300px;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-section {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.filter-dropdown {
  width: 200px;
}

:deep(.filter-dropdown .p-dropdown) {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
}

:deep(.filter-dropdown .p-dropdown:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

:deep(.modules-table) {
  border: none;
}

:deep(.modules-table .p-datatable-header) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
}

:deep(.modules-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  border-right: none;
  border-left: none;
  border-top: none;
  text-align: left;
}

:deep(.modules-table .p-datatable-tbody > tr > td) {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: none;
  border-left: none;
  border-top: none;
  font-size: 0.875rem;
  color: #374151;
}

:deep(.modules-table .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

.group-link {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: none;
  padding: 0;
}

.group-link:hover {
  text-decoration: underline;
  color: #2563eb;
}

.version-text {
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.action-icons {
  display: flex;
  gap: 0.5rem;
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
}

.config-icon:hover {
  background: #f3f4f6;
  color: #374151;
}

.disable-icon:hover {
  background: #fee2e2;
  color: #dc2626;
}
</style>
