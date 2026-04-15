import type { CollectionConfig } from 'payload'

import { revalidatePath } from 'next/cache'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { Banner } from '../blocks/Banner'
import richText from '../fields/richText'
import { formatPreviewURL } from '../utilities/formatPreviewURL'

export const Releases: CollectionConfig = {
  slug: 'releases',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['title', 'githubTag', 'publishedOn', '_status'],
    livePreview: {
      url: ({ data }) => formatPreviewURL('releases', data),
    },
    preview: (doc) => formatPreviewURL('releases', doc),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    slug: true,
    authors: true,
    githubTag: true,
    image: true,
    publishedOn: true,
    title: true,
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
      label: 'Header Image',
      relationTo: 'media',
    },
    richText({
      name: 'excerpt',
      required: false,
    }),
    {
      name: 'content',
      type: 'blocks',
      blockReferences: [
        Banner,
        'blogContent',
        'code',
        'blogMarkdown',
        'mediaBlock',
        'reusableContentBlock',
      ],
      blocks: [],
    },
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
      name: 'slug',
      type: 'text',
      admin: {
        description:
          'Auto-generated from GitHub tag for imported releases. Enter manually for non-imported releases.',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation, value }) => {
            // If a slug is already provided (e.g. from importer or manual entry), keep it
            if (typeof value === 'string' && value.length > 0) {
              return value
            }

            // On create, derive slug from githubTag only (never from title)
            if (operation === 'create' && data?.githubTag) {
              return data.githubTag
                .replace(/ /g, '-')
                .replace(/[^\w.-]+/g, '')
                .toLowerCase()
            }

            return value
          },
        ],
      },
      index: true,
      label: 'Slug',
      required: true,
      unique: true,
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
    // GitHub import metadata
    {
      name: 'githubReleaseId',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      index: true,
      label: 'GitHub Release ID',
      unique: true,
    },
    {
      name: 'githubTag',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      index: true,
      label: 'GitHub Tag',
    },
    {
      name: 'githubUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'GitHub URL',
    },
    {
      name: 'importedFromGitHub',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: false,
      label: 'Imported from GitHub',
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/posts/releases')
          revalidatePath(`/posts/releases/${doc.slug}`)
        } catch {
          // revalidatePath only works inside a Next.js request context;
          // silently skip when running from scripts or Local API outside Next.js
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath('/posts/releases')
          revalidatePath(`/posts/releases/${doc.slug}`)
        } catch {
          // silently skip outside Next.js request context
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
