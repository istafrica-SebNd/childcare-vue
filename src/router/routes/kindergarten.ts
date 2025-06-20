import type { RouteRecordRaw } from 'vue-router'
import BaseLayout from '@/layouts/core/BaseLayout.vue'

// Educator/Kindergarten Pages (lazy loaded for performance)
const EducatorDashboard = () => import('@/pages/educator/EducatorDashboard.vue')

export const kindergartenRoutes: RouteRecordRaw[] = [
  {
    path: '/educator',
    component: BaseLayout,
    meta: {
      requiresAuth: true,
      role: 'educator'
    },
    children: [
      {
        path: '',
        name: 'EducatorDashboard',
        component: EducatorDashboard
      }
      // Future educator routes can be added here:
      // {
      //   path: 'children',
      //   name: 'EducatorChildren',
      //   component: EducatorChildren
      // },
      // {
      //   path: 'attendance',
      //   name: 'EducatorAttendance',
      //   component: EducatorAttendance
      // },
      // {
      //   path: 'activities',
      //   name: 'EducatorActivities',
      //   component: EducatorActivities
      // },
      // {
      //   path: 'messages',
      //   name: 'EducatorMessages',
      //   component: EducatorMessages
      // }
    ]
  }
]
