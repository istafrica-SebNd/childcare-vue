import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

// PrimeVue styles
// import '@primevue/themes/lara-light-blue/theme.css'
// import 'primevue/resources/themes/lara-light-blue/theme.css'
// import "primevue/resources/base.css";
// import 'primeicons/primeicons.css'

import Aura from '@primevue/themes/aura';

import "primeicons/primeicons.css";

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

// Load saved language preference
const savedLanguage = localStorage.getItem('language')
if (savedLanguage && ['en', 'no'].includes(savedLanguage)) {
  i18n.global.locale.value = savedLanguage as 'en' | 'no'
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Configure PrimeVue with the Aura theme and ripple
app.use(PrimeVue, { 
    ripple: true
})
app.use(ToastService)

// Add PrimeVue directives
app.directive('tooltip', Tooltip)

app.use(i18n)

app.mount('#app')
