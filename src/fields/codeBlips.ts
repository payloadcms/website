import type { Field } from 'payload'
import richText from './richText'
import link from './link'

const codeBlips: Field = {
  name: 'codeBlips',
  type: 'array',
  labels: {
    singular: 'Blip',
    plural: 'Blips',
  },
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
      type: 'checkbox',
      name: 'enableLink',
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
}

export default codeBlips
