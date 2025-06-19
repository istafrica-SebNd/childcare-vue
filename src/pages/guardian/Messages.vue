<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import Skeleton from 'primevue/skeleton'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const { t } = useI18n()

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
  conversation.unread = false
  
  // On mobile, hide sidebar when conversation is selected
  if (isMobile.value) {
    showSidebar.value = false
  }
}

const goBackToConversations = () => {
  selectedConversation.value = null
  showSidebar.value = true
}

const handleSendMessage = () => {
  if (replyText.value.trim() && selectedConversation.value) {
    const newMessage = {
      id: Date.now(),
      sender: props.userName || 'You',
      content: replyText.value.trim(),
      timestamp: new Date().toISOString(),
      type: 'sent',
      attachments: []
    }
    
    selectedConversation.value.messages.push(newMessage)
    selectedConversation.value.lastMessage = replyText.value.trim()
    selectedConversation.value.timestamp = new Date().toISOString()
    
    replyText.value = ''
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const getInitials = (name: string) => {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Teacher': return 'success'
    case 'System': return 'info'
    case 'Case Worker': return 'warning'
    default: return 'secondary'
  }
}

const getAvatarColor = (role: string) => {
  switch (role) {
    case 'Teacher': return 'bg-blue-600'
    case 'System': return 'bg-gray-600'
    case 'Case Worker': return 'bg-purple-600'
    default: return 'bg-gray-600'
  }
}

// Auto-select first conversation on desktop
if (conversations.value.length > 0 && !isMobile.value) {
  selectedConversation.value = conversations.value[0]
}
</script>

<template>
  <!-- Main Container with responsive sizing -->
  <div class="h-screen w-full flex items-top justify-center bg-gray-100 px-4">
    <div :class="[
      'flex bg-white rounded-2xl shadow-2xl overflow-hidden',
      'w-full h-full', // Mobile: full screen
      'lg:w-[70%] lg:h-[80%] lg:max-w-7xl lg:max-h-[800px]' // Desktop: centered with size limits
    ]">
      
      <!-- Left Sidebar - Conversations List -->
      <div :class="[
        'flex-shrink-0 border-r border-gray-200 bg-white flex flex-col',
        'w-full lg:w-80', // Mobile: full width, Desktop: fixed width
        (!showSidebar || (!isMobile && selectedConversation)) ? 'hidden lg:flex' : 'flex'
      ]">
        <!-- Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
            <div class="flex items-center gap-2">
              <Button 
                icon="pi pi-filter" 
                severity="secondary" 
                outlined 
                size="small"
                class="px-3 py-2 text-sm font-medium"
              >
                Filter
              </Button>
              <Button 
                icon="pi pi-plus" 
                severity="primary" 
                size="small"
                class="px-3 py-2 text-sm font-medium"
              >
                New Message
              </Button>
            </div>
          </div>
          <p class="text-gray-600 mb-6 text-sm">Communicate with the kindergarten and follow up on messages</p>
          
          <!-- Dynamic Filter Tabs -->
          <div v-if="availableTabs.length > 1" class="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
            <Button 
              v-for="tab in availableTabs"
              :key="tab.key"
              :label="tab.label"
              :severity="activeTab === tab.key ? 'primary' : 'secondary'"
              :outlined="activeTab !== tab.key"
              size="small"
              class="flex-1 text-sm font-medium py-2"
              @click="activeTab = tab.key"
            />
          </div>

          <!-- Search -->
          <div class="relative mb-1">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i class="pi pi-search text-gray-400 text-sm"></i>
            </div>
            <InputText 
              v-model="searchTerm"
              placeholder="Search conversations..."
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-500"
            />
          </div>
        </div>

        <!-- Conversations List -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-3">
            <!-- Unread indicator -->
            <div v-if="unreadCount > 0" class="px-3 py-2 mb-2">
              <Badge 
                :value="`${unreadCount} new`"
                severity="danger"
                class="text-xs font-medium"
              />
            </div>

            <!-- Conversation Items -->
            <div 
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              :class="[
                'p-4 rounded-xl cursor-pointer transition-all duration-200 mb-2',
                selectedConversation?.id === conversation.id 
                  ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'hover:bg-gray-50 border border-transparent'
              ]"
              @click="selectConversation(conversation)"
            >
              <div class="flex items-start gap-3">
                <div class="relative flex-shrink-0">
                  <Avatar 
                    :label="getInitials(conversation.participant.name)"
                    :class="[
                      'w-11 h-11 text-white text-sm font-semibold',
                      getAvatarColor(conversation.participant.role)
                    ]"
                    shape="circle"
                  />
                  <div 
                    v-if="conversation.participant.online"
                    class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
                  ></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h4 :class="[
                      'font-semibold truncate text-sm',
                      selectedConversation?.id === conversation.id ? 'text-blue-900' : 'text-gray-900'
                    ]">
                      {{ conversation.participant.name }}
                    </h4>
                    <span class="text-xs text-gray-500 font-medium">{{ formatDate(conversation.timestamp) }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <p :class="[
                      'text-sm truncate leading-relaxed',
                      conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-600'
                    ]">
                      {{ conversation.lastMessage }}
                    </p>
                    <div 
                      v-if="conversation.unread"
                      class="w-2 h-2 bg-blue-600 rounded-full ml-3 flex-shrink-0"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Active Conversation -->
      <div :class="[
        'flex-1 flex flex-col bg-gray-50',
        showSidebar && isMobile && !selectedConversation ? 'hidden' : 'flex'
      ]">
        <template v-if="selectedConversation">
          <!-- Chat Header -->
          <div class="p-6 border-b border-gray-200 bg-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <Button
                  v-if="isMobile"
                  icon="pi pi-arrow-left"
                  severity="secondary"
                  text
                  class="p-2"
                  @click="goBackToConversations"
                />
                
                <div class="relative">
                  <Avatar 
                    :label="getInitials(selectedConversation.participant.name)"
                    :class="[
                      'w-12 h-12 text-white font-semibold',
                      getAvatarColor(selectedConversation.participant.role)
                    ]"
                    shape="circle"
                  />
                  <div 
                    v-if="selectedConversation.participant.online"
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                  ></div>
                </div>
                
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">{{ selectedConversation.participant.name }}</h3>
                  <p v-if="selectedConversation.participant.online" class="text-sm text-green-600 font-medium">
                    Online now
                  </p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <Button icon="pi pi-phone" severity="secondary" outlined rounded class="w-10 h-10" />
                <Button icon="pi pi-video" severity="secondary" outlined rounded class="w-10 h-10" />
                <Button icon="pi pi-ellipsis-h" severity="secondary" outlined rounded class="w-10 h-10" />
              </div>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            <div 
              v-for="message in selectedConversation.messages"
              :key="message.id"
              :class="[
                'flex items-start gap-4',
                message.type === 'sent' ? 'justify-end' : ''
              ]"
            >
              <!-- Received Message -->
              <template v-if="message.type === 'received'">
                <Avatar 
                  :label="getInitials(selectedConversation.participant.name)"
                  :class="[
                    'w-8 h-8 text-white text-sm font-semibold flex-shrink-0',
                    getAvatarColor(selectedConversation.participant.role)
                  ]"
                  shape="circle"
                />
                <div class="flex-1 max-w-lg">
                  <div class="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm border border-gray-100">
                    <p class="text-gray-800 leading-relaxed">{{ message.content }}</p>
                    
                    <!-- File Attachment -->
                    <div 
                      v-if="message.attachments && message.attachments.length > 0"
                      class="mt-4"
                    >
                      <div 
                        v-for="attachment in message.attachments"
                        :key="attachment.name"
                        class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <i class="pi pi-paperclip text-gray-500 text-lg"></i>
                        <div class="flex-1">
                          <p class="font-medium text-sm text-gray-900">{{ attachment.name }}</p>
                          <p class="text-xs text-gray-500">{{ attachment.size }}</p>
                        </div>
                        <Button icon="pi pi-download" severity="secondary" text size="small" />
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 ml-4">{{ formatTime(message.timestamp) }}</p>
                </div>
              </template>

              <!-- Sent Message -->
              <template v-else>
                <div class="flex-1 max-w-lg">
                  <div class="bg-blue-600 text-white rounded-2xl rounded-tr-md p-4 shadow-sm ml-auto">
                    <p class="leading-relaxed">{{ message.content }}</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 mr-4 text-right">{{ formatTime(message.timestamp) }}</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Message Input -->
          <div class="p-4 border-t border-gray-200 bg-white">
            <div class="flex items-end gap-3">
              <Button icon="pi pi-paperclip" severity="secondary" text class="mb-1 w-10 h-10" />
              
              <div class="flex-1">
                <Textarea 
                  v-model="replyText"
                  placeholder="Type a message..."
                  :auto-resize="true"
                  rows="1"
                  class="w-full resize-none  px-4 py-3 text-sm bg-white"
                  @keydown.enter.prevent="handleSendMessage"
                />
              </div>
              
              <Button 
                icon="pi pi-send"
                severity="primary"
                rounded
                :disabled="!replyText.trim()"
                @click="handleSendMessage"
                class="mb-1 w-10 h-10"
              />
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <template v-else>
          <div class="flex-1 flex items-center justify-center bg-gray-50">
            <div class="text-center">
              <i class="pi pi-comment text-6xl text-gray-300 mb-4"></i>
              <h3 class="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
              <p class="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container responsive styling */
.h-screen {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
}

/* Custom scrollbar styling */
:deep(.overflow-y-auto::-webkit-scrollbar) {
  width: 6px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background: #d1d5db;
  border-radius: 3px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
  background: #9ca3af;
}

/* Desktop centered container */
@media (min-width: 1024px) {
  .lg\:w-\[70\%\] {
    width: 70%;
  }
  
  .lg\:h-\[80\%\] {
    height: 80%;
  }
  
  .lg\:max-w-7xl {
    max-width: 80rem;
  }
  
  .lg\:max-h-\[800px\] {
    max-height: 800px;
  }
}

/* Mobile full screen adjustments */
@media (max-width: 1023px) {
  .h-screen .flex {
    border-radius: 0;
  }
  
  /* Hide padding on mobile for full screen */
  .p-4 {
    padding: 0;
  }
}

/* Input and textarea styling */
:deep(.p-inputtext) {
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  background-color: white;
}

:deep(.p-inputtext:hover) {
  border-color: #d1d5db;
}

:deep(.p-inputtext:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: white;
  outline: none;
}

:deep(.p-inputtextarea) {
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  transition: all 0.2s ease;
  line-height: 1.5;
  background-color: white;
}

:deep(.p-inputtextarea:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: white;
  outline: none;
}

/* Button styling */
:deep(.p-button) {
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 0.75rem;
}

:deep(.p-button-sm) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

:deep(.p-button-rounded) {
  border-radius: 50%;
  padding: 0.5rem;
}

:deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.p-button-outlined) {
  background-color: white;
  border-width: 1px;
}

:deep(.p-button-outlined:hover) {
  background-color: #f9fafb;
}

/* Badge styling */
:deep(.p-badge) {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

/* Message bubble animations and styling */
.bg-white {
  animation: messageSlideIn 0.3s ease-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.bg-blue-600 {
  animation: messageSlideIn 0.3s ease-out;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Avatar styling */
:deep(.p-avatar) {
  font-family: inherit;
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* Online indicator styling */
.bg-green-500 {
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(34, 197, 94, 0.2);
}

/* Conversation item hover effects */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

/* Selected conversation styling */
.bg-blue-50 {
  background-color: #eff6ff;
  border-color: #3b82f6;
}

/* Typography improvements */
h1, h2, h3, h4 {
  letter-spacing: -0.025em;
  font-family: inherit;
}

.text-sm {
  line-height: 1.5;
}

/* Tab styling improvements */
:deep(.p-button.flex-1) {
  justify-content: center;
  min-height: 2.5rem;
}

/* Search input specific styling */
:deep(.p-inputtext::placeholder) {
  color: #9ca3af;
  font-weight: 400;
}

:deep(.p-inputtext[placeholder]) {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Search container improvements */
.relative .pi-search {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Remove default input styling */
:deep(.p-inputtext) {
  box-shadow: none;
  border-width: 1px;
}

:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

/* Filter buttons styling */
:deep(.p-button[severity="secondary"][outlined]) {
  border-color: #d1d5db;
  color: #6b7280;
}

:deep(.p-button[severity="secondary"][outlined]:hover) {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

/* Message input area styling */
.border-t {
  border-top: 1px solid #e5e7eb;
}

/* Loading states and transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus visible improvements */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Conversation list spacing */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Improve text contrast */
.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-900 {
  color: #111827;
}

/* Border improvements */
.border-gray-100 {
  border-color: #f3f4f6;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

/* Message bubble corner adjustments */
.rounded-tl-md {
  border-top-left-radius: 0.375rem;
}

.rounded-tr-md {
  border-top-right-radius: 0.375rem;
}

.rounded-2xl {
  border-radius: 1rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

/* WhatsApp-like responsive behavior */
@media (max-width: 1023px) {
  /* Mobile full screen */
  .rounded-2xl {
    border-radius: 0;
  }
  
  /* Ensure proper mobile chat behavior */
  .lg\:w-80 {
    width: 100%;
  }
}

/* Desktop centered layout */
@media (min-width: 1024px) {
  /* Ensure proper desktop proportions */
  .bg-gray-100 {
    background-color: #f3f4f6;
  }
  
  /* Nice shadow for desktop */
  .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
}

/* Smooth transitions for responsive changes */
.flex-shrink-0 {
  transition: width 0.3s ease;
}

/* Message input improvements */
:deep(.p-inputtextarea) {
  max-height: 120px;
  min-height: 44px;
}

/* Mobile safe area adjustments */
@supports (padding: max(0px)) {
  @media (max-width: 1023px) {
    .h-screen {
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
    }
  }
}
</style> 