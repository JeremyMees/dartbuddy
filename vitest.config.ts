import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./test/nuxt/unit.setup.ts'],

    onConsoleLog: (line) => {
      return (
        !line.startsWith('<Suspense>') &&
        !line.startsWith(
          'Importing from "vitest/environments" is deprecated since Vitest 4.1.',
        )
      )
    },
  },
})
