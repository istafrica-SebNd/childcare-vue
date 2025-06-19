<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card } from 'primevue'
import { Calendar, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-vue-next'

const { t } = useI18n()

interface AttendanceData {
  totalDays: number
  presentDays: number
  absentDays: number
  averageHours: number
  monthlyTrend: {
    month: string
    attendance: number
  }[]
}

const attendanceData = ref<AttendanceData>({
  totalDays: 20,
  presentDays: 18,
  absentDays: 2,
  averageHours: 7.5,
  monthlyTrend: [
    { month: 'Oct', attendance: 95 },
    { month: 'Nov', attendance: 92 },
    { month: 'Dec', attendance: 88 },
    { month: 'Jan', attendance: 90 },
    { month: 'Feb', attendance: 94 },
    { month: 'Mar', attendance: 96 }
  ]
})

const attendanceRate = computed(() => {
  return Math.round((attendanceData.value.presentDays / attendanceData.value.totalDays) * 100)
})

const getAttendanceColor = (rate: number) => {
  if (rate >= 90) return 'text-emerald-600'
  if (rate >= 80) return 'text-amber-600'
  return 'text-red-600'
}

const getAttendanceIcon = (rate: number) => {
  if (rate >= 90) return CheckCircle
  if (rate >= 80) return Clock
  return XCircle
}
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
                {{ t('attendance_stats.title', 'Attendance Statistics') }}
              </h2>
              <p class="text-sm text-slate-600">
                {{ t('attendance_stats.subtitle', 'Monthly attendance overview and trends') }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-2xl font-bold" :class="getAttendanceColor(attendanceRate)">
                {{ attendanceRate }}%
              </div>
              <div class="text-sm text-slate-600">
                {{ t('attendance_stats.attendance_rate', 'Attendance Rate') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="p-6">
      <!-- Main Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div class="text-2xl font-bold text-slate-900">
            {{ attendanceData.totalDays }}
          </div>
          <div class="text-sm text-slate-600">
            {{ t('attendance_stats.total_days', 'Total Days') }}
          </div>
        </div>
        <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <div class="text-2xl font-bold text-emerald-600">
            {{ attendanceData.presentDays }}
          </div>
          <div class="text-sm text-emerald-600">
            {{ t('attendance_stats.present_days', 'Present Days') }}
          </div>
        </div>
        <div class="bg-red-50 p-4 rounded-xl border border-red-200">
          <div class="text-2xl font-bold text-red-600">
            {{ attendanceData.absentDays }}
          </div>
          <div class="text-sm text-red-600">
            {{ t('attendance_stats.absent_days', 'Absent Days') }}
          </div>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-slate-600" />
            <h3 class="font-medium text-slate-900">
              {{ t('attendance_stats.monthly_trend', 'Monthly Trend') }}
            </h3>
          </div>
        </div>
        <div class="h-48 flex items-end gap-2">
          <div
            v-for="(month, index) in attendanceData.monthlyTrend"
            :key="month.month"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="w-full bg-gradient-to-t from-oslo-blue to-blue-700 rounded-t-lg transition-all duration-300 hover:opacity-80"
              :style="{ height: `${month.attendance}%` }"
            />
            <div class="text-xs text-slate-600 mt-2">
              {{ month.month }}
            </div>
            <div class="text-xs font-medium" :class="getAttendanceColor(month.attendance)">
              {{ month.attendance }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Average Hours -->
      <div class="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div class="flex items-center gap-3">
          <Clock class="w-5 h-5 text-blue-600" />
          <div>
            <div class="font-medium text-blue-800">
              {{ t('attendance_stats.average_hours', 'Average Daily Hours') }}
            </div>
            <div class="text-2xl font-bold text-blue-700">
              {{ attendanceData.averageHours }} {{ t('attendance_stats.hours', 'hours') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template> 