import * as React from 'react'
import Link from 'next/link'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockSpacing } from '@components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'caseStudyCards' }> & {
  padding?: PaddingProps
}

export const CaseStudyCards: React.FC<Props> = props => {
  const { caseStudyCardFields, padding } = props

  if (caseStudyCardFields?.cards && caseStudyCardFields?.cards?.length > 0) {
    return (
      <BlockWrapper
        className={classes.caseStudyCards}
        settings={caseStudyCardFields.settings}
        padding={padding}
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
                      href={`/case-studies/${card.caseStudy.slug}`}
                      key={i}
                      className={classes.card}
                      prefetch={false}
                    >
                      <RichText className={classes.content} content={card.richText} />
                      <div className={classes.media}>
                        {typeof card.caseStudy.featuredImage !== 'string' && (
                          <Media resource={card.caseStudy.featuredImage} fill />
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
