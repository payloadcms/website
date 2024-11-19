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
    preview: doc => formatPreviewURL('posts', doc),
    useAsTitle: 'title',
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
    slugField(),
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
      required: true,
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
