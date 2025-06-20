import type { RouteRecordRaw } from 'vue-router'
import BaseLayout from '@/layouts/core/BaseLayout.vue'

// Caseworker Pages (lazy loaded for performance)
const CaseWorkerDashboard = () => import('@/pages/caseworker/CaseWorkerDashboard.vue')
const ReviewQueue = () => import('@/pages/caseworker/ReviewQueue.vue')
const PlacementManagement = () => import('@/pages/caseworker/PlacementManagement.vue')
const CaseWorkerMessages = () => import('@/pages/caseworker/Messages.vue')

// Commented out pages that don't exist yet
// const ManualApplication = () => import('@/pages/caseworker/ManualApplication.vue')
// const ApplicationsInProgress = () => import('@/pages/caseworker/ApplicationsInProgress.vue')
// const ApplicationsSubmitted = () => import('@/pages/caseworker/ApplicationsSubmitted.vue')
// const ApplicationsFollowUp = () => import('@/pages/caseworker/ApplicationsFollowUp.vue')
// const ApplicationView = () => import('@/pages/caseworker/ApplicationView.vue')
// const DualPlacementSetup = () => import('@/pages/caseworker/DualPlacementSetup.vue')

export const caseManagerRoutes: RouteRecordRaw[] = [
  {
    path: '/caseworker',
    component: BaseLayout,
    meta: {
      requiresAuth: true,
      role: 'caseworker'
    },
    children: [
      {
        path: '',
        name: 'CaseWorkerDashboard',
        component: CaseWorkerDashboard
      },
      {
        path: 'review-queue',
        name: 'CaseWorkerReviewQueue',
        component: ReviewQueue
      },
      {
        path: 'placement-management',
        name: 'CaseWorkerPlacementManagement',
        component: PlacementManagement
      },
      {
        path: 'messages',
        name: 'CaseWorkerMessages',
        component: CaseWorkerMessages
      }
      // Future routes can be added here:
      // {
      //   path: 'manual-application',
      //   name: 'CaseWorkerManualApplication',
      //   component: ManualApplication
      // },
      // {
      //   path: 'applications-in-progress',
      //   name: 'CaseWorkerApplicationsInProgress',
      //   component: ApplicationsInProgress
      // },
      // {
      //   path: 'applications-submitted',
      //   name: 'CaseWorkerApplicationsSubmitted',
      //   component: ApplicationsSubmitted
      // },
      // {
      //   path: 'applications-follow-up',
      //   name: 'CaseWorkerApplicationsFollowUp',
      //   component: ApplicationsFollowUp
      // },
      // {
      //   path: 'application/:id',
      //   name: 'CaseWorkerApplicationView',
      //   component: ApplicationView
      // },
      // {
      //   path: 'dual-placement-setup',
      //   name: 'CaseWorkerDualPlacementSetup',
      //   component: DualPlacementSetup
      // }
    ]
  }
]
