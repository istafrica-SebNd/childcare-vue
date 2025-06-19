<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'

const router = useRouter()
const toast = useToast()

// Reactive state
const householdIncome = ref()
const showPaymentOptions = ref(false)
const showFeeReductionModal = ref(false)
const isProcessingApplication = ref(false)

// Payment data
const paymentSummary = ref({
  outstandingBalance: 4440,
  nextPaymentDue: '2024-05-01',
  unpaidInvoices: 2,
  monthlyFee: 2220,
  originalMonthlyFee: 3330,
  totalSavedThisYear: 12210,
  totalPaidThisYear: 6560,
  paymentsCompleted: 3,
  reductionActive: true,
  monthlySavings: 1110
})

const paymentHistory = ref([
  {
    period: 'March 2024',
    invoiceNumber: 'INV-2024-003',
    amount: 2220,
    originalAmount: 3330,
    reduction: 1110,
    dueDate: '2024-04-01',
    paidDate: '2024-03-28',
    status: 'paid'
  },
  {
    period: 'April 2024',
    invoiceNumber: 'INV-2024-004',
    amount: 2220,
    originalAmount: 3330,
    reduction: 1110,
    dueDate: '2024-05-01',
    status: 'due'
  },
  {
    period: 'May 2024',
    invoiceNumber: 'INV-2024-005',
    amount: 2220,
    originalAmount: 3330,
    reduction: 1110,
    dueDate: '2024-06-01',
    status: 'pending'
  }
])

// Computed properties for fee reduction
const isEligibleForReduction = computed(() => {
  return householdIncome.value > 0 && householdIncome.value < 600000
})

const currentFee = computed(() => 3330)

const potentialNewFee = computed(() => {
  if (!isEligibleForReduction.value || !householdIncome.value) return currentFee.value
  
  // Fee calculation based on Norwegian kindergarten fee structure
  if (householdIncome.value < 300000) return 1665
  if (householdIncome.value < 400000) return 1665  
  if (householdIncome.value < 500000) return 2220
  if (householdIncome.value < 600000) return 2775
  return currentFee.value
})

const monthlySavings = computed(() => {
  return currentFee.value - potentialNewFee.value
})

const annualSavings = computed(() => {
  return monthlySavings.value * 12
})

// Event handlers
const handlePayFullAmount = () => {
  toast.add({
    severity: 'success',
    summary: '💳 Payment Initiated',
    detail: `Redirecting to secure payment portal for ${formatCurrency(paymentSummary.value.outstandingBalance)}. Please wait...`,
    life: 4000
  })
}

const handleMorePaymentOptions = () => {
  showPaymentOptions.value = !showPaymentOptions.value
}

const handlePayNow = (amount: number) => {
  toast.add({
    severity: 'success',
    summary: '💰 Payment Processing',
    detail: `Starting payment of ${formatCurrency(amount)}. You will be redirected to your payment provider.`,
    life: 4000
  })
}

const handleViewInvoice = (invoiceNumber: string) => {
  toast.add({
    severity: 'info',
    summary: '📄 Opening Invoice',
    detail: `Loading detailed view for invoice ${invoiceNumber}...`,
    life: 2500
  })
}

const handleDownloadInvoice = (invoiceNumber: string) => {
  toast.add({
    severity: 'success',
    summary: '📥 Download Started',
    detail: `Downloading ${invoiceNumber} as PDF. Check your downloads folder.`,
    life: 3000
  })
}

const handleExportAll = () => {
  toast.add({
    severity: 'info',
    summary: '📊 Export Started',
    detail: 'Preparing complete payment history export. This may take a moment...',
    life: 3500
  })
}

const handlePaySingleInvoice = () => {
  toast.add({
    severity: 'success',
    summary: '🧾 Single Payment',
    detail: `Processing payment of ${formatCurrency(2220)} for your most recent invoice.`,
    life: 3500
  })
}

const handlePayPartialAmount = () => {
  toast.add({
    severity: 'info',
    summary: '💳 Partial Payment',
    detail: 'Opening custom payment form where you can specify the amount to pay.',
    life: 3000
  })
}

const handleSetupAutoPay = () => {
  toast.add({
    severity: 'info',
    summary: '🔄 Auto-Pay Setup',
    detail: 'Redirecting to automatic payment configuration. Never miss a payment again!',
    life: 3500
  })
}

const handleApplyForReduction = async () => {
  isProcessingApplication.value = true
  
  // Show processing state for 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isProcessingApplication.value = false
  showFeeReductionModal.value = true
}

const handleSubmitApplication = () => {
  showFeeReductionModal.value = false
  toast.add({
    severity: 'success',
    summary: '✅ Application Submitted',
    detail: 'Your fee reduction application has been submitted successfully. You will receive a decision within 5-7 business days.',
    life: 5000
  })
}

const handleCancelApplication = () => {
  showFeeReductionModal.value = false
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('no-NO')} kr`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('no-NO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Breadcrumb Navigation -->
    <AppBreadcrumb />

    <!-- Payment Overdue Alert -->
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-red-800">Payment Overdue</h3>
          <p class="text-sm text-red-700">Late fees may apply</p>
        </div>
      </div>
    </div>

    <!-- Outstanding Balance Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-start justify-between">
        <!-- Left Side - Balance Info -->
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">Outstanding Balance</p>
            <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ formatCurrency(paymentSummary.outstandingBalance) }}</h2>
            
            <!-- Due Date & Invoice Count -->
            <div class="flex items-center space-x-6 text-sm text-gray-600">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Due: {{ formatDate(paymentSummary.nextPaymentDue) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>{{ paymentSummary.unpaidInvoices }} unpaid invoices</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Payment Actions -->
        <div class="flex flex-col space-y-3 min-w-[280px] max-w-[280px]">
          <!-- Pay Full Amount Button -->
          <button 
            @click="handlePayFullAmount"
            class="bg-red-600 hover:bg-red-700 text-white rounded-lg p-4 transition-colors w-full"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-semibold">Pay Full Amount</div>
                  <div class="text-sm opacity-90">{{ formatCurrency(paymentSummary.outstandingBalance) }}</div>
                </div>
              </div>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </div>
          </button>

          <!-- More Payment Options -->
          <button 
            @click="handleMorePaymentOptions"
            class="bg-white border border-gray-300 text-gray-700 rounded-lg p-3 hover:bg-gray-50 transition-colors w-full"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium">More Payment Options</span>
              <svg 
                :class="['w-4 h-4 transition-transform duration-200', showPaymentOptions ? 'rotate-180' : '']" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </button>

          <!-- Expandable Payment Options -->
          <div 
            v-if="showPaymentOptions" 
            class="space-y-2 animate-fadeIn w-full"
          >
            <!-- Pay Single Invoice -->
            <button 
              @click="handlePaySingleInvoice"
              class="w-full bg-white border border-gray-200 text-gray-700 rounded-lg p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <span class="font-medium">Pay Single Invoice</span>
                </div>
                <span class="font-semibold text-blue-600 flex-shrink-0">{{ formatCurrency(2220) }}</span>
              </div>
            </button>

            <!-- Pay Partial Amount -->
            <button 
              @click="handlePayPartialAmount"
              class="w-full bg-white border border-gray-200 text-gray-700 rounded-lg p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <span class="font-medium">Pay Partial Amount</span>
                </div>
                <span class="text-sm text-gray-500 flex-shrink-0">Custom</span>
              </div>
            </button>

            <!-- Setup Auto-Pay -->
            <button 
              @click="handleSetupAutoPay"
              class="w-full bg-white border border-gray-200 text-gray-700 rounded-lg p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </div>
                  <span class="font-medium">Setup Auto-Pay</span>
                </div>
                <span class="text-sm text-gray-500 flex-shrink-0">Recurring</span>
              </div>
            </button>
          </div>

          <!-- Trust Indicators -->
          <div class="flex items-center justify-center space-x-4 pt-2">
            <div class="flex items-center space-x-1 text-xs text-gray-500">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span>Bank Secured</span>
            </div>
            <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div class="flex items-center space-x-1 text-xs text-gray-500">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span>SSL Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid lg:grid-cols-5 gap-6">
      <!-- Left Section - Payment Stats -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Payment Summary Cards -->
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Monthly Fee Card -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <div>
                <p class="text-xs text-blue-600 font-semibold uppercase tracking-wider">Monthly Fee</p>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-3xl font-bold text-blue-900">{{ formatCurrency(paymentSummary.monthlyFee) }}</p>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 line-through">{{ formatCurrency(paymentSummary.originalMonthlyFee) }}</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">33% off</span>
              </div>
            </div>
          </div>

          <!-- Paid in 2024 Card -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <p class="text-xs text-green-600 font-semibold uppercase tracking-wider">Paid in 2024</p>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-3xl font-bold text-green-900">{{ formatCurrency(paymentSummary.totalPaidThisYear) }}</p>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">{{ paymentSummary.paymentsCompleted }} payments completed</span>
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Saved Card -->
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div>
                <p class="text-xs text-purple-600 font-semibold uppercase tracking-wider">Total Saved</p>
              </div>
            </div>
            <div class="space-y-2">
              <p class="text-3xl font-bold text-purple-900">{{ formatCurrency(paymentSummary.totalSavedThisYear) }}</p>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Since fee reduction approval</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reduced Payment Active Alert -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h3 class="font-semibold text-green-800">Reduced Payment Active</h3>
              <p class="text-sm text-green-700">Your fee reduction application has been approved. You're saving {{ formatCurrency(paymentSummary.monthlySavings) }} per month.</p>
            </div>
          </div>
        </div>

        <!-- Important Payment Information -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div class="flex items-center space-x-3 mb-4">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="font-semibold text-gray-900">Important Payment Information</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li class="flex items-center space-x-2">
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>Payment is due by the 1st of each month</span>
            </li>
            <li class="flex items-center space-x-2">
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>Late payments may result in additional fees</span>
            </li>
            <li class="flex items-center space-x-2">
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>Income-based reductions are reviewed annually</span>
            </li>
            <li class="flex items-center space-x-2">
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>Contact us immediately if you cannot make payment</span>
            </li>
            <li class="flex items-center space-x-2">
              <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <span>Electronic invoices are sent via Altinn</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column - Fee Reduction Calculator -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center space-x-2 mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <h3 class="font-semibold text-green-800">Fee Reduction Calculator</h3>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Total Household Income (NOK)
              </label>
              <input 
                v-model="householdIncome"
                type="number"
                placeholder="e.g. 450000"
                class="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div class="text-sm text-green-600">
              <p>Enter your annual household income before taxes to see potential savings</p>
            </div>

            <!-- Eligibility Results -->
            <div v-if="householdIncome && householdIncome > 0" class="space-y-4">
              <!-- Eligible Section -->
              <div v-if="isEligibleForReduction" class="bg-white border border-green-300 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-4">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="font-semibold text-green-800">You may be eligible!</span>
                </div>

                <!-- Fee Comparison -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Current Fee:</p>
                    <p class="text-xl font-bold text-gray-900">{{ formatCurrency(currentFee) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Potential New Fee:</p>
                    <p class="text-xl font-bold text-green-700">{{ formatCurrency(potentialNewFee) }}</p>
                  </div>
                </div>

                <!-- Savings Display -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Monthly Savings:</p>
                    <p class="text-xl font-bold text-green-700">{{ formatCurrency(monthlySavings) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Annual Savings:</p>
                    <p class="text-xl font-bold text-green-700">{{ formatCurrency(annualSavings) }}</p>
                  </div>
                </div>

                <!-- Apply Button -->
                <button 
                  @click="handleApplyForReduction"
                  :disabled="isProcessingApplication"
                  class="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div v-if="isProcessingApplication" class="flex items-center justify-center space-x-3">
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                  <div v-else class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                      <span class="font-semibold">Apply for Reduction</span>
                    </div>
                    <div class="text-sm opacity-90">
                      Save {{ formatCurrency(annualSavings) }}/year
                    </div>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>

                <!-- Trust Indicators -->
                <div class="flex items-center justify-center space-x-6 mt-4 pt-3 border-t border-green-200">
                  <div class="flex items-center space-x-1 text-xs text-green-700">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div class="flex items-center space-x-1 text-xs text-green-700">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>5-7 days</span>
                  </div>
                  <div class="flex items-center space-x-1 text-xs text-green-700">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
                    </svg>
                    <span>Free</span>
                  </div>
                </div>

                <!-- Process Information -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div class="space-y-2 text-xs text-green-800">
                    <div class="flex items-center space-x-2">
                      <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Government verified process</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Automatic income verification with Tax Administration</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>No paperwork required - all done digitally</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Not Eligible Section -->
              <div v-else class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-semibold text-amber-800">Income threshold exceeded</span>
                </div>
                <p class="text-sm text-amber-700">
                  Based on your income, you may not qualify for fee reduction. 
                  Contact us for a detailed assessment.
                </p>
              </div>
            </div>

            <!-- Fee Reduction Info -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm font-medium text-blue-900">Fee reductions are based on household income and updated annually. This is an estimate - final decisions are made by the municipality.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment History Section -->
    <div class="mt-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header -->
        <div class="px-8 py-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Payment History</h3>
                <p class="text-sm text-gray-600">Your complete invoice and payment records</p>
              </div>
            </div>
            <button 
              @click="handleExportAll"
              class="flex items-center space-x-2 px-4 py-2.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Export All</span>
            </button>
          </div>
        </div>

        <!-- Enhanced Table -->
        <div class="overflow-hidden">
          <table class="w-full">
            <!-- Table Header -->
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-8 py-4 text-left text-sm font-semibold text-gray-700">Period</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th class="px-8 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <!-- Table Body -->
            <tbody class="bg-white">
              <tr v-for="(payment, index) in paymentHistory" :key="payment.invoiceNumber" 
                  :class="['border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150', 
                           index === paymentHistory.length - 1 ? 'border-b-0' : '']">
                <!-- Period Column -->
                <td class="px-8 py-6">
                  <div>
                    <div class="font-semibold text-gray-900 text-base">{{ payment.period }}</div>
                    <div class="text-sm text-gray-500 mt-1">{{ payment.invoiceNumber }}</div>
                  </div>
                </td>

                <!-- Amount Column -->
                <td class="px-6 py-6">
                  <div>
                    <div class="font-bold text-gray-900 text-base">{{ formatCurrency(payment.amount) }}</div>
                    <div class="text-sm mt-1 flex items-center space-x-2">
                      <span class="text-gray-400 line-through">{{ formatCurrency(payment.originalAmount) }}</span>
                      <span class="text-green-600 font-medium">-{{ formatCurrency(payment.reduction) }}</span>
                    </div>
                  </div>
                </td>

                <!-- Due Date Column -->
                <td class="px-6 py-6">
                  <div>
                    <div class="font-medium text-gray-900">{{ formatDate(payment.dueDate) }}</div>
                    <div v-if="payment.paidDate" class="text-sm text-green-600 mt-1">
                      Paid {{ formatDate(payment.paidDate) }}
                    </div>
                  </div>
                </td>

                <!-- Status Column -->
                <td class="px-6 py-6">
                  <div>
                    <!-- Paid Status -->
                    <span 
                      v-if="payment.status === 'paid'"
                      class="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Paid</span>
                    </span>
                    
                    <!-- Due Status -->
                    <span 
                      v-else-if="payment.status === 'due'"
                      class="inline-flex items-center space-x-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Due</span>
                    </span>
                    
                    <!-- Pending Status -->
                    <span 
                      v-else-if="payment.status === 'pending'"
                      class="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Pending</span>
                    </span>
                  </div>
                </td>

                <!-- Actions Column -->
                <td class="px-8 py-6 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <!-- Pay Now Button (only for due payments) -->
                    <button 
                      v-if="payment.status === 'due'"
                      @click="handlePayNow(payment.amount)"
                      class="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-150"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      <span>Pay Now</span>
                    </button>
                    
                    <!-- View Invoice Button -->
                    <button 
                      @click="handleViewInvoice(payment.invoiceNumber)"
                      class="p-2.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-150"
                      title="View Invoice"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    
                    <!-- Download Invoice Button -->
                    <button 
                      @click="handleDownloadInvoice(payment.invoiceNumber)"
                      class="p-2.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-150"
                      title="Download PDF"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Fee Reduction Application Modal -->
    <div 
      v-if="showFeeReductionModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="handleCancelApplication"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-modalSlideIn">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Apply for Fee Reduction</h3>
          <button 
            @click="handleCancelApplication"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-4">
          <p class="text-gray-700">
            Income-based fee reduction application. Your income will be verified with the Tax Administration.
          </p>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Total Household Income (NOK)
            </label>
            <input 
              :value="householdIncome"
              type="number"
              placeholder="e.g., 450000"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              readonly
            />
            <p class="text-sm text-gray-600 mt-1">Annual household income before taxes</p>
          </div>

          <!-- Info Panel -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="text-sm text-blue-800">
                <p>Your income will be automatically verified with the Tax Administration. You will receive a decision within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200 space-x-3">
          <button 
            @click="handleCancelApplication"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleSubmitApplication"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Fade in animation for expandable content */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transform transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Modal animations */
.animate-modalSlideIn {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Spinning animation for loader */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 