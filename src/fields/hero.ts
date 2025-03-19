import type { Field } from 'payload'

import { themeField } from './blockFields'
import link from './link'
import linkGroup from './linkGroup'
import livestreamFields from './livestreamFields'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'default',
      label: 'Type',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Content and Media',
          value: 'contentMedia',
        },
        {
          label: 'Centered Content',
          value: 'centeredContent',
        },
        {
          label: 'Form',
          value: 'form',
        },
        {
          label: 'Home',
          value: 'home',
        },
        {
          label: 'Home New',
          value: 'homeNew',
        },
        {
          label: 'Livestream',
          value: 'livestream',
        },
        {
          label: 'Gradient',
          value: 'gradient',
        },
        {
          label: '3.0',
          value: 'three',
        },
      ],
      required: true,
    },
    {
      name: 'fullBackground',
      type: 'checkbox',
      admin: {
        condition: (_, { type } = {}) => type === 'gradient',
      },
    },
    themeField(100),
    {
      type: 'collapsible',
      fields: [
        {
          name: 'enableBreadcrumbsBar',
          type: 'checkbox',
          label: 'Enable Breadcrumbs Bar',
        },
        linkGroup({
          appearances: false,
          overrides: {
            name: 'breadcrumbsBarLinks',
            admin: {
              condition: (_, { enableBreadcrumbsBar } = {}) => Boolean(enableBreadcrumbsBar),
            },
            labels: {
              plural: 'Links',
              singular: 'Link',
            },
          },
        }),
      ],
      label: 'Breadcrumbs Bar',
    },
    livestreamFields,
    {
      name: 'enableAnnouncement',
      type: 'checkbox',
      admin: {
        condition: (_, { type }) => ['home', 'homeNew'].includes(type),
      },
      label: 'Enable Announcement?',
    },
    link({
      appearances: false,
      overrides: {
        name: 'announcementLink',
        admin: {
          condition: (_, { enableAnnouncement }) => enableAnnouncement,
        },
      },
    }),
    {
      name: 'richText',
      type: 'richText',
      admin: {
        condition: (_, { type } = {}) => type !== 'livestream',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        condition: (_, { type } = {}) =>
          type !== 'livestream' &&
          type !== 'centeredContent' &&
          type !== 'three' &&
          type !== 'homeNew',
      },
    },
    linkGroup({
      additions: {
        npmCta: true,
      },
      appearances: false,
      overrides: {
        name: 'primaryButtons',
        admin: {
          condition: (_, { type }) => ['home', 'homeNew'].includes(type),
        },
        label: 'Primary Buttons',
      },
    }),
    {
      name: 'secondaryHeading',
      type: 'richText',
      admin: {
        condition: (_, { type }) => ['home'].includes(type),
      },
    },
    {
      name: 'secondaryDescription',
      type: 'richText',
      admin: {
        condition: (_, { type }) => type === 'home',
      },
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { type } = {}) =>
            ['centeredContent', 'contentMedia', 'default', 'gradient', 'livestream'].includes(type),
        },
      },
    }),
    {
      name: 'threeCTA',
      type: 'radio',
      admin: {
        condition: (_, { type }) => type === 'three',
      },
      label: 'CTA?',
      options: [
        {
          label: 'Newsletter Sign Up',
          value: 'newsletter',
        },
        {
          label: 'Buttons',
          value: 'buttons',
        },
      ],
      required: true,
    },
    {
      name: 'newsletter',
      type: 'group',
      admin: {
        condition: (_, { type, threeCTA }) => type === 'three' && threeCTA === 'newsletter',
        hideGutter: true,
      },
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          admin: { placeholder: 'Enter your email' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            placeholder: 'Sign up to receive periodic updates and feature releases to your email.',
          },
        },
      ],
    },
    {
      name: 'buttons',
      type: 'blocks',
      admin: {
        condition: (_, { type, threeCTA }) => type === 'three' && threeCTA === 'buttons',
      },
      blockReferences: ['link', 'command'],
      blocks: [],
      labels: {
        plural: 'Buttons',
        singular: 'Button',
      },
    },
    linkGroup({
      appearances: false,
      overrides: {
        name: 'secondaryButtons',
        admin: {
          condition: (_, { type }) => ['home'].includes(type),
        },
        label: 'Secondary Buttons',
      },
    }),
    {
      name: 'images',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => ['gradient', 'homeNew', 'three'].includes(type),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      minRows: 1,
    },
    {
      name: 'enableMedia',
      type: 'checkbox',
      admin: {
        condition: (_, { type }) => type === 'centeredContent',
      },
      defaultValue: false,
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type, enableMedia } = {}) =>
          ['contentMedia', 'home'].includes(type) || (enableMedia && type === 'centeredContent'),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'secondaryMedia',
      type: 'upload',
      admin: {
        condition: (_, { type }) => type === 'home',
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'featureVideo',
      type: 'upload',
      admin: {
        condition: (_, { type }) => ['home'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'form',
      type: 'relationship',
      admin: {
        condition: (_, { type }) => type === 'form',
      },
      relationTo: 'forms',
    },
    {
      name: 'logos',
      type: 'array',
      admin: {
        condition: (_, { type }) => type === 'home',
      },
      fields: [
        {
          name: 'logoMedia',
          type: 'upload',
          label: 'Media',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'logoShowcaseLabel',
      type: 'richText',
      admin: {
        condition: (_, { type }) => type === 'homeNew',
      },
    },
    {
      name: 'logoShowcase',
      type: 'upload',
      admin: {
        condition: (_, { type }) => type === 'homeNew',
      },
      hasMany: true,
      minRows: 7,
      relationTo: 'media',
    },
  ],
  label: false,
}
