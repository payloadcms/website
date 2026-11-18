import type { Block } from 'payload'

import { blockFields } from '@root/fields/blockFields'

export const VersionSupportTable: Block = {
  slug: 'versionSupportTable',
  fields: [
    blockFields({
      name: 'versionSupportTableFields',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'rows',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'payloadVersion',
                  type: 'text',
                  admin: { width: '20%' },
                  label: 'Payload Version',
                  required: true,
                },
                {
                  name: 'releaseDate',
                  type: 'text',
                  admin: { width: '20%' },
                  label: 'Release Date',
                },
                {
                  name: 'criticalFixesUntil',
                  type: 'text',
                  admin: { width: '20%' },
                  label: 'Critical Fixes Until',
                },
                {
                  name: 'securityFixesUntil',
                  type: 'text',
                  admin: { width: '20%' },
                  label: 'Security Fixes Until',
                },
                {
                  name: 'status',
                  type: 'select',
                  admin: { width: '20%' },
                  label: 'Status',
                  options: [
                    { label: 'Stable', value: 'stable' },
                    { label: 'Beta', value: 'beta' },
                    { label: 'EOL', value: 'eol' },
                  ],
                  required: true,
                },
              ],
            },
          ],
          label: 'Rows',
        },
      ],
    }),
  ],
  interfaceName: 'VersionSupportTableType',
  labels: {
    plural: 'Version Support Tables',
    singular: 'Version Support Table',
  },
}
