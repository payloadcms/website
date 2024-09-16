import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import codeBlips from '../../fields/codeBlips'

export const Code: Block = {
  slug: 'code',
  fields: [
    blockFields({
      name: 'codeFields',
      fields: [
        {
          name: 'language',
          type: 'select',
          defaultValue: 'none',
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'JavaScript',
              value: 'js',
            },
            {
              label: 'TypeScript',
              value: 'ts',
            },
          ],
        },
        {
          name: 'code',
          type: 'code',
          required: true,
        },
        codeBlips,
      ],
    }),
  ],
}
