import type { CollectionConfig } from 'payload'

import { isAdmin } from '../../access/isAdmin'
import docsFeedbackVote from '../../scripts/docsFeedbackVote'

export const DocsFeedback: CollectionConfig = {
  slug: 'docs-feedback',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['path', 'helpful', 'notHelpful'],
    group: 'Docs',
    useAsTitle: 'path',
  },
  // Registered as a collection endpoint (not a root endpoint): Payload routes
  // `/api/docs-feedback/*` to this collection, so a root-level path of
  // `/docs-feedback/vote` would never match. This resolves to POST /api/docs-feedback/vote.
  endpoints: [
    {
      handler: docsFeedbackVote,
      method: 'post',
      path: '/vote',
    },
  ],
  fields: [
    {
      name: 'path',
      type: 'text',
      admin: {
        description: 'The docs page key, e.g. "getting-started/what-is-payload".',
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'helpful',
      type: 'number',
      defaultValue: 0,
      min: 0,
      required: true,
    },
    {
      name: 'notHelpful',
      type: 'number',
      defaultValue: 0,
      min: 0,
      required: true,
    },
  ],
}
