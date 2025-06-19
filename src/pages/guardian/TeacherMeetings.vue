<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { t } = useI18n()
const selectedDate = ref('')

// Mock meetings data
const upcomingMeetings = ref([
  {
    id: 1,
    date: '2024-03-25',
    time: '14:00',
    teacher: 'Kari Andersen',
    type: 'Utviklingssamtale',
    duration: 30,
    status: 'confirmed',
    agenda: t('guardian.meetings.examples.socialDevelopment', 'Discuss Emma\'s social development and learning')
  },
  {
    id: 2,
    date: '2024-04-02',
    time: '15:30',
    teacher: 'Lars Eriksen',
    type: 'Bekymringssamtale',
    duration: 45,
    status: 'pending',
    agenda: t('guardian.meetings.examples.playgroundIncident', 'Follow-up after playground incident')
  }
])

const availableSlots = ref([
  { date: '2024-03-20', times: ['09:00', '10:00', '14:00', '15:00'] },
  { date: '2024-03-21', times: ['09:30', '11:00', '13:30'] },
  { date: '2024-03-22', times: ['10:00', '14:30', '15:30'] }
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'confirmed': return 'success'
    case 'pending': return 'warning'
    default: return 'info'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('guardian.meetings.title', 'Teacher Meetings') }}</h1>
        <p class="text-slate-600 mt-2">{{ t('guardian.meetings.description', 'Book meetings with your child\'s teachers and educators') }}</p>
      </div>
      <Button>
        <i class="pi pi-plus mr-2"></i>
        {{ t('guardian.meetings.bookNew', 'Book New Meeting') }}
      </Button>
    </div>

    <!-- Upcoming Meetings -->
    <Card>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">{{ t('guardian.meetings.upcomingMeetings', 'Upcoming Meetings') }}</h2>
          <p class="text-sm text-gray-600">{{ t('guardian.meetings.plannedMeetings', 'Your scheduled teacher meetings') }}</p>
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div v-for="meeting in upcomingMeetings" :key="meeting.id" class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <i class="pi pi-user text-xl"></i>
              </div>
              <div>
                <h3 class="font-semibold">{{ meeting.type }}</h3>
                <p class="text-sm text-gray-600">
                  {{ formatDate(meeting.date) }} {{ t('guardian.meetings.at', 'at') }} {{ meeting.time }}
                </p>
                <p class="text-sm text-gray-600">{{ t('guardian.meetings.with', 'With') }} {{ meeting.teacher }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Tag :severity="getStatusSeverity(meeting.status)" :value="t(`guardian.meetings.status.${meeting.status}`)" />
              <Button icon="pi pi-pencil" text />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Available Time Slots -->
    <Card>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">{{ t('guardian.meetings.availableSlots', 'Available Time Slots') }}</h2>
          <p class="text-sm text-gray-600">{{ t('guardian.meetings.selectTime', 'Select an available time for new meeting') }}</p>
        </div>
      </template>
      <template #content>
        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="(slot, index) in availableSlots" :key="index" class="border rounded-lg p-4">
            <h3 class="font-semibold mb-3">
              {{ formatDate(slot.date) }}
            </h3>
            <div class="space-y-2">
              <Button
                v-for="time in slot.times"
                :key="time"
                severity="secondary"
                outlined
                class="w-full"
              >
                {{ time }}
              </Button>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.p-card {
  border-radius: 1rem;
}
</style> 