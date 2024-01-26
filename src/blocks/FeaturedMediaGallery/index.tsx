import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type FeaturedMediaGalleryProps = Extract<
  Page['layout'][0],
  { blockType: 'featuredMediaGallery' }
>

export const FeaturedMediaGallery: React.FC<FeaturedMediaGalleryProps> = ({
  featuredMediaGalleryFields,
}) => {
  const { background, alignment, leader, title, description, links, featuredMediaTabs } =
    featuredMediaGalleryFields || {}

  const hasLinks = Array.isArray(links) && links.length > 0
  const hasFeaturedMediaTabs = Array.isArray(featuredMediaTabs) && featuredMediaTabs.length > 0

  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const switchTab = index => {
    setActiveTabIndex(index)
    resetAutoplayTimer()
  }

  const nextTab = useCallback(() => {
    if (featuredMediaTabs && hasFeaturedMediaTabs) {
      const nextIndex = activeTabIndex < featuredMediaTabs.length - 1 ? activeTabIndex + 1 : 0
      setActiveTabIndex(nextIndex)
    }
  }, [activeTabIndex, featuredMediaTabs, hasFeaturedMediaTabs])

  const resetAutoplayTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(nextTab, 5000)
  }, [nextTab])

  useEffect(() => {
    resetAutoplayTimer()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [resetAutoplayTimer, activeTabIndex])

  return (
    <div
      className={[
        classes.featuredMediaGallery,
        background === 'dark' ? classes.darkBg : classes.blackBg,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Gutter>
        <BackgroundGrid className={classes.backgroundGrid} />
        <div className={['grid'].filter(Boolean).join(' ')}>
          {alignment === 'mediaGalleryContent' ? (
            <Fragment>
              <div
                className={[classes.mediaTabs, 'cols-10 start-1 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                {hasFeaturedMediaTabs &&
                  featuredMediaTabs.map((tab, index) => (
                    <div
                      key={tab.id || index}
                      className={[
                        classes.imageContainer,
                        classes.leftImageAlignment,
                        activeTabIndex === index ? classes.activeImage : '',
                        tab.mediaAlignment === 'fill'
                          ? classes.filledImageContainerHeight
                          : classes.centeredImageContainerHeight,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden={activeTabIndex !== index ? 'true' : 'false'}
                    >
                      {typeof tab.media === 'object' && tab.media !== null && (
                        <Media resource={tab.media} />
                      )}
                    </div>
                  ))}
              </div>
              <div
                className={[classes.content, 'cols-4 start-13 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                {leader && <div className={classes.leader}>{leader}</div>}
                {title && <h2 className={classes.title}>{title}</h2>}
                {description && <RichText className={classes.description} content={description} />}
                <div className={[classes.mobileMediaTabs].filter(Boolean).join(' ')}>
                  <div className={classes.aspectRatioWrapper}>
                    {hasFeaturedMediaTabs &&
                      featuredMediaTabs.map((tab, index) => (
                        <div
                          key={tab.id || index}
                          className={[
                            classes.imageContainer,
                            classes.rightImageAlignment,
                            activeTabIndex === index ? classes.activeImage : '',
                            tab.mediaAlignment === 'fill'
                              ? classes.filledImageContainerHeight
                              : classes.centeredImageContainerHeight,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          aria-hidden={activeTabIndex !== index ? 'true' : 'false'}
                        >
                          {typeof tab.media === 'object' && tab.media !== null && (
                            <Media resource={tab.media} />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                {featuredMediaTabs && (
                  <ul className={classes.tabs}>
                    {featuredMediaTabs.map((tab, index) => (
                      <li key={tab.id || index}>
                        <button
                          className={[
                            classes.tabButton,
                            index === activeTabIndex ? classes.activeButton : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => switchTab(index)}
                        >
                          {tab.mediaLabel}
                          {index === activeTabIndex && <div className={classes.progressBar}></div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {hasLinks && (
                  <ul className={classes.links}>
                    {links.map(({ link }, index) => {
                      return (
                        <li key={index}>
                          <CMSLink
                            {...link}
                            key={index}
                            appearance="default"
                            fullWidth
                            buttonProps={{
                              icon: 'arrow',
                              hideHorizontalBorders: true,
                            }}
                            className={[
                              classes.linkButton,
                              background === 'black' ? classes.blackButtonBg : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div
                className={[classes.content, 'cols-4 start-1 cols-m-8'].filter(Boolean).join(' ')}
              >
                {leader && <div className={classes.leader}>{leader}</div>}
                {title && <h2 className={classes.title}>{title}</h2>}
                {description && <RichText className={classes.description} content={description} />}
                <div className={[classes.mobileMediaTabs].filter(Boolean).join(' ')}>
                  <div className={classes.aspectRatioWrapper}>
                    {hasFeaturedMediaTabs &&
                      featuredMediaTabs.map((tab, index) => (
                        <div
                          key={tab.id || index}
                          className={[
                            classes.imageContainer,
                            classes.rightImageAlignment,
                            activeTabIndex === index ? classes.activeImage : '',
                            tab.mediaAlignment === 'fill'
                              ? classes.filledImageContainerHeight
                              : classes.centeredImageContainerHeight,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          aria-hidden={activeTabIndex !== index ? 'true' : 'false'}
                        >
                          {typeof tab.media === 'object' && tab.media !== null && (
                            <Media resource={tab.media} />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                {featuredMediaTabs && (
                  <ul className={classes.tabs}>
                    {featuredMediaTabs.map((tab, index) => (
                      <li key={tab.id || index}>
                        <button
                          className={[
                            classes.tabButton,
                            index === activeTabIndex ? classes.activeButton : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => switchTab(index)}
                        >
                          {tab.mediaLabel}
                          {index === activeTabIndex && <div className={classes.progressBar}></div>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {hasLinks && (
                  <ul className={classes.links}>
                    {links.map(({ link }, index) => {
                      return (
                        <li key={index}>
                          <CMSLink
                            {...link}
                            key={index}
                            appearance="default"
                            fullWidth
                            buttonProps={{
                              icon: 'arrow',
                              hideHorizontalBorders: true,
                            }}
                            className={[
                              classes.linkButton,
                              background === 'black' ? classes.blackButtonBg : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <div
                className={[classes.mediaTabs, 'cols-10 start-7 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                {hasFeaturedMediaTabs &&
                  featuredMediaTabs.map((tab, index) => (
                    <div
                      key={tab.id || index}
                      className={[
                        classes.imageContainer,
                        classes.rightImageAlignment,
                        activeTabIndex === index ? classes.activeImage : '',
                        tab.mediaAlignment === 'fill'
                          ? classes.filledImageContainerHeight
                          : classes.centeredImageContainerHeight,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden={activeTabIndex !== index ? 'true' : 'false'}
                    >
                      {typeof tab.media === 'object' && tab.media !== null && (
                        <Media resource={tab.media} />
                      )}
                    </div>
                  ))}
              </div>
            </Fragment>
          )}
        </div>
      </Gutter>
    </div>
  )
}
