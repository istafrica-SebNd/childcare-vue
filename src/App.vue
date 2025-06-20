<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
</script>

<template>
  <RouterView />
  <Toast position="top-right" />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

<!-- Global Toast Styling -->
<style>
/* Custom Toast Styling */
:deep(.p-toast) {
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:deep(.p-toast-message) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  margin-bottom: 1rem;
  min-width: 360px;
  max-width: 420px;
  overflow: hidden;
  position: relative;
}

:deep(.p-toast-message::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
}

:deep(.p-toast-message-success) {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
  color: white;
}

:deep(.p-toast-message-success::before) {
  background: linear-gradient(90deg, #34d399, #10b981, #059669);
}

:deep(.p-toast-message-info) {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  color: white;
}

:deep(.p-toast-message-info::before) {
  background: linear-gradient(90deg, #60a5fa, #3b82f6, #1e40af);
}

:deep(.p-toast-message-warn) {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%);
  color: white;
}

:deep(.p-toast-message-warn::before) {
  background: linear-gradient(90deg, #fbbf24, #f59e0b, #d97706);
}

:deep(.p-toast-message-error) {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
  color: white;
}

:deep(.p-toast-message-error::before) {
  background: linear-gradient(90deg, #f87171, #ef4444, #dc2626);
}

:deep(.p-toast-message-content) {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
}

:deep(.p-toast-message-icon) {
  font-size: 1.5rem;
  margin-top: 0.125rem;
  background: rgba(255, 255, 255, 0.2);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:deep(.p-toast-message-text) {
  flex: 1;
  padding-right: 0.5rem;
}

:deep(.p-toast-summary) {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
  line-height: 1.4;
}

:deep(.p-toast-detail) {
  font-size: 0.875rem;
  opacity: 0.95;
  line-height: 1.5;
  font-weight: 400;
}

:deep(.p-toast-icon-close) {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

:deep(.p-toast-icon-close:hover) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

/* Enhanced animation improvements */
:deep(.p-toast-message-enter-from) {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

:deep(.p-toast-message-enter-active) {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.p-toast-message-enter-to) {
  opacity: 1;
  transform: translateX(0) scale(1);
}

:deep(.p-toast-message-leave-from) {
  opacity: 1;
  transform: translateX(0) scale(1);
}

:deep(.p-toast-message-leave-active) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.p-toast-message-leave-to) {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* Progress bar for toast lifetime */
:deep(.p-toast-message::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  animation: toastProgress linear;
}

:deep(.p-toast-message[data-life="3000"]::after) {
  animation-duration: 3s;
}

:deep(.p-toast-message[data-life="4000"]::after) {
  animation-duration: 4s;
}

:deep(.p-toast-message[data-life="5000"]::after) {
  animation-duration: 5s;
}

@keyframes toastProgress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
