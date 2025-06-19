<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  AlertCircle,
  MessageSquare,
  Calendar,
  FileText,
  Clock,
  UserPlus
} from 'lucide-vue-next'

const { t } = useI18n()

const actions = [
  {
    title: t('actions.report_absence', 'Report Absence'),
    description: t('actions.report_absence_desc', 'Report child absence or schedule future absence'),
    icon: AlertCircle,
    url: '/guardian/absence-reporting',
    color: 'text-red-500'
  },
  {
    title: t('actions.message_teacher', 'Message Teacher'),
    description: t('actions.message_teacher_desc', 'Send a message to your child\'s teacher'),
    icon: MessageSquare,
    url: '/guardian/messages',
    color: 'text-blue-500'
  },
  {
    title: t('actions.schedule_meeting', 'Schedule Meeting'),
    description: t('actions.schedule_meeting_desc', 'Request a meeting with staff'),
    icon: Calendar,
    url: '/guardian/teacher-meetings',
    color: 'text-green-500'
  },
  {
    title: t('actions.view_documents', 'View Documents'),
    description: t('actions.view_documents_desc', 'Access consents and important documents'),
    icon: FileText,
    url: '/guardian/documents',
    color: 'text-purple-500'
  },
  {
    title: t('actions.check_schedule', 'Check Schedule'),
    description: t('actions.check_schedule_desc', 'View today\'s activities and schedule'),
    icon: Clock,
    url: '/guardian/daily-schedule',
    color: 'text-orange-500'
  },
  {
    title: t('actions.add_guardian', 'Add Guardian'),
    description: t('actions.add_guardian_desc', 'Add another guardian to your child\'s profile'),
    icon: UserPlus,
    url: '/guardian/child-profile',
    color: 'text-teal-500'
  }
]
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-4">
        {{ t('quick_actions.title', 'Quick Actions') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="action in actions"
          :key="action.url"
          :to="action.url"
          class="group p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div
              class="p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors"
              :class="action.color"
            >
              <component :is="action.icon" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-medium text-slate-900 group-hover:text-primary-600">
                {{ action.title }}
              </h3>
              <p class="text-sm text-slate-500 mt-1">
                {{ action.description }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template> 