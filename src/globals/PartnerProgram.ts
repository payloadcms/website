import type { GlobalConfig } from 'payload'

import { revalidatePath } from 'next/cache'

import { isAdmin } from '../access/isAdmin'
import linkGroup from '../fields/linkGroup'

export const PartnerProgram: GlobalConfig = {
  slug: 'partner-program',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Partner Program',
  },
  fields: [
    {
      name: 'contactForm',
      type: 'relationship',
      admin: {
        description: 'Select the form that should be used for the contact form.',
      },
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'richText',
          type: 'richText',
          label: 'Hero Text',
        },
        linkGroup({
          appearances: false,
          overrides: {
            name: 'breadcrumbBarLinks',
          },
        }),
        linkGroup({
          appearances: false,
          overrides: {
            name: 'heroLinks',
          },
        }),
      ],
    },
    {
      name: 'featuredPartners',
      type: 'group',
      fields: [
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'partners',
          type: 'relationship',
          hasMany: true,
          hooks: {
            afterChange: [
              async ({ previousValue, req, value }) => {
                if (value !== previousValue) {
                  const payload = await req.payload
                  await payload
                    .update({
                      collection: 'partners',
                      data: {
                        featured: false,
                      },
                      where: {
                        featured: {
                          equals: true,
                        },
                      },
                    })
                    .then(async () => {
                      await payload.update({
                        collection: 'partners',
                        data: {
                          featured: true,
                        },
                        where: {
                          id: {
                            in: value,
                          },
                        },
                      })
                    })
                }
              },
            ],
          },
          maxRows: 4,
          minRows: 4,
          relationTo: 'partners',
          required: true,
        },
      ],
    },
    {
      name: 'contentBlocks',
      type: 'group',
      fields: [
        {
          name: 'beforeDirectory',
          type: 'blocks',
          blockReferences: [
            'callout',
            'cta',
            'cardGrid',
            'caseStudyCards',
            'caseStudiesHighlight',
            'caseStudyParallax',
            'codeFeature',
            'content',
            'contentGrid',
            'form',
            'hoverCards',
            'hoverHighlights',
            'linkGrid',
            'logoGrid',
            'mediaBlock',
            'mediaContent',
            'mediaContentAccordion',
            'pricing',
            'reusableContentBlock',
            'slider',
            'statement',
            'steps',
            'stickyHighlights',
            'exampleTabs',
          ],
          blocks: [],
          label: 'Before Directory Blocks',
          labels: {
            plural: 'Blocks',
            singular: 'Block',
          },
        },
        {
          name: 'afterDirectory',
          type: 'blocks',
          blockReferences: [
            'callout',
            'cta',
            'cardGrid',
            'caseStudyCards',
            'caseStudiesHighlight',
            'caseStudyParallax',
            'codeFeature',
            'content',
            'contentGrid',
            'form',
            'hoverCards',
            'hoverHighlights',
            'linkGrid',
            'logoGrid',
            'mediaBlock',
            'mediaContent',
            'mediaContentAccordion',
            'pricing',
            'reusableContentBlock',
            'slider',
            'statement',
            'steps',
            'stickyHighlights',
            'exampleTabs',
          ],
          blocks: [],
          label: 'After Directory Blocks',
          labels: {
            plural: 'Blocks',
            singular: 'Block',
          },
        },
      ],
      label: false,
    },
  ],
  hooks: {
    afterChange: [() => revalidatePath('/parters', 'layout')],
  },
  label: 'Partner Program Directory',
}
