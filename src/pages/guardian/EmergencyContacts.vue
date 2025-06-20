<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import { User, Phone, Clock, FileText, MapPin, AlertTriangle } from 'lucide-vue-next'

defineOptions({
  name: 'EmergencyContacts'
})

const { t } = useI18n()

interface EmergencyContact {
  id: number
  name: string
  relationship: string
  phone: string
  email: string
  priority: number
  canPickup: boolean
  verified: boolean
  isPrimary: boolean
  availability: string
  notes: string
}

const emergencyContacts = ref<EmergencyContact[]>([
  {
    id: 1,
    name: 'Maria Hansen',
    relationship: 'Mother',
    phone: '+47 123 45 678',
    email: 'maria@example.com',
    priority: 1,
    canPickup: true,
    verified: true,
    isPrimary: true,
    availability: '24/7',
    notes: ''
  },
  {
    id: 2,
    name: 'Jon Hansen',
    relationship: 'Father',
    phone: '+47 987 65 432',
    email: 'jon@example.com',
    priority: 2,
    canPickup: true,
    verified: true,
    isPrimary: false,
    availability: 'Weekdays',
    notes: 'Works from home'
  },
  {
    id: 3,
    name: 'Anna Larsen',
    relationship: 'Grandmother',
    phone: '+47 555 44 333',
    email: 'anna@example.com',
    priority: 3,
    canPickup: false,
    verified: false,
    isPrimary: false,
    availability: 'Weekends',
    notes: 'Available on weekends'
  }
])

const isAddDialogOpen = ref(false)
const newContact = ref({
  name: '',
  relationship: '',
  phone: '',
  email: '',
  canPickup: false,
  availability: '',
  notes: ''
})

const relationshipOptions = [
  { label: 'Mother', value: 'Mother' },
  { label: 'Father', value: 'Father' },
  { label: 'Grandmother', value: 'Grandmother' },
  { label: 'Grandfather', value: 'Grandfather' },
  { label: 'Aunt', value: 'Aunt' },
  { label: 'Uncle', value: 'Uncle' },
  { label: 'Family Friend', value: 'Family Friend' },
  { label: 'Other', value: 'Other' }
]

const handleAddContact = () => {
  if (newContact.value.name && newContact.value.phone) {
    const contact: EmergencyContact = {
      id: emergencyContacts.value.length + 1,
      ...newContact.value,
      priority: emergencyContacts.value.length + 1,
      verified: false,
      isPrimary: false,
      availability: '',
      notes: ''
    }
    emergencyContacts.value.push(contact)
    newContact.value = {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      canPickup: false,
      availability: '',
      notes: ''
    }
    isAddDialogOpen.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ t('guardian.emergencyContacts.title') }}</h1>
        <p class="text-slate-600 mt-2">{{ t('guardian.emergencyContacts.description') }}</p>
      </div>
      <Button @click="isAddDialogOpen = true" class="bg-oslo-blue hover:bg-oslo-blue/90">
        <User class="w-4 h-4 mr-2" />
        {{ t('guardian.emergencyContacts.addNew') }}
      </Button>
    </div>

    <!-- Important Notice -->
    <Card class="border-yellow-200 bg-yellow-50">
      <template #content>
        <div class="flex items-start gap-3 p-4">
          <div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock class="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-yellow-800">{{ t('guardian.emergencyContacts.important') }}</h3>
            <p class="text-yellow-700 text-sm mt-1">
              {{ t('guardian.emergencyContacts.importantNotice') }}
            </p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Emergency Contacts List -->
    <div class="space-y-4">
      <Card
        v-for="contact in emergencyContacts"
        :key="contact.id"
        class="hover:shadow-md transition-shadow"
      >
        <template #content>
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-oslo-blue/10 rounded-full flex items-center justify-center">
                  <User class="w-6 h-6 text-oslo-blue" />
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-slate-900">{{ contact.name }}</h3>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="contact.isPrimary ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'"
                    >
                      {{ contact.isPrimary ? t('guardian.emergencyContacts.primary') : t('guardian.emergencyContacts.secondary') }}
                    </span>
                  </div>

                  <p class="text-slate-600 mb-3">{{ contact.relationship }}</p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-slate-400" />
                      <a
                        :href="`tel:${contact.phone}`"
                        class="text-oslo-blue hover:text-oslo-blue/80 hover:underline transition-colors"
                      >
                        {{ contact.phone }}
                      </a>
                    </div>

                    <div class="flex items-center gap-2">
                      <MapPin class="w-4 h-4 text-slate-400" />
                      <a
                        :href="`mailto:${contact.email}`"
                        class="text-oslo-blue hover:text-oslo-blue/80 hover:underline transition-colors"
                      >
                        {{ contact.email }}
                      </a>
                    </div>

                    <div class="flex items-center gap-2">
                      <Clock class="w-4 h-4 text-slate-400" />
                      <span class="text-slate-600">{{ contact.availability }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <FileText class="w-4 h-4 text-slate-400" />
                      <span class="text-slate-600">{{ t('guardian.emergencyContacts.verified') }}</span>
                    </div>
                  </div>

                  <div v-if="contact.notes" class="mt-3 p-3 bg-slate-50 rounded-lg">
                    <p class="text-sm text-slate-600">
                      <strong>{{ t('guardian.emergencyContacts.notes') }}:</strong> {{ contact.notes }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 ml-4">
                <Button text severity="secondary" size="small">
                  <FileText class="w-4 h-4" />
                </Button>
                <Button text severity="secondary" size="small">
                  <Phone class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Add New Contact Card -->
    <Card
      class="border-dashed border-2 border-slate-300 hover:border-oslo-blue transition-colors cursor-pointer"
      @click="isAddDialogOpen = true"
    >
      <template #content>
        <div class="p-8 text-center">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-700 mb-2">{{ t('guardian.emergencyContacts.addNew') }}</h3>
          <p class="text-slate-500">{{ t('guardian.emergencyContacts.clickToAdd') }}</p>
        </div>
      </template>
    </Card>

    <!-- Important Information -->
    <Card class="border-blue-200 bg-blue-50">
      <template #content>
        <div class="p-6">
          <div class="flex items-start gap-3">
            <AlertTriangle class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 class="font-semibold text-blue-800 mb-2">{{ t('guardian.emergencyContacts.requirements') }}</h3>
              <ul class="space-y-1 text-sm text-blue-700">
                <li>• {{ t('guardian.emergencyContacts.requirement1') }}</li>
                <li>• {{ t('guardian.emergencyContacts.requirement2') }}</li>
                <li>• {{ t('guardian.emergencyContacts.requirement3') }}</li>
                <li>• {{ t('guardian.emergencyContacts.requirement4') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Add Emergency Contact Dialog -->
    <Dialog
      v-model:visible="isAddDialogOpen"
      modal
      :header="t('guardian.emergencyContacts.addNew')"
      class="w-full max-w-2xl"
    >
      <form @submit.prevent="handleAddContact" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('guardian.emergencyContacts.fullName') }}
            </label>
            <InputText
              v-model="newContact.name"
              :placeholder="t('guardian.emergencyContacts.fullNamePlaceholder')"
              class="w-full"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('guardian.emergencyContacts.relationship') }}
            </label>
            <Dropdown
              v-model="newContact.relationship"
              :options="relationshipOptions"
              :placeholder="t('guardian.emergencyContacts.selectRelationship')"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('guardian.emergencyContacts.phone') }}
            </label>
            <InputText
              v-model="newContact.phone"
              :placeholder="t('guardian.emergencyContacts.phonePlaceholder')"
              class="w-full"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('guardian.emergencyContacts.email') }}
            </label>
            <InputText
              v-model="newContact.email"
              :placeholder="t('guardian.emergencyContacts.emailPlaceholder')"
              class="w-full"
              type="email"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('guardian.emergencyContacts.availability') }}
            </label>
            <InputText
              v-model="newContact.availability"
              :placeholder="t('guardian.emergencyContacts.availabilityPlaceholder')"
              class="w-full"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">
              {{ t('guardian.emergencyContacts.notes') }}
            </label>
            <Textarea
              v-model="newContact.notes"
              :placeholder="t('guardian.emergencyContacts.notesPlaceholder')"
              class="w-full"
              rows="3"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button outlined class="border-oslo-blue text-oslo-blue hover:bg-oslo-blue/5" @click="isAddDialogOpen = false">
            {{ t('guardian.emergencyContacts.cancel') }}
          </Button>
          <Button type="submit" class="bg-oslo-blue hover:bg-oslo-blue/90">
            {{ t('guardian.emergencyContacts.save') }}
          </Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>
