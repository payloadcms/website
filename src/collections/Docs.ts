import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'

export const Docs: CollectionConfig = {
  slug: 'docs',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['path', 'topic', 'slug', 'title'],
    useAsTitle: 'path',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        readOnly: true,
      },
      required: true,
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
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        afterRead: [
          ({ data }) => {
            if (data) {return `${data.topic}/${data.slug}`}
          },
        ],
      },
    },
    {
      name: 'topic',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
