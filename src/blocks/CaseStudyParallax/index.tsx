'use client'
import * as React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import MediaParallax from '@components/MediaParallax'
import { QuoteIconAlt } from '@root/icons/QuoteIconAlt'
import { Page } from '@root/payload-types'
import { useResize } from '@root/utilities/use-resize'

import classes from './index.module.scss'

type ContentProps = Extract<Page['layout'][0], { blockType: 'caseStudyParallax' }>

type Props = ContentProps & {
  className?: string
  padding: PaddingProps
}

type StickyBlockProps = ContentProps & {
  currentIndex: number
}

type QuoteProps = {
  item: any
  isVisible?: boolean
  className?: string
}

export const QuoteBlock: React.FC<QuoteProps> = props => {
  const { isVisible, item, className } = props
  return (
    <div
      className={[isVisible && classes.isVisible, 'cols-8 grid', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!isVisible}
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
            label={'Read the case study'}
            hideHorizontalBorders
            appearance={'default'}
            icon="arrow"
            className={classes.caseStudyButton}
            href={`/case-studies/${item?.caseStudy?.slug}`}
            el="a"
            aria-hidden={!isVisible}
            disabled={!isVisible}
          />
        </div>
      )}
    </div>
  )
}

export const QuoteStickyBlock: React.FC<StickyBlockProps> = props => {
  const { caseStudyParallaxFields, currentIndex } = props

  if (caseStudyParallaxFields?.items && caseStudyParallaxFields?.items?.length > 0) {
    return (
      <div className={[classes.stickyBlock, 'grid cols-16 cols-m-8'].filter(Boolean).join(' ')}>
        {caseStudyParallaxFields?.items.map((item, index) => {
          const isVisible = index === currentIndex

          return (
            <QuoteBlock
              key={index}
              isVisible={isVisible}
              item={item}
              className={classes.stickyBlockItem}
            />
          )
        })}
      </div>
    )
  }
  return null
}

export const CaseStudyParallax: React.FC<Props> = props => {
  const { caseStudyParallaxFields, padding } = props
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        settings={caseStudyParallaxFields.settings}
        padding={padding}
        className={classes.wrapper}
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
                    index === 0 ? classes.isFirst : 'cols-16 cols-m-8',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {item.images?.length && item.images.length > 0 ? (
                    <MediaParallax
                      media={item.images}
                      className={[classes.media, 'cols-8 start-9 start-m-1']
                        .filter(Boolean)
                        .join(' ')}
                    />
                  ) : null}

                  <QuoteBlock className={classes.mobileQuoteItem} item={item} />
                </div>
              )
            })}
          </div>

          <div className={classes.navWrapper}>
            <div className={[classes.nav].filter(Boolean).join(' ')} style={variableStyle}>
              <BackgroundGrid zIndex={0} className={classes.navBackgroundGrid} />

              <Gutter>
                <div
                  className={[classes.navGrid, 'grid'].filter(Boolean).join(' ')}
                  ref={navGridRef}
                >
                  <div className={[classes.progressIndicator].filter(Boolean).join(' ')} />
                  {caseStudyParallaxFields?.items.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={[classes.navItem, `cols-4 cols-m-8`].filter(Boolean).join(' ')}
                        ref={el => {
                          if (el) navButtonsRef.current[index] = el
                        }}
                      >
                        {typeof item.caseStudy !== 'string' && (
                          <Button
                            icon="arrow"
                            label={item.tabLabel}
                            hideHorizontalBorders
                            className={[
                              classes.navButton,
                              activeIndex.current === index && classes.isActive,
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
      </BlockWrapper>
    )
  }

  return null
}
