import type { App } from 'vue'

// Import the main router configuration
import router from '@/router'

// Router plugin for Vue app
export default {
  install(app: App) {
    app.use(router)
  }
}

// Export router for direct use
export { router }
