'use client'

import React, { Fragment } from 'react'
import { BannerBlock } from '@blocks/Banner'
import { BlogContent } from '@blocks/BlogContent'
import { BlogMarkdown } from '@blocks/BlogMarkdown'
import { CallToAction } from '@blocks/CallToAction'
import { CardGrid } from '@blocks/CardGrid'
import { CaseStudiesHighlightBlock } from '@blocks/CaseStudiesHighlight'
import { CaseStudyCards } from '@blocks/CaseStudyCards'
import { CodeBlock } from '@blocks/CodeBlock'
import { CodeFeature } from '@blocks/CodeFeature'
import { ContentBlock } from '@blocks/Content'
import { ContentGrid } from '@blocks/ContentGrid'
import { FormBlock } from '@blocks/FormBlock'
import { HoverHighlights } from '@blocks/HoverHighlights'
import { LinkGrid } from '@blocks/LinkGrid'
import { MediaBlock } from '@blocks/MediaBlock'
import { MediaContent } from '@blocks/MediaContent'
import { Pricing } from '@blocks/Pricing'
import { RelatedPosts, RelatedPostsBlock } from '@blocks/RelatedPosts'
import { ReusableContentBlock } from '@blocks/ReusableContent'
import { Slider } from '@blocks/Slider'
import { Steps } from '@blocks/Steps'
import { StickyHighlights } from '@blocks/StickyHighlights'
import { toKebabCase } from '@utilities/to-kebab-case'

import { BlockSpacing } from '@components/BlockSpacing'
import { Page, ReusableContent } from '@root/payload-types'

type ReusableContentBlockType = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

const blockComponents = {
  banner: BannerBlock,
  blogContent: BlogContent,
  blogMarkdown: BlogMarkdown,
  caseStudiesHighlight: CaseStudiesHighlightBlock,
  caseStudyCards: CaseStudyCards,
  mediaBlock: MediaBlock,
  code: CodeBlock,
  content: ContentBlock,
  contentGrid: ContentGrid,
  form: FormBlock,
  slider: Slider,
  cardGrid: CardGrid,
  mediaContent: MediaContent,
  steps: Steps,
  stickyHighlights: StickyHighlights,
  hoverHighlights: HoverHighlights,
  codeFeature: CodeFeature,
  cta: CallToAction,
  linkGrid: LinkGrid,
  reusableContentBlock: ReusableContentBlock,
  pricing: Pricing,
  relatedPosts: RelatedPosts,
}

type Props = {
  blocks: (ReusableContent['layout'][0] | ReusableContentBlockType | RelatedPostsBlock)[]
  disableOuterSpacing?: true
}

export const RenderBlocks: React.FC<Props> = props => {
  const { blocks, disableOuterSpacing } = props
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            const hasSpacing = ![
              'banner',
              'blogContent',
              'blogMarkdown',
              'code',
              'reusableContentBlock',
            ].includes(blockType)

            let topSpacing = hasSpacing
            let bottomSpacing = hasSpacing

            if (disableOuterSpacing && hasSpacing) {
              if (index === 0) topSpacing = false
              if (index === blocks.length - 1) bottomSpacing = false
            }

            if (Block) {
              return (
                <BlockSpacing key={index} top={topSpacing} bottom={bottomSpacing}>
                  <Block id={toKebabCase(blockName)} {...block} />
                </BlockSpacing>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
