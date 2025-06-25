<template>
  <BaseLayout>
    <template #content>
      <div class="system-settings">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">System Settings</h1>
            <p class="mt-1 text-gray-600">
              Configure system-wide parameters and preferences
            </p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-refresh"
              label="Reset"
              :loading="settingsLoading"
              @click="resetSettings"
              class="p-button-outlined"
            />
            <Button
              icon="pi pi-save"
              label="Save Changes"
              :loading="settingsLoading"
              :disabled="!hasChanges"
              @click="saveSettings"
              class="p-button-primary"
            />
          </div>
        </div>

        <!-- Settings Tabs -->
        <TabView v-model:activeIndex="activeTab">
          <!-- General Settings -->
          <TabPanel header="General">
            <Card>
              <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        System Name
                      </label>
                      <InputText
                        v-model="localSettings.general.systemName"
                        class="w-full"
                        placeholder="Enter system name"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Admin Email
                      </label>
                      <InputText
                        v-model="localSettings.general.adminEmail"
                        type="email"
                        class="w-full"
                        placeholder="admin@oslo.kommune.no"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <InputText
                        v-model="localSettings.general.supportEmail"
                        type="email"
                        class="w-full"
                        placeholder="support@oslo.kommune.no"
                      />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Default Language
                      </label>
                      <Dropdown
                        v-model="localSettings.general.defaultLanguage"
                        :options="languageOptions"
                        option-label="label"
                        option-value="value"
                        class="w-full"
                        placeholder="Select language"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <Dropdown
                        v-model="localSettings.general.timezone"
                        :options="timezoneOptions"
                        option-label="label"
                        option-value="value"
                        class="w-full"
                        placeholder="Select timezone"
                      />
                    </div>

                    <div>
                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.general.maintenanceMode"
                          input-id="maintenance-mode"
                        />
                        <label for="maintenance-mode" class="text-sm font-medium text-gray-700">
                          Maintenance Mode
                        </label>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Enable to show maintenance message to users
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <!-- Application Settings -->
          <TabPanel header="Applications">
            <Card>
              <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Max Applications per Child
                      </label>
                      <InputNumber
                        v-model="localSettings.applications.maxApplicationsPerChild"
                        :min="1"
                        :max="10"
                        class="w-full"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <Calendar
                        v-model="applicationDeadlineDate"
                        date-format="yy-mm-dd"
                        class="w-full"
                        placeholder="Select deadline"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Document Required Days
                      </label>
                      <InputNumber
                        v-model="localSettings.applications.documentRequiredDays"
                        :min="1"
                        :max="90"
                        suffix=" days"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Email Days
                      </label>
                      <InputNumber
                        v-model="localSettings.applications.reminderEmailDays"
                        :min="1"
                        :max="30"
                        suffix=" days"
                        class="w-full"
                      />
                    </div>

                    <div>
                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.applications.autoApprovalEnabled"
                          input-id="auto-approval"
                        />
                        <label for="auto-approval" class="text-sm font-medium text-gray-700">
                          Auto Approval Enabled
                        </label>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Automatically approve applications that meet criteria
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <!-- Notifications -->
          <TabPanel header="Notifications">
            <Card>
              <template #content>
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.notifications.emailNotifications"
                          input-id="email-notifications"
                        />
                        <label for="email-notifications" class="text-sm font-medium text-gray-700">
                          Enable Email Notifications
                        </label>
                      </div>

                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.notifications.statusUpdateEmails"
                          input-id="status-emails"
                        />
                        <label for="status-emails" class="text-sm font-medium text-gray-700">
                          Status Update Emails
                        </label>
                      </div>

                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.notifications.placementOfferEmails"
                          input-id="placement-emails"
                        />
                        <label for="placement-emails" class="text-sm font-medium text-gray-700">
                          Placement Offer Emails
                        </label>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">External Integrations</h3>
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.notifications.smsNotifications"
                          input-id="sms-notifications"
                        />
                        <label for="sms-notifications" class="text-sm font-medium text-gray-700">
                          SMS Notifications
                        </label>
                      </div>

                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.notifications.altinnIntegration"
                          input-id="altinn-integration"
                        />
                        <label for="altinn-integration" class="text-sm font-medium text-gray-700">
                          Altinn Integration
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <!-- Security -->
          <TabPanel header="Security">
            <Card>
              <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <InputNumber
                        v-model="localSettings.security.sessionTimeout"
                        :min="5"
                        :max="480"
                        suffix=" min"
                        class="w-full"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <InputNumber
                        v-model="localSettings.security.maxLoginAttempts"
                        :min="3"
                        :max="10"
                        class="w-full"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Password Min Length
                      </label>
                      <InputNumber
                        v-model="localSettings.security.passwordMinLength"
                        :min="6"
                        :max="20"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        API Rate Limit (requests/hour)
                      </label>
                      <InputNumber
                        v-model="localSettings.security.apiRateLimit"
                        :min="100"
                        :max="10000"
                        class="w-full"
                      />
                    </div>

                    <div>
                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="localSettings.security.twoFactorRequired"
                          input-id="two-factor"
                        />
                        <label for="two-factor" class="text-sm font-medium text-gray-700">
                          Two-Factor Authentication Required
                        </label>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Require 2FA for all user accounts
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <!-- Integrations -->
          <TabPanel header="Integrations">
            <Card>
              <template #content>
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">External Systems</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-3">
                        <div class="flex items-center gap-3">
                          <InputSwitch
                            v-model="localSettings.integrations.fregEnabled"
                            input-id="freg-enabled"
                          />
                          <label for="freg-enabled" class="text-sm font-medium text-gray-700">
                            FREG (Folkeregisteret)
                          </label>
                        </div>

                        <div class="flex items-center gap-3">
                          <InputSwitch
                            v-model="localSettings.integrations.altinnEnabled"
                            input-id="altinn-enabled"
                          />
                          <label for="altinn-enabled" class="text-sm font-medium text-gray-700">
                            Altinn
                          </label>
                        </div>

                        <div class="flex items-center gap-3">
                          <InputSwitch
                            v-model="localSettings.integrations.idPortenEnabled"
                            input-id="idporten-enabled"
                          />
                          <label for="idporten-enabled" class="text-sm font-medium text-gray-700">
                            ID-porten
                          </label>
                        </div>
                      </div>

                      <div class="space-y-3">
                        <div class="flex items-center gap-3">
                          <InputSwitch
                            v-model="localSettings.integrations.noarkEnabled"
                            input-id="noark-enabled"
                          />
                          <label for="noark-enabled" class="text-sm font-medium text-gray-700">
                            Noark 5
                          </label>
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            QlikSense URL
                          </label>
                          <InputText
                            v-model="localSettings.integrations.qlikSenseUrl"
                            class="w-full"
                            placeholder="https://qlik.oslo.kommune.no"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>
        </TabView>

        <!-- Save Confirmation Toast -->
        <Toast />
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import { useAdmin } from '@/composables/api/useAdmin'
import type { SystemSettings, SettingsUpdateRequest } from '@/types/admin'
import Button from 'primevue/button'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'

const toast = useToast()

const {
  systemSettings,
  settingsLoading,
  loadSystemSettings,
  updateSettings
} = useAdmin()

// Local state for form
const localSettings = ref<SystemSettings>({
  general: {
    systemName: '',
    adminEmail: '',
    supportEmail: '',
    defaultLanguage: 'no',
    timezone: 'Europe/Oslo',
    maintenanceMode: false
  },
  applications: {
    maxApplicationsPerChild: 5,
    applicationDeadline: '',
    autoApprovalEnabled: false,
    documentRequiredDays: 14,
    reminderEmailDays: 7
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    altinnIntegration: true,
    statusUpdateEmails: true,
    placementOfferEmails: true
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    twoFactorRequired: false,
    apiRateLimit: 1000
  },
  integrations: {
    fregEnabled: true,
    altinnEnabled: true,
    idPortenEnabled: true,
    noarkEnabled: true,
    qlikSenseUrl: ''
  }
})

const originalSettings = ref<SystemSettings | null>(null)
const activeTab = ref(0)

// Convert date for calendar component
const applicationDeadlineDate = computed({
  get: () => localSettings.value.applications.applicationDeadline
    ? new Date(localSettings.value.applications.applicationDeadline)
    : null,
  set: (value: Date | null) => {
    localSettings.value.applications.applicationDeadline = value
      ? value.toISOString().split('T')[0]
      : ''
  }
})

// Options for dropdowns
const languageOptions = [
  { label: 'Norwegian', value: 'no' },
  { label: 'English', value: 'en' }
]

const timezoneOptions = [
  { label: 'Europe/Oslo', value: 'Europe/Oslo' },
  { label: 'UTC', value: 'UTC' }
]

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (!originalSettings.value) return false
  return JSON.stringify(localSettings.value) !== JSON.stringify(originalSettings.value)
})

// Load settings on mount
onMounted(async () => {
  await loadSystemSettings()
  if (systemSettings.value) {
    localSettings.value = JSON.parse(JSON.stringify(systemSettings.value))
    originalSettings.value = JSON.parse(JSON.stringify(systemSettings.value))
  }
})

// Watch for changes in systemSettings from the store
watch(systemSettings, (newSettings) => {
  if (newSettings) {
    localSettings.value = JSON.parse(JSON.stringify(newSettings))
    originalSettings.value = JSON.parse(JSON.stringify(newSettings))
  }
}, { immediate: true })

// Methods
const saveSettings = async () => {
  try {
    // Save each category separately
    const categories: Array<keyof SystemSettings> = ['general', 'applications', 'notifications', 'security', 'integrations']

    for (const category of categories) {
      const request: SettingsUpdateRequest = {
        category,
        settings: localSettings.value[category]
      }
      await updateSettings(request)
    }

    originalSettings.value = JSON.parse(JSON.stringify(localSettings.value))

    toast.add({
      severity: 'success',
      summary: 'Settings Saved',
      detail: 'System settings have been updated successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save system settings. Please try again.',
      life: 5000
    })
  }
}

const resetSettings = () => {
  if (originalSettings.value) {
    localSettings.value = JSON.parse(JSON.stringify(originalSettings.value))
    toast.add({
      severity: 'info',
      summary: 'Settings Reset',
      detail: 'Changes have been discarded',
      life: 3000
    })
  }
}
</script>

<style scoped>
.system-settings {
  @apply p-6 max-w-6xl mx-auto;
}

.system-settings .p-tabview .p-tabview-panels {
  @apply p-0;
}

.system-settings .p-tabview .p-tabview-panel {
  @apply pt-6;
}
</style>
