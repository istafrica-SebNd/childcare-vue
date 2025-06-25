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
              <p class="header-subtitle">Manage system-wide user roles and permission templates</p>
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
          <!-- Search and Actions Bar -->
          <div class="search-actions-bar">
            <div class="search-section">
              <div class="search-input-wrapper">
                <i class="pi pi-search search-icon"></i>
                <InputText
                  v-model="searchQuery"
                  placeholder="Search roles..."
                  class="search-input"
                />
              </div>
            </div>
            <div class="action-buttons">
              <Button
                icon="pi pi-upload"
                label="Import"
                outlined
                class="action-btn"
                @click="handleImport"
              />
              <Button
                icon="pi pi-download"
                label="Export"
                outlined
                class="action-btn"
                @click="handleExport"
              />
              <Button
                icon="pi pi-plus"
                label="Create Role"
                class="action-btn create-btn"
                @click="handleCreateRole"
              />
            </div>
          </div>

          <!-- Data Table -->
          <div class="table-section">
            <DataTable
              :value="filteredRoles"
              v-model:selection="selectedRoles"
              dataKey="id"
              class="roles-table"
              :scrollable="false"
            >
              <!-- Selection Column -->
              <Column selectionMode="multiple" style="width: 3rem" headerClass="table-header-cell">
                <template #header>
                  <Checkbox v-model="selectAll" :binary="true" @change="handleSelectAll" />
                </template>
              </Column>

              <!-- Role Name Column -->
              <Column field="roleName" header="Role Name" style="width: 15rem" headerClass="table-header-cell" />

              <!-- Description Column -->
              <Column field="description" header="Description" style="width: 25rem" headerClass="table-header-cell" />

              <!-- Users Column -->
              <Column field="users" header="Users" style="width: 8rem" headerClass="table-header-cell">
                <template #body="slotProps">
                  <span class="user-count">{{ slotProps.data.users }}</span>
                </template>
              </Column>

              <!-- Status Column -->
              <Column field="status" header="Status" style="width: 8rem" headerClass="table-header-cell">
                <template #body="slotProps">
                  <span :class="['status-badge', slotProps.data.status.toLowerCase()]">
                    {{ slotProps.data.status }}
                  </span>
                </template>
              </Column>

              <!-- Created Column -->
              <Column field="created" header="Created" style="width: 10rem" headerClass="table-header-cell" />

              <!-- Actions Column -->
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

          <!-- Pagination -->
          <div class="pagination-section">
            <div class="pagination-controls">
              <Button
                label="Previous"
                icon="pi pi-angle-left"
                outlined
                :disabled="currentPage === 1"
                @click="currentPage--"
              />
              <Button
                :label="'1'"
                :class="['pagination-number', { 'active': currentPage === 1 }]"
                @click="currentPage = 1"
              />
              <Button
                :label="'2'"
                :class="['pagination-number', { 'active': currentPage === 2 }]"
                @click="currentPage = 2"
              />
              <Button
                :label="'3'"
                :class="['pagination-number', { 'active': currentPage === 3 }]"
                @click="currentPage = 3"
              />
              <Button
                label="Next"
                icon="pi pi-angle-right"
                iconPos="right"
                outlined
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              />
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'

// Types
interface Role {
  id: string
  roleName: string
  description: string
  users: number
  status: string
  created: string
}

// Reactive data
const searchQuery = ref('')
const selectedRoles = ref<Role[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const totalPages = ref(3)

// Mock data
const rolesData = ref<Role[]>([
  {
    id: 'R001',
    roleName: 'Super Administrator',
    description: 'Full system access',
    users: 2,
    status: 'Active',
    created: '2024-01-15'
  },
  {
    id: 'R002',
    roleName: 'District Manager',
    description: 'District level management',
    users: 8,
    status: 'Active',
    created: '2024-01-20'
  },
  {
    id: 'R003',
    roleName: 'Kindergarten Director',
    description: 'Kindergarten management',
    users: 15,
    status: 'Active',
    created: '2024-02-01'
  },
  {
    id: 'R004',
    roleName: 'Educator',
    description: 'Daily operations and child care',
    users: 45,
    status: 'Active',
    created: '2024-02-10'
  },
  {
    id: 'R005',
    roleName: 'Parent',
    description: 'Guardian access',
    users: 230,
    status: 'Active',
    created: '2024-02-15'
  }
])



// Computed
const filteredRoles = computed(() => {
  if (!searchQuery.value) {
    return rolesData.value
  }

  const query = searchQuery.value.toLowerCase()
  return rolesData.value.filter(role =>
    role.roleName.toLowerCase().includes(query) ||
    role.description.toLowerCase().includes(query)
  )
})



// Methods
const handleSelectAll = () => {
  selectedRoles.value = selectAll.value ? [...filteredRoles.value] : []
}

const handleImport = () => {
  console.log('Importing roles...')
}

const handleExport = () => {
  console.log('Exporting roles...')
}

const handleCreateRole = () => {
  console.log('Creating new role...')
}

const handleEdit = (role: Role) => {
  console.log('Editing role:', role)
}

const handleDelete = (role: Role) => {
  console.log('Deleting role:', role)
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
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
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

.action-buttons {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.create-btn {
  background: #1d4ed8;
  color: white;
  border: none;
}

.create-btn:hover {
  background: #1e40af;
}

/* Table Section */
.table-section {
  margin-bottom: 2rem;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.roles-table {
  width: 100%;
}

.roles-table :deep(.table-header-cell) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 12px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  text-align: left;
}

.roles-table :deep(.p-datatable-tbody > tr > td) {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.roles-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: #f9fafb;
}

/* Table Cell Styles */
.user-count {
  font-weight: 600;
  color: #1f2937;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
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
  padding: 6px;
  border-radius: 4px;
  color: #6b7280;
}

.edit-icon:hover {
  color: #3b82f6;
  background: #f3f4f6;
}

.delete-icon:hover {
  color: #dc2626;
  background: #fef2f2;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.pagination-number {
  min-width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
}

.pagination-number.active {
  background: #1d4ed8;
  color: white;
  border-color: #1d4ed8;
}

.pagination-number:hover:not(.active) {
  background: #f3f4f6;
}

/* Tab Content Styles */
.tab-content {
  min-height: 400px;
}

/* Limited Roles Layout */
.limited-roles-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.available-roles-section,
.limited-roles-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.create-limited-role-btn {
  background: #1d4ed8;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
}

.available-roles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.available-role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.role-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.role-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.select-role-btn {
  padding: 6px;
  color: #3b82f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.select-role-btn:hover {
  background: #f3f4f6;
}

.limited-roles-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.limited-table {
  width: 100%;
}

.restrictions-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.restriction-item {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Filter Section */
.filter-section {
  display: flex;
  align-items: center;
}

.filter-dropdown {
  min-width: 180px;
}

.filter-dropdown :deep(.p-dropdown) {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

/* Module Groups Table */
.module-groups-table {
  width: 100%;
}

/* Modules Table */
.modules-table {
  width: 100%;
}

.group-link {
  color: #3b82f6;
  cursor: pointer;
}

.group-link:hover {
  text-decoration: underline;
}

.config-icon:hover {
  color: #059669;
  background: #ecfdf5;
}

.disable-icon:hover {
  color: #dc2626;
  background: #fef2f2;
}

/* Responsive */
@media (max-width: 768px) {
  .user-role-templates-page {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .tab-navigation {
    flex-wrap: wrap;
  }

  .search-actions-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .action-buttons {
    justify-content: flex-end;
  }

  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .limited-roles-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
