<template>
  <BaseLayout>
    <template #content>
      <div class="global-config-admin">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Global Configuration</h1>
            <p class="mt-1 text-gray-600">
              Manage system-wide settings and configuration parameters
            </p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              :loading="loading"
              @click="loadConfiguration"
              class="p-button-outlined"
            />
            <Button
              icon="pi pi-save"
              label="Save All"
              @click="saveAllConfigurations"
              class="p-button-primary"
            />
          </div>
        </div>

        <!-- Configuration Sections -->
        <TabView>
          <TabPanel header="System Parameters">
            <Card>
              <template #title>System Parameters</template>
              <template #content>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                      <Calendar
                        v-model="config.applicationDeadline"
                        date-format="dd/mm/yy"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Max Applications per Child</label>
                      <InputNumber
                        v-model="config.maxApplicationsPerChild"
                        :min="1"
                        :max="10"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Placement Start Date</label>
                      <Calendar
                        v-model="config.placementStartDate"
                        date-format="dd/mm/yy"
                      />
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">System Maintenance Window</label>
                      <Dropdown
                        v-model="config.maintenanceWindow"
                        :options="maintenanceOptions"
                        option-label="label"
                        option-value="value"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Auto-backup Frequency</label>
                      <Dropdown
                        v-model="config.backupFrequency"
                        :options="backupOptions"
                        option-label="label"
                        option-value="value"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                      <InputNumber
                        v-model="config.sessionTimeout"
                        :min="15"
                        :max="480"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <TabPanel header="Business Rules">
            <Card>
              <template #title>Business Rules Configuration</template>
              <template #content>
                <div class="space-y-6">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 class="font-semibold mb-4">Sibling Priority</h3>
                      <div class="space-y-4">
                        <div class="flex items-center gap-3">
                          <InputSwitch
                            v-model="config.siblingPriority.enabled"
                            input-id="sibling-priority"
                          />
                          <label for="sibling-priority">Enable sibling priority</label>
                        </div>
                        <div v-if="config.siblingPriority.enabled">
                          <label class="block text-sm font-medium text-gray-700 mb-2">Priority Weight</label>
                          <InputNumber
                            v-model="config.siblingPriority.weight"
                            :min="1"
                            :max="100"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 class="font-semibold mb-4">Geographic Priority</h3>
                      <div class="space-y-4">
                        <div class="flex items-center gap-3">
                          <InputSwitch
                            v-model="config.geographicPriority.enabled"
                            input-id="geographic-priority"
                          />
                          <label for="geographic-priority">Enable geographic priority</label>
                        </div>
                        <div v-if="config.geographicPriority.enabled">
                          <label class="block text-sm font-medium text-gray-700 mb-2">Max Distance (km)</label>
                          <InputNumber
                            v-model="config.geographicPriority.maxDistance"
                            :min="0.5"
                            :max="50"
                            :min-fraction-digits="1"
                            :max-fraction-digits="1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <TabPanel header="Email & Notifications">
            <Card>
              <template #title>Communication Settings</template>
              <template #content>
                <div class="space-y-6">
                  <div>
                    <h3 class="font-semibold mb-4">Email Templates</h3>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Application Confirmation</label>
                        <Textarea
                          v-model="config.emailTemplates.applicationConfirmation"
                          rows="4"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Placement Offer</label>
                        <Textarea
                          v-model="config.emailTemplates.placementOffer"
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-semibold mb-4">Notification Settings</h3>
                    <div class="space-y-4">
                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="config.notifications.emailEnabled"
                          input-id="email-notifications"
                        />
                        <label for="email-notifications">Enable email notifications</label>
                      </div>
                      <div class="flex items-center gap-3">
                        <InputSwitch
                          v-model="config.notifications.smsEnabled"
                          input-id="sms-notifications"
                        />
                        <label for="sms-notifications">Enable SMS notifications</label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <TabPanel header="Advanced Settings">
            <Card>
              <template #title>Advanced System Configuration</template>
              <template #content>
                <div class="space-y-6">
                  <div>
                    <h3 class="font-semibold mb-4">Performance Settings</h3>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cache TTL (seconds)</label>
                        <InputNumber
                          v-model="config.performance.cacheTTL"
                          :min="60"
                          :max="3600"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Max Concurrent Users</label>
                        <InputNumber
                          v-model="config.performance.maxConcurrentUsers"
                          :min="100"
                          :max="10000"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="font-semibold mb-4">Security Settings</h3>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                        <InputNumber
                          v-model="config.security.passwordMinLength"
                          :min="8"
                          :max="64"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Login Attempts Limit</label>
                        <InputNumber
                          v-model="config.security.maxLoginAttempts"
                          :min="3"
                          :max="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </TabPanel>
        </TabView>

        <Toast />
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

const toast = useToast()

// State
const loading = ref(false)

// Configuration data
const config = ref({
  applicationDeadline: new Date('2024-04-30'),
  maxApplicationsPerChild: 5,
  placementStartDate: new Date('2024-08-01'),
  maintenanceWindow: 'sunday-02:00',
  backupFrequency: 'daily',
  sessionTimeout: 30,
  siblingPriority: {
    enabled: true,
    weight: 50
  },
  geographicPriority: {
    enabled: true,
    maxDistance: 5.0
  },
  emailTemplates: {
    applicationConfirmation: 'Dear guardian, your application has been received...',
    placementOffer: 'Congratulations! We are pleased to offer your child a place...'
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false
  },
  performance: {
    cacheTTL: 300,
    maxConcurrentUsers: 1000
  },
  security: {
    passwordMinLength: 12,
    maxLoginAttempts: 5
  }
})

// Options
const maintenanceOptions = [
  { label: 'Sunday 02:00', value: 'sunday-02:00' },
  { label: 'Saturday 23:00', value: 'saturday-23:00' },
  { label: 'Daily 03:00', value: 'daily-03:00' }
]

const backupOptions = [
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' }
]

// Methods
const loadConfiguration = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Configuration already loaded in mock
  } finally {
    loading.value = false
  }
}

const saveAllConfigurations = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Configuration Saved',
      detail: 'All configuration changes have been saved successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save configuration changes',
      life: 3000
    })
  }
}

// Initialize
onMounted(() => {
  loadConfiguration()
})
</script>

<style scoped>
.global-config-admin {
  @apply p-6 max-w-7xl mx-auto;
}
</style>
