import type { CollectionConfig } from 'payload'

import { revalidatePath } from 'next/cache'

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

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    livePreview: {
      url: ({ data }) => formatPreviewURL('posts', data),
    },
    preview: (doc) => formatPreviewURL('posts', doc),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    slug: true,
    authors: true,
    authorType: true,
    guestAuthor: true,
    guestSocials: true,
    image: true,
    publishedOn: true,
    title: true,
    category: true,
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
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          admin: {
            width: '50%',
          },
          defaultValue: 'blog',
          options: [
            { label: 'Blog', value: 'blog' },
            { label: 'Guide', value: 'guide' },
          ],
          required: true,
        },
        {
          name: 'tags',
          type: 'text',
          admin: {
            width: '50%',
          },
          hasMany: true,
        },
      ],
    },
    {
      name: 'useVideo',
      type: 'checkbox',
      label: 'Use Youtube video as header image',
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.useVideo,
      },
      label: 'Video URL',
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
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      hasMany: true,
      relationTo: 'posts',
    },
    {
      name: 'relatedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.category === 'guide',
        description:
          'Select the docs where you want to link to this guide. Be sure to select the correct version.',
      },
      hasMany: true,
      relationTo: 'docs',
    },
    slugField(),
    {
      name: 'authorType',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'team',
      options: [
        { label: 'Guest', value: 'guest' },
        { label: 'Team', value: 'team' },
      ],
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.authorType === 'team',
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
      required: true,
    },
    {
      name: 'guestAuthor',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.authorType === 'guest',
        position: 'sidebar',
      },
    },
    {
      type: 'collapsible',
      admin: {
        condition: (_, siblingData) => siblingData?.authorType === 'guest',
        initCollapsed: true,
        position: 'sidebar',
      },
      fields: [
        {
          name: 'guestSocials',
          label: false,
          type: 'group',
          fields: [
            {
              name: 'youtube',
              type: 'text',
            },
            {
              name: 'twitter',
              type: 'text',
            },
            {
              name: 'linkedin',
              type: 'text',
            },
            {
              name: 'website',
              type: 'text',
            },
          ],
        },
      ],
      label: 'Guest Author Socials',
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath(`/blog/${doc.slug}`)
        revalidatePath(`/blog`, 'page')
        console.log(`Revalidated: /blog/${doc.slug}`)
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
