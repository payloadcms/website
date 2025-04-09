import type { CollectionConfig } from 'payload'

import { addToDocs } from '@root/fields/addToDocs'
import { revalidatePath } from 'next/cache'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { Banner } from '../blocks/Banner'
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
    preview: (doc) => {
      return formatPreviewURL('posts', doc, (doc?.category as { slug: string })?.slug)
    },
    useAsTitle: 'title',
  },
  defaultPopulate: {
    slug: true,
    authors: true,
    authorType: true,
    category: true,
    dynamicThumbnail: true,
    featuredMedia: true,
    guestAuthor: true,
    guestSocials: true,
    image: true,
    publishedOn: true,
    relatedPosts: true,
    thumbnail: true,
    title: true,
    videoUrl: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'featuredMedia',
      type: 'select',
      defaultValue: 'upload',
      options: [
        {
          label: 'Image Upload',
          value: 'upload',
        },
        {
          label: 'Video Embed',
          value: 'videoUrl',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      admin: {
        condition: (_, siblingData) => siblingData?.featuredMedia === 'upload',
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.featuredMedia === 'videoUrl',
      },
      label: 'Video URL',
    },
    {
      name: 'dynamicThumbnail',
      type: 'checkbox',
      admin: {
        condition: (_, siblingData) => siblingData?.featuredMedia === 'videoUrl',
      },
      defaultValue: true,
      label: 'Use dynamic thumbnail',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      admin: {
        condition: (_, siblingData) =>
          !siblingData?.dynamicThumbnail && siblingData?.featuredMedia !== 'upload',
      },
      relationTo: 'media',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          admin: {
            width: '50%',
          },
          hooks: {
            afterChange: [
              async ({ previousValue, req, value }) => {
                try {
                  const category = await req.payload.findByID({
                    id: value,
                    collection: 'categories',
                    select: {
                      slug: true,
                    },
                  })
                  if (!category) {
                    throw new Error('Category not found')
                  } else {
                    revalidatePath(`/posts/${category.slug}`)
                    console.log(`Revalidated: /posts/${category.slug}`)
                  }

                  if (value !== previousValue) {
                    const previousCategory = await req.payload.findByID({
                      id: previousValue,
                      collection: 'categories',
                      select: {
                        slug: true,
                      },
                    })
                    if (!previousCategory) {
                      throw new Error('Previous category not found')
                    } else {
                      revalidatePath(`/posts/${previousCategory.slug}`)
                      console.log(`Revalidated: /posts/${previousCategory.slug}`)
                    }
                  }
                } catch (error) {
                  console.error(error)
                }
              },
            ],
          },
          relationTo: 'categories',
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
    richText({
      name: 'excerpt',
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
      required: true,
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
        description:
          'Select the docs where you want to link to this guide. Be sure to select the correct version.',
      },
      hasMany: true,
      hooks: {
        afterChange: [
          ({ req, value }) => {
            try {
              if (!Array.isArray(value)) {
                return
              }

              value.forEach(async (docID) => {
                const doc = await req.payload.findByID({
                  id: docID,
                  collection: 'docs',
                  select: {
                    slug: true,
                    topic: true,
                  },
                })

                if (!doc) {
                  throw new Error('Doc not found')
                } else {
                  revalidatePath(`/docs/${doc.topic}/${doc.slug}`)
                  console.log(`Revalidated: /docs/${doc.topic}/${doc.slug}`)
                }
              })
            } catch (error) {
              console.error(error)
            }
          },
        ],
      },
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
          label: false,
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
    addToDocs,
  ],
  forceSelect: {
    relatedPosts: true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        try {
          const category = await req.payload.findByID({
            id: doc.category,
            collection: 'categories',
            select: {
              slug: true,
            },
          })

          const previousCategory = await req.payload.findByID({
            id: previousDoc.category,
            collection: 'categories',
            select: {
              slug: true,
            },
          })

          if (!category) {
            throw new Error('Category not found')
          } else {
            revalidatePath(`/${category.slug}/${doc.slug}`)
            console.log(`Revalidated: /posts/${category.slug}/${doc.slug}`)
          }

          if (!previousCategory) {
            throw new Error('Previous category not found')
          } else {
            revalidatePath(`/${previousCategory.slug}/${previousDoc.slug}`)
            console.log(`Revalidated: /posts/${previousCategory.slug}/${previousDoc.slug}`)
          }
        } catch (error) {
          console.error(error)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        try {
          const category = await req.payload.findByID({
            id: doc.category,
            collection: 'categories',
            select: {
              slug: true,
            },
          })

          if (!category) {
            throw new Error('Category not found')
          } else {
            revalidatePath(`/${category.slug}`)
            revalidatePath(`/${category.slug}/${doc.slug}`)
            console.log(`Revalidated: /posts/${category.slug}`)
            console.log(`Revalidated: /posts/${category.slug}/${doc.slug}`)
          }
        } catch (error) {
          console.error(error)
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
