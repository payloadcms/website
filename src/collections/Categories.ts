import { isAdmin } from '@root/access/isAdmin'
import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  defaultPopulate: {
    slug: true,
    name: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'headline',
      label: 'Headline',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'posts',
      label: 'Posts',
      type: 'join',
      collection: 'posts',
      on: 'category',
      maxDepth: 2,
      defaultLimit: 0,
    },
  ],
}
