<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import { 
  Building, 
  Users, 
  FileText,
  ArrowRight,
  CheckCircle,
  Shield,
  Globe,
  Clock,
  BookOpen,
  GraduationCap,
  Search,
  Star,
  MapPin,
  Filter
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

// No auto-redirect - let users choose their path from the landing page

// Search filters
const searchQuery = ref('')
const selectedAgeGroup = ref('')
const selectedDistrict = ref('')

const ageGroups = [
  { label: 'All Ages', value: '' },
  { label: '1-3 years', value: '1-3' },
  { label: '3-6 years', value: '3-6' }
]

const districts = [
  { label: 'All Districts', value: '' },
  { label: 'Grünerløkka', value: 'grunerløkka' },
  { label: 'Sagene', value: 'sagene' },
  { label: 'Sinsen', value: 'sinsen' }
]

// Sample kindergarten data
const kindergartens = ref([
  {
    id: 1,
    name: 'Stensberggata Barnehage',
    rating: 4.8,
    reviews: 45,
    ageGroup: '1-6 years',
    price: '3,850',
    availability: 'Available',
    location: 'Grünerløkka',
    features: ['Outdoor Play', 'Educational'],
    image: '/api/placeholder/300/200',
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    name: 'Grünerløkka Flerkulturelle Barnehage',
    rating: 4.9,
    reviews: 67,
    ageGroup: '1-6 years',
    price: '4,100',
    availability: 'Available',
    location: 'Grünerløkka',
    features: ['Multicultural', 'Languages'],
    image: '/api/placeholder/300/200',
    bgColor: 'bg-green-50'
  },
  {
    id: 3,
    name: 'Majorstuen Musikk Barnehage',
    rating: 4.7,
    reviews: 32,
    ageGroup: '2-6 years',
    price: '4,250',
    availability: 'Available',
    location: 'Majorstuen',
    features: ['Music Focus', 'Creative Arts'],
    image: '/api/placeholder/300/200',
    bgColor: 'bg-purple-50'
  },
  {
    id: 4,
    name: 'Østerås Barnehage',
    rating: 4.6,
    reviews: 28,
    ageGroup: '1-5 years',
    price: '3,750',
    availability: 'Available',
    location: 'Østerås',
    features: ['Nature Based', 'Outdoor'],
    image: '/api/placeholder/300/200',
    bgColor: 'bg-orange-50'
  },
  {
    id: 5,
    name: 'Solborg Barnehage',
    rating: 4.9,
    reviews: 51,
    ageGroup: '1-6 years',
    price: '4,050',
    availability: 'Available',
    location: 'Nordre Aker',
    features: ['Holistic Development', 'Nurturing'],
    image: '/api/placeholder/300/200',
    bgColor: 'bg-pink-50'
  },
  {
    id: 6,
    name: 'Tåsen Naturbarnehage Barnehage',
    rating: 4.8,
    reviews: 39,
    ageGroup: '2-6 years',
    price: '4,200',
    availability: 'Available',
    location: 'Tåsen',
    features: ['Nature', 'Environmental'],
    image: '/api/placeholder/300/200',
    bgColor: 'bg-green-50'
  }
])

// Platform features
const platformFeatures = [
  {
    icon: '🔍',
    title: 'Smart Search',
    description: 'Advanced filtering by location, age groups, programs, and special amenities to find your perfect match.',
    color: 'bg-purple-100'
  },
  {
    icon: '📝',
    title: 'Easy Application',
    description: 'Submit applications to multiple kindergartens with a single form. Save time and reduce paperwork.',
    color: 'bg-pink-100'
  },
  {
    icon: '✅',
    title: 'Verified Information',
    description: 'All kindergarten data is verified and approved by Oslo Municipality for accuracy and reliability.',
    color: 'bg-cyan-100'
  },
  {
    icon: '👥',
    title: 'Expert Support',
    description: 'Get guidance from our education specialists throughout the application and selection process.',
    color: 'bg-green-100'
  }
]

// Trust indicators
const trustStats = [
  { value: '5,000+', label: 'Happy Families' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Support Available' }
]

// Functions
const handleSearch = () => {
  // Implement search logic
  console.log('Searching with:', searchQuery.value, selectedAgeGroup.value, selectedDistrict.value)
}

const handleStartApplication = () => {
  router.push('/guardian/new-application')
}

const handleExploreKindergartens = () => {
  // Scroll to kindergartens section
  document.getElementById('kindergartens-section')?.scrollIntoView({ behavior: 'smooth' })
}

const handleViewDetails = (kindergarten: any) => {
  // Navigate to kindergarten details
  console.log('View details for:', kindergarten.name)
}

const handleApply = (kindergarten: any) => {
  router.push('/guardian/new-application')
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">Childcare System</span>
          </div>

          <!-- Navigation -->
          <div class="flex items-center space-x-4">
            <button class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">EN</button>
            <button class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium" @click="router.push('/login')">Login</button>
            <button class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium" @click="handleStartApplication">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
      <div class="max-w-7xl mx-auto px-6 py-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div>
            <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <svg class="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-sm font-medium">Oslo Municipality Certified</span>
            </div>

            <h1 class="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find the Perfect
              <span class="text-yellow-300">Kindergarten</span> for
              Your Child
            </h1>

            <p class="text-xl text-purple-100 mb-8 leading-relaxed">
              Discover Oslo's finest kindergartens with our intelligent search system. Compare facilities, access verified information, and find the perfect educational foundation for your child's growth and development.
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-4 gap-6 mb-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-white">6+</div>
                <div class="text-sm text-purple-200">Districts</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-white">58+</div>
                <div class="text-sm text-purple-200">Available Spots</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-white">5</div>
                <div class="text-sm text-purple-200">Quality Levels</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-white">4.8★</div>
                <div class="text-sm text-purple-200">Average Rating</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                @click="handleStartApplication"
                class="flex items-center justify-center space-x-2 px-8 py-4 bg-yellow-400 text-purple-900 rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Start Your Application</span>
              </button>
              <button 
                @click="handleExploreKindergartens"
                class="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span>Explore Kindergartens</span>
              </button>
            </div>
          </div>

          <!-- Right Content - Hero Image -->
          <div class="relative">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <!-- Main Image Placeholder -->
              <div class="bg-gradient-to-br from-yellow-200 to-orange-300 rounded-xl w-full h-96 flex items-center justify-center relative overflow-hidden">
                <!-- Decorative elements -->
                <div class="absolute inset-0">
                  <div class="absolute top-8 left-8 w-16 h-16 bg-white/30 rounded-full"></div>
                  <div class="absolute top-20 right-12 w-12 h-12 bg-white/20 rounded-full"></div>
                  <div class="absolute bottom-12 left-16 w-8 h-8 bg-white/40 rounded-full"></div>
                  <div class="absolute bottom-8 right-8 w-20 h-20 bg-white/25 rounded-full"></div>
                </div>
                
                <!-- Center Content -->
                <div class="text-center z-10">
                  <svg class="w-24 h-24 text-white/80 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <h3 class="text-2xl font-bold text-white/90">Happy Children Learning</h3>
                  <p class="text-white/70 mt-2">Quality Education & Care</p>
                </div>
              </div>

              <!-- Floating Cards -->
              <div class="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-800">Safe Environment</span>
                </div>
              </div>
              
              <div class="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-800">Top Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Our Platform -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamlined kindergarten search and application process designed for modern families
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="feature in platformFeatures" 
            :key="feature.title"
            class="text-center group"
          >
            <div :class="`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200`">
              <span class="text-3xl">{{ feature.icon }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Find Your Ideal Kindergarten -->
    <section id="kindergartens-section" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Find Your Ideal Kindergarten</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Use our advanced filters to discover kindergartens that match your family's needs
          </p>
        </div>

        <!-- Search Filters -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-12">
          <div class="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search by name, district, or program</label>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search kindergartens..." 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <select 
                v-model="selectedAgeGroup"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option v-for="age in ageGroups" :key="age.value" :value="age.value">{{ age.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select 
                v-model="selectedDistrict"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option v-for="district in districts" :key="district.value" :value="district.value">{{ district.label }}</option>
              </select>
            </div>
            <div>
              <button 
                @click="handleSearch"
                class="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                🔍 Search
              </button>
            </div>
          </div>
        </div>

        <!-- Additional Filters -->
        <div class="flex flex-wrap items-center justify-between mb-8">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">1 Additional filters</span>
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                🏫 Outdoor space available
              </button>
              <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                🎓 Organic food
              </button>
              <button class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                👨‍👩‍👧‍👦 Sibling bonus
              </button>
            </div>
          </div>
          <button class="text-purple-600 hover:text-purple-700 font-medium">Clear all</button>
        </div>

        <!-- Results Summary -->
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">6 Kindergartens Found</h3>
          <p class="text-gray-600">Showing 6 of 6 results - sorted by rating</p>
        </div>

        <!-- Kindergarten Cards Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="kindergarten in kindergartens" 
            :key="kindergarten.id"
            class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Image -->
            <div :class="`h-48 ${kindergarten.bgColor} relative`">
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div class="absolute top-4 left-4">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {{ kindergarten.availability }}
                </span>
              </div>
              <div class="absolute top-4 right-4">
                <button class="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900 leading-tight">{{ kindergarten.name }}</h3>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">{{ kindergarten.rating }}</span>
                  <span class="text-sm text-gray-500">({{ kindergarten.reviews }})</span>
                </div>
              </div>

              <div class="space-y-3 mb-4">
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ kindergarten.location }}</span>
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <span>{{ kindergarten.ageGroup }}</span>
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <span>NOK {{ kindergarten.price }}/month</span>
                </div>
              </div>

              <!-- Features -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="feature in kindergarten.features" 
                  :key="feature"
                  class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                >
                  {{ feature }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex space-x-2">
                <button 
                  @click="handleViewDetails(kindergarten)"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  View Details
                </button>
                <button 
                  @click="handleApply(kindergarten)"
                  class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted by Oslo Families -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Trusted by Oslo Families</h2>
          <p class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our platform makes finding the perfect kindergarten for your child efficient and stress-free. Trusted by thousands of families across Oslo.
          </p>

          <div class="grid md:grid-cols-3 gap-12">
            <div 
              v-for="stat in trustStats" 
              :key="stat.label"
              class="text-center"
            >
              <div class="text-5xl font-bold text-gray-900 mb-2">{{ stat.value }}</div>
              <div class="text-lg text-gray-600">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold mb-6">Ready to Find Your Child's Perfect Kindergarten?</h2>
        <p class="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Start your journey today and give your child the best educational foundation. Our team is here to help you through every step of the process.
        </p>
        <button 
          @click="handleStartApplication"
          class="px-8 py-4 bg-yellow-400 text-purple-900 rounded-lg hover:bg-yellow-300 transition-colors font-semibold text-lg"
        >
          🚀 Start Application Now
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth animations */
.transition-all {
  transition: all 0.3s ease;
}

/* Focus styles for accessibility */
input:focus, select:focus, button:focus {
  outline: none;
  ring: 2;
  ring-color: rgb(147 51 234);
}
</style> 