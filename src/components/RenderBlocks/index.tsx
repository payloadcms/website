'use client'

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { BannerBlock } from '@blocks/Banner'
import { BlogContent } from '@blocks/BlogContent'
import { BlogMarkdown } from '@blocks/BlogMarkdown'
import { Callout } from '@blocks/Callout'
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
import { HoverCards } from '@blocks/HoverCards'
import { HoverHighlights } from '@blocks/HoverHighlights'
import { LinkGrid } from '@blocks/LinkGrid'
import { LogoGrid } from '@blocks/LogoGrid'
import { MediaBlock } from '@blocks/MediaBlock'
import { MediaContent } from '@blocks/MediaContent'
import { MediaContentAccordion } from '@blocks/MediaContentAccordion'
import { Pricing } from '@blocks/Pricing'
import { RelatedPosts, RelatedPostsBlock } from '@blocks/RelatedPosts'
import { ReusableContentBlock } from '@blocks/ReusableContent'
import { Slider } from '@blocks/Slider'
import { Statement } from '@blocks/Statement'
import { Steps } from '@blocks/Steps'
import { StickyHighlights } from '@blocks/StickyHighlights'
import { toKebabCase } from '@utilities/to-kebab-case'

import { PaddingProps, Settings } from '@components/BlockWrapper'
import { getFieldsKeyFromBlock } from '@components/RenderBlocks/utilities'
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
  callout: Callout,
  code: CodeBlock,
  content: ContentBlock,
  contentGrid: ContentGrid,
  form: FormBlock,
  slider: Slider,
  cardGrid: CardGrid,
  mediaContent: MediaContent,
  mediaContentAccordion: MediaContentAccordion,
  steps: Steps,
  stickyHighlights: StickyHighlights,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  codeFeature: CodeFeature,
  cta: CallToAction,
  linkGrid: LinkGrid,
  logoGrid: LogoGrid,
  reusableContentBlock: ReusableContentBlock,
  pricing: Pricing,
  relatedPosts: RelatedPosts,
  exampleTabs: ExampleTabs,
  featuredMediaGallery: FeaturedMediaGallery,
  statement: Statement,
}

export type BlocksProp = ReusableContent['layout'][0] | ReusableContentBlockType | RelatedPostsBlock

type Props = {
  blocks: BlocksProp[]
  disableOuterSpacing?: true
  hero?: Page['hero']
  disableGutter?: boolean
  heroTheme?: Page['hero']['theme']
  layout?: 'page' | 'post'
}

export const RenderBlocks: React.FC<Props> = props => {
  const { blocks, disableOuterSpacing, disableGutter, hero, layout } = props
  const heroTheme = hero?.type === 'home' ? 'dark' : hero?.theme
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()
  const [docPadding, setDocPadding] = React.useState(0)
  const docRef = React.useRef<HTMLDivElement>(null)

  // This is needed to avoid hydration errors when the theme is not yet available
  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const paddingExceptions = useMemo(
    () => [
      'banner',
      'blogContent',
      'blogMarkdown',
      'code',
      'reusableContentBlock',
      'caseStudyParallax',
    ],
    [],
  )

  const getPaddingProps = useCallback(
    (block: (typeof blocks)[number], index: number) => {
      const isFirst = index === 0
      const isLast = index + 1 === blocks.length

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

      if (isLast) bottomPadding = 'large'

      if (paddingExceptions.includes(block.blockType)) bottomPadding = 'large'

      return {
        top: topPadding ?? undefined,
        bottom: bottomPadding ?? undefined,
      }
    },
    [themeState, heroTheme, blocks, paddingExceptions],
  )

  React.useEffect(() => {
    if (docRef.current?.offsetWidth === undefined) return
    setDocPadding(layout === 'post' ? Math.round(docRef.current?.offsetWidth / 8) - 2 : 0)
  }, [docRef.current?.offsetWidth, layout])

  const marginAdjustment = {
    marginLeft: `${docPadding / -1 - 1}px`,
    marginRight: `${docPadding / -1 - 1}px`,
    paddingLeft: docPadding,
    paddingRight: docPadding,
  }

  if (hasBlocks) {
    return (
      <Fragment>
        <div ref={docRef}>
          {blocks.map((block, index) => {
            const { blockName, blockType } = block

            if (blockType && blockType in blockComponents) {
              const Block = blockComponents[blockType]

              if (Block) {
                return (
                  <Block
                    key={index}
                    id={toKebabCase(blockName)}
                    {...block}
                    padding={getPaddingProps(block, index)}
                    marginAdjustment={marginAdjustment}
                    disableGutter={disableGutter}
                  />
                )
              }
            }
            return null
          })}
        </div>
      </Fragment>
    )
  }

  return null
}
