import { slateEditor } from '@payloadcms/richtext-slate'
import type { Field } from 'payload'

import linkGroup from './linkGroup'
import link from './link'
import livestreamFields from './livestreamFields'
import label from './richText/label'
import largeBody from './richText/largeBody'

import { themeField } from './blockFields'

export const hero: Field = {
  name: 'hero',
  label: false,
  type: 'group',
  fields: [
    {
      type: 'select',
      name: 'type',
      label: 'Type',
      required: true,
      defaultValue: 'default',
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
    },
    {
      type: 'checkbox',
      name: 'fullBackground',
      admin: {
        condition: (_, { type } = {}) => type === 'gradient',
      },
    },
    themeField,
    {
      type: 'collapsible',
      label: 'Breadcrumbs Bar',
      fields: [
        {
          type: 'checkbox',
          name: 'enableBreadcrumbsBar',
          label: 'Enable Breadcrumbs Bar',
        },
        linkGroup({
          overrides: {
            name: 'breadcrumbsBarLinks',
            labels: {
              singular: 'Link',
              plural: 'Links',
            },
            admin: {
              condition: (_, { enableBreadcrumbsBar } = {}) => Boolean(enableBreadcrumbsBar),
            },
          },
          appearances: false,
        }),
      ],
    },
    livestreamFields,
    {
      name: 'enableAnnouncement',
      type: 'checkbox',
      admin: {
        condition: (_, { type }) => type === 'home',
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
      editor: slateEditor({
        admin: {
          elements: ['h1', 'h2', 'h3', 'h6', largeBody, 'ul', label],
          leaves: ['underline'],
        },
      }),
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        condition: (_, { type } = {}) =>
          type !== 'livestream' && type !== 'centeredContent' && type !== 'three',
      },
      editor: slateEditor({
        admin: {
          elements: [largeBody, 'ul', label, 'link'],
          leaves: ['underline'],
        },
      }),
    },
    linkGroup({
      appearances: false,
      overrides: {
        name: 'primaryButtons',
        label: 'Primary Buttons',
        admin: {
          condition: (_, { type }) => type === 'home',
        },
      },
    }),
    {
      name: 'secondaryHeading',
      type: 'richText',
      admin: {
        condition: (_, { type }) => type === 'home',
      },
      editor: slateEditor({
        admin: {
          elements: ['h2', largeBody, 'ul', label],
          leaves: ['underline'],
        },
      }),
    },
    {
      name: 'secondaryDescription',
      type: 'richText',
      admin: {
        condition: (_, { type }) => type === 'home',
      },
      editor: slateEditor({
        admin: {
          elements: [largeBody, 'ul', label, 'link'],
          leaves: ['underline'],
        },
      }),
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { type } = {}) =>
            ['contentMedia', 'default', 'livestream', 'centeredContent', 'gradient'].includes(type),
        },
      },
    }),
    {
      name: 'buttons',
      type: 'blocks',
      labels: {
        singular: 'Button',
        plural: 'Buttons',
      },
      admin: {
        condition: (_, { type }) => type === 'three',
      },
      blocks: [
        {
          slug: 'link',
          labels: {
            singular: 'Link',
            plural: 'Links',
          },
          fields: [link()],
        },
        {
          slug: 'command',
          labels: {
            singular: 'Command Line',
            plural: 'Command Lines',
          },
          fields: [
            {
              name: 'command',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    linkGroup({
      appearances: false,
      overrides: {
        name: 'secondaryButtons',
        label: 'Secondary Buttons',
        admin: {
          condition: (_, { type }) => type === 'home',
        },
      },
    }),
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      admin: {
        condition: (_, { type } = {}) => ['gradient'].includes(type),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['contentMedia', 'home'].includes(type),
      },
    },
    {
      name: 'secondaryMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, { type }) => type === 'home',
      },
    },
    {
      name: 'featureVideo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, { type }) => type === 'home',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        condition: (_, { type }) => type === 'form',
      },
    },
    {
      name: 'logos',
      type: 'array',
      fields: [
        {
          name: 'logoMedia',
          label: 'Media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        condition: (_, { type }) => type === 'home',
      },
    },
  ],
}
