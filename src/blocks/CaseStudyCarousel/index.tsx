'use client'
import * as React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockSpacing } from '@components/BlockSpacing'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'caseStudyCarousel' }>

type StickyBlockProps = Props & {
  currentIndex: number
}

export const QuoteStickyBlock: React.FC<StickyBlockProps> = props => {
  const { caseStudyCarouselFields, currentIndex } = props
  /* const slider = useSlider() */

  if (caseStudyCarouselFields?.cards && caseStudyCarouselFields?.cards?.length > 0) {
    return (
      <div className={[classes.stickyBlock, 'grid'].filter(Boolean).join(' ')}>
        {caseStudyCarouselFields?.cards.map((card, index) => {
          return (
            <div
              key={index}
              className={[
                classes.stickyBlockItem,
                currentIndex === index && classes.isVisible,
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
  const [index, setIndex] = React.useState<number>(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cardsRef = React.useRef<HTMLDivElement[]>([])
  const id = React.useId()

  React.useEffect(() => {
    let intersectionObserver: IntersectionObserver

    if (cardsRef.current?.length) {
      intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
              setIndex(entry.target.dataset.index ? parseInt(entry.target.dataset.index) : 0)
            }
          })
        },
        {
          rootMargin: '0px',
          threshold: 0.75,
        },
      )

      cardsRef.current.forEach(card => {
        intersectionObserver.observe(card)
      })
    }
  }, [containerRef, cardsRef])

  const handleTabClick =
    (index: number): React.MouseEventHandler<HTMLButtonElement> =>
    event => {
      if (cardsRef.current?.length) {
        cardsRef.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      }
    }

  if (caseStudyCarouselFields?.cards && caseStudyCarouselFields?.cards?.length > 0) {
    return (
      <BlockSpacing className={classes.caseStudyCards}>
        <Gutter className={classes.mainGutter}>
          <BackgroundGrid />

          <QuoteStickyBlock currentIndex={index} {...props} />

          <div className={classes.mainTrack} ref={containerRef}>
            {caseStudyCarouselFields?.cards.map((card, index) => {
              return (
                <div
                  id={`${id}${index}`}
                  ref={el => (cardsRef.current[index] = el)}
                  key={index}
                  data-index={index}
                  className={[classes.card, 'grid'].filter(Boolean).join(' ')}
                >
                  <div className={[classes.media, 'cols-8 start-9'].filter(Boolean).join(' ')}>
                    {typeof card.previewImage !== 'string' && (
                      <>
                        <Media resource={card.previewImage} fill />
                        <Media resource={card.previewImage} />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className={[classes.nav].filter(Boolean).join(' ')}>
            <BackgroundGrid className={classes.navBackgroundGrid} />
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
                        onClick={handleTabClick(index)}
                      />
                    )}
                  </div>
                )
              })}
            </Gutter>
          </div>
        </Gutter>
      </BlockSpacing>
    )
  }

  return null
}
