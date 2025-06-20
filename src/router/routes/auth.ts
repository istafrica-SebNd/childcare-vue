import type { RouteRecordRaw } from 'vue-router'
import { guestGuard } from '../guards'

// Auth Pages (lazy loaded for performance)
const Index = () => import('@/pages/Index.vue')
const LoginPage = () => import('@/pages/auth/LoginPage.vue')
const NotFound = () => import('@/pages/shared/NotFound.vue')

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    beforeEnter: guestGuard
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]
