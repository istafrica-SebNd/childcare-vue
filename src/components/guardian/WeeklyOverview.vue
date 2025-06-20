<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card } from 'primevue'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-vue-next'

const { t } = useI18n()

interface DaySchedule {
  date: string
  status: 'present' | 'absent' | 'late'
  checkIn?: string
  checkOut?: string
  notes?: string
}

const currentWeek = ref<DaySchedule[]>([
  {
    date: '2024-03-18',
    status: 'present',
    checkIn: '08:15',
    checkOut: '16:30'
  },
  {
    date: '2024-03-19',
    status: 'late',
    checkIn: '09:30',
    checkOut: '16:45',
    notes: 'Late arrival due to doctor appointment'
  },
  {
    date: '2024-03-20',
    status: 'present',
    checkIn: '08:00',
    checkOut: '16:00'
  },
  {
    date: '2024-03-21',
    status: 'absent',
    notes: 'Sick leave'
  },
  {
    date: '2024-03-22',
    status: 'present',
    checkIn: '08:30',
    checkOut: '16:15'
  }
])

const getStatusIcon = (status: DaySchedule['status']) => {
  switch (status) {
    case 'present':
      return CheckCircle
    case 'absent':
      return XCircle
    case 'late':
      return AlertCircle
  }
}

const getStatusColor = (status: DaySchedule['status']) => {
  switch (status) {
    case 'present':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    case 'absent':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'late':
      return 'text-amber-600 bg-amber-50 border-amber-200'
  }
}

const getStatusText = (status: DaySchedule['status']) => {
  switch (status) {
    case 'present':
      return t('weekly_overview.status.present', 'Present')
    case 'absent':
      return t('weekly_overview.status.absent', 'Absent')
    case 'late':
      return t('weekly_overview.status.late', 'Late')
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const weeklyStats = computed(() => {
  const total = currentWeek.value.length
  const present = currentWeek.value.filter(day => day.status === 'present').length
  const absent = currentWeek.value.filter(day => day.status === 'absent').length
  const late = currentWeek.value.filter(day => day.status === 'late').length

  return {
    total,
    present,
    absent,
    late,
    attendanceRate: Math.round((present / total) * 100)
  }
})
</script>

<template>
  <Card class="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
    <template #header>
      <div class="border-b border-slate-200/60 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-oslo-blue to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-slate-900">
                {{ t('weekly_overview.title', 'Weekly Overview') }}
              </h2>
              <p class="text-sm text-slate-600">
                {{ t('weekly_overview.subtitle', 'Attendance and schedule for the current week') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-2xl font-bold text-slate-900">
                {{ weeklyStats.attendanceRate }}%
              </div>
              <div class="text-sm text-slate-600">
                {{ t('weekly_overview.attendance_rate', 'Attendance Rate') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="p-6">
      <!-- Weekly Stats -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div class="text-2xl font-bold text-slate-900">
            {{ weeklyStats.total }}
          </div>
          <div class="text-sm text-slate-600">
            {{ t('weekly_overview.total_days', 'Total Days') }}
          </div>
        </div>
        <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <div class="text-2xl font-bold text-emerald-600">
            {{ weeklyStats.present }}
          </div>
          <div class="text-sm text-emerald-600">
            {{ t('weekly_overview.present_days', 'Present Days') }}
          </div>
        </div>
        <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <div class="text-2xl font-bold text-amber-600">
            {{ weeklyStats.late }}
          </div>
          <div class="text-sm text-amber-600">
            {{ t('weekly_overview.late_days', 'Late Days') }}
          </div>
        </div>
        <div class="bg-red-50 p-4 rounded-xl border border-red-200">
          <div class="text-2xl font-bold text-red-600">
            {{ weeklyStats.absent }}
          </div>
          <div class="text-sm text-red-600">
            {{ t('weekly_overview.absent_days', 'Absent Days') }}
          </div>
        </div>
      </div>

      <!-- Daily Schedule -->
      <div class="space-y-4">
        <div
          v-for="day in currentWeek"
          :key="day.date"
          class="flex items-center justify-between p-4 rounded-xl border transition-colors"
          :class="[
            day.status === 'present' ? 'bg-emerald-50 border-emerald-200' :
            day.status === 'absent' ? 'bg-red-50 border-red-200' :
            'bg-amber-50 border-amber-200'
          ]"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="[
                day.status === 'present' ? 'bg-emerald-100' :
                day.status === 'absent' ? 'bg-red-100' :
                'bg-amber-100'
              ]"
            >
              <component
                :is="getStatusIcon(day.status)"
                class="w-5 h-5"
                :class="[
                  day.status === 'present' ? 'text-emerald-600' :
                  day.status === 'absent' ? 'text-red-600' :
                  'text-amber-600'
                ]"
              />
            </div>
            <div>
              <div class="font-medium text-slate-900">
                {{ formatDate(day.date) }}
              </div>
              <div class="text-sm" :class="getStatusColor(day.status)">
                {{ getStatusText(day.status) }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div v-if="day.checkIn || day.checkOut" class="flex items-center gap-4">
              <div v-if="day.checkIn" class="text-right">
                <div class="text-sm text-slate-600">
                  {{ t('weekly_overview.check_in', 'Check In') }}
                </div>
                <div class="font-medium text-slate-900">
                  {{ day.checkIn }}
                </div>
              </div>
              <div v-if="day.checkOut" class="text-right">
                <div class="text-sm text-slate-600">
                  {{ t('weekly_overview.check_out', 'Check Out') }}
                </div>
                <div class="font-medium text-slate-900">
                  {{ day.checkOut }}
                </div>
              </div>
            </div>
            <div v-if="day.notes" class="text-sm text-slate-600 max-w-xs">
              {{ day.notes }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template> 
