import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./test/nuxt/unit.setup.ts'],

    onConsoleLog: (l) => {
      return !l.startsWith('<Suspense>')
    },
  },
})
