<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
import { FolderOpen, FileText, Download, Search, Filter, Eye, Calendar, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const { t, locale } = useI18n()

interface Document {
  id: number
  title: string
  category: string
  type: string
  size: string
  date: string
  description: string
  url: string
}

interface Category {
  id: string
  name: string
  count: number
}

const searchQuery = ref('')
const selectedCategory = ref('all')
const showFilterPanel = ref(false)
const isLoading = ref(true)
const error = ref<string | null>(null)

const documents = ref<Document[]>([
  {
    id: 1,
    title: 'Annual Activity Plan 2024',
    description: 'Comprehensive plan for learning activities throughout the year',
    category: 'Curriculum',
    size: '2.4 MB',
    date: '2024-01-08',
    type: 'pdf',
    url: '/documents/annual-activity-plan-2024.pdf'
  },
  {
    id: 2,
    title: 'Weekly Menu Plan',
    description: 'Nutritious meals planned for the week ahead',
    category: 'Menu',
    size: '580 kB',
    date: '2024-03-01',
    type: 'pdf',
    url: '/documents/weekly-menu-plan.pdf'
  },
  {
    id: 3,
    title: 'Safety Guidelines',
    description: 'Important safety procedures and emergency protocols',
    category: 'Safety',
    size: '1.2 MB',
    date: '2024-02-15',
    type: 'pdf',
    url: '/documents/safety-guidelines.pdf'
  },
  {
    id: 4,
    title: 'Parent Handbook',
    description: 'Complete guide for parents with policies and procedures',
    category: 'Handbook',
    size: '3.1 MB',
    date: '2024-01-10',
    type: 'pdf',
    url: '/documents/parent-handbook.pdf'
  },
  {
    id: 5,
    title: 'Child Development Report',
    description: 'Individual progress and development assessment',
    category: 'Personal',
    size: '890 kB',
    date: '2024-03-15',
    type: 'pdf',
    url: '/documents/child-development-report.pdf'
  }
])

const categories = ref<Category[]>([
  { id: 'all', name: 'All Documents', count: 5 },
  { id: 'curriculum', name: 'Curriculum', count: 1 },
  { id: 'menu', name: 'Menu', count: 1 },
  { id: 'safety', name: 'Safety', count: 1 },
  { id: 'handbook', name: 'Handbook', count: 1 },
  { id: 'personal', name: 'Personal', count: 1 }
])

const recentUpdates = ref([
  { title: 'Annual Activity Plan 2024', publishedDate: '8. januar' },
  { title: 'Weekly Menu Plan', publishedDate: '1. mars' },
  { title: 'Safety Guidelines', publishedDate: '15. februar' }
])

const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(doc =>
      doc.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

const handleDocumentView = async (doc: Document) => {
  try {
    toast.add({
      severity: 'info',
      summary: 'Opening Document',
      detail: `Loading ${doc.title} in document viewer...`,
      life: 3000
    })

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Open document in new tab - in real app this would be a proper document viewer
    window.open(doc.url, '_blank', 'width=800,height=600')
  } catch (err) {
    error.value = `Failed to open document: ${doc.title}`
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to open document. Please try again.',
      life: 5000
    })
  }
}

const handleDocumentDownload = async (doc: Document) => {
  try {
    toast.add({
      severity: 'info',
      summary: 'Download Started',
      detail: `Downloading ${doc.title} (${doc.size})...`,
      life: 3000
    })

    // Simulate download process
    const link = document.createElement('a')
    link.href = doc.url
    link.download = `${doc.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
    link.click()

    // Show completion message
    setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: 'Download Complete',
        detail: `${doc.title} downloaded successfully.`,
        life: 3000
      })
    }, 2000)
  } catch (err) {
    error.value = `Failed to download document: ${doc.title}`
    toast.add({
      severity: 'error',
      summary: 'Download Failed',
      detail: 'Failed to download document. Please try again.',
      life: 5000
    })
  }
}

const handleQuickDownload = (title: string) => {
  const document = documents.value.find(doc => doc.title === title)
  if (document) {
    handleDocumentDownload(document)
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    toast.add({
      severity: 'info',
      summary: 'Searching',
      detail: `Found ${filteredDocuments.value.length} documents matching "${searchQuery.value}"`,
      life: 2000
    })
  }
}

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId

  const category = categories.value.find(cat => cat.id === categoryId)
  const categoryName = category?.name || 'All Documents'

  toast.add({
    severity: 'info',
    summary: 'Category Selected',
    detail: `Showing ${categoryName} (${filteredDocuments.value.length} documents)`,
    life: 2000
  })
}

const toggleFilterPanel = () => {
  showFilterPanel.value = !showFilterPanel.value
  toast.add({
    severity: 'info',
    summary: 'Filter Panel',
    detail: showFilterPanel.value ? 'Filter panel opened' : 'Filter panel closed',
    life: 2000
  })
}

const formatDate = (dateString: string): string => {
  const currentLocale = locale.value === 'no' ? 'nb-NO' : 'en-US'
  return new Date(dateString).toLocaleDateString(currentLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getCategoryBadgeClass = (category: string): string => {
  const categoryClasses: Record<string, string> = {
    'Curriculum': 'bg-blue-100 text-blue-800',
    'Menu': 'bg-green-100 text-green-800',
    'Safety': 'bg-red-100 text-red-800',
    'Handbook': 'bg-purple-100 text-purple-800',
    'Personal': 'bg-yellow-100 text-yellow-800'
  }
  return categoryClasses[category] || 'bg-gray-100 text-gray-800'
}

// Simulate loading documents on mount
onMounted(async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Update category counts
    categories.value.forEach(category => {
      if (category.id === 'all') {
        category.count = documents.value.length
      } else {
        category.count = documents.value.filter(doc =>
          doc.category.toLowerCase() === category.id.toLowerCase()
        ).length
      }
    })

    isLoading.value = false
  } catch (err) {
    error.value = 'Failed to load documents'
    isLoading.value = false
    toast.add({
      severity: 'error',
      summary: 'Loading Error',
      detail: 'Failed to load documents. Please refresh the page.',
      life: 5000
    })
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('documents.title', 'Documents') }}</h1>
      <p class="text-gray-600">{{ t('documents.description', 'Manage your child\'s documents and files') }}</p>
    </div>

    <!-- Error State -->
    <Card v-if="error && !isLoading" class="border-red-200 bg-red-50">
      <template #content>
        <div class="flex items-center p-4 text-red-800">
          <AlertCircle class="w-5 h-5 mr-3 flex-shrink-0" />
          <div>
            <h3 class="font-medium">Error</h3>
            <p class="text-sm mt-1">{{ error }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Search and Filter -->
    <Card>
      <template #content>
        <div class="p-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <InputText
                  v-model="searchQuery"
                  :placeholder="t('guardian.documents.search')"
                  class="pl-10 w-full"
                  :disabled="isLoading"
                  @input="handleSearch"
                  :aria-label="t('guardian.documents.search')"
                />
              </div>
            </div>
            <Button
              outlined
              :disabled="isLoading"
              @click="toggleFilterPanel"
              :aria-label="t('guardian.documents.filter')"
              :aria-pressed="showFilterPanel"
            >
              <Filter class="w-4 h-4 mr-2" />
              {{ t('guardian.documents.filter') }}
            </Button>
          </div>
        </div>
      </template>
    </Card>

    <!-- Categories -->
    <Card>
      <template #header>
        <div class="p-6 pb-0">
          <h2 class="text-xl font-semibold">{{ t('guardian.documents.categoriesTitle') }}</h2>
        </div>
      </template>
      <template #content>
        <div class="p-6 pt-4">
          <div v-if="isLoading" class="flex flex-wrap gap-2">
            <Skeleton v-for="i in 6" :key="i" width="8rem" height="2rem" class="rounded" />
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category.id)"
              :aria-pressed="selectedCategory === category.id"
              :aria-label="`Select ${category.name} category`"
              :class="[
                'px-4 py-2 rounded text-sm font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-oslo-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category.name }} ({{ category.count }})
            </button>
          </div>
        </div>
      </template>
    </Card>

    <!-- Documents List -->
    <Card>
      <template #header>
        <div class="p-6 pb-0">
          <h2 class="text-xl font-semibold">{{ t('guardian.documents.documentsTitle') }}</h2>
          <p class="text-sm text-slate-600 mt-1">
            {{ filteredDocuments.length }} {{ t('guardian.documents.of') }} {{ documents.length }} {{ t('guardian.documents.documentsCount') }}
          </p>
        </div>
      </template>
      <template #content>
        <div class="p-6 pt-4">
          <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton shape="circle" size="3rem" />
              <div class="flex-1 space-y-2">
                <Skeleton width="60%" height="1.5rem" />
                <Skeleton width="80%" height="1rem" />
                <div class="flex gap-4">
                  <Skeleton width="4rem" height="1.5rem" class="rounded-full" />
                  <Skeleton width="3rem" height="1rem" />
                  <Skeleton width="5rem" height="1rem" />
                </div>
              </div>
              <div class="flex gap-2">
                <Skeleton width="2rem" height="2rem" />
                <Skeleton width="2rem" height="2rem" />
              </div>
            </div>
          </div>

          <div v-else-if="filteredDocuments.length === 0" class="text-center py-8 text-slate-500">
            <FileText class="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No documents found matching your criteria.</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="document in filteredDocuments"
              :key="document.id"
              class="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              role="article"
              :aria-label="`Document: ${document.title}`"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <FileText class="w-6 h-6 text-slate-600" />
                </div>

                <div>
                  <h3 class="font-semibold">{{ document.title }}</h3>
                  <p class="text-sm text-slate-600">{{ document.description }}</p>

                  <div class="flex items-center gap-4 mt-2">
                    <span
                      class="px-2 py-1 rounded-full text-sm"
                      :class="getCategoryBadgeClass(document.category)"
                    >
                      {{ document.category }}
                    </span>

                    <div class="flex items-center gap-3 text-xs text-slate-500">
                      <span>{{ document.size }}</span>
                      <div class="flex items-center gap-1">
                        <Calendar class="w-3 h-3" />
                        {{ formatDate(document.date) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <Button
                  text
                  severity="secondary"
                  size="small"
                  @click="handleDocumentView(document)"
                  :aria-label="`View ${document.title}`"
                >
                  <Eye class="w-4 h-4" />
                </Button>
                <Button
                  text
                  severity="secondary"
                  size="small"
                  @click="handleDocumentDownload(document)"
                  :aria-label="`Download ${document.title}`"
                >
                  <Download class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Recent Updates -->
    <Card>
      <template #header>
        <div class="p-6 pb-0">
          <h2 class="text-xl font-semibold">{{ t('guardian.documents.recentUpdates') }}</h2>
          <p class="text-sm text-slate-600 mt-1">{{ t('guardian.documents.recentDescription') }}</p>
        </div>
      </template>
      <template #content>
        <div class="p-6 pt-4">
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div class="space-y-2">
                <Skeleton width="12rem" height="1.25rem" />
                <Skeleton width="8rem" height="1rem" />
              </div>
              <Skeleton width="6rem" height="2rem" />
            </div>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="update in recentUpdates"
              :key="update.title"
              class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <h4 class="font-medium">{{ update.title }}</h4>
                <p class="text-sm text-slate-600">
                  {{ t('guardian.documents.published') }} {{ update.publishedDate }}
                </p>
              </div>
              <Button
                outlined
                size="small"
                @click="handleQuickDownload(update.title)"
                :aria-label="`Download ${update.title}`"
              >
                <Download class="w-4 h-4 mr-1" />
                {{ t('guardian.documents.download') }}
              </Button>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
