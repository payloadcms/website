import type { Block } from 'payload'

import { languages } from '../shared.js'
import { codeConverter } from './converter.js'

export const CodeBlock: Block = {
  slug: 'Code',
  admin: {
    jsx: '@root/collections/Docs/blocks/code/converterClient#codeConverterClient',
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'ts',
      options: Object.entries(languages).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    },
    {
      name: 'code',
      type: 'code',
      admin: {
        components: {
          Field: '@root/collections/Docs/blocks/code/CodeFields#Code',
        },
      },
    },
  ],
  interfaceName: 'CodeBlock',
  jsx: codeConverter,
}
