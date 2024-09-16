import type { Field } from 'payload'

import populateFullTitle from './populateFullTitle'

export const fullTitle: Field = {
  name: 'fullTitle',
  type: 'text',
  admin: {
    components: {
      Field: false,
    },
  },
  hooks: {
    beforeChange: [populateFullTitle],
  },
}
