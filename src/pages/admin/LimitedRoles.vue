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
          <div class="limited-roles-layout">
            <!-- Available Roles Section -->
            <div class="available-roles-section">
              <h3 class="section-title">Available Roles</h3>
              <div class="available-roles-list">
                <div
                  v-for="role in availableRoles"
                  :key="role.id"
                  class="available-role-item"
                >
                  <div class="role-info">
                    <h4 class="role-name">{{ role.name }}</h4>
                    <p class="role-description">{{ role.description }}</p>
                  </div>
                  <Button
                    icon="pi pi-angle-right"
                    class="select-role-btn"
                    @click="selectRole(role)"
                  />
                </div>
              </div>
            </div>

            <!-- Limited Roles Section -->
            <div class="limited-roles-section">
              <div class="section-header">
                <h3 class="section-title">Limited Roles</h3>
                <Button
                  icon="pi pi-plus"
                  label="Create Limited Role"
                  class="create-limited-role-btn"
                  @click="handleCreateLimitedRole"
                />
              </div>

              <!-- Limited Roles Table -->
              <div class="limited-roles-table">
                <DataTable
                  :value="limitedRoles"
                  class="limited-table"
                  :scrollable="false"
                >
                  <Column field="name" header="Name" style="width: 12rem" headerClass="table-header-cell" />
                  <Column field="baseRole" header="Base Role" style="width: 10rem" headerClass="table-header-cell" />
                  <Column field="restrictions" header="Restrictions" style="width: 15rem" headerClass="table-header-cell">
                    <template #body="slotProps">
                      <div class="restrictions-list">
                        <div
                          v-for="restriction in slotProps.data.restrictions"
                          :key="restriction"
                          class="restriction-item"
                        >
                          {{ restriction }}
                        </div>
                      </div>
                    </template>
                  </Column>
                  <Column field="users" header="Users" style="width: 6rem" headerClass="table-header-cell">
                    <template #body="slotProps">
                      <span class="user-count">{{ slotProps.data.users }}</span>
                    </template>
                  </Column>
                  <Column field="actions" header="Actions" style="width: 8rem" headerClass="table-header-cell">
                    <template #body="slotProps">
                      <div class="action-icons">
                        <Button
                          icon="pi pi-pencil"
                          class="p-button-text action-icon edit-icon"
                          @click="handleEditLimitedRole(slotProps.data)"
                        />
                        <Button
                          icon="pi pi-trash"
                          class="p-button-text action-icon delete-icon"
                          @click="handleDeleteLimitedRole(slotProps.data)"
                        />
                      </div>
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

// Types
interface AvailableRole {
  id: string
  name: string
  description: string
}

interface LimitedRole {
  id: string
  name: string
  baseRole: string
  restrictions: string[]
  users: number
}

// Available roles for limited roles creation
const availableRoles = ref<AvailableRole[]>([
  {
    id: 'AR001',
    name: 'Super Administrator',
    description: 'Full system access'
  },
  {
    id: 'AR002',
    name: 'District Manager',
    description: 'District level management'
  },
  {
    id: 'AR003',
    name: 'Kindergarten Director',
    description: 'Kindergarten management'
  },
  {
    id: 'AR004',
    name: 'Educator',
    description: 'Daily operations and child care'
  },
  {
    id: 'AR005',
    name: 'Parent',
    description: 'Guardian access'
  }
])

// Limited roles data
const limitedRoles = ref<LimitedRole[]>([
  {
    id: 'LR001',
    name: 'Temporary Educator',
    baseRole: 'Educator',
    restrictions: ['Cannot delete records', 'View only reports'],
    users: 3
  },
  {
    id: 'LR002',
    name: 'Intern Administrator',
    baseRole: 'District Manager',
    restrictions: ['Cannot modify policies', 'Limited user management'],
    users: 1
  },
  {
    id: 'LR003',
    name: 'Substitute Teacher',
    baseRole: 'Educator',
    restrictions: ['Cannot access parent communications'],
    users: 8
  }
])

// Methods
const selectRole = (role: AvailableRole) => {
  console.log('Selecting role for limited role creation:', role)
}

const handleCreateLimitedRole = () => {
  console.log('Creating limited role...')
}

const handleEditLimitedRole = (limitedRole: LimitedRole) => {
  console.log('Editing limited role:', limitedRole)
}

const handleDeleteLimitedRole = (limitedRole: LimitedRole) => {
  console.log('Deleting limited role:', limitedRole)
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

/* Limited Roles Layout */
.limited-roles-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Available Roles Section */
.available-roles-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.available-roles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.available-role-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.available-role-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.role-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.role-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.select-role-btn {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 8px;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-role-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* Limited Roles Section */
.limited-roles-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.create-limited-role-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.create-limited-role-btn:hover {
  background: #2563eb;
}

/* Limited Roles Table */
.limited-roles-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

:deep(.limited-table) {
  border: none;
}

:deep(.limited-table .p-datatable-header) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
}

:deep(.limited-table .p-datatable-thead > tr > th) {
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

:deep(.limited-table .p-datatable-tbody > tr > td) {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  border-right: none;
  border-left: none;
  border-top: none;
  font-size: 0.875rem;
  color: #374151;
}

:deep(.limited-table .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

.restrictions-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.restriction-item {
  background: #f1f5f9;
  color: #64748b;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.user-count {
  font-weight: 600;
  color: #1f2937;
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

@media (max-width: 1024px) {
  .limited-roles-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
