import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../access/isAdmin'
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from '../access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      sameSite:
        process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE
          ? 'none'
          : undefined,
      secure:
        process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE
          ? true
          : undefined,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
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
      label: 'Twitter Handle',
      type: 'text',
      admin: {
        description: 'Example: `payloadcms`',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['public'],
      required: true,
      access: {
        read: isAdminOrSelfFieldLevel,
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: ['admin', 'public'],
    },
  ],
}
