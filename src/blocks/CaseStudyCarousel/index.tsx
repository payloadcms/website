'use client'
import * as React from 'react'
import { useState } from 'react'
import { Slide, SliderProgress, SliderProvider, SliderTrack, useSlider } from '@faceless-ui/slider'
import Link from 'next/link'

import { BlockSpacing } from '@components/BlockSpacing'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'caseStudyCarousel' }>

export const QuoteStickyBlock: React.FC<Props> = props => {
  const { caseStudyCarouselFields } = props
  const slider = useSlider()

  if (caseStudyCarouselFields?.cards && caseStudyCarouselFields?.cards?.length > 0) {
    return (
      <div className={[classes.stickyBlock, 'grid'].filter(Boolean).join(' ')}>
        {caseStudyCarouselFields?.cards.map((card, index) => {
          return (
            <div
              key={index}
              className={[
                classes.stickyBlockItem,
                slider.currentSlideIndex === index && classes.isVisible,
                'cols-8',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={classes.quote}>{card.quote}</div>

              <div className={classes.authorWrapper}>
                <div className={classes.media}>
                  {typeof card.logo !== 'string' && <Media resource={card.logo} />}
                </div>
                <div className={classes.author}>{card.author}</div>
              </div>

              {typeof card.caseStudy !== 'string' && (
                <Button
                  label={'Read the case study'}
                  hideHorizontalBorders
                  appearance={'primary'}
                  className="isHovered"
                  href={`/case-studies/${card.caseStudy.slug}`}
                  el="a"
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export const CaseStudyCarousel: React.FC<Props> = props => {
  const { caseStudyCarouselFields } = props
  const [index, setIndex] = useState<number>(0)

  if (caseStudyCarouselFields?.cards && caseStudyCarouselFields?.cards?.length > 0) {
    return (
      <BlockSpacing className={classes.caseStudyCards}>
        <Gutter>
          <SliderProvider slidesToShow={1} currentSlideIndex={index}>
            <QuoteStickyBlock {...props} />
            <SliderTrack
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                //alignItems: 'center',
                //marginBottom: '10px',
              }}
              className={classes.mainTrack}
            >
              {caseStudyCarouselFields?.cards.map((card, index) => {
                return (
                  <Slide index={index} className={[classes.card, 'grid'].filter(Boolean).join(' ')}>
                    <div className={[classes.media, 'cols-8 start-9'].filter(Boolean).join(' ')}>
                      {typeof card.previewImage !== 'string' && (
                        <>
                          <Media resource={card.previewImage} fill />
                          <Media resource={card.previewImage} />
                        </>
                      )}
                    </div>
                  </Slide>
                )
              })}
            </SliderTrack>

            <div className={[classes.nav].filter(Boolean).join(' ')}>
              <Gutter className="grid">
                {caseStudyCarouselFields?.cards.map((card, index) => {
                  return (
                    <div
                      key={index}
                      className={[classes.navItem, `cols-4`].filter(Boolean).join(' ')}
                    >
                      {typeof card.caseStudy !== 'string' && (
                        <Button
                          icon="arrow"
                          label={card.tabLabel}
                          hideHorizontalBorders
                          className={[classes.navButton].filter(Boolean).join(' ')}
                          el="button"
                          onClick={() => {
                            setIndex(index)
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </Gutter>
            </div>
          </SliderProvider>
        </Gutter>
      </BlockSpacing>
    )
  }

  return null
}
