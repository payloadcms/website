import { GlobalConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

import linkGroup from '../fields/linkGroup'
import { Callout } from '../blocks/Callout'
import { CallToAction } from '../blocks/CallToAction'
import { CardGrid } from '../blocks/CardGrid'
import { CaseStudiesHighlight } from '../blocks/CaseStudiesHighlight'
import { CaseStudyCards } from '../blocks/CaseStudyCards'
import { CaseStudyParallax } from '../blocks/CaseStudyParallax'
import { CodeFeature } from '../blocks/CodeFeature'
import { Content } from '../blocks/Content'
import { ContentGrid } from '../blocks/ContentGrid'
import { ExampleTabs } from '../blocks/ExampleTabs'
import { Form } from '../blocks/Form'
import { HoverCards } from '../blocks/HoverCards'
import { HoverHighlights } from '../blocks/HoverHighlights'
import { LinkGrid } from '../blocks/LinkGrid'
import { LogoGrid } from '../blocks/LogoGrid'
import { MediaBlock } from '../blocks/Media'
import { MediaContent } from '../blocks/MediaContent'
import { Pricing } from '../blocks/Pricing'
import { ReusableContent } from '../blocks/ReusableContent'
import { Slider } from '../blocks/Slider'
import { Steps } from '../blocks/Steps'
import { StickyHighlights } from '../blocks/StickyHighlights'
import { Statement } from '../blocks/Statement'
import { MediaContentAccordion } from '../blocks/MediaContentAccordion'
import { revalidatePath } from 'next/cache'

export const PartnerProgram: GlobalConfig = {
  slug: 'partner-program',
  label: 'Partner Program Directory',
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
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Select the form that should be used for the contact form.',
      },
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
          overrides: {
            name: 'breadcrumbBarLinks',
          },
          appearances: false,
        }),
        linkGroup({
          overrides: {
            name: 'heroLinks',
          },
          appearances: false,
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
          relationTo: 'partners',
          hasMany: true,
          required: true,
          minRows: 4,
          maxRows: 4,
          hooks: {
            afterChange: [
              async ({ value, previousValue, req }) => {
                if (value !== previousValue) {
                  const payload = await req.payload
                  await payload
                    .update({
                      collection: 'partners',
                      where: {
                        featured: {
                          equals: true,
                        },
                      },
                      data: {
                        featured: false,
                      },
                    })
                    .then(async () => {
                      await payload.update({
                        collection: 'partners',
                        where: {
                          id: {
                            in: value,
                          },
                        },
                        data: {
                          featured: true,
                        },
                      })
                    })
                }
              },
            ],
          },
        },
      ],
    },
    {
      name: 'contentBlocks',
      type: 'group',
      label: false,
      fields: [
        {
          name: 'beforeDirectory',
          label: 'Before Directory Blocks',
          labels: {
            singular: 'Block',
            plural: 'Blocks',
          },
          type: 'blocks',
          blocks: [
            Callout,
            CallToAction,
            CardGrid,
            CaseStudyCards,
            CaseStudiesHighlight,
            CaseStudyParallax,
            CodeFeature,
            Content,
            ContentGrid,
            Form,
            HoverCards,
            HoverHighlights,
            LinkGrid,
            LogoGrid,
            MediaBlock,
            MediaContent,
            MediaContentAccordion,
            Pricing,
            ReusableContent,
            Slider,
            Statement,
            Steps,
            StickyHighlights,
            ExampleTabs,
          ],
        },
        {
          name: 'afterDirectory',
          type: 'blocks',
          label: 'After Directory Blocks',
          labels: {
            singular: 'Block',
            plural: 'Blocks',
          },
          blocks: [
            Callout,
            CallToAction,
            CardGrid,
            CaseStudyCards,
            CaseStudiesHighlight,
            CaseStudyParallax,
            CodeFeature,
            Content,
            ContentGrid,
            Form,
            HoverCards,
            HoverHighlights,
            LinkGrid,
            LogoGrid,
            MediaBlock,
            MediaContent,
            MediaContentAccordion,
            Pricing,
            ReusableContent,
            Slider,
            Statement,
            Steps,
            StickyHighlights,
            ExampleTabs,
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [() => revalidatePath('/parters', 'layout')],
  },
}
