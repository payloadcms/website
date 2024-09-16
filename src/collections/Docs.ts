import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Docs: CollectionConfig = {
  slug: 'docs',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'topic', 'slug', 'title'],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'description',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'keywords',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'headings',
      type: 'json',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'content',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'path',
      type: 'text',
      hooks: {
        afterRead: [
          ({ data }) => {
            if (data) return `${data.topic}/${data.slug}`
          },
        ],
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'topic',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
