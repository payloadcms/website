'use client'
import * as React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockSpacing } from '@components/BlockSpacing'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { Page } from '@root/payload-types'
import { useResize } from '@root/utilities/use-resize'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'caseStudyCarousel' }>

type StickyBlockProps = Props & {
  currentIndex: number
}

export const QuoteStickyBlock: React.FC<StickyBlockProps> = props => {
  const { caseStudyCarouselFields, currentIndex } = props

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
  const [activeIndex, setActiveIndex] = React.useState<number>(0)
  const [scrollProgress, setScrollProgress] = React.useState<number>(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cardsRef = React.useRef<HTMLDivElement[]>([])
  const navGridRef = React.useRef<HTMLDivElement>(null)
  const navButtonsRef = React.useRef<HTMLDivElement[]>([])
  const id = React.useId()
  const containerWidth = useResize(containerRef)

  React.useEffect(() => {
    if (scrollProgress) {
      let newIndex = 0
      if (scrollProgress < 25) {
        newIndex = 0
      }
      if (scrollProgress > 25 && scrollProgress < 50) {
        newIndex = 1
      }
      if (scrollProgress > 50 && scrollProgress < 75) {
        newIndex = 2
      }
      if (scrollProgress > 75) {
        newIndex = 3
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)

        if (navButtonsRef.current?.length && navGridRef.current) {
          /* This logic is in a timeout so that on mobile scroll() doesnt block the other scrollIntoView function */
          setTimeout(() => {
            const target = navButtonsRef.current[newIndex]
            const offset = target.offsetLeft > 0 ? target.offsetLeft : 0
            navGridRef.current?.scroll(offset, 0)
          }, 500)
        }
      }
    }
  }, [scrollProgress, navButtonsRef, navGridRef])

  React.useEffect(() => {
    let intersectionObserver: IntersectionObserver

    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollHeight } = containerRef.current
        const totalScrollableDistance = containerRef.current.getBoundingClientRect().bottom
        const midPoint = window.innerHeight - 20 * 4
        const totalDocScrollLength = scrollHeight + 20 * 8 - midPoint
        const anchor = totalScrollableDistance - midPoint

        if (anchor > 0) {
          const scrollPosition = (anchor / totalDocScrollLength) * 100

          if (scrollPosition > 100) setScrollProgress(0)
          else {
            setScrollProgress(100 - scrollPosition)
          }
        } else {
          setScrollProgress(100)
        }
        if (totalScrollableDistance < totalDocScrollLength) {
        }
      }
    }

    if (containerRef.current) {
      intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              window.addEventListener('scroll', handleScroll)
            } else {
              window.removeEventListener('scroll', handleScroll)
            }
          })
        },
        {
          rootMargin: '0px',
        },
      )

      intersectionObserver.observe(containerRef.current)
    }

    return () => {
      intersectionObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, containerWidth])

  const handleTabClick =
    (index: number): React.MouseEventHandler<HTMLButtonElement> =>
    event => {
      if (cardsRef.current?.length) {
        cardsRef.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }
    }

  const variableStyle = { '--progress-width': `${scrollProgress}%` } as React.CSSProperties

  if (caseStudyCarouselFields?.cards && caseStudyCarouselFields?.cards?.length > 0) {
    return (
      <BlockSpacing className={classes.caseStudyCards}>
        <Gutter className={classes.mainGutter}>
          <BackgroundGrid />

          <div className={classes.mainTrack} ref={containerRef}>
            <QuoteStickyBlock currentIndex={activeIndex} {...props} />
            {caseStudyCarouselFields?.cards.map((card, index) => {
              const isVisible = index === activeIndex
              return (
                <div
                  id={`${id}${index}`}
                  ref={el => {
                    if (el) cardsRef.current[index] = el
                  }}
                  key={index}
                  data-index={index}
                  className={[
                    classes.card,
                    'grid ',
                    isVisible && classes.isVisible,
                    index === 0 ? classes.isFirst : 'cols-16',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={[classes.media, 'cols-8 start-9'].filter(Boolean).join(' ')}>
                    {typeof card.previewImage !== 'string' && (
                      <>
                        <Media resource={card.previewImage} />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className={classes.navWrapper}>
            <div className={[classes.nav].filter(Boolean).join(' ')} style={variableStyle}>
              <BackgroundGrid className={classes.navBackgroundGrid} />

              <Gutter>
                <div
                  className={[classes.navGrid, 'grid'].filter(Boolean).join(' ')}
                  ref={navGridRef}
                >
                  <div className={[classes.progressIndicator].filter(Boolean).join(' ')} />
                  {caseStudyCarouselFields?.cards.map((card, index) => {
                    return (
                      <div
                        key={index}
                        className={[classes.navItem, `cols-4 cols-m-8`].filter(Boolean).join(' ')}
                        ref={el => {
                          if (el) navButtonsRef.current[index] = el
                        }}
                      >
                        {typeof card.caseStudy !== 'string' && (
                          <Button
                            icon="arrow"
                            label={card.tabLabel}
                            hideHorizontalBorders
                            className={[
                              classes.navButton,
                              activeIndex === index && classes.isActive,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            el="button"
                            labelClassName={classes.navButtonLabel}
                            onClick={handleTabClick(index)}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </Gutter>
            </div>
          </div>
        </Gutter>
      </BlockSpacing>
    )
  }

  return null
}
