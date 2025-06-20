<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Image, MessageSquare, Calendar } from 'lucide-vue-next'

const { t } = useI18n()

interface Post {
  id: string
  title: string
  type: 'announcement' | 'event' | 'photo'
  date: string
  author: string
  content: string
  imageUrl?: string
  comments: number
}

const recentPosts = ref<Post[]>([
  {
    id: '1',
    title: 'Summer Festival Planning',
    type: 'event',
    date: '2024-03-15',
    author: 'Teacher Anna',
    content: 'We are planning our annual summer festival! Join us for games, food, and fun activities.',
    comments: 5
  },
  {
    id: '2',
    title: 'Art Exhibition Photos',
    type: 'photo',
    date: '2024-03-14',
    author: 'Teacher Maria',
    content: 'Check out the amazing artwork created by our talented children!',
    imageUrl: '/images/art-exhibition.jpg',
    comments: 12
  },
  {
    id: '3',
    title: 'Important Notice: Parent Meeting',
    type: 'announcement',
    date: '2024-03-13',
    author: 'Principal John',
    content: 'Please join us for our quarterly parent meeting next week.',
    comments: 3
  }
])

const getTypeIcon = (type: Post['type']) => {
  switch (type) {
    case 'photo':
      return Image
    case 'event':
      return Calendar
    default:
      return MessageSquare
  }
}

const getTypeColor = (type: Post['type']) => {
  switch (type) {
    case 'photo':
      return 'text-blue-500'
    case 'event':
      return 'text-green-500'
    default:
      return 'text-purple-500'
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900">
          {{ t('notice_board.title', 'Notice Board') }}
        </h2>
        <router-link
          to="/guardian/notice-board"
          class="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ t('common.view_all', 'View All') }}
        </router-link>
      </div>

      <div class="space-y-4">
        <div
          v-for="post in recentPosts"
          :key="post.id"
          class="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div
              class="p-2 rounded-lg bg-slate-50"
              :class="getTypeColor(post.type)"
            >
              <component :is="getTypeIcon(post.type)" class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-slate-900 truncate">
                {{ post.title }}
              </h3>
              <p class="text-sm text-slate-500 mt-1 line-clamp-2">
                {{ post.content }}
              </p>
              <div class="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span>{{ post.author }}</span>
                <span>•</span>
                <span>{{ post.date }}</span>
                <span>•</span>
                <span>{{ post.comments }} {{ t('common.comments', 'comments') }}</span>
              </div>
            </div>
            <img
              v-if="post.imageUrl"
              :src="post.imageUrl"
              :alt="post.title"
              class="w-16 h-16 rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 
