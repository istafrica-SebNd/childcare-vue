<template>
  <BaseLayout>
    <template #content>
      <div class="admin-dashboard">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('admin.dashboard.title') }}</h1>
          <p class="text-gray-600">{{ $t('admin.dashboard.subtitle') }}</p>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Districts -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-600 mb-1">{{ $t('admin.dashboard.kpis.totalDistricts') }}</div>
                <div class="text-3xl font-bold text-gray-900">15</div>
                <div class="text-sm text-gray-500">{{ $t('admin.dashboard.kpis.active') }}</div>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-map-marker text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <!-- System Uptime -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-600 mb-1">{{ $t('admin.dashboard.kpis.systemUptime') }}</div>
                <div class="text-3xl font-bold text-green-600">99.94%</div>
                <div class="text-sm text-green-600">+0.1%</div>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-chart-line text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <!-- Total Children -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-600 mb-1">{{ $t('admin.dashboard.kpis.totalChildren') }}</div>
                <div class="text-3xl font-bold text-purple-600">34,567</div>
                <div class="text-sm text-green-600">+287</div>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-users text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <!-- Compliance Score -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-600 mb-1">{{ $t('admin.dashboard.kpis.complianceScore') }}</div>
                <div class="text-3xl font-bold text-orange-600">96.8%</div>
                <div class="text-sm text-green-600">+2.1%</div>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-check-circle text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="mb-6">
          <div class="flex space-x-8 border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ $t(tab.nameKey) }}
            </button>
          </div>
        </div>

        <!-- Filter Buttons -->
        <div class="mb-6">
          <div class="flex flex-wrap gap-3">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              <i :class="filter.icon" class="mr-2"></i>
              {{ $t(filter.nameKey) }}
            </button>
          </div>
        </div>

        <!-- Administrative Modules Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Global System Configuration -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/global-config')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-globe text-blue-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.globalSystemConfiguration.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.globalSystemConfiguration.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.globalSystemConfiguration.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- District Oversight -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/districts')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-map-marker text-green-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.districtOversight.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.districtOversight.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.districtOversight.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Policy Management -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/policies')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-file text-purple-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.policyManagement.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.policyManagement.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.policyManagement.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- User & Role Templates -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/user-templates')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-user text-orange-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.userRoleTemplates.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.userRoleTemplates.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.userRoleTemplates.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Kindergarten Classification -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/kindergarten-types')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-building text-blue-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.kindergartenClassification.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.kindergartenClassification.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.kindergartenClassification.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Placement Windows -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/placement-windows')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-calendar text-red-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.placementWindows.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.placementWindows.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.placementWindows.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Feature Control Center -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/features')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-cog text-teal-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.featureControlCenter.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.featureControlCenter.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.featureControlCenter.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Security & Compliance -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/security')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-shield text-red-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.securityCompliance.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.securityCompliance.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.securityCompliance.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Dashboard -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/analytics')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-chart-bar text-yellow-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.analyticsDashboard.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.analyticsDashboard.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.analyticsDashboard.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Data Integration -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/integrations')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-database text-indigo-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.dataIntegration.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.dataIntegration.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.dataIntegration.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- Communication Center -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/communications')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-comments text-cyan-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.communicationCenter.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.communicationCenter.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.communicationCenter.action') }} →
                </div>
              </div>
            </div>
          </div>

          <!-- System Releases -->
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
               @click="navigateTo('/admin/releases')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-upload text-purple-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.dashboard.modules.systemReleases.title') }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ $t('admin.dashboard.modules.systemReleases.description') }}</p>
                <div class="flex items-center text-blue-600 text-sm font-medium">
                  {{ $t('admin.dashboard.modules.systemReleases.action') }} →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/core/BaseLayout.vue'

const router = useRouter()

// Reactive data
const activeTab = ref('system-overview')
const activeFilter = ref('all-modules')

// Tab configuration with translation keys
const tabs = [
  { id: 'system-overview', nameKey: 'admin.dashboard.tabs.systemOverview' },
  { id: 'governance', nameKey: 'admin.dashboard.tabs.governance' },
  { id: 'operations', nameKey: 'admin.dashboard.tabs.operations' },
  { id: 'monitoring', nameKey: 'admin.dashboard.tabs.monitoring' }
]

// Filter configuration with translation keys
const filters = [
  { id: 'all-modules', nameKey: 'admin.dashboard.filters.allModules', icon: 'pi pi-th-large' },
  { id: 'system-config', nameKey: 'admin.dashboard.filters.systemConfig', icon: 'pi pi-cog' },
  { id: 'governance', nameKey: 'admin.dashboard.filters.governance', icon: 'pi pi-shield' },
  { id: 'security', nameKey: 'admin.dashboard.filters.security', icon: 'pi pi-lock' },
  { id: 'data-management', nameKey: 'admin.dashboard.filters.dataManagement', icon: 'pi pi-database' },
  { id: 'operations', nameKey: 'admin.dashboard.filters.operations', icon: 'pi pi-play' },
  { id: 'analytics', nameKey: 'admin.dashboard.filters.analytics', icon: 'pi pi-chart-bar' }
]

// Navigation method
const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  // Component initialization if needed
})
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 7xl;
  margin: 0 auto;
}
</style>
