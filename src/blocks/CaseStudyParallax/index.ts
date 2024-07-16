import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'

export const CaseStudyParallax: Block = {
  slug: 'caseStudyParallax',
  labels: {
    singular: 'Case Study Parallax',
    plural: 'Case Study Parallax',
  },
  fields: [
    blockFields({
      name: 'caseStudyParallaxFields',
      fields: [
        {
          name: 'items',
          type: 'array',
          minRows: 4,
          maxRows: 4,
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
            },
            {
              name: 'author',
              type: 'text',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'images',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tabLabel',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'A label for the navigation tab at the bottom of the parallax',
                  },
                },
                {
                  name: 'caseStudy',
                  type: 'relationship',
                  relationTo: 'case-studies',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
}
