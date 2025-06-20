import { createPinia } from 'pinia'
import type { App } from 'vue'

// Create Pinia store instance
const pinia = createPinia()

// Pinia plugin for Vue app
export default {
  install(app: App) {
    app.use(pinia)
  }
}

// Export pinia for direct use
export { pinia }
