import type { RouteRecordRaw } from 'vue-router'
// import BaseLayout from '@/layouts/core/BaseLayout.vue' // Will be used when admin routes are implemented

// Admin Pages (lazy loaded for performance)
// Currently commented out - these pages don't exist yet
// const MunicipalityAdminDashboard = () => import('@/pages/admin/MunicipalityAdminDashboard.vue')
// const Reports = () => import('@/pages/admin/Reports.vue')
// const SystemSettings = () => import('@/pages/admin/SystemSettings.vue')
// const GlobalConfig = () => import('@/pages/admin/GlobalConfig.vue')
// const Districts = () => import('@/pages/admin/Districts.vue')
// const Policies = () => import('@/pages/admin/Policies.vue')
// const UserTemplates = () => import('@/pages/admin/UserTemplates.vue')
// const KindergartenTypes = () => import('@/pages/admin/KindergartenTypes.vue')
// const PlacementWindows = () => import('@/pages/admin/PlacementWindows.vue')
// const Features = () => import('@/pages/admin/Features.vue')
// const Security = () => import('@/pages/admin/Security.vue')
// const AdminAnalytics = () => import('@/pages/admin/AdminAnalytics.vue')
// const Integrations = () => import('@/pages/admin/Integrations.vue')
// const Communications = () => import('@/pages/admin/Communications.vue')
// const Releases = () => import('@/pages/admin/Releases.vue')

export const adminRoutes: RouteRecordRaw[] = [
  // Admin routes are commented out until the pages are created
  // {
  //   path: '/admin',
  //   component: BaseLayout,
  //   meta: {
  //     requiresAuth: true,
  //     role: 'admin'
  //   },
  //   children: [
  //     {
  //       path: '',
  //       name: 'MunicipalityAdminDashboard',
  //       component: MunicipalityAdminDashboard
  //     },
  //     {
  //       path: 'reports',
  //       name: 'AdminReports',
  //       component: Reports
  //     },
  //     {
  //       path: 'settings',
  //       name: 'AdminSystemSettings',
  //       component: SystemSettings
  //     },
  //     {
  //       path: 'global-config',
  //       name: 'AdminGlobalConfig',
  //       component: GlobalConfig
  //     },
  //     {
  //       path: 'districts',
  //       name: 'AdminDistricts',
  //       component: Districts
  //     },
  //     {
  //       path: 'policies',
  //       name: 'AdminPolicies',
  //       component: Policies
  //     },
  //     {
  //       path: 'user-templates',
  //       name: 'AdminUserTemplates',
  //       component: UserTemplates
  //     },
  //     {
  //       path: 'kindergarten-types',
  //       name: 'AdminKindergartenTypes',
  //       component: KindergartenTypes
  //     },
  //     {
  //       path: 'placement-windows',
  //       name: 'AdminPlacementWindows',
  //       component: PlacementWindows
  //     },
  //     {
  //       path: 'features',
  //       name: 'AdminFeatures',
  //       component: Features
  //     },
  //     {
  //       path: 'security',
  //       name: 'AdminSecurity',
  //       component: Security
  //     },
  //     {
  //       path: 'analytics',
  //       name: 'AdminAnalytics',
  //       component: AdminAnalytics
  //     },
  //     {
  //       path: 'integrations',
  //       name: 'AdminIntegrations',
  //       component: Integrations
  //     },
  //     {
  //       path: 'communications',
  //       name: 'AdminCommunications',
  //       component: Communications
  //     },
  //     {
  //       path: 'releases',
  //       name: 'AdminReleases',
  //       component: Releases
  //     }
  //   ]
  // }
]
