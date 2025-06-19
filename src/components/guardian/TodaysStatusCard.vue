<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-vue-next'

const { t } = useI18n()

interface ChildStatus {
  id: string
  name: string
  status: 'present' | 'absent' | 'late' | 'unknown'
  checkInTime?: string
  checkOutTime?: string
  notes?: string
}

const children = ref<ChildStatus[]>([
  {
    id: '1',
    name: 'Emma Johnson',
    status: 'present',
    checkInTime: '08:30',
    checkOutTime: '16:00'
  },
  {
    id: '2',
    name: 'Lucas Smith',
    status: 'late',
    checkInTime: '09:15',
    notes: 'Arrived late due to traffic'
  },
  {
    id: '3',
    name: 'Sophia Williams',
    status: 'absent',
    notes: 'Sick leave'
  }
])

const getStatusIcon = (status: ChildStatus['status']) => {
  switch (status) {
    case 'present':
      return CheckCircle2
    case 'absent':
      return XCircle
    case 'late':
      return Clock
    default:
      return AlertCircle
  }
}

const getStatusColor = (status: ChildStatus['status']) => {
  switch (status) {
    case 'present':
      return 'text-green-500'
    case 'absent':
      return 'text-red-500'
    case 'late':
      return 'text-orange-500'
    default:
      return 'text-slate-500'
  }
}

const getStatusText = (status: ChildStatus['status']) => {
  switch (status) {
    case 'present':
      return t('status.present', 'Present')
    case 'absent':
      return t('status.absent', 'Absent')
    case 'late':
      return t('status.late', 'Late')
    default:
      return t('status.unknown', 'Unknown')
  }
}

const presentCount = computed(() => 
  children.value.filter(child => child.status === 'present').length
)

const absentCount = computed(() => 
  children.value.filter(child => child.status === 'absent').length
)

const lateCount = computed(() => 
  children.value.filter(child => child.status === 'late').length
)
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-4">
        {{ t('today_status.title', "Today's Status") }}
      </h2>

      <!-- Status Summary -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="text-center p-4 rounded-lg bg-green-50">
          <div class="text-2xl font-semibold text-green-600">{{ presentCount }}</div>
          <div class="text-sm text-green-700">{{ t('status.present', 'Present') }}</div>
        </div>
        <div class="text-center p-4 rounded-lg bg-red-50">
          <div class="text-2xl font-semibold text-red-600">{{ absentCount }}</div>
          <div class="text-sm text-red-700">{{ t('status.absent', 'Absent') }}</div>
        </div>
        <div class="text-center p-4 rounded-lg bg-orange-50">
          <div class="text-2xl font-semibold text-orange-600">{{ lateCount }}</div>
          <div class="text-sm text-orange-700">{{ t('status.late', 'Late') }}</div>
        </div>
      </div>

      <!-- Children List -->
      <div class="space-y-4">
        <div
          v-for="child in children"
          :key="child.id"
          class="flex items-center justify-between p-4 rounded-lg border border-slate-200"
        >
          <div class="flex items-center gap-3">
            <div
              class="p-2 rounded-lg bg-slate-50"
              :class="getStatusColor(child.status)"
            >
              <component :is="getStatusIcon(child.status)" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-medium text-slate-900">{{ child.name }}</h3>
              <div class="flex items-center gap-2 text-sm text-slate-500">
                <span>{{ getStatusText(child.status) }}</span>
                <span v-if="child.checkInTime">•</span>
                <span v-if="child.checkInTime">
                  {{ t('status.check_in', 'Check-in') }}: {{ child.checkInTime }}
                </span>
                <span v-if="child.checkOutTime">•</span>
                <span v-if="child.checkOutTime">
                  {{ t('status.check_out', 'Check-out') }}: {{ child.checkOutTime }}
                </span>
              </div>
            </div>
          </div>
          <p v-if="child.notes" class="text-sm text-slate-500">
            {{ child.notes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 