import type { CollectionConfig } from 'payload'

import { isAdmin } from '../../access/isAdmin'
import { extractDescription } from './extract-description'
import { updateAlgolia } from './updateAlgolia'

export const CommunityHelp: CollectionConfig = {
  slug: 'community-help',
  admin: {
    useAsTitle: 'title',
  },
  labels: {
    singular: 'Community Help',
    plural: 'Community Helps',
  },
  access: {
    create: () => false,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'communityHelpType',
      label: 'Community Help Type',
      type: 'radio',
      access: {
        update: () => false,
      },
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
      label: 'GitHub ID',
      type: 'text',
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData?.communityHelpType === 'github',
      },
    },
    {
      name: 'discordID',
      label: 'Discord ID',
      type: 'text',
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData?.communityHelpType === 'discord',
      },
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
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData.introDescription
          },
        ],
        afterRead: [
          ({ data }) => {
            if (data?.communityHelpType === 'discord') {
              return extractDescription(data.communityHelpJSON.intro.content)
            }
            return extractDescription(data?.communityHelpJSON.body)
          },
        ],
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'helpful',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        afterChange: [
          ({ previousValue, value, siblingData }) => {
            if (previousValue !== value) {
              const docID =
                siblingData.communityHelpType === 'discord'
                  ? siblingData.discordID
                  : siblingData.githubID
              if (docID) updateAlgolia(docID, value)
            }
          },
        ],
      },
    },
    {
      name: 'relatedDocs',
      type: 'relationship',
      relationTo: 'docs',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
