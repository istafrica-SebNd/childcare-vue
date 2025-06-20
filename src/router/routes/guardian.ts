import type { RouteRecordRaw } from 'vue-router'
import BaseLayout from '@/layouts/core/BaseLayout.vue'

// Guardian Pages (lazy loaded for performance)
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
const GuardianConsents = () => import('@/pages/guardian/Consents.vue')
const GuardianAbsenceReporting = () => import('@/pages/guardian/AbsenceReporting.vue')
const GuardianTeacherMeetings = () => import('@/pages/guardian/TeacherMeetings.vue')
const GuardianPickupAuthorization = () => import('@/pages/guardian/PickupAuthorization.vue')
const GuardianChildLocation = () => import('@/pages/guardian/ChildLocation.vue')

export const guardianRoutes: RouteRecordRaw[] = [
  {
    path: '/guardian',
    component: BaseLayout,
    meta: {
      requiresAuth: true,
      role: 'guardian'
    },
    children: [
      {
        path: '',
        name: 'GuardianDashboard',
        component: GuardianDashboard
      },
      {
        path: 'messages',
        name: 'GuardianMessages',
        component: GuardianMessages
      },
      {
        path: 'daily-schedule',
        name: 'GuardianDailySchedule',
        component: GuardianDailySchedule
      },
      {
        path: 'attendance-tracking',
        name: 'GuardianAttendanceTracking',
        component: GuardianAttendanceTracking
      },
      {
        path: 'notice-board',
        name: 'GuardianNoticeBoard',
        component: GuardianNoticeBoard
      },
      {
        path: 'notice-board/post/:id',
        name: 'GuardianPostDetail',
        component: PostDetail
      },
      {
        path: 'application-status',
        name: 'GuardianApplicationStatus',
        component: GuardianApplicationStatus
      },
      {
        path: 'child-profile',
        name: 'GuardianChildProfile',
        component: GuardianChildProfile
      },
      {
        path: 'children',
        name: 'GuardianChildrenList',
        component: ChildrenList
      },
      {
        path: 'child-profile/:childId',
        name: 'GuardianChildProfileDetail',
        component: ChildProfileDetail
      },
      {
        path: 'child-profile/:childId/application-details',
        name: 'GuardianChildApplicationDetails',
        component: ChildProfileDetail
      },
      {
        path: 'child-profile/:childId/attendance',
        name: 'GuardianChildAttendance',
        component: ChildProfileDetail
      },
      {
        path: 'child-profile/:childId/consents',
        name: 'GuardianChildConsents',
        component: ChildProfileDetail
      },
      {
        path: 'child-profile/:childId/living-arrangements',
        name: 'GuardianChildLivingArrangements',
        component: ChildProfileDetail
      },
      {
        path: 'child-profile/:childId/documents',
        name: 'GuardianChildDocuments',
        component: ChildProfileDetail
      },
      {
        path: 'child-profile/:childId/contacts',
        name: 'GuardianChildContacts',
        component: ChildProfileDetail
      },
      {
        path: 'payments',
        name: 'GuardianPayments',
        component: GuardianPayments
      },
      {
        path: 'documents',
        name: 'GuardianDocuments',
        component: GuardianDocuments
      },
      {
        path: 'new-application',
        name: 'GuardianNewApplication',
        component: GuardianNewApplication
      },
      {
        path: 'living-arrangements',
        name: 'GuardianLivingArrangements',
        component: GuardianLivingArrangements
      },
      {
        path: 'dual-placement/:id',
        name: 'GuardianDualPlacementManagement',
        component: GuardianDualPlacementManagement
      },
      {
        path: 'consents',
        name: 'GuardianConsents',
        component: GuardianConsents
      },
      {
        path: 'absence-reporting',
        name: 'GuardianAbsenceReporting',
        component: GuardianAbsenceReporting
      },
      {
        path: 'teacher-meetings',
        name: 'GuardianTeacherMeetings',
        component: GuardianTeacherMeetings
      },
      {
        path: 'pickup-authorization',
        name: 'GuardianPickupAuthorization',
        component: GuardianPickupAuthorization
      },
      {
        path: 'child-location',
        name: 'GuardianChildLocation',
        component: GuardianChildLocation
      }
    ]
  }
]
