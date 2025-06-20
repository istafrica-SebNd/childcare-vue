import type { App } from 'vue'

// Import the main i18n configuration
import { i18n } from '@/locales'

// i18n plugin for Vue app
export default {
  install(app: App) {
    app.use(i18n)
  }
}

// Export i18n for direct use
export { i18n }
