'use client'

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { BannerBlock } from '@blocks/Banner/index.js'
import { BlogContent } from '@blocks/BlogContent/index.js'
import { BlogMarkdown } from '@blocks/BlogMarkdown/index.js'
import { Callout } from '@blocks/Callout/index.js'
import { CallToAction } from '@blocks/CallToAction/index.js'
import { CardGrid } from '@blocks/CardGrid/index.js'
import { CaseStudiesHighlightBlock } from '@blocks/CaseStudiesHighlight/index.js'
import { CaseStudyCards } from '@blocks/CaseStudyCards/index.js'
import { CaseStudyParallax } from '@blocks/CaseStudyParallax/index.js'
import { CodeBlock } from '@blocks/CodeBlock/index.js'
import { CodeFeature } from '@blocks/CodeFeature/index.js'
import { ContentBlock } from '@blocks/Content/index.js'
import { ContentGrid } from '@blocks/ContentGrid/index.js'
import { FormBlock } from '@blocks/FormBlock/index.js'
import { HoverCards } from '@blocks/HoverCards/index.js'
import { HoverHighlights } from '@blocks/HoverHighlights/index.js'
import { LinkGrid } from '@blocks/LinkGrid/index.js'
import { LogoGrid } from '@blocks/LogoGrid/index.js'
import { MediaBlock } from '@blocks/MediaBlock/index.js'
import { MediaContent } from '@blocks/MediaContent/index.js'
import { MediaContentAccordion } from '@blocks/MediaContentAccordion/index.js'
import { Pricing } from '@blocks/Pricing/index.js'
import { RelatedPosts, RelatedPostsBlock } from '@blocks/RelatedPosts/index.js'
import { ReusableContentBlock } from '@blocks/ReusableContent/index.js'
import { Slider } from '@blocks/Slider/index.js'
import { Statement } from '@blocks/Statement/index.js'
import { Steps } from '@blocks/Steps/index.js'
import { StickyHighlights } from '@blocks/StickyHighlights/index.js'
import { toKebabCase } from '@utilities/to-kebab-case.js'

import { PaddingProps, Settings } from '@components/BlockWrapper/index.js'
import { getFieldsKeyFromBlock } from '@components/RenderBlocks/utilities.js'
import { Page, ReusableContent } from '@root/payload-types.js'
import { useThemePreference } from '@root/providers/Theme/index.js'
import { Theme } from '@root/providers/Theme/types.js'

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
  statement: Statement,
}

export type BlocksProp = ReusableContent['layout'][0] | ReusableContentBlockType | RelatedPostsBlock

type Props = {
  blocks: BlocksProp[]
  disableOuterSpacing?: true
  hero?: Page['hero']
  disableGutter?: boolean
  disableGrid?: boolean
  heroTheme?: Page['hero']['theme']
  layout?: 'page' | 'post'
  customId?: string | null
}

export const RenderBlocks: React.FC<Props> = props => {
  const { blocks, disableOuterSpacing, disableGutter, disableGrid, hero, layout, customId } = props
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

      if (previousBlock?.blockType === 'hoverHighlights') topPadding = 'large'

      if (nextBlock?.blockType === 'hoverHighlights') bottomPadding = 'large'

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
    marginLeft: `${docPadding / -1}px`,
    marginRight: `${docPadding / -1}px`,
    paddingLeft: docPadding,
    paddingRight: docPadding,
  }

  const hideBackground = hero?.type === 'three'

  if (hasBlocks) {
    return (
      <Fragment>
        <div ref={docRef} id={customId ?? undefined}>
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
                    hideBackground={hideBackground}
                    padding={getPaddingProps(block, index)}
                    marginAdjustment={{
                      ...marginAdjustment,
                      ...(blockType === 'banner' ? { paddingLeft: 32, paddingRight: 32 } : {}),
                    }}
                    disableGutter={disableGutter}
                    disableGrid={disableGrid}
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
