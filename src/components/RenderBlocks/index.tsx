'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { BannerBlock } from '@blocks/Banner'
import { BlogContent } from '@blocks/BlogContent'
import { BlogMarkdown } from '@blocks/BlogMarkdown'
import { CallToAction } from '@blocks/CallToAction'
import { CardGrid } from '@blocks/CardGrid'
import { CaseStudiesHighlightBlock } from '@blocks/CaseStudiesHighlight'
import { CaseStudyCards } from '@blocks/CaseStudyCards'
import { CaseStudyParallax } from '@blocks/CaseStudyParallax'
import { CodeBlock } from '@blocks/CodeBlock'
import { CodeFeature } from '@blocks/CodeFeature'
import { ContentBlock } from '@blocks/Content'
import { ContentGrid } from '@blocks/ContentGrid'
import { ExampleTabs } from '@blocks/ExampleTabs'
import { FeaturedMediaGallery } from '@blocks/FeaturedMediaGallery'
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

import { PaddingProps, Settings } from '@components/BlockWrapper'
import { Page, ReusableContent } from '@root/payload-types'
import { useThemePreference } from '@root/providers/Theme'
import { Theme } from '@root/providers/Theme/types'

type ReusableContentBlockType = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

const blockComponents = {
  banner: BannerBlock,
  blogContent: BlogContent,
  blogMarkdown: BlogMarkdown,
  caseStudiesHighlight: CaseStudiesHighlightBlock,
  caseStudyCards: CaseStudyCards,
  caseStudyParallax: CaseStudyParallax,
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
  exampleTabs: ExampleTabs,
  featuredMediaGallery: FeaturedMediaGallery,
}

type Props = {
  blocks: (ReusableContent['layout'][0] | ReusableContentBlockType | RelatedPostsBlock)[]
  disableOuterSpacing?: true
  heroTheme?: Page['hero']['theme']
}

function getFieldsKeyFromBlock(
  block: ReusableContent['layout'][0] | ReusableContentBlockType | RelatedPostsBlock,
) {
  if (!block) return ''

  const keys = Object.keys(block)

  const key = keys.find(value => {
    return value.endsWith('Fields')
  })

  return key ?? ''
}

export const RenderBlocks: React.FC<Props> = props => {
  const { blocks, disableOuterSpacing, heroTheme } = props
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()

  // This is needed to avoid hydration errors when the theme is not yet available
  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const getPaddingProps = useCallback(
    (block: (typeof blocks)[number], index: number) => {
      const isFirst = index === 0

      const theme = themeState

      let topPadding: PaddingProps['top']
      let bottomPadding: PaddingProps['bottom']

      let previousBlock = !isFirst ? blocks[index - 1] : null
      let previousBlockKey, previousBlockSettings

      let nextBlock =
        index + 1 < blocks.length ? blocks[Math.min(index + 1, blocks.length - 1)] : null
      let nextBlockKey, nextBlockSettings

      let currentBlockSettings: Settings = block[getFieldsKeyFromBlock(block)]?.settings
      let currentBlockTheme

      currentBlockTheme = currentBlockSettings?.theme ?? theme

      if (previousBlock) {
        previousBlockKey = getFieldsKeyFromBlock(previousBlock)
        previousBlockSettings = previousBlock[previousBlockKey]?.settings
      }

      if (nextBlock) {
        nextBlockKey = getFieldsKeyFromBlock(nextBlock)
        nextBlockSettings = nextBlock[nextBlockKey]?.settings
      }

      // If first block in the layout, add top padding based on the hero
      if (isFirst) {
        if (heroTheme) {
          topPadding = heroTheme === currentBlockTheme ? 'small' : 'large'
        } else {
          topPadding = theme === currentBlockTheme ? 'small' : 'large'
        }
      } else {
        if (previousBlockSettings?.theme) {
          topPadding = currentBlockTheme === previousBlockSettings?.theme ? 'small' : 'large'
        } else {
          topPadding = theme === currentBlockTheme ? 'small' : 'large'
        }
      }

      if (nextBlockSettings?.theme) {
        bottomPadding = currentBlockTheme === nextBlockSettings?.theme ? 'small' : 'large'
      } else {
        bottomPadding = theme === currentBlockTheme ? 'small' : 'large'
      }

      return {
        top: topPadding ?? undefined,
        bottom: bottomPadding ?? undefined,
      }
    },
    [themeState, heroTheme, blocks],
  )

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            // Keeping this here for now in case it's needed in the future
            /* const hasSpacing = ![
              'banner',
              'blogContent',
              'blogMarkdown',
              'code',
              'reusableContentBlock',
            ].includes(blockType) */

            if (Block) {
              return (
                <Block
                  key={index}
                  id={toKebabCase(blockName)}
                  {...block}
                  padding={getPaddingProps(block, index)}
                />
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
