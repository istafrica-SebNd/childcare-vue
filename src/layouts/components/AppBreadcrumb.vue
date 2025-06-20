<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(Boolean)
  const crumbs = []

  let currentPath = ''

  for (let i = 0; i < pathArray.length; i++) {
    currentPath += `/${pathArray[i]}`

    crumbs.push({
      label: pathArray[i].charAt(0).toUpperCase() + pathArray[i].slice(1).replace('-', ' '),
      path: currentPath,
      isLast: i === pathArray.length - 1
    })
  }

  return crumbs
})
</script>

<template>
  <nav class="breadcrumb-container">
    <ol class="breadcrumb-list flex items-center gap-2 text-sm text-gray-600">
      <li class="breadcrumb-item">
        <router-link
          to="/"
          class="text-blue-600 hover:text-blue-800 transition-colors"
        >
          <i class="pi pi-home mr-1"></i>
          Home
        </router-link>
      </li>

      <template v-for="crumb in breadcrumbs" :key="crumb.path">
        <li class="breadcrumb-separator">
          <i class="pi pi-angle-right text-gray-400"></i>
        </li>

        <li class="breadcrumb-item">
          <router-link
            v-if="!crumb.isLast"
            :to="crumb.path"
            class="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {{ crumb.label }}
          </router-link>
          <span
            v-else
            class="text-gray-900 font-medium"
          >
            {{ crumb.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>
