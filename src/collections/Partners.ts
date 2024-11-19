import { isAdmin, isAdminFieldLevel } from '../access/isAdmin'

import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { formatPreviewURL } from '../utilities/formatPreviewURL'
import { revalidatePath } from 'next/cache'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: 'Partner',
    plural: 'Partners',
  },
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'name',
    livePreview: {
      url: ({ data }) => formatPreviewURL('partners', data),
    },
    preview: doc => formatPreviewURL('partners', doc),
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Agency Name',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Contact Email',
      required: true,
    },
    slugField('name', {
      admin: {
        position: 'sidebar',
      },
      required: true,
    }),
    {
      name: 'agency_status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      defaultValue: 'active',
      admin: {
        position: 'sidebar',
        description: 'Set to inactive to hide this partner from the directory.',
      },
    },
    {
      name: 'hubspotID',
      type: 'text',
      label: 'HubSpot ID',
      admin: {
        position: 'sidebar',
      },
      access: {
        read: isAdminFieldLevel,
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'This field is managed by the Featured Partners field in the Partner Program collection',
      },
    },
    {
      name: 'topContributor',
      type: 'checkbox',
      label: 'Top Contributor?',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          name: 'content',
          fields: [
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: '1600 x 800px recommended',
              },
              required: true,
            },
            {
              name: 'overview',
              label: 'Overview',
              type: 'richText',
              required: true,
            },
            {
              name: 'services',
              label: 'Services',
              type: 'richText',
              required: true,
            },
            {
              name: 'idealProject',
              label: 'Ideal Project',
              type: 'richText',
              required: true,
            },
            {
              name: 'caseStudy',
              type: 'relationship',
              relationTo: 'case-studies',
            },
            {
              name: 'contributions',
              label: 'Contributions',
              type: 'array',
              admin: {
                description:
                  "Contributions to Payload. Must be a valid GitHub issue, pull request, or discussion URL from a repo in the 'payloadcms' organization.",
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'type',
                      required: true,
                      type: 'select',
                      options: [
                        {
                          label: 'Discussion',
                          value: 'discussion',
                        },
                        {
                          label: 'Pull Request',
                          value: 'pr',
                        },
                        {
                          label: 'Issue',
                          value: 'issue',
                        },
                      ],
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'repo',
                      type: 'text',
                      required: true,
                      defaultValue: 'payload',
                      admin: {
                        width: '25%',
                        // description: ({ path, value }) => `github.com/payloadcms/${value || ''}`,
                      },
                    },
                    {
                      name: 'number',
                      type: 'number',
                      required: true,
                      admin: {
                        width: '25%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'projects',
              label: 'Projects built with Payload',
              type: 'array',
              maxRows: 4,
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'regions',
              type: 'relationship',
              relationTo: 'regions',
              hasMany: true,
              required: true,
            },
            {
              name: 'specialties',
              type: 'relationship',
              relationTo: 'specialties',
              hasMany: true,
              required: true,
            },
            {
              name: 'budgets',
              type: 'relationship',
              relationTo: 'budgets',
              hasMany: true,
              required: true,
            },
            {
              name: 'industries',
              type: 'relationship',
              relationTo: 'industries',
              hasMany: true,
              required: true,
            },
            {
              name: 'social',
              type: 'array',
              label: 'Social Media Links',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      label: 'Platform',
                      required: true,
                      admin: {
                        width: '50%',
                      },
                      options: [
                        {
                          label: 'LinkedIn',
                          value: 'linkedin',
                        },
                        {
                          label: 'Twitter',
                          value: 'twitter',
                        },
                        {
                          label: 'Facebook',
                          value: 'facebook',
                        },
                        {
                          label: 'Instagram',
                          value: 'instagram',
                        },
                        {
                          label: 'YouTube',
                          value: 'youtube',
                        },
                        {
                          label: 'GitHub',
                          value: 'github',
                        },
                      ],
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath(`/partners/${doc.slug}`)
        revalidatePath(`/partners`, 'page')
        console.log(`Revalidated: /partners/${doc.slug}`)
      },
    ],
  },
}
