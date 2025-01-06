import type { CollectionConfig } from 'payload'

import { isAdmin } from '../../access/isAdmin'
import { extractDescription } from './extract-description'
import { updateAlgolia } from './updateAlgolia'

export const CommunityHelp: CollectionConfig = {
  slug: 'community-help',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'communityHelpType',
      type: 'radio',
      access: {
        update: () => false,
      },
      label: 'Community Help Type',
      options: [
        {
          label: 'Discord Thread',
          value: 'discord',
        },
        {
          label: 'GitHub Discussion',
          value: 'github',
        },
      ],
    },
    {
      name: 'githubID',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.communityHelpType === 'github',
      },
      index: true,
      label: 'GitHub ID',
    },
    {
      name: 'discordID',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.communityHelpType === 'discord',
      },
      index: true,
      label: 'Discord ID',
    },
    {
      name: 'communityHelpJSON',
      type: 'json',
      required: true,
    },
    {
      name: 'introDescription',
      type: 'text',
      hidden: true,
      hooks: {
        afterRead: [
          ({ data }) => {
            if (data?.communityHelpType === 'discord') {
              return extractDescription(data.communityHelpJSON.intro.content)
            }
            return extractDescription(data?.communityHelpJSON.body)
          },
        ],
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData.introDescription
          },
        ],
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      index: true,
      label: 'Slug',
    },
    {
      name: 'helpful',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        afterChange: [
          async ({ previousValue, siblingData, value }) => {
            if (previousValue !== value) {
              const docID =
                siblingData.communityHelpType === 'discord'
                  ? siblingData.discordID
                  : siblingData.githubID
              if (docID) {
                await updateAlgolia(docID, value)
              }
            }
          },
        ],
      },
    },
    {
      name: 'relatedDocs',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      index: true,
      relationTo: 'docs',
    },
  ],
  labels: {
    plural: 'Community Helps',
    singular: 'Community Help',
  },
}
