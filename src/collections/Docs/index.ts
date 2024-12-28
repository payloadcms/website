import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  defaultEditorFeatures,
  EXPERIMENTAL_TableFeature,
  type FeatureProviderServer,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'

import { isAdmin } from '../../access/isAdmin'
import { BannerBlock } from './blocks/banner'
import { CodeBlock } from './blocks/code'
import { LightDarkImageBlock } from './blocks/lightDarkImage'
import { RestExamplesBlock } from './blocks/restExamples'
import { TableWithDrawersBlock } from './blocks/tableWithDrawers'
import { UploadBlock } from './blocks/upload'
import { YoutubeBlock } from './blocks/youtube'

export const contentLexicalEditorFeatures: FeatureProviderServer[] = [
  // Default features without upload
  ...defaultEditorFeatures.filter((feature) => feature.key !== 'upload'),
  EXPERIMENTAL_TableFeature(),
  BlocksFeature({
    blocks: [
      CodeBlock,
      BannerBlock,
      YoutubeBlock,
      LightDarkImageBlock,
      UploadBlock,
      RestExamplesBlock,
      TableWithDrawersBlock,
    ],
  }),
]

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
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: contentLexicalEditorFeatures,
              }),
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'keywords',
              type: 'text',
            },
            {
              name: 'headings',
              type: 'json',
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
                    if (data) {
                      return `${data.topic}/${data.slug}`
                    }
                  },
                ],
              },
            },
            {
              name: 'topic',
              type: 'text',
              admin: {
                position: 'sidebar',
              },
              required: true,
            },
            {
              name: 'topicGroup',
              type: 'text',
              admin: {
                description:
                  'The topic group is displayed on the sidebar, but is not part of the URL',
                position: 'sidebar',
              },
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              admin: {
                position: 'sidebar',
              },
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'order',
              type: 'number',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'version',
              type: 'text',
              required: true,

              admin: {
                position: 'sidebar',
              },
            },
          ],
          label: 'Meta',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        if (doc?.version === 'v2') {
          revalidatePath('/(frontend)/(pages)/docs/v2/[topic]/[doc]', 'page')
        } else {
          // Revalidate all doc paths, to ensure that the sidebar is up-to-date for all docs
          revalidatePath('/(frontend)/(pages)/docs/[topic]/[doc]', 'page')
        }
      },
    ],
  },
}
