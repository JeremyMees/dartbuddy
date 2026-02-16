import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/image',
    'shadcn-nuxt',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/tailwind.css'],

  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [
      // @ts-expect-error - Temporary fix for tailwindcss plugin types mismatch
      tailwindcss(),
    ],
  },

  shadcn: { prefix: '' },
})
