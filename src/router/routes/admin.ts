import type { RouteRecordRaw } from 'vue-router'

// Admin Pages (lazy loaded for performance)
const AdminDashboard = () => import('@/pages/admin/AdminDashboard.vue')

// Administration submenu pages
const ApplicationForms = () => import('@/pages/admin/ApplicationForms.vue')
const Approve = () => import('@/pages/admin/Approve.vue')
const ChildcareMember = () => import('@/pages/admin/ChildcareMember.vue')
const DebtManagement = () => import('@/pages/admin/DebtManagement.vue')
const GuaranteeList = () => import('@/pages/admin/GuaranteeList.vue')
const LogsAdmin = () => import('@/pages/admin/Logs.vue')
const ManageChildinfo = () => import('@/pages/admin/ManageChildinfo.vue')
const ModifiedApplication = () => import('@/pages/admin/ModifiedApplication.vue')
const QueueHandling = () => import('@/pages/admin/QueueHandling.vue')
const QueueException = () => import('@/pages/admin/QueueException.vue')
const StayrequestJob = () => import('@/pages/admin/StayrequestJob.vue')
const SuggestedAdmission = () => import('@/pages/admin/SuggestedAdmission.vue')
const UnitChildrenOverview = () => import('@/pages/admin/UnitChildrenOverview.vue')
const ActivityPlans = () => import('@/pages/admin/ActivityPlans.vue')

// Access Right submenu pages
const Roles = () => import('@/pages/admin/Roles.vue')
const LimitedRoles = () => import('@/pages/admin/LimitedRoles.vue')
const ModuleGroups = () => import('@/pages/admin/ModuleGroups.vue')
const Modules = () => import('@/pages/admin/Modules.vue')

// Admissions submenu pages
const AdmissionsApplications = () => import('@/pages/admin/AdmissionsApplications.vue')
const AdmissionsList = () => import('@/pages/admin/AdmissionsList.vue')

// Independent navigation pages
const PersonRegister = () => import('@/pages/admin/PersonRegister.vue')
const Reports = () => import('@/pages/admin/Reports.vue')
const Logs = () => import('@/pages/admin/Logs.vue')
const Communications = () => import('@/pages/admin/Communications.vue')
const SystemSettings = () => import('@/pages/admin/SystemSettings.vue')

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  // Administration submenu routes
  {
    path: '/admin/application-forms',
    name: 'AdminApplicationForms',
    component: ApplicationForms,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/approve',
    name: 'AdminApprove',
    component: Approve,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/childcare-member',
    name: 'AdminChildcareMember',
    component: ChildcareMember,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/debt-management',
    name: 'AdminDebtManagement',
    component: DebtManagement,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/guarantee-list',
    name: 'AdminGuaranteeList',
    component: GuaranteeList,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/logs-admin',
    name: 'AdminLogsAdmin',
    component: LogsAdmin,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/manage-childinfo',
    name: 'AdminManageChildinfo',
    component: ManageChildinfo,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/modified-application',
    name: 'AdminModifiedApplication',
    component: ModifiedApplication,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/queue-handling',
    name: 'AdminQueueHandling',
    component: QueueHandling,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/queue-exception',
    name: 'AdminQueueException',
    component: QueueException,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/stayrequest-job',
    name: 'AdminStayrequestJob',
    component: StayrequestJob,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/suggested-admission',
    name: 'AdminSuggestedAdmission',
    component: SuggestedAdmission,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/unit-children-overview',
    name: 'AdminUnitChildrenOverview',
    component: UnitChildrenOverview,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/activity-plans',
    name: 'AdminActivityPlans',
    component: ActivityPlans,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  // Access Right submenu routes
  {
    path: '/admin/roles',
    name: 'AdminRoles',
    component: Roles,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/limited-roles',
    name: 'AdminLimitedRoles',
    component: LimitedRoles,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/module-groups',
    name: 'AdminModuleGroups',
    component: ModuleGroups,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/modules',
    name: 'AdminModules',
    component: Modules,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  // Admissions submenu routes
  {
    path: '/admin/admissions/applications',
    name: 'AdminAdmissionsApplications',
    component: AdmissionsApplications,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/admissions/list',
    name: 'AdminAdmissionsList',
    component: AdmissionsList,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  // Independent navigation routes
  {
    path: '/admin/person-register',
    name: 'AdminPersonRegister',
    component: PersonRegister,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: Reports,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/logs',
    name: 'AdminLogs',
    component: Logs,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/communications',
    name: 'AdminCommunications',
    component: Communications,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: SystemSettings,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  }
]
