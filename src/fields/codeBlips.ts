import type { ArrayField } from 'payload'

import link from './link'
import richText from './richText'

const codeBlips: ArrayField = {
  name: 'codeBlips',
  type: 'array',
  fields: [
    {
      name: 'row',
      type: 'number',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    richText({ name: 'feature', required: true }),
    {
      name: 'enableLink',
      type: 'checkbox',
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          condition: (_, { enableLink } = {}) => Boolean(enableLink),
        },
      },
    }),
  ],
  labels: {
    plural: 'Blips',
    singular: 'Blip',
  },
}

export default codeBlips
