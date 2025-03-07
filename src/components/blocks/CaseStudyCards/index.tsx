import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { BlockSpacing } from '@components/BlockSpacing/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { PixelBackground } from '@components/PixelBackground/index'
import { RichText } from '@components/RichText/index'
import Link from 'next/link'
import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'caseStudyCards' }>

export const CaseStudyCards: React.FC<Props> = (props) => {
  const { caseStudyCardFields, hideBackground, padding } = props

  if (caseStudyCardFields?.cards && caseStudyCardFields?.cards?.length > 0) {
    return (
      <BlockWrapper
        className={classes.caseStudyCards}
        hideBackground={hideBackground}
        padding={padding}
        settings={caseStudyCardFields.settings}
      >
        <BackgroundGrid />
        <Gutter className={classes.gutter}>
          <BackgroundScanline className={classes.scanline} />
          {caseStudyCardFields?.cards?.length > 0 && (
            <div className={classes.cards}>
              {caseStudyCardFields.cards.map((card, i) => {
                if (typeof card.caseStudy === 'object' && card.caseStudy !== null) {
                  return (
                    <Link
                      className={classes.card}
                      href={`/case-studies/${card.caseStudy.slug}`}
                      key={i}
                      prefetch={false}
                    >
                      <RichText className={classes.content} content={card.richText} />
                      <div className={classes.media}>
                        {typeof card.caseStudy.featuredImage !== 'string' && (
                          <Media fill resource={card.caseStudy.featuredImage} />
                        )}
                      </div>
                    </Link>
                  )
                }

                return null
              })}
            </div>
          )}
        </Gutter>
      </BlockWrapper>
    )
  }

  return null
}
