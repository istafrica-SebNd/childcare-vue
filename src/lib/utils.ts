import type { Ref } from 'vue'

// Simple class name utility without external dependencies
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Generic value updater utility
export function valueUpdater<T>(updaterOrValue: T | ((prev: T) => T), ref: Ref<T>) {
  ref.value = typeof updaterOrValue === 'function'
    ? (updaterOrValue as (prev: T) => T)(ref.value)
    : updaterOrValue
}

// Additional utility functions for the kindergarten app
export function formatName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
