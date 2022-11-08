'use client'

import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'
import { Page, ReusableContent } from '../../payload-types'
import { toKebabCase } from '../../utilities/to-kebab-case'
import { BlockSpacing } from '../BlockSpacing'

type ReusableContentBlock = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

const blockComponents = {
  banner: dynamic(() => import('../blocks/Banner').then(mod => mod.BannerBlock)),
  blogContent: dynamic(() => import('../blocks/BlogContent').then(mod => mod.BlogContent)),
  blogMarkdown: dynamic(() => import('../blocks/BlogMarkdown').then(mod => mod.BlogMarkdown)),
  caseStudiesHighlight: dynamic(() =>
    import('../blocks/CaseStudiesHighlight').then(mod => mod.CaseStudiesHighlightBlock)),
  caseStudyCards: dynamic(() => import('../blocks/CaseStudyCards').then(mod => mod.CaseStudyCards)),
  mediaBlock: dynamic(() => import('../blocks/MediaBlock').then(mod => mod.MediaBlock)),
  code: dynamic(() => import('../blocks/CodeBlock').then(mod => mod.CodeBlock)),
  content: dynamic(() => import('../blocks/Content').then(mod => mod.ContentBlock)),
  contentGrid: dynamic(() => import('../blocks/ContentGrid').then(mod => mod.ContentGrid)),
  form: dynamic(() => import('../blocks/FormBlock').then(mod => mod.FormBlock)),
  slider: dynamic(() => import('../blocks/Slider').then(mod => mod.Slider)),
  cardGrid: dynamic(() => import('../blocks/CardGrid').then(mod => mod.CardGrid)),
  mediaContent: dynamic(() => import('../blocks/MediaContent').then(mod => mod.MediaContent)),
  steps: dynamic(() => import('../blocks/Steps').then(mod => mod.Steps)),
  stickyHighlights: dynamic(() =>
    import('../blocks/StickyHighlights').then(mod => mod.StickyHighlights),
  ),
  hoverHighlights: dynamic(() =>
    import('../blocks/HoverHighlights').then(mod => mod.HoverHighlights),),
  codeFeature: dynamic(() => import('../blocks/CodeFeature').then(mod => mod.CodeFeature)),
}

type Props = {
  blocks: (ReusableContent['layout'][0] | ReusableContentBlock)[]
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

            const hasSpacing = !['banner', 'blogContent', 'blogMarkdown', 'code'].includes(
              blockType,
            )

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
