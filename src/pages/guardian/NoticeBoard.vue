<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const { t } = useI18n()

// Mock posts data
const posts = ref([
  {
    id: 1,
    type: 'photos',
    title: 'Spring Flowers Discovery',
    content: 'The children had a wonderful time discovering spring flowers in the kindergarten garden today.',
    author: 'Kari Andersen',
    date: '2024-03-18T14:30:00',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    likes: 12,
    comments: 3,
    category: 'activities'
  },
  {
    id: 2,
    type: 'menu',
    title: 'Weekly Menu',
    content: 'This week\'s menu includes healthy meals with fresh vegetables and seasonal ingredients.',
    author: 'Oslo Barnehage',
    date: '2024-03-17T09:00:00',
    attachment: 'ukemeny-uke12.pdf',
    likes: 8,
    comments: 1,
    category: 'menu'
  },
  {
    id: 3,
    type: 'announcement',
    title: 'Monthly Activity Plan',
    content: 'April activities will focus on nature exploration and creative arts.',
    author: 'Activity Coordinator',
    date: '2024-03-16T16:45:00',
    attachment: 'manedsplan-april-2024.pdf',
    likes: 15,
    comments: 5,
    category: 'curriculum'
  },
  {
    id: 4,
    type: 'event',
    title: 'Spring Flea Market',
    content: 'Join us for our annual spring flea market. Donations welcome!',
    author: 'Parent Committee',
    date: '2024-03-15T12:20:00',
    eventDate: '2024-04-05',
    likes: 23,
    comments: 8,
    category: 'events'
  }
])

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'activities': return 'bg-green-100 text-green-700'
    case 'menu': return 'bg-orange-100 text-orange-700'
    case 'curriculum': return 'bg-blue-100 text-blue-700'
    case 'events': return 'bg-purple-100 text-purple-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'activities': return 'pi pi-users'
    case 'menu': return 'pi pi-android'
    case 'curriculum': return 'pi pi-file'
    case 'events': return 'pi pi-calendar'
    default: return 'pi pi-file'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' •')
}

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getAuthorInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}
</script>

<template>
  <div class="min-h-screen bg-white p-6">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />
    
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 mb-1">Notice Board</h1>
          <p class="text-slate-600">Latest posts and announcements from the kindergarten</p>
        </div>
        <Badge class="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 font-medium">
          <i class="pi pi-calendar mr-2 text-sm"></i>
          Latest Updates
        </Badge>
      </div>

      <!-- Filter Categories -->
      <Card class="border border-slate-200 shadow-sm">
        <template #content>
          <div class="p-6">
            <div class="flex flex-wrap gap-3">
              <Button 
                label="All Posts" 
                size="small" 
                class="bg-slate-900 hover:bg-slate-800 text-white border-0 px-4 py-2 font-medium"
              />
              <Button 
                size="small" 
                outlined
                class="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 font-medium"
              >
                <i class="pi pi-users mr-2 text-sm"></i>
                Activities
              </Button>
              <Button 
                size="small" 
                outlined
                class="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 font-medium"
              >
                <i class="pi pi-android mr-2 text-sm"></i>
                Menu
              </Button>
              <Button 
                size="small" 
                outlined
                class="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 font-medium"
              >
                <i class="pi pi-file mr-2 text-sm"></i>
                Curriculum
              </Button>
              <Button 
                size="small" 
                outlined
                class="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 font-medium"
              >
                <i class="pi pi-calendar mr-2 text-sm"></i>
                Events
              </Button>
            </div>
          </div>
        </template>
      </Card>

      <!-- Posts Feed -->
      <div class="space-y-6">
        <Card 
          v-for="post in posts" 
          :key="post.id" 
          class="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <template #header>
            <div class="px-6 pt-6 pb-4">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {{ getAuthorInitials(post.author) }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-900 text-base">{{ post.author }}</h3>
                    <p class="text-sm text-slate-500 mt-0.5">{{ formatDate(post.date) }}</p>
                  </div>
                </div>
                
                <div :class="['px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5', getCategoryColor(post.category)]">
                  <i :class="[getCategoryIcon(post.category), 'text-xs']"></i>
                  {{ post.category }}
                </div>
              </div>
            </div>
          </template>
          
          <template #content>
            <div class="px-6 pb-6 space-y-5">
              <div>
                <h2 class="text-xl font-bold mb-3 text-slate-900 leading-tight">{{ post.title }}</h2>
                <p class="text-slate-700 leading-relaxed text-base">{{ post.content }}</p>
              </div>

              <!-- Images -->
              <div v-if="post.images" class="grid grid-cols-3 gap-3">
                <div 
                  v-for="(image, index) in post.images" 
                  :key="index" 
                  class="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"
                >
                  <i class="pi pi-camera text-slate-400 text-2xl"></i>
                </div>
              </div>

              <!-- Attachment -->
              <div 
                v-if="post.attachment" 
                class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <i class="pi pi-file-pdf text-red-600 text-xl"></i>
                <span class="text-sm font-medium text-slate-900 flex-1">{{ post.attachment }}</span>
                <Button 
                  label="Download" 
                  size="small" 
                  text 
                  class="text-slate-600 hover:text-slate-900 font-medium"
                />
              </div>

              <!-- Event Date -->
              <div 
                v-if="post.eventDate" 
                class="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200"
              >
                <i class="pi pi-calendar text-purple-600 text-xl"></i>
                <span class="font-semibold text-purple-800 text-sm">
                  {{ formatEventDate(post.eventDate) }}
                </span>
              </div>

              <!-- Interaction Bar -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                <div class="flex items-center gap-6">
                  <button class="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors group">
                    <i class="pi pi-heart text-lg group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm font-semibold">{{ post.likes }}</span>
                  </button>
                  <button class="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group">
                    <i class="pi pi-comment text-lg group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm font-semibold">{{ post.comments }}</span>
                  </button>
                </div>
                
                <Button 
                  size="small" 
                  text 
                  class="text-slate-600 hover:text-slate-900 font-medium"
                >
                  <i class="pi pi-share-alt mr-2"></i>
                  Share
                </Button>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Load More -->
      <div class="flex justify-center pt-2">
        <Button 
          label="Load More Posts" 
          outlined 
          class="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 font-medium"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Override PrimeVue Card styling to match design exactly */
:deep(.p-card) {
  border-radius: 0.75rem;
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  background: white;
}

:deep(.p-card-header) {
  padding: 0;
  border-bottom: none;
}

:deep(.p-card-content) {
  padding: 0;
}

/* Custom button styling */
:deep(.p-button) {
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.p-button-sm) {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

:deep(.p-button-outlined) {
  background-color: white;
  border-width: 1px;
}

:deep(.p-button-text) {
  background-color: transparent;
  border: none;
  padding: 0.5rem 0.75rem;
}

/* Badge styling */
:deep(.p-badge) {
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: 1px solid;
}

/* Hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Category badge specific styling */
.bg-green-100 {
  background-color: rgb(220 252 231);
  color: rgb(21 128 61);
  border-color: rgb(187 247 208);
}

.bg-orange-100 {
  background-color: rgb(254 215 170);
  color: rgb(194 65 12);
  border-color: rgb(251 191 36);
}

.bg-blue-100 {
  background-color: rgb(219 234 254);
  color: rgb(29 78 216);
  border-color: rgb(147 197 253);
}

.bg-purple-100 {
  background-color: rgb(243 232 255);
  color: rgb(126 34 206);
  border-color: rgb(196 181 253);
}

/* Improved interaction animations */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Typography improvements */
h1, h2, h3 {
  letter-spacing: -0.025em;
}

.leading-tight {
  line-height: 1.25;
}
</style> 