import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Media: CollectionConfig<'media'> = {
  slug: 'media',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  defaultPopulate: {
    alt: true,
    darkModeFallback: true,
    filename: true,
    height: true,
    mimeType: true,
    url: true,
    width: true,
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
  upload: true,
}
