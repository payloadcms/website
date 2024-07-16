import path from 'path'
import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'darkModeFallback',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Choose an upload to render if the visitor is using dark mode.',
      },
    },
  ],
}
