<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'

const { t } = useI18n()
const showAddForm = ref(false)

// Mock authorized persons data
const authorizedPersons = ref([
  {
    id: 1,
    name: 'Lars Eriksen',
    relationship: t('guardian.pickup.relationships.father'),
    phone: '+47 987 65 432',
    validUntil: '2024-12-31',
    status: 'active',
    emergencyContact: true
  },
  {
    id: 2,
    name: 'Inga Andersen',
    relationship: t('guardian.pickup.relationships.grandmother'),
    phone: '+47 456 78 901',
    validUntil: '2024-06-30',
    status: 'active',
    emergencyContact: false
  },
  {
    id: 3,
    name: 'Kari Olsen',
    relationship: t('guardian.pickup.relationships.friend'),
    phone: '+47 234 56 789',
    validUntil: '2024-04-15',
    status: 'temporary',
    emergencyContact: false
  }
])

const emergencyPickups = ref([
  {
    id: 1,
    date: new Date().toISOString().split('T')[0],
    person: 'Inga Andersen',
    reason: t('guardian.pickup.emergencyReasons.parentIll'),
    status: 'approved',
    requestTime: '14:30'
  }
])

const relationships = [
  { label: t('guardian.pickup.relationships.father'), value: 'father' },
  { label: t('guardian.pickup.relationships.mother'), value: 'mother' },
  { label: t('guardian.pickup.relationships.grandmother'), value: 'grandmother' },
  { label: t('guardian.pickup.relationships.grandfather'), value: 'grandfather' },
  { label: t('guardian.pickup.relationships.friend'), value: 'friend' },
  { label: t('guardian.pickup.relationships.other'), value: 'other' }
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'temporary': return 'warning'
    case 'approved': return 'success'
    default: return 'info'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('guardian.pickup.title') }}</h1>
        <p class="text-slate-600 mt-2">{{ t('guardian.pickup.description') }}</p>
      </div>
      <Button @click="showAddForm = true">
        <i class="pi pi-plus mr-2"></i>
        {{ t('guardian.pickup.addAuthorized') }}
      </Button>
    </div>

    <!-- Emergency Pickup Today -->
    <Card class="border-l-4 border-l-red-500">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-shield text-red-500"></i>
          {{ t('guardian.pickup.emergencyToday') }}
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <Dropdown
              v-model="selectedPerson"
              :options="authorizedPersons"
              optionLabel="name"
              :placeholder="t('guardian.pickup.selectPerson')"
              class="flex-1"
            />
            <Calendar
              v-model="pickupTime"
              timeOnly
              :placeholder="t('guardian.pickup.pickupTime')"
              class="w-48"
            />
          </div>
          <Textarea
            v-model="emergencyReason"
            :placeholder="t('guardian.pickup.emergencyReason')"
            rows="3"
            class="w-full"
          />
          <Button class="w-full">
            {{ t('guardian.pickup.notifyEmergency') }}
          </Button>
        </div>
      </template>
    </Card>

    <!-- Authorized Persons -->
    <Card>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">{{ t('guardian.pickup.authorizedPersons') }}</h2>
          <p class="text-sm text-gray-600">{{ t('guardian.pickup.authorizedDescription') }}</p>
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div v-for="person in authorizedPersons" :key="person.id" class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <i class="pi pi-users text-xl"></i>
              </div>
              <div>
                <h3 class="font-semibold">{{ person.name }}</h3>
                <p class="text-sm text-gray-600">{{ person.relationship }}</p>
                <div class="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span class="flex items-center gap-1">
                    <i class="pi pi-phone"></i>
                    {{ person.phone }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="pi pi-clock"></i>
                    {{ t('guardian.pickup.validUntil') }}: {{ formatDate(person.validUntil) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Tag v-if="person.emergencyContact" severity="danger" value="Emergency" />
              <Tag :severity="getStatusSeverity(person.status)" :value="t(`guardian.pickup.status.${person.status}`)" />
              <Button icon="pi pi-pencil" text />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Recent Emergency Pickups -->
    <Card>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">{{ t('guardian.pickup.recentEmergency') }}</h2>
          <p class="text-sm text-gray-600">{{ t('guardian.pickup.recentDescription') }}</p>
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <div v-for="pickup in emergencyPickups" :key="pickup.id" class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i class="pi pi-shield text-red-600 text-xl"></i>
              </div>
              <div>
                <h3 class="font-semibold">
                  {{ formatDate(pickup.date) }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ pickup.person }} - {{ pickup.reason }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ t('guardian.pickup.requestedAt') }}: {{ pickup.requestTime }}
                </p>
              </div>
            </div>
            <Tag :severity="getStatusSeverity(pickup.status)" :value="t(`guardian.pickup.status.${pickup.status}`)" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Add Authorization Form -->
    <Card v-if="showAddForm" class="border-2 border-blue-500">
      <template #header>
        <h2 class="text-xl font-semibold">{{ t('guardian.pickup.addNewPerson') }}</h2>
      </template>
      <template #content>
        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">
                {{ t('guardian.pickup.fullName') }}
              </label>
              <InputText
                v-model="newPerson.name"
                :placeholder="t('guardian.pickup.enterName')"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                {{ t('guardian.pickup.relationship') }}
              </label>
              <Dropdown
                v-model="newPerson.relationship"
                :options="relationships"
                optionLabel="label"
                optionValue="value"
                :placeholder="t('guardian.pickup.selectRelationship')"
                class="w-full"
              />
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">
                {{ t('guardian.pickup.phoneNumber') }}
              </label>
              <InputText
                v-model="newPerson.phone"
                placeholder="+47 xxx xx xxx"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                {{ t('guardian.pickup.validUntil') }}
              </label>
              <Calendar
                v-model="newPerson.validUntil"
                dateFormat="yy-mm-dd"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <Button severity="secondary" @click="showAddForm = false">
              {{ t('common.cancel') }}
            </Button>
            <Button>
              {{ t('common.save') }}
            </Button>
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
