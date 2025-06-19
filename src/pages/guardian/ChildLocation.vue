<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapPin, Navigation, Clock, User, Phone } from 'lucide-vue-next'
import { format } from 'date-fns'
import { nb, enUS } from 'date-fns/locale'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { t, locale } = useI18n()
const selectedView = ref('current')

interface Location {
  area: string
  building: string
  room: string
  lastUpdate: Date
  staff: string
  staffPhone: string
}

interface LocationHistory {
  time: string
  area: string
  activity: string
}

interface MapLocation {
  id: string
  name: string
  x: number
  y: number
  current?: boolean
}

// Mock data
const currentLocation = ref<Location>({
  area: t('guardian.location.areas.playground'),
  building: t('guardian.location.buildings.main'),
  room: t('guardian.location.rooms.outdoor'),
  lastUpdate: new Date(),
  staff: 'Kari Andersen',
  staffPhone: '+47 123 45 678'
})

const locationHistory = ref<LocationHistory[]>([
  {
    time: '13:45',
    area: t('guardian.location.areas.playground'),
    activity: t('guardian.location.activities.outdoorPlay')
  },
  {
    time: '12:30',
    area: t('guardian.location.areas.diningRoom'),
    activity: t('guardian.location.activities.lunch')
  },
  {
    time: '11:00',
    area: t('guardian.location.areas.classroom'),
    activity: t('guardian.location.activities.learningTime')
  },
  {
    time: '09:30',
    area: t('guardian.location.areas.playground'),
    activity: t('guardian.location.activities.morningPlay')
  },
  {
    time: '08:15',
    area: t('guardian.location.areas.mainEntrance'),
    activity: t('guardian.location.activities.arrival')
  }
])

const kindergartenMap = ref<MapLocation[]>([
  { id: 'entrance', name: t('guardian.location.areas.mainEntrance'), x: 10, y: 80 },
  { id: 'classroom1', name: t('guardian.location.areas.classroom'), x: 30, y: 30 },
  { id: 'dining', name: t('guardian.location.areas.diningRoom'), x: 70, y: 30 },
  { id: 'playground', name: t('guardian.location.areas.playground'), x: 50, y: 70, current: true },
  { id: 'rest', name: t('guardian.location.areas.restRoom'), x: 30, y: 60 }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('guardian.location.title') }}</h1>
        <p class="text-slate-600 mt-2">{{ t('guardian.location.description') }}</p>
      </div>
      <div class="flex gap-2">
        <Button 
          :outlined="selectedView !== 'current'"
          @click="selectedView = 'current'"
        >
          {{ t('guardian.location.currentLocation') }}
        </Button>
        <Button 
          :outlined="selectedView !== 'history'"
          @click="selectedView = 'history'"
        >
          {{ t('guardian.location.locationHistory') }}
        </Button>
      </div>
    </div>

    <!-- Current Location -->
    <Card v-if="selectedView === 'current'">
      <template #header>
        <div class="flex items-center gap-2">
          <MapPin class="w-5 h-5 text-primary" />
          <h2 class="text-xl font-semibold">{{ t('guardian.location.currentLocation') }}</h2>
        </div>
        <p class="text-sm text-gray-500">
          {{ t('guardian.location.lastUpdated') }}: {{ format(currentLocation.lastUpdate, 'HH:mm', { locale }) }}
        </p>
      </template>

      <template #content>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <MapPin class="w-5 h-5" />
              </div>
              <div>
                <p class="font-semibold text-lg">{{ currentLocation.area }}</p>
                <p class="text-sm text-slate-600">
                  {{ currentLocation.building }} - {{ currentLocation.room }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                <User class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm text-slate-600">{{ t('guardian.location.responsibleStaff') }}</p>
                <p class="font-semibold">{{ currentLocation.staff }}</p>
              </div>
            </div>

            <Button class="w-full mt-4">
              <template #icon>
                <Phone class="w-4 h-4 mr-2" />
              </template>
              {{ t('guardian.location.contactStaff') }}
            </Button>
          </div>
          
          <!-- Simple Map View -->
          <div>
            <div class="text-sm font-medium mb-2 text-center">
              {{ t('guardian.location.kindergartenMap') }}
            </div>
            <div class="relative w-full h-48 bg-white rounded border">
              <div v-for="location in kindergartenMap" :key="location.id"
                   :class="[
                     'absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2',
                     location.current ? 'bg-primary animate-pulse' : 'bg-slate-300'
                   ]"
                   :style="{ 
                     left: `${location.x}%`, 
                     top: `${location.y}%` 
                   }"
                   :title="location.name">
                <div v-if="location.current" 
                     class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {{ location.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Location History -->
    <Card v-if="selectedView === 'history'">
      <template #header>
        <h2 class="text-xl font-semibold">{{ t('guardian.location.locationHistory') }}</h2>
        <p class="text-sm text-gray-500">{{ t('guardian.location.historyDescription') }}</p>
      </template>

      <template #content>
        <div class="space-y-4">
          <div v-for="(entry, index) in locationHistory" :key="index" 
               class="flex items-center gap-4 p-4 border rounded-lg">
            <div class="text-sm font-mono text-slate-600 w-16">
              {{ entry.time }}
            </div>
            <div class="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <MapPin class="w-5 h-5 text-slate-600" />
            </div>
            <div class="flex-1">
              <h3 class="font-medium">{{ entry.area }}</h3>
              <p class="text-sm text-slate-600">{{ entry.activity }}</p>
            </div>
            <Tag v-if="index === 0" severity="info">
              {{ t('guardian.location.current') }}
            </Tag>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template> 