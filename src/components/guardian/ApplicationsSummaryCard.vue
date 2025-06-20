<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, Button, Tag } from 'primevue'
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-vue-next'

const { t } = useI18n()

interface Application {
  id: string
  kindergarten: string
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
  startDate: string
  progress: number
}

const applications = ref<Application[]>([
  {
    id: 'APP-2024-001',
    kindergarten: 'Oslo Kindergarten Center',
    status: 'pending',
    submittedDate: '2024-03-15',
    startDate: '2024-08-01',
    progress: 60
  },
  {
    id: 'APP-2024-002',
    kindergarten: 'Nordstrand Kindergarten',
    status: 'approved',
    submittedDate: '2024-02-20',
    startDate: '2024-08-15',
    progress: 100
  },
  {
    id: 'APP-2024-003',
    kindergarten: 'Frogner Kindergarten',
    status: 'rejected',
    submittedDate: '2024-01-10',
    startDate: '2024-08-01',
    progress: 100
  }
])

const getStatusIcon = (status: Application['status']) => {
  switch (status) {
    case 'pending':
      return Clock
    case 'approved':
      return CheckCircle
    case 'rejected':
      return XCircle
  }
}

const getStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'pending':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'approved':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    case 'rejected':
      return 'text-red-600 bg-red-50 border-red-200'
  }
}

const getStatusText = (status: Application['status']) => {
  switch (status) {
    case 'pending':
      return t('applications.status.pending', 'Pending')
    case 'approved':
      return t('applications.status.approved', 'Approved')
    case 'rejected':
      return t('applications.status.rejected', 'Rejected')
  }
}

const activeApplications = computed(() => {
  return applications.value.filter(app => app.status === 'pending').length
})

const completedApplications = computed(() => {
  return applications.value.filter(app => app.status !== 'pending').length
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
    <template #header>
      <div class="border-b border-slate-200/60 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-oslo-blue to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <FileText class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-slate-900">
                {{ t('applications.title', 'Applications') }}
              </h2>
              <p class="text-sm text-slate-600">
                {{ t('applications.subtitle', 'Track your kindergarten applications') }}
              </p>
            </div>
          </div>
          <router-link
            to="/guardian/applications"
            class="text-sm font-medium text-oslo-blue hover:text-blue-700 flex items-center gap-1"
          >
            {{ t('common.view_all', 'View All') }}
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </template>

    <div class="p-6">
      <!-- Application Stats -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <div class="text-2xl font-bold text-amber-600">
            {{ activeApplications }}
          </div>
          <div class="text-sm text-amber-600">
            {{ t('applications.active', 'Active Applications') }}
          </div>
        </div>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div class="text-2xl font-bold text-slate-900">
            {{ completedApplications }}
          </div>
          <div class="text-sm text-slate-600">
            {{ t('applications.completed', 'Completed') }}
          </div>
        </div>
      </div>

      <!-- Applications List -->
      <div class="space-y-4">
        <div
          v-for="app in applications"
          :key="app.id"
          class="flex items-center justify-between p-4 rounded-xl border transition-colors"
          :class="[
            app.status === 'pending' ? 'bg-amber-50 border-amber-200' :
            app.status === 'approved' ? 'bg-emerald-50 border-emerald-200' :
            'bg-red-50 border-red-200'
          ]"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="[
                app.status === 'pending' ? 'bg-amber-100' :
                app.status === 'approved' ? 'bg-emerald-100' :
                'bg-red-100'
              ]"
            >
              <component
                :is="getStatusIcon(app.status)"
                class="w-5 h-5"
                :class="[
                  app.status === 'pending' ? 'text-amber-600' :
                  app.status === 'approved' ? 'text-emerald-600' :
                  'text-red-600'
                ]"
              />
            </div>
            <div>
              <div class="font-medium text-slate-900">
                {{ app.kindergarten }}
              </div>
              <div class="text-sm" :class="getStatusColor(app.status)">
                {{ getStatusText(app.status) }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-right">
              <div class="text-sm text-slate-600">
                {{ t('applications.submitted', 'Submitted') }}
              </div>
              <div class="font-medium text-slate-900">
                {{ formatDate(app.submittedDate) }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-slate-600">
                {{ t('applications.start_date', 'Start Date') }}
              </div>
              <div class="font-medium text-slate-900">
                {{ formatDate(app.startDate) }}
              </div>
            </div>
            <div v-if="app.status === 'pending'" class="w-24">
              <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-oslo-blue to-blue-700 transition-all duration-300"
                  :style="{ width: `${app.progress}%` }"
                />
              </div>
              <div class="text-xs text-slate-600 mt-1">
                {{ app.progress }}% {{ t('applications.complete', 'complete') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- New Application Button -->
      <div class="mt-6">
        <router-link to="/guardian/new-application">
          <Button class="w-full bg-gradient-to-r from-oslo-blue to-blue-700 hover:from-oslo-blue/90 hover:to-blue-700/90 shadow-lg">
            {{ t('applications.new', 'New Application') }}
            <ArrowRight class="w-4 h-4 ml-2" />
          </Button>
        </router-link>
      </div>
    </div>
  </Card>
</template> 
