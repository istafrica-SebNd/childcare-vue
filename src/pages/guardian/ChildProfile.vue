<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirect to the new children list page
  router.replace('/guardian/children')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-oslo-blue"></div>
  </div>
</template> 
