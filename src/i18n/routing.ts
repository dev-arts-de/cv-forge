import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'es', 'it', 'pt', 'pl', 'nl', 'tr', 'ar'],
  defaultLocale: 'de',
  localeDetection: true
})
