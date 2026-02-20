import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/tailwind.css'],

  compatibilityDate: '2025-07-15',

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'DartBuddy',
      short_name: 'Buddy',
      description: 'Dart scoring app',
      theme_color: '#262624',
      background_color: '#262624',
      display: 'standalone',
      icons: [
        {
          src: '/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-96x96.png',
          sizes: '96x96',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
      ],
      meta: [{ name: 'apple-mobile-web-app-title', content: 'Buddy' }],
    },
  },

  vite: {
    plugins: [
      // @ts-expect-error - Temporary fix for tailwindcss plugin types mismatch
      tailwindcss(),
    ],
  },

  shadcn: { prefix: '' },
})
