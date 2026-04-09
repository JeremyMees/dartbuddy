import { config } from '@vue/test-utils'

config.global.directives = {}

config.global.stubs = {
  NuxtLink: {
    props: ['to'],
    template: '<a :href="to"><slot></slot></a>',
  },
  NumberTicker: {
    props: ['value'],
    template: '<div data-test-number-ticker>{{ value }}</div>',
  },
}
