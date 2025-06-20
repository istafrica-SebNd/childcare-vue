import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import BaseLayout from '@/layouts/core/BaseLayout.vue'

// Pages (lazy loaded for performance)
const Index = () => import('@/pages/Index.vue')
const LoginPage = () => import('@/pages/auth/LoginPage.vue')
const NotFound = () => import('@/pages/shared/NotFound.vue')

// Guardian
const GuardianDashboard = () => import('@/pages/guardian/GuardianDashboard.vue')
const GuardianMessages = () => import('@/components/communication/Messages.vue')
const GuardianDailySchedule = () => import('@/pages/guardian/DailySchedule.vue')
const GuardianAttendanceTracking = () => import('@/pages/guardian/AttendanceTracking.vue')
const GuardianNoticeBoard = () => import('@/pages/guardian/NoticeBoard.vue')
const PostDetail = () => import('@/pages/guardian/PostDetail.vue')
const GuardianApplicationStatus = () => import('@/pages/guardian/ApplicationStatus.vue')
const GuardianChildProfile = () => import('@/pages/guardian/ChildProfile.vue')
const ChildrenList = () => import('@/pages/guardian/ChildrenList.vue')
const ChildProfileDetail = () => import('@/pages/guardian/ChildProfileDetail.vue')
const GuardianPayments = () => import('@/pages/guardian/Payments.vue')
const GuardianDocuments = () => import('@/pages/guardian/Documents.vue')
const GuardianNewApplication = () => import('@/pages/guardian/NewApplication.vue')
const GuardianLivingArrangements = () => import('@/pages/guardian/LivingArrangements.vue')
const GuardianDualPlacementManagement = () => import('@/pages/guardian/DualPlacementManagement.vue')
const GuardianEmergencyContacts = () => import('@/pages/guardian/EmergencyContacts.vue')
const GuardianHolidayRegistration = () => import('@/pages/guardian/HolidayRegistration.vue')
const GuardianConsents = () => import('@/pages/guardian/Consents.vue')
const GuardianAbsenceReporting = () => import('@/pages/guardian/AbsenceReporting.vue')
const GuardianTeacherMeetings = () => import('@/pages/guardian/TeacherMeetings.vue')
const GuardianPickupAuthorization = () => import('@/pages/guardian/PickupAuthorization.vue')
const GuardianChildLocation = () => import('@/pages/guardian/ChildLocation.vue')

// Caseworker
const CaseWorkerDashboard = () => import('@/pages/caseworker/CaseWorkerDashboard.vue')
const ReviewQueue = () => import('@/pages/caseworker/ReviewQueue.vue')
const PlacementManagement = () => import('@/pages/caseworker/PlacementManagement.vue')
const CaseWorkerMessages = () => import('@/pages/caseworker/Messages.vue')
// const ManualApplication = () => import('@/pages/caseworker/ManualApplication.vue')
// const ApplicationsInProgress = () => import('@/pages/caseworker/ApplicationsInProgress.vue')
// const ApplicationsSubmitted = () => import('@/pages/caseworker/ApplicationsSubmitted.vue')
// const ApplicationsFollowUp = () => import('@/pages/caseworker/ApplicationsFollowUp.vue')
// const ApplicationView = () => import('@/pages/caseworker/ApplicationView.vue')
// const DualPlacementSetup = () => import('@/pages/caseworker/DualPlacementSetup.vue')

// Educator
const EducatorDashboard = () => import('@/pages/educator/EducatorDashboard.vue')

// Admin
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

// Add other roles/pages as needed...

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Index },
  { path: '/login', name: 'Login', component: LoginPage },
  {
    path: '/guardian',
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'GuardianDashboard', component: GuardianDashboard },
      { path: 'messages', component: GuardianMessages },
      { path: 'daily-schedule', component: GuardianDailySchedule },
      { path: 'attendance-tracking', component: GuardianAttendanceTracking },
      { path: 'notice-board', component: GuardianNoticeBoard },
      { path: 'notice-board/post/:id', component: PostDetail },
      { path: 'application-status', component: GuardianApplicationStatus },
      { path: 'child-profile', component: GuardianChildProfile },
      { path: 'children', component: ChildrenList },
      { path: 'child-profile/:childId', component: ChildProfileDetail },
      { path: 'child-profile/:childId/application-details', component: ChildProfileDetail },
      { path: 'child-profile/:childId/attendance', component: ChildProfileDetail },
      { path: 'child-profile/:childId/consents', component: ChildProfileDetail },
      { path: 'child-profile/:childId/living-arrangements', component: ChildProfileDetail },
      { path: 'child-profile/:childId/documents', component: ChildProfileDetail },
      { path: 'child-profile/:childId/contacts', component: ChildProfileDetail },
      { path: 'payments', component: GuardianPayments },
      { path: 'documents', component: GuardianDocuments },
      { path: 'new-application', component: GuardianNewApplication },
      { path: 'living-arrangements', component: GuardianLivingArrangements },
      { path: 'dual-placement/:id', component: GuardianDualPlacementManagement },
      // { path: 'emergency-contacts', component: GuardianEmergencyContacts },
      // { path: 'holiday-registration', component: GuardianHolidayRegistration },
      { path: 'consents', component: GuardianConsents },
      { path: 'absence-reporting', component: GuardianAbsenceReporting },
      { path: 'teacher-meetings', component: GuardianTeacherMeetings },
      { path: 'pickup-authorization', component: GuardianPickupAuthorization },
      { path: 'child-location', component: GuardianChildLocation },
    ],
  },
  {
    path: '/caseworker',
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'CaseWorkerDashboard', component: CaseWorkerDashboard },
      { path: 'review-queue', component: ReviewQueue },
      { path: 'placement-management', component: PlacementManagement },
      { path: 'messages', component: CaseWorkerMessages },
    ],
  },
  {
    path: '/educator',
    component: BaseLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'EducatorDashboard', component: EducatorDashboard },
    ],
  },
  // {
  //   path: '/admin',
  //   component: Layout,
  //   meta: { requiresAuth: true, requiresAdmin: true },
  //   children: [
  //     { path: '', name: 'MunicipalityAdminDashboard', component: MunicipalityAdminDashboard },
  //     { path: 'reports', component: Reports },
  //     { path: 'settings', component: SystemSettings },
  //     { path: 'global-config', component: GlobalConfig },
  //     { path: 'districts', component: Districts },
  //     { path: 'policies', component: Policies },
  //     { path: 'user-templates', component: UserTemplates },
  //     { path: 'kindergarten-types', component: KindergartenTypes },
  //     { path: 'placement-windows', component: PlacementWindows },
  //     { path: 'features', component: Features },
  //     { path: 'security', component: Security },
  //     { path: 'analytics', component: AdminAnalytics },
  //     { path: 'integrations', component: Integrations },
  //     { path: 'communications', component: Communications },
  //     { path: 'releases', component: Releases },
  //   ],
  // },
  // ...add staff, educator, partner, district-admin, kindergarten, etc. here
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard for auth
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // If route requires auth
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!auth.user) {
      next({ name: 'Login' })
      return
    }

    // Check if user has required role
    if (to.meta.role && auth.user.role !== to.meta.role) {
      next({ name: 'Home' })
      return
    }
  }

  next()
})

export default router
