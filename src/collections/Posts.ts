import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { Banner } from '../blocks/Banner'
import { BlogContent } from '../blocks/BlogContent'
import { BlogMarkdown } from '../blocks/BlogMarkdown'
import { Code } from '../blocks/Code'
import { MediaBlock } from '../blocks/Media'
import { ReusableContent } from '../blocks/ReusableContent'
import richText from '../fields/richText'
import { slugField } from '../fields/slug'
import { formatPreviewURL } from '../utilities/formatPreviewURL'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    preview: doc => formatPreviewURL('posts', doc),
  },
  versions: {
    drafts: true,
  },
  access: {
    create: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath(`/blog/${doc.slug}`)
        revalidatePath(`/blog`, 'page')
        console.log(`Revalidated: /blog/${doc.slug}`)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    richText({
      name: 'excerpt',
    }),
    {
      name: 'content',
      type: 'blocks',
      blocks: [Banner, BlogContent, Code, BlogMarkdown, MediaBlock, ReusableContent],
      required: true,
    },
    {
      name: 'lexicalContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({
            blocks: [
              Banner,
              BlogContent,
              Code,
              BlogMarkdown,
              MediaBlock,
              ReusableContent,
              {
                slug: 'spotlight',
                fields: [
                  {
                    name: 'element',
                    type: 'select',
                    options: [
                      {
                        label: 'H1',
                        value: 'h1',
                      },
                      {
                        label: 'H2',
                        value: 'h2',
                      },
                      {
                        label: 'H3',
                        value: 'h3',
                      },
                      {
                        label: 'Paragraph',
                        value: 'p',
                      },
                    ],
                  },
                  {
                    name: 'richText',
                    type: 'richText',
                    editor: lexicalEditor({
                      features: ({ rootFeatures }) => rootFeatures,
                    }),
                  },
                ],
                interfaceName: 'SpotlightBlock',
              },
              {
                slug: 'video',
                fields: [
                  {
                    name: 'url',
                    type: 'text',
                  },
                ],
                interfaceName: 'VideoBlock',
              },
              {
                slug: 'br',
                fields: [
                  {
                    name: 'ignore',
                    type: 'text',
                  },
                ],

                interfaceName: 'BrBlock',
              },
            ],
          }),
        ],
      }),
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    slugField(),
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedOn',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
  ],
}
