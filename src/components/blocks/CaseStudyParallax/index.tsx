'use client'
import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import MediaParallax from '@components/MediaParallax/index'
import { QuoteIconAlt } from '@root/icons/QuoteIconAlt/index'
import { useResize } from '@root/utilities/use-resize'
import * as React from 'react'

import classes from './index.module.scss'

type ContentProps = Extract<Page['layout'][0], { blockType: 'caseStudyParallax' }>

type Props = {
  className?: string
  hideBackground?: boolean
  padding: PaddingProps
} & ContentProps

type StickyBlockProps = {
  currentIndex: number
} & ContentProps

type QuoteProps = {
  className?: string
  isVisible?: boolean
  item: any
}

export const QuoteBlock: React.FC<QuoteProps> = (props) => {
  const { className, isVisible, item } = props
  return (
    <div
      aria-hidden={!isVisible}
      className={[isVisible && classes.isVisible, 'cols-8 grid', className]
        .filter(Boolean)
        .join(' ')}
    >
      <QuoteIconAlt className={classes.quoteIcon} />
      <div
        aria-hidden={!isVisible}
        className={[classes.quote, 'cols-12'].filter(Boolean).join(' ')}
      >
        &ldquo;{item.quote}&rdquo;
      </div>

      <div
        aria-hidden={!isVisible}
        className={[classes.authorWrapper, 'cols-12'].filter(Boolean).join(' ')}
      >
        <div className={classes.media}>
          {typeof item.logo !== 'string' && <Media className={classes.logo} resource={item.logo} />}
        </div>
        <div className={classes.author}>{item.author}</div>
      </div>

      {typeof item.caseStudy !== 'string' && item?.caseStudy?.slug && (
        <div className={['cols-8 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
          <Button
            appearance={'default'}
            aria-hidden={!isVisible}
            className={classes.caseStudyButton}
            disabled={!isVisible}
            el="a"
            hideHorizontalBorders
            href={`/case-studies/${item?.caseStudy?.slug}`}
            icon="arrow"
            label={'Read the case study'}
          />
        </div>
      )}
    </div>
  )
}

export const QuoteStickyBlock: React.FC<StickyBlockProps> = (props) => {
  const { caseStudyParallaxFields, currentIndex } = props

  if (caseStudyParallaxFields?.items && caseStudyParallaxFields?.items?.length > 0) {
    return (
      <div className={[classes.stickyBlock, 'grid cols-16 cols-m-8'].filter(Boolean).join(' ')}>
        {caseStudyParallaxFields?.items.map((item, index) => {
          const isVisible = index === currentIndex

          return (
            <QuoteBlock
              className={classes.stickyBlockItem}
              isVisible={isVisible}
              item={item}
              key={index}
            />
          )
        })}
      </div>
    )
  }
  return null
}

export const CaseStudyParallax: React.FC<Props> = (props) => {
  const { caseStudyParallaxFields, hideBackground, padding } = props
  const activeIndex = React.useRef(0)
  const [scrollProgress, setScrollProgress] = React.useState<number>(0)
  const [delayNavScroll, setDelayNavScroll] = React.useState<boolean>(false)
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

      if (newIndex !== activeIndex.current) {
        activeIndex.current = newIndex

        if (navButtonsRef.current?.length && navGridRef.current) {
          if (delayNavScroll) {
            /* This logic is in a timeout so that on mobile scroll() doesn't block the other scrollIntoView function */
            setTimeout(() => {
              const target = navButtonsRef.current[newIndex]
              const offset = target.offsetLeft > 0 ? target.offsetLeft : 0
              navGridRef.current?.scroll(offset, 0)
              setDelayNavScroll(false)
            }, 500)
          } else {
            const target = navButtonsRef.current[newIndex]
            const offset = target.offsetLeft > 0 ? target.offsetLeft : 0
            navGridRef.current?.scroll(offset, 0)
          }
        }
      }
    }
  }, [scrollProgress, navButtonsRef, navGridRef, delayNavScroll])

  React.useEffect(() => {
    let intersectionObserver: IntersectionObserver
    let scheduledAnimationFrame = false

    const updateScrollProgress = () => {
      if (containerRef.current) {
        const { scrollHeight } = containerRef.current
        const totalScrollableDistance = containerRef.current.getBoundingClientRect().bottom
        const midPoint = window.innerHeight - 20 * 4
        const totalDocScrollLength = scrollHeight + 20 * 8 - midPoint
        const anchor = totalScrollableDistance - midPoint

        if (anchor > 0) {
          const scrollPosition = (anchor / totalDocScrollLength) * 100

          if (scrollPosition > 100) {
            setScrollProgress(0)
          } else {
            setScrollProgress(100 - scrollPosition)
          }
        } else {
          setScrollProgress(100)
        }
        if (totalScrollableDistance < totalDocScrollLength) {
        }
      }

      scheduledAnimationFrame = false
    }

    const handleScroll = () => {
      if (scheduledAnimationFrame) {
        return
      }

      scheduledAnimationFrame = true
      requestAnimationFrame(updateScrollProgress)
    }

    if (containerRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
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
    (event) => {
      if (cardsRef.current?.length) {
        setDelayNavScroll(true)
        cardsRef.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }
    }

  const variableStyle = { '--progress-width': `${scrollProgress}%` } as React.CSSProperties

  if (caseStudyParallaxFields?.items && caseStudyParallaxFields?.items?.length > 0) {
    return (
      <BlockWrapper
        className={classes.wrapper}
        hideBackground={hideBackground}
        padding={padding}
        settings={caseStudyParallaxFields.settings}
      >
        <BackgroundGrid zIndex={0} />
        <Gutter className={classes.mainGutter}>
          <Gutter
            className={[classes.scanlineWrapper, 'grid cols-8 start-9'].filter(Boolean).join(' ')}
          >
            <BackgroundScanline
              className={[classes.scanline, 'cols-8 start-11'].filter(Boolean).join(' ')}
            />
          </Gutter>
          <div className={[classes.mainTrack, 'grid'].filter(Boolean).join(' ')} ref={containerRef}>
            <QuoteStickyBlock currentIndex={activeIndex.current} {...props} />
            {caseStudyParallaxFields?.items.map((item, index) => {
              const isVisible = index === activeIndex.current
              return (
                <div
                  className={[
                    classes.card,
                    'grid ',
                    isVisible && classes.isVisible,
                    index === 0 ? classes.isFirst : 'cols-16 cols-m-8',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  data-index={index}
                  id={`${id}${index}`}
                  key={index}
                  ref={(el) => {
                    if (el) {
                      cardsRef.current[index] = el
                    }
                  }}
                >
                  {item.images?.length && item.images.length > 0 ? (
                    <MediaParallax
                      className={[classes.media, 'cols-8 start-9 start-m-1']
                        .filter(Boolean)
                        .join(' ')}
                      media={item.images}
                    />
                  ) : null}

                  <QuoteBlock className={classes.mobileQuoteItem} item={item} />
                </div>
              )
            })}
          </div>

          <div className={classes.navWrapper}>
            <div className={[classes.nav].filter(Boolean).join(' ')} style={variableStyle}>
              <BackgroundGrid className={classes.navBackgroundGrid} zIndex={0} />

              <Gutter>
                <div
                  className={[classes.navGrid, 'grid'].filter(Boolean).join(' ')}
                  ref={navGridRef}
                >
                  <div className={[classes.progressIndicator].filter(Boolean).join(' ')} />
                  {caseStudyParallaxFields?.items.map((item, index) => {
                    return (
                      <div
                        className={[classes.navItem, `cols-4 cols-m-8`].filter(Boolean).join(' ')}
                        key={index}
                        ref={(el) => {
                          if (el) {
                            navButtonsRef.current[index] = el
                          }
                        }}
                      >
                        {typeof item.caseStudy !== 'string' && (
                          <Button
                            className={[
                              classes.navButton,
                              activeIndex.current === index && classes.isActive,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            el="button"
                            hideHorizontalBorders
                            icon="arrow"
                            label={item.tabLabel}
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
      </BlockWrapper>
    )
  }

  return null
}
