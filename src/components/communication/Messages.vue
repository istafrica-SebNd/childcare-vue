<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb.vue'

// Props for reusability
interface Props {
  userRole?: 'guardian' | 'educator' | 'admin' | 'case-worker'
  userId?: string
  userName?: string
  conversations?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'guardian',
  userId: '',
  userName: 'User',
  conversations: () => []
})

// Reactive state
const activeTab = ref('all')
const searchTerm = ref('')
const replyText = ref('')
const selectedConversation = ref<any>(null)
const isMobile = ref(false)
const showSidebar = ref(true)

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value && selectedConversation.value) {
    showSidebar.value = false
  } else {
    showSidebar.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Mock conversations data (with role-based filtering capability)
const defaultConversations = ref([
  {
    id: 1,
    participant: {
      name: 'Sarah Johnson - Educator',
      role: 'Teacher',
      avatar: '/oslo-logo.svg',
      online: true
    },
    lastMessage: 'Emma had a great day today! She participated actively in our...',
    timestamp: '2024-03-18T10:30:00',
    unread: true,
    starred: false,
    archived: false,
    allowedRoles: ['guardian', 'admin'],
    messages: [
      {
        id: 1,
        sender: 'Sarah Johnson',
        content: 'Good morning! Just wanted to update you on Emma\'s progress today. She did really well in our morning activities.',
        timestamp: '2024-03-18T09:30:00',
        type: 'received',
        attachments: []
      },
      {
        id: 2,
        sender: 'You',
        content: 'Thank you for the update! How was she during lunch time?',
        timestamp: '2024-03-18T10:15:00',
        type: 'sent',
        attachments: []
      },
      {
        id: 3,
        sender: 'Sarah Johnson',
        content: 'Emma had a great day today! She participated actively in our art session and made some beautiful drawings.',
        timestamp: '2024-03-18T10:30:00',
        type: 'received',
        attachments: [
          { name: 'Emma_Artwork_Today.jpg', size: '2.1 MB' }
        ]
      }
    ]
  },
  {
    id: 2,
    participant: {
      name: 'System Notification',
      role: 'System',
      avatar: null,
      online: false
    },
    lastMessage: 'Your kindergarten application has been updated.',
    timestamp: '2024-03-16T14:15:00',
    unread: false,
    starred: true,
    archived: false,
    allowedRoles: ['guardian', 'educator', 'admin', 'case-worker'],
    messages: [
      {
        id: 1,
        sender: 'System',
        content: 'Your kindergarten application for Emma has been updated. Please check the application status page for more details.',
        timestamp: '2024-03-16T14:15:00',
        type: 'received',
        attachments: []
      }
    ]
  },
  {
    id: 3,
    participant: {
      name: 'Mike Thompson - Case Worker',
      role: 'Case Worker',
      avatar: null,
      online: false
    },
    lastMessage: 'I have reviewed your documents. Everything looks good!',
    timestamp: '2024-03-10T09:45:00',
    unread: false,
    starred: false,
    archived: false,
    allowedRoles: ['guardian', 'admin'],
    messages: [
      {
        id: 1,
        sender: 'Mike Thompson',
        content: 'I have reviewed your documents for Emma\'s application. Everything looks good and the application is moving forward.',
        timestamp: '2024-03-10T09:45:00',
        type: 'received',
        attachments: []
      }
    ]
  }
])

// Use provided conversations or default ones
const conversations = computed(() => {
  const convs = props.conversations.length > 0 ? props.conversations : defaultConversations.value
  // Filter conversations based on user role
  return convs.filter(conv =>
    !conv.allowedRoles || conv.allowedRoles.includes(props.userRole)
  )
})

// Computed properties
const unreadCount = computed(() =>
  conversations.value.filter(conv => conv.unread && !conv.archived).length
)

const filteredConversations = computed(() => {
  return conversations.value.filter(conv => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesTab = activeTab.value === 'all' ||
                      (activeTab.value === 'teachers' && conv.participant.role === 'Teacher')
    return matchesSearch && matchesTab
  })
})

// Get available tabs based on user role
const availableTabs = computed(() => {
  const tabs = [{ key: 'all', label: 'All Conversations' }]

  if (props.userRole === 'guardian') {
    tabs.push({ key: 'teachers', label: 'Teachers' })
  } else if (props.userRole === 'educator') {
    tabs.push({ key: 'parents', label: 'Parents' })
  } else if (props.userRole === 'admin') {
    tabs.push({ key: 'staff', label: 'Staff' })
  }

  return tabs
})

// Methods
const selectConversation = (conversation: any) => {
  selectedConversation.value = conversation
  // Mark as read
  conversation.unread = false

  if (isMobile.value) {
    showSidebar.value = false
  }
}

const goBackToList = () => {
  if (isMobile.value) {
    showSidebar.value = true
    selectedConversation.value = null
  }
}

const sendReply = () => {
  if (replyText.value.trim() && selectedConversation.value) {
    const newMessage = {
      id: selectedConversation.value.messages.length + 1,
      sender: 'You',
      content: replyText.value,
      timestamp: new Date().toISOString(),
      type: 'sent',
      attachments: []
    }

    selectedConversation.value.messages.push(newMessage)
    selectedConversation.value.lastMessage = replyText.value
    selectedConversation.value.timestamp = new Date().toISOString()

    replyText.value = ''
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString()
  }
}

const downloadAttachment = (attachment: any) => {
  console.log('Downloading:', attachment.name)
}
</script>

<template>
  <div class="h-full bg-white">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />

    <!-- Main Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 flex items-center">
            Messages
            <Badge
              v-if="unreadCount > 0"
              :value="unreadCount"
              severity="danger"
              class="ml-2"
            />
          </h1>
          <p class="text-sm text-gray-600 mt-1">Communicate with the kindergarten and follow up on messages</p>
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-120px)]">
      <!-- Sidebar -->
      <div
        v-show="showSidebar"
        class="w-full lg:w-80 border-r border-gray-200 flex flex-col bg-white"
        :class="{ 'absolute inset-0 z-10 lg:relative': isMobile && !showSidebar }"
      >
        <!-- Tabs -->
        <div class="px-4 pt-4 pb-4">
          <div class="flex space-x-8">
            <button
              v-for="tab in availableTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'pb-3 text-sm font-medium border-b-2 transition-all',
                activeTab === tab.key
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="px-4 pb-4">
          <div class="relative">
            <i class="pi pi-search absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <InputText
              v-model="searchTerm"
              placeholder="Search conversations..."
              class="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-gray-200 transition-colors"
            />
          </div>
        </div>

        <!-- Conversations List -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            @click="selectConversation(conversation)"
            :class="[
              'px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-25 transition-colors',
              selectedConversation?.id === conversation.id ? 'bg-blue-25 border-blue-100' : ''
            ]"
          >
            <div class="flex items-start space-x-3">
              <div class="relative flex-shrink-0">
                <Avatar
                  :image="conversation.participant.avatar"
                  :label="conversation.participant.name.split(' ').map(n => n[0]).join('')"
                  size="normal"
                  shape="circle"
                  class="bg-gray-500"
                />
                <div
                  v-if="conversation.participant.online"
                  class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                ></div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 :class="[
                    'text-sm font-medium truncate',
                    conversation.unread ? 'text-gray-900' : 'text-gray-700'
                  ]">
                    {{ conversation.participant.name }}
                  </h3>
                  <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {{ formatTime(conversation.timestamp) }}
                  </span>
                </div>

                <p :class="[
                  'text-sm truncate mt-1',
                  conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-500'
                ]">
                  {{ conversation.lastMessage }}
                </p>

                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center space-x-2">
                    <span
                      v-if="conversation.unread"
                      class="w-2 h-2 bg-blue-600 rounded-full"
                    ></span>
                    <span class="text-xs px-2 py-1 rounded-full" :class="[
                      conversation.participant.role === 'Teacher' ? 'bg-green-100 text-green-700' :
                      conversation.participant.role === 'Case Worker' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    ]">
                      {{ conversation.participant.role }}
                    </span>
                  </div>
                  <i
                    v-if="conversation.starred"
                    class="pi pi-star-fill text-yellow-500 text-xs"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Area -->
      <div
        v-show="!showSidebar || !isMobile"
        class="flex-1 flex flex-col bg-white"
      >
        <!-- Empty State -->
        <div v-if="!selectedConversation" class="flex-1 flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <div class="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-lg flex items-center justify-center">
              <i class="pi pi-comments text-4xl text-gray-400"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Start a conversation</h3>
            <p class="text-gray-600 mb-6 max-w-sm">
              Select a conversation from the sidebar to view messages or start a new conversation.
            </p>
            <Button
              icon="pi pi-plus"
              label="New Conversation"
              class="bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </div>

        <!-- Active Conversation -->
        <div v-else class="flex-1 flex flex-col">
          <!-- Conversation Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <Button
                  v-if="isMobile"
                  icon="pi pi-arrow-left"
                  @click="goBackToList"
                  text
                  rounded
                  size="small"
                />
                <Avatar
                  :image="selectedConversation.participant.avatar"
                  :label="selectedConversation.participant.name.split(' ').map(n => n[0]).join('')"
                  size="normal"
                  shape="circle"
                  class="bg-gray-500"
                />
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    {{ selectedConversation.participant.name }}
                  </h2>
                  <p class="text-sm text-gray-500">{{ selectedConversation.participant.role }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <Button icon="pi pi-phone" text rounded size="small" />
                <Button icon="pi pi-video" text rounded size="small" />
                <Button icon="pi pi-ellipsis-v" text rounded size="small" />
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            <div
              v-for="message in selectedConversation.messages"
              :key="message.id"
              :class="[
                'flex',
                message.type === 'sent' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm',
                  message.type === 'sent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                ]"
              >
                <p class="text-sm">{{ message.content }}</p>

                <!-- Attachments -->
                <div v-if="message.attachments.length > 0" class="mt-3 space-y-2">
                  <div
                    v-for="attachment in message.attachments"
                    :key="attachment.name"
                    class="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg"
                  >
                    <i class="pi pi-file text-gray-500"></i>
                    <span class="text-xs text-gray-700">{{ attachment.name }}</span>
                    <Button
                      icon="pi pi-download"
                      @click="downloadAttachment(attachment)"
                      text
                      size="small"
                    />
                  </div>
                </div>

                <div
                  :class="[
                    'text-xs mt-2',
                    message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                  ]"
                >
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Reply Area -->
          <div class="px-6 py-4 bg-white border-t border-gray-200">
            <div class="flex items-end space-x-3">
              <div class="flex-1">
                <Textarea
                  v-model="replyText"
                  placeholder="Type your message..."
                  :auto-resize="true"
                  rows="1"
                  class="w-full resize-none"
                  @keyup.enter.ctrl="sendReply"
                />
              </div>
              <div class="flex space-x-2">
                <Button icon="pi pi-paperclip" text rounded size="small" />
                <Button
                  icon="pi pi-send"
                  @click="sendReply"
                  :disabled="!replyText.trim()"
                  size="small"
                  class="bg-blue-600 hover:bg-blue-700"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">Press Ctrl+Enter to send</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile responsive adjustments */
@media (max-width: 1024px) {
  .lg\:w-80 {
    width: 100%;
  }

  .lg\:relative {
    position: relative;
  }

  .lg\:max-w-md {
    max-width: 24rem;
  }
}

/* Custom scrollbar for conversations */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
