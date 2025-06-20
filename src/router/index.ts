import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import route guards
import { authGuard } from './guards'

// Import route modules
import { authRoutes } from './routes/auth'
import { guardianRoutes } from './routes/guardian'
import { caseManagerRoutes } from './routes/caseManager'
import { kindergartenRoutes } from './routes/kindergarten'
import { adminRoutes } from './routes/admin'

// Combine all routes
const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...guardianRoutes,
  ...caseManagerRoutes,
  ...kindergartenRoutes,
  ...adminRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Apply global navigation guards
router.beforeEach(authGuard)

export default router
