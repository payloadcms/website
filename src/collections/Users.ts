import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../access/isAdmin'
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from '../access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdmin,
    delete: isAdminOrSelf,
    read: () => true,
    update: isAdminOrSelf,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      sameSite:
        process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE
          ? 'None'
          : undefined,
      secure:
        process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE
          ? true
          : undefined,
    },
    tokenExpiration: 28800, // 8 hours
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'twitter',
      type: 'text',
      admin: {
        description: 'Example: `payloadcms`',
      },
      label: 'Twitter Handle',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: isAdminFieldLevel,
        read: isAdminOrSelfFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: ['public'],
      hasMany: true,
      options: ['admin', 'public'],
      required: true,
    },
  ],
}
