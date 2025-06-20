<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/auth/useAuth'

interface Props {
  showNotifications?: boolean
  onToggleSidebar?: () => void
}

withDefaults(defineProps<Props>(), {
  showNotifications: true
})

const { userName, userRole, userDistrict, logout } = useAuth()
const { locale } = useI18n()

// Language selector state
const showLanguageMenu = ref(false)
const languages = [
  { code: 'en', name: 'English' },
  { code: 'no', name: 'Norsk' },
  { code: 'sv', name: 'Svenska' }
]

// User menu state
const showUserMenu = ref(false)

// Refs for dropdown elements
const languageDropdownRef = ref<HTMLElement>()
const userDropdownRef = ref<HTMLElement>()

const userDisplayName = computed(() => userName.value || 'Anna Hansen')

// Current language display name
const currentLanguage = computed(() => {
  const lang = languages.find(l => l.code === locale.value)
  return lang?.name || 'English'
})

// Functions
const toggleLanguageMenu = () => {
  if (showUserMenu.value) {
    showUserMenu.value = false
  }
  showLanguageMenu.value = !showLanguageMenu.value
}

const toggleUserMenu = () => {
  if (showLanguageMenu.value) {
    showLanguageMenu.value = false
  }
  showUserMenu.value = !showUserMenu.value
}

const handleBlurWithDelay = (callback: () => void) => {
  setTimeout(callback, 150)
}

const selectLanguage = (language: typeof languages[0]) => {
  locale.value = language.code
  showLanguageMenu.value = false

  // Optionally save language preference to localStorage
  localStorage.setItem('preferred-language', language.code)
}

const handleLogout = async () => {
  try {

    // Close the user menu
    showUserMenu.value = false

    // Call the logout function from the composable (includes navigation)
    await logout()

  } catch (error) {
    console.error('🔴 Error during logout:', error)
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node

  if (languageDropdownRef.value && !languageDropdownRef.value.contains(target)) {
    showLanguageMenu.value = false
  }

  if (userDropdownRef.value && !userDropdownRef.value.contains(target)) {
    showUserMenu.value = false
  }
}

// Initialize language from localStorage on component mount
const initializeLanguage = () => {
  const savedLanguage = localStorage.getItem('preferred-language')
  if (savedLanguage && languages.some(l => l.code === savedLanguage)) {
    locale.value = savedLanguage
  }
}

// Lifecycle hooks
onMounted(() => {
  initializeLanguage()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="app-header">
    <div class="header-container">


      <!-- Center - Welcome Message -->
      <div class="header-center">
        <div class="welcome-section">
          <div class="welcome-icon">
            <i class="pi pi-graduation-cap"></i>
          </div>
          <div class="welcome-text">
            <h2 class="welcome-title">{{ $t('auth.welcome') }}, {{ userDisplayName }}</h2>
            <div class="welcome-subtitle-row">
              <span class="district-badge">{{ userDistrict }}</span>
            </div>
            <p class="welcome-description">Manage your account and access services</p>
          </div>
        </div>
      </div>

      <!-- Right side - Language and User Menu -->
      <div class="header-right">
        <!-- Language Selector -->
        <div class="dropdown-container" ref="languageDropdownRef">
          <button
            @click="toggleLanguageMenu"
            @blur="handleBlurWithDelay(() => showLanguageMenu = false)"
            class="language-button"
          >
            <i class="pi pi-globe"></i>
            <span>{{ currentLanguage }}</span>
            <i class="pi pi-chevron-down" :class="{ 'rotated': showLanguageMenu }"></i>
          </button>

          <div v-if="showLanguageMenu" class="dropdown-menu language-menu">
            <button
              v-for="language in languages"
              :key="language.code"
              @click="selectLanguage(language)"
              class="dropdown-item"
              :class="{ 'active': language.name === currentLanguage }"
            >
              {{ language.name }}
            </button>
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div class="dropdown-container" ref="userDropdownRef">
          <button
            @click="toggleUserMenu"
            @blur="handleBlurWithDelay(() => showUserMenu = false)"
            class="user-button"
          >
            <div class="user-info">
              <span class="user-name">{{ userDisplayName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
            <i class="pi pi-chevron-down" :class="{ 'rotated': showUserMenu }"></i>
          </button>

          <div v-if="showUserMenu" class="dropdown-menu user-menu">
            <hr class="dropdown-divider">
            <button class="dropdown-item">
              <i class="pi pi-user"></i>
              {{ $t('common.profile') }}
            </button>
            <button class="dropdown-item">
              <i class="pi pi-cog"></i>
              {{ $t('common.settings') }}
            </button>
            <button class="dropdown-item">
              <i class="pi pi-question-circle"></i>
              Help & Support
            </button>
            <hr class="dropdown-divider">
            <button @click="handleLogout" class="dropdown-item logout">
              <i class="pi pi-sign-out"></i>
              {{ $t('common.logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #f8fafc;
  color: #1e40af;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  max-width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  margin-left: 2rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #1e40af;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon i {
  font-size: 1.25rem;
  color: white;
}

.platform-info {
  display: flex;
  flex-direction: column;
}

.platform-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: #1e40af;
}

.platform-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.2;
}

.welcome-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;

}

.welcome-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: #1e40af;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-icon i {
  font-size: 1.125rem;
  color: white;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.welcome-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  color: #1e40af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.welcome-subtitle-row {
  display: flex;
  align-items: center;
  margin: 0.125rem 0;
}

.district-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #c7d2fe;
}

.welcome-description {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-container {
  position: relative;
}

.language-button,
.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.language-button:hover,
.user-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  color: #1e40af;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.2;
}

.pi-chevron-down {
  transition: transform 0.2s ease;
  font-size: 0.75rem;
  color: #64748b;
}

.pi-chevron-down.rotated {
  transform: rotate(180deg);
}

.pi-globe {
  color: #64748b;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  min-width: 180px;
  overflow: hidden;
}

.language-menu {
  min-width: 120px;
}

.user-menu {
  min-width: 200px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
  z-index: 10;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}




.dropdown-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .header-center {
    margin-left: 1rem;
  }

  .welcome-section {
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 1024px) {
  .header-center {
    display: none;
  }

  .header-container {
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0.75rem 1rem;
  }

  .platform-info {
    display: none;
  }

  .header-right {
    gap: 0.5rem;
  }

  .language-button span,
  .user-info .user-name {
    display: none;
  }

  .user-info .user-role {
    display: block;
  }
}
</style>
