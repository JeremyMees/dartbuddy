export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/icon'],

  devtools: { enabled: true },

  compatibilityDate: '2025-07-15',

  eslint: {
    config: { stylistic: true },
  },
})