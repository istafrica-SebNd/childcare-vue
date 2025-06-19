<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header.vue'
import AppSidebar from './AppSidebar.vue'

const sidebarOpen = ref(true)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <AppSidebar :open="sidebarOpen" />
    <div class="flex-1 flex flex-col">
      <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 bg-slate-50 overflow-auto">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template> 