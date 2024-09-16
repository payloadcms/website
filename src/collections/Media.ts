import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { isAdmin } from '../access/isAdmin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
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
      admin: {
        description: 'Choose an upload to render if the visitor is using dark mode.',
      },
      relationTo: 'media',
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
  },
}
