<template>
  <BaseLayout>
    <template #content>
      <div class="features-admin">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Feature Flags</h1>
            <p class="mt-1 text-gray-600">
              Manage system feature flags and experimental features
            </p>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              :loading="loading"
              @click="loadFeatures"
              class="p-button-outlined"
            />
            <Button
              icon="pi pi-plus"
              label="New Feature"
              @click="createFeature"
              class="p-button-primary"
            />
          </div>
        </div>

        <!-- Feature Categories -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card class="border-0 shadow-lg">
            <template #content>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600">{{ activeFeatures }}</div>
                <div class="text-sm text-gray-600 mt-1">Active Features</div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg">
            <template #content>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600">{{ experimentalFeatures }}</div>
                <div class="text-sm text-gray-600 mt-1">Experimental</div>
              </div>
            </template>
          </Card>

          <Card class="border-0 shadow-lg">
            <template #content>
              <div class="text-center">
                <div class="text-3xl font-bold text-orange-600">{{ rolloutFeatures }}</div>
                <div class="text-sm text-gray-600 mt-1">In Rollout</div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Features List -->
        <Card>
          <template #content>
            <div class="space-y-4">
              <div
                v-for="feature in features"
                :key="feature.id"
                class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-semibold text-gray-900">{{ feature.name }}</h3>
                      <Tag
                        :value="feature.environment"
                        :class="{
                          'p-tag-success': feature.environment === 'production',
                          'p-tag-warning': feature.environment === 'staging',
                          'p-tag-info': feature.environment === 'development',
                          'p-tag-secondary': feature.environment === 'all'
                        }"
                      />
                      <Tag
                        v-if="feature.rolloutPercentage < 100"
                        :value="`${feature.rolloutPercentage}% rollout`"
                        severity="warning"
                      />
                    </div>
                    <p class="text-gray-600 text-sm mb-2">{{ feature.description }}</p>
                    <div class="text-xs text-gray-500">
                      Key: <code class="bg-gray-100 px-1 rounded">{{ feature.key }}</code>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <!-- Rollout Progress -->
                    <div v-if="feature.rolloutPercentage < 100" class="w-24">
                      <div class="text-xs text-gray-500 mb-1">Rollout</div>
                      <ProgressBar :value="feature.rolloutPercentage" class="h-2" />
                    </div>

                    <!-- Toggle Switch -->
                    <div class="flex items-center gap-2">
                      <label class="text-sm text-gray-700">Enabled</label>
                      <InputSwitch
                        v-model="feature.isEnabled"
                        @change="toggleFeature(feature)"
                      />
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                      <Button
                        icon="pi pi-pencil"
                        class="p-button-sm p-button-outlined"
                        @click="editFeature(feature)"
                        v-tooltip="'Edit Feature'"
                      />
                      <Button
                        icon="pi pi-trash"
                        class="p-button-sm p-button-outlined p-button-danger"
                        @click="deleteFeature(feature)"
                        v-tooltip="'Delete Feature'"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Create/Edit Feature Dialog -->
        <Dialog
          v-model:visible="showFeatureDialog"
          :style="{ width: '600px' }"
          :header="editingFeature ? 'Edit Feature' : 'Create Feature'"
          :modal="true"
          class="p-fluid"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <InputText
                v-model="featureForm.name"
                placeholder="Feature display name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Key</label>
              <InputText
                v-model="featureForm.key"
                placeholder="feature_key_snake_case"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                v-model="featureForm.description"
                rows="3"
                placeholder="Describe what this feature does"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                <Dropdown
                  v-model="featureForm.environment"
                  :options="environmentOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select environment"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rollout %</label>
                <InputNumber
                  v-model="featureForm.rolloutPercentage"
                  :min="0"
                  :max="100"
                  suffix="%"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center gap-3">
                <InputSwitch
                  v-model="featureForm.isEnabled"
                  input-id="feature-enabled"
                />
                <label for="feature-enabled" class="text-sm font-medium text-gray-700">
                  Enable Feature
                </label>
              </div>
            </div>
          </div>

          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-outlined"
              @click="showFeatureDialog = false"
            />
            <Button
              :label="editingFeature ? 'Update' : 'Create'"
              icon="pi pi-check"
              :loading="saving"
              @click="saveFeature"
            />
          </template>
        </Dialog>

        <ConfirmDialog />
        <Toast />
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import BaseLayout from '@/layouts/core/BaseLayout.vue'
import type { FeatureFlag } from '@/types/admin'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

// State
const loading = ref(false)
const saving = ref(false)
const features = ref<FeatureFlag[]>([])
const showFeatureDialog = ref(false)
const editingFeature = ref<FeatureFlag | null>(null)

// Form data
const featureForm = ref({
  name: '',
  key: '',
  description: '',
  isEnabled: false,
  rolloutPercentage: 100,
  environment: 'development' as const
})

// Options
const environmentOptions = [
  { label: 'Development', value: 'development' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' },
  { label: 'All Environments', value: 'all' }
]

// Mock data
const mockFeatures: FeatureFlag[] = [
  {
    id: '1',
    name: 'Real-time Notifications',
    key: 'realtime_notifications',
    description: 'WebSocket-based real-time notifications for users',
    isEnabled: true,
    rolloutPercentage: 100,
    environment: 'production',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Advanced Search',
    key: 'advanced_search',
    description: 'Enhanced search functionality with filters and facets',
    isEnabled: true,
    rolloutPercentage: 75,
    environment: 'staging',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'AI-Powered Recommendations',
    key: 'ai_recommendations',
    description: 'Machine learning based kindergarten recommendations',
    isEnabled: false,
    rolloutPercentage: 25,
    environment: 'development',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Mobile App Integration',
    key: 'mobile_app_integration',
    description: 'Native mobile app API endpoints',
    isEnabled: true,
    rolloutPercentage: 50,
    environment: 'staging',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Computed
const activeFeatures = computed(() =>
  features.value.filter(f => f.isEnabled).length
)

const experimentalFeatures = computed(() =>
  features.value.filter(f => f.environment === 'development').length
)

const rolloutFeatures = computed(() =>
  features.value.filter(f => f.rolloutPercentage < 100 && f.rolloutPercentage > 0).length
)

// Methods
const loadFeatures = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    features.value = mockFeatures
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Load Failed',
      detail: 'Failed to load feature flags',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const toggleFeature = async (feature: FeatureFlag) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    toast.add({
      severity: 'success',
      summary: 'Feature Updated',
      detail: `Feature "${feature.name}" has been ${feature.isEnabled ? 'enabled' : 'disabled'}`,
      life: 3000
    })
  } catch (error) {
    // Revert toggle on error
    feature.isEnabled = !feature.isEnabled
    toast.add({
      severity: 'error',
      summary: 'Update Failed',
      detail: 'Failed to update feature flag',
      life: 3000
    })
  }
}

const createFeature = () => {
  editingFeature.value = null
  featureForm.value = {
    name: '',
    key: '',
    description: '',
    isEnabled: false,
    rolloutPercentage: 100,
    environment: 'development'
  }
  showFeatureDialog.value = true
}

const editFeature = (feature: FeatureFlag) => {
  editingFeature.value = feature
  featureForm.value = {
    name: feature.name,
    key: feature.key,
    description: feature.description,
    isEnabled: feature.isEnabled,
    rolloutPercentage: feature.rolloutPercentage,
    environment: feature.environment
  }
  showFeatureDialog.value = true
}

const saveFeature = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingFeature.value) {
      // Update existing feature
      Object.assign(editingFeature.value, featureForm.value)
    } else {
      // Create new feature
      const newFeature: FeatureFlag = {
        id: String(Date.now()),
        ...featureForm.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      features.value.push(newFeature)
    }

    showFeatureDialog.value = false
    toast.add({
      severity: 'success',
      summary: editingFeature.value ? 'Feature Updated' : 'Feature Created',
      detail: `Feature "${featureForm.value.name}" has been ${editingFeature.value ? 'updated' : 'created'}`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: 'Failed to save feature flag',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const deleteFeature = (feature: FeatureFlag) => {
  confirm.require({
    message: `Are you sure you want to delete the feature "${feature.name}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      const index = features.value.findIndex(f => f.id === feature.id)
      if (index > -1) {
        features.value.splice(index, 1)
        toast.add({
          severity: 'success',
          summary: 'Feature Deleted',
          detail: `Feature "${feature.name}" has been deleted`,
          life: 3000
        })
      }
    }
  })
}

// Initialize
onMounted(() => {
  loadFeatures()
})
</script>

<style scoped>
.features-admin {
  @apply p-6 max-w-7xl mx-auto;
}

code {
  @apply text-xs font-mono;
}
</style>
