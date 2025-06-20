<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const liked = ref(false)

// Mock post data - in real app this would come from API
const post = ref({
  id: parseInt(route.params.id as string) || 1,
  type: 'photos',
  title: 'Easter Holiday Preparations',
  content: `We're excited to share the wonderful Easter preparations happening at our kindergarten! The children have been busy creating beautiful decorations and learning about Easter traditions.

  This week, the children have been:
  • Painting Easter eggs with natural colors
  • Creating spring flower arrangements
  • Learning about Easter traditions from different cultures
  • Preparing for our Easter celebration next Friday

  We encourage all families to join us for our Easter celebration on Friday, March 22nd, from 2:00 PM to 4:00 PM. The children will showcase their artwork and we'll have traditional Easter activities for the whole family.

  Please remember to bring a small Easter treat to share if you'd like to contribute to our celebration buffet.`,
  author: 'Kari Andersen',
  date: '2024-03-18T14:30:00',
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  likes: 12,
  comments: 3,
  category: 'activities'
})

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'activities': return 'pi pi-users'
    case 'menu': return 'pi pi-utensils'
    case 'curriculum': return 'pi pi-file'
    case 'events': return 'pi pi-calendar'
    default: return 'pi pi-file'
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'activities': return 'success'
    case 'menu': return 'warning'
    case 'curriculum': return 'info'
    case 'events': return 'help'
    default: return 'secondary'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with back button -->
    <div class="flex items-center gap-4">
      <Button severity="secondary" size="small" @click="router.push('/guardian/notice-board')">
        <i class="pi pi-arrow-left mr-2"></i>
        Back to Notice Board
      </Button>
    </div>

    <!-- Post Content -->
    <Card>
      <template #header>
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {{ post.author.split(' ').map((n: string) => n[0]).join('') }}
            </div>
            <div>
              <h3 class="font-semibold text-lg">{{ post.author }}</h3>
              <p class="text-sm text-gray-600">
                {{ formatDate(post.date) }}
              </p>
            </div>
          </div>
          
          <Tag :severity="getCategoryColor(post.category)">
            <i :class="getCategoryIcon(post.category)" class="mr-2"></i>
            {{ post.category }}
          </Tag>
        </div>
      </template>
      
      <template #content>
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
            <div class="prose max-w-none">
              <p v-for="(paragraph, index) in post.content.split('\n')" :key="index" class="text-gray-700 leading-relaxed mb-4">
                {{ paragraph }}
              </p>
            </div>
          </div>

          <!-- Images -->
          <div v-if="post.images" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="(image, index) in post.images" :key="index" class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <i class="pi pi-camera text-gray-400 text-3xl"></i>
            </div>
          </div>

          <!-- Interaction Bar -->
          <div class="flex items-center justify-between pt-4 border-t">
            <div class="flex items-center gap-6">
              <button 
                @click="liked = !liked"
                class="flex items-center gap-2 transition-colors"
                :class="liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'"
              >
                <i class="pi pi-heart" :class="{ 'fill-current': liked }"></i>
                <span class="font-medium">{{ liked ? post.likes + 1 : post.likes }}</span>
              </button>
              <button class="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <i class="pi pi-comments"></i>
                <span class="font-medium">{{ post.comments }}</span>
              </button>
            </div>
            
            <Button severity="secondary" size="small">
              <i class="pi pi-share-alt mr-2"></i>
              Share
            </Button>
          </div>

          <!-- Comments Section -->
          <div class="space-y-4 pt-6 border-t">
            <h3 class="text-lg font-semibold">Comments</h3>
            <div class="text-gray-500 text-center py-8">
              Comments feature coming soon...
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
