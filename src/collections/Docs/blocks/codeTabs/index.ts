import type { Block } from 'payload'

import { languages } from '../shared'
import { codeTabsConverter } from './converter'

export const CodeTabsBlock: Block = {
  slug: 'CodeTabs',
  admin: {
    jsx: '@root/collections/Docs/blocks/codeTabs/converterClient#codeTabsConverterClient',
  },
  fields: [
    {
      name: 'tabs',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'language',
          type: 'select',
          defaultValue: 'ts',
          options: Object.entries(languages).map(([key, value]) => ({
            label: value,
            value: key,
          })),
          required: true,
        },
        {
          name: 'code',
          type: 'code',
          required: true,
        },
      ],
      labels: {
        plural: 'Tabs',
        singular: 'Tab',
      },
      minRows: 2,
      required: true,
    },
  ],
  interfaceName: 'CodeTabsBlock',
  labels: {
    plural: 'Code Tabs',
    singular: 'Code Tabs',
  },
  jsx: codeTabsConverter,
}
