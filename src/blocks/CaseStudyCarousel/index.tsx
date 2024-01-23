import * as React from 'react'
import { Slide, SliderProvider, SliderTrack } from '@faceless-ui/slider'
import Link from 'next/link'

import { BlockSpacing } from '@components/BlockSpacing'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'caseStudyCarousel' }>

export const CaseStudyCarousel: React.FC<Props> = props => {
  const { caseStudyCarouselFields } = props

  if (caseStudyCarouselFields?.cards && caseStudyCarouselFields?.cards?.length > 0) {
    return (
      <BlockSpacing className={classes.caseStudyCards}>
        <Gutter>
          test:
          <SliderProvider slidesToShow={1}>
            <SliderTrack>
              {caseStudyCarouselFields?.cards?.length > 0 && (
                <div className={classes.cards}>
                  {caseStudyCarouselFields?.cards.map((card, index) => {
                    return <Slide index={index}>{card.tabLabel}</Slide>
                  })}
                </div>
              )}
            </SliderTrack>
          </SliderProvider>
        </Gutter>
      </BlockSpacing>
    )
  }

  return null
}
