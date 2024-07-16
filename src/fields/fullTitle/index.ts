import type { Field } from 'payload'

import populateFullTitle from './populateFullTitle'

export const fullTitle: Field = {
  name: 'fullTitle',
  type: 'text',
  hooks: {
    beforeChange: [populateFullTitle],
  },
  admin: {
    components: {
      Field: () => null,
    },
  },
}
