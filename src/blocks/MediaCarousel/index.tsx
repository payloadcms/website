import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Slide, SliderTrack } from '@faceless-ui/slider'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type MediaCarouselProps = Extract<Page['layout'][0], { blockType: 'mediaCarouselBlock' }>

export const MediaCarouselBlock: React.FC<MediaCarouselProps> = ({ mediaCarouselBlockFields }) => {
  const { alignment, leader, title, description, links, mediaSlides } =
    mediaCarouselBlockFields || {}

  const [currentSlide, setCurrentSlide] = useState(0)
  const autoplayInterval = 5000 // 5 seconds for example
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const hasLinks = Array.isArray(links) && links.length > 0
  const hasMediaSlides = Array.isArray(mediaSlides) && mediaSlides.length > 0

  return (
    <Gutter>
      <div className={['grid'].filter(Boolean).join(' ')}>
        {alignment === 'mediaCarouselContent' ? (
          <Fragment>
            <div
              className={[classes.mediaSlides, classes.right, 'cols-12 start-1 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {/* This is where the slider will go */}
            </div>
            <div
              className={[classes.content, 'cols-4 start-13 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {leader && <div className={classes.leader}>{leader}</div>}
              {title && <div className={classes.title}>{title}</div>}
              {description && <RichText className={classes.description} content={description} />}
              {hasLinks && (
                <ul className={classes.links}>
                  {links.map(({ link }, i) => {
                    return (
                      <li key={i}>
                        <Button {...link} appearance="default" />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className={[classes.content, 'cols-4 start-1 cols-m-8'].filter(Boolean).join(' ')}>
              {leader && <div className={classes.leader}>{leader}</div>}
              {title && <div className={classes.title}>{title}</div>}
              {description && <RichText className={classes.description} content={description} />}
              {hasLinks && (
                <ul className={classes.links}>
                  {links.map(({ link }, i) => {
                    return (
                      <li key={i}>
                        <Button {...link} appearance="default" />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <div
              className={[classes.mediaSlides, classes.right, 'cols-12 start-5 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {/* This is where the slider will go */}
            </div>
          </Fragment>
        )}
      </div>
    </Gutter>
  )
}
