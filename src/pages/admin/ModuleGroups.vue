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
          <!-- Search and Action Bar -->
          <div class="search-actions-bar">
            <div class="search-section">
              <div class="search-input-wrapper">
                <i class="pi pi-search search-icon"></i>
                <InputText
                  v-model="searchQuery"
                  placeholder="Search module groups..."
                  class="search-input"
                />
              </div>
            </div>
            <div class="action-buttons">
              <Button
                icon="pi pi-plus"
                label="Create Group"
                class="action-btn create-btn"
                @click="handleCreateGroup"
              />
            </div>
          </div>

          <!-- Data Table -->
          <div class="table-section">
            <DataTable
              :value="filteredModuleGroups"
              class="module-groups-table"
              :scrollable="false"
            >
              <Column field="groupName" header="Group Name" style="width: 15rem" headerClass="table-header-cell" />
              <Column field="description" header="Description" style="width: 25rem" headerClass="table-header-cell" />
              <Column field="modules" header="Modules" style="width: 10rem" headerClass="table-header-cell" />
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
                      icon="pi pi-pencil"
                      class="p-button-text action-icon edit-icon"
                      @click="handleEdit(slotProps.data)"
                    />
                    <Button
                      icon="pi pi-trash"
                      class="p-button-text action-icon delete-icon"
                      @click="handleDelete(slotProps.data)"
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

// Types
interface ModuleGroup {
  id: string
  groupName: string
  description: string
  modules: string
  status: string
}

// Reactive data
const searchQuery = ref('')

// Module groups data
const moduleGroups = ref<ModuleGroup[]>([
  {
    id: 'MG001',
    groupName: 'User Management',
    description: 'User and role management modules',
    modules: '5 modules',
    status: 'Active'
  },
  {
    id: 'MG002',
    groupName: 'Child Care Operations',
    description: 'Daily operations and attendance',
    modules: '12 modules',
    status: 'Active'
  },
  {
    id: 'MG003',
    groupName: 'Financial Management',
    description: 'Billing and payment processing',
    modules: '8 modules',
    status: 'Active'
  },
  {
    id: 'MG004',
    groupName: 'Reporting & Analytics',
    description: 'Reports and data analysis',
    modules: '6 modules',
    status: 'Active'
  }
])

// Computed
const filteredModuleGroups = computed(() => {
  if (!searchQuery.value) {
    return moduleGroups.value
  }

  const query = searchQuery.value.toLowerCase()
  return moduleGroups.value.filter(group =>
    group.groupName.toLowerCase().includes(query) ||
    group.description.toLowerCase().includes(query)
  )
})

// Methods
const handleCreateGroup = () => {
  console.log('Creating module group...')
}

const handleEdit = (moduleGroup: ModuleGroup) => {
  console.log('Editing module group:', moduleGroup)
}

const handleDelete = (moduleGroup: ModuleGroup) => {
  console.log('Deleting module group:', moduleGroup)
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

.action-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.create-btn {
  background: #3b82f6;
  color: white;
}

.create-btn:hover {
  background: #2563eb;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

:deep(.module-groups-table) {
  border: none;
}

:deep(.module-groups-table .p-datatable-header) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
}

:deep(.module-groups-table .p-datatable-thead > tr > th) {
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

:deep(.module-groups-table .p-datatable-tbody > tr > td) {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: none;
  border-left: none;
  border-top: none;
  font-size: 0.875rem;
  color: #374151;
}

:deep(.module-groups-table .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
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

.edit-icon:hover {
  background: #dbeafe;
  color: #2563eb;
}

.delete-icon:hover {
  background: #fee2e2;
  color: #dc2626;
}
</style>
