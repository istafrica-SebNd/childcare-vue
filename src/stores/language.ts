import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  const { t, locale } = useI18n()
  const currentLocale = ref(locale.value)

  const translate = (key: string, fallback?: string): string => {
    const translation = t(key)
    return translation === key ? (fallback || key) : translation
  }

  const setLocale = (newLocale: string) => {
    currentLocale.value = newLocale
    locale.value = newLocale
  }

  return {
    currentLocale,
    translate,
    setLocale
  }
}) 