'use client'

import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { LogoShowcase } from '@components/Hero/Home/LogoShowcase/index'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding'
import { Media } from '@components/Media/index'
import { RichText } from '@components/RichText/index'
import React, { useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

export const HomeHero: React.FC<
  {
    firstContentBlock?: BlocksProp
  } & Page['hero']
> = ({
  announcementLink,
  description,
  enableAnnouncement,
  featureVideo,
  firstContentBlock,
  logos,
  media,
  primaryButtons,
  richText,
  secondaryButtons,
  secondaryDescription,
  secondaryHeading,
  secondaryMedia,
}) => {
  const laptopMediaRef = useRef<HTMLDivElement | null>(null)
  const mobileLaptopMediaRef = useRef<HTMLDivElement | null>(null)
  const [laptopMediaHeight, setLaptopMediaHeight] = useState(0)
  const [mobileMediaWrapperHeight, setMobileMediaWrapperHeight] = useState(0)
  const padding = useGetHeroPadding('dark', firstContentBlock)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  useEffect(() => {
    const updateElementHeights = () => {
      const renderedLaptopMediaHeight = laptopMediaRef.current
        ? laptopMediaRef.current.offsetHeight
        : 0
      setLaptopMediaHeight(renderedLaptopMediaHeight)
    }
    updateElementHeights()
    window.addEventListener('resize', updateElementHeights)

    return () => window.removeEventListener('resize', updateElementHeights)
  }, [])

  useEffect(() => {
    const updateMobileMediaWrapperHeight = () => {
      const newMobileHeight = mobileLaptopMediaRef.current
        ? mobileLaptopMediaRef.current.offsetHeight
        : 0
      setMobileMediaWrapperHeight(newMobileHeight)
    }
    updateMobileMediaWrapperHeight()
    window.addEventListener('resize', updateMobileMediaWrapperHeight)

    return () => window.removeEventListener('resize', updateMobileMediaWrapperHeight)
  }, [])

  const aspectRatio = 2560 / 1971
  const dynamicHeight = windowWidth / aspectRatio

  const getContentWrapperHeight = () => {
    if (windowWidth >= 1024) {
      return {
        height: `${dynamicHeight}px`,
      }
    } else if (windowWidth < 1024) {
      return {
        height: '100%',
      }
    } else {
      return {
        height: 'unset',
      }
    }
  }

  const contentWrapperHeight = getContentWrapperHeight()

  const getGridLineStyles = () => {
    if (windowWidth >= 1024) {
      // For desktop
      return {
        0: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 65%, rgba(0, 0, 0, 0) 80%)',
        },
        1: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 65%, rgba(0, 0, 0, 0) 80%)',
        },
        2: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 75%, rgba(0, 0, 0, 0) 95%)',
        },
        3: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 20%, rgba(0, 0, 0, 0) 60%)',
        },
        4: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 60%, rgba(0, 0, 0, 0) 90%)',
        },
      }
    } else {
      // For mobile
      return {
        0: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 70%, rgba(0, 0, 0, 0) 100%)',
        },
        1: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 80%, rgba(0, 0, 0, 0) 90%)',
        },
        2: {
          background: 'var(--grid-line-dark)',
        },
        3: {
          background: 'var(--grid-line-dark)',
        },
        4: {
          background:
            'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 80%, rgba(0, 0, 0, 0) 100%)',
        },
      }
    }
  }

  const gridLineStyles = getGridLineStyles()

  return (
    <ChangeHeaderTheme theme="dark">
      <BlockWrapper hero padding={padding} setPadding={false} settings={{ theme: 'dark' }}>
        <div className={classes.bgFull}>
          <Media
            alt=""
            className={classes.desktopBg}
            height={1644}
            priority
            src="/images/hero-shapes.jpg"
            width={1920}
          />
          <Media
            alt=""
            className={classes.mobileBg}
            height={800}
            priority
            src="/images/mobile-hero-shapes.jpg"
            width={390}
          />
        </div>
        <div className={classes.homeHero}>
          <div className={classes.background}>
            <div className={classes.imagesContainerWrapper}>
              {typeof media === 'object' && media !== null && (
                <Media
                  className={classes.laptopMedia}
                  height={1971}
                  priority
                  ref={laptopMediaRef}
                  resource={media}
                  width={2560}
                />
              )}
              {typeof secondaryMedia === 'object' && secondaryMedia !== null && (
                <div className={classes.pedestalMaskedImage}>
                  <BackgroundGrid
                    gridLineStyles={{
                      0: {
                        background: 'var(--grid-line-dark)',
                      },
                      1: {
                        background: 'var(--grid-line-dark)',
                      },
                      2: {
                        background: 'var(--grid-line-dark)',
                      },
                      3: {
                        background: 'var(--grid-line-dark)',
                      },
                      4: {
                        background: 'var(--grid-line-dark)',
                      },
                    }}
                    zIndex={1}
                  />
                  <Media
                    className={classes.pedestalImage}
                    height={1199}
                    priority
                    resource={secondaryMedia}
                    width={2560}
                  />
                </div>
              )}
              {typeof featureVideo === 'object' && featureVideo !== null && (
                <div className={classes.featureVideoMask} style={{ height: laptopMediaHeight }}>
                  <Media className={classes.featureVideo} priority resource={featureVideo} />
                </div>
              )}
            </div>
          </div>
          <div className={classes.contentWrapper} style={contentWrapperHeight}>
            <Gutter className={classes.content}>
              <div className={classes.primaryContentWrap} data-theme="dark">
                <BackgroundGrid gridLineStyles={gridLineStyles} zIndex={0} />
                <div className={[classes.primaryContent, 'grid'].filter(Boolean).join(' ')}>
                  <div className={['cols-8 start-1'].filter(Boolean).join(' ')}>
                    {enableAnnouncement && (
                      <div className={classes.announcementLink}>
                        <CMSLink {...announcementLink} />
                      </div>
                    )}
                    <RichText className={classes.richTextHeading} content={richText} />
                    <RichText className={classes.richTextDescription} content={description} />
                    {Array.isArray(primaryButtons) && (
                      <ul className={[classes.primaryButtons].filter(Boolean).join(' ')}>
                        {primaryButtons.map(({ link }, i) => {
                          return (
                            <li key={i}>
                              <CMSLink
                                {...link}
                                appearance="default"
                                buttonProps={{
                                  hideHorizontalBorders: true,
                                  icon: 'arrow',
                                }}
                                fullWidth
                              />
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {/* Mobile media - only rendered starting at mid-break */}
                    <div
                      className={classes.mobileMediaWrapper}
                      style={{ height: mobileMediaWrapperHeight }}
                    >
                      {typeof media === 'object' && media !== null && (
                        <Media
                          className={classes.laptopMedia}
                          ref={mobileLaptopMediaRef}
                          resource={media}
                        />
                      )}
                      {typeof secondaryMedia === 'object' && secondaryMedia !== null && (
                        <div className={classes.pedestalMaskedImage}>
                          <BackgroundGrid
                            className={classes.mobilePedestalBackgroundGrid}
                            gridLineStyles={{
                              0: {
                                background: 'var(--grid-line-dark)',
                              },
                              1: {
                                background: 'var(--grid-line-dark)',
                              },
                              2: {
                                background: 'var(--grid-line-dark)',
                              },
                              3: {
                                background: 'var(--grid-line-dark)',
                              },
                              4: {
                                background: 'var(--grid-line-dark)',
                              },
                            }}
                            zIndex={1}
                          />
                          <Media className={classes.pedestalImage} resource={secondaryMedia} />
                        </div>
                      )}
                      {typeof featureVideo === 'object' && featureVideo !== null && (
                        <div
                          className={classes.featureVideoMask}
                          style={{ height: mobileMediaWrapperHeight }}
                        >
                          <Media
                            className={classes.featureVideo}
                            priority
                            resource={featureVideo}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={[classes.secondaryContentWrap, 'grid'].filter(Boolean).join(' ')}
                data-theme="dark"
              >
                <BackgroundGrid className={classes.mobileSecondaryBackgroundGrid} zIndex={1} />
                <div className={classes.mobileSecondaryBackground} />
                <div
                  className={[classes.secondaryContent, 'cols-8 start-1'].filter(Boolean).join(' ')}
                >
                  <RichText
                    className={classes.secondaryRichTextHeading}
                    content={secondaryHeading}
                  />
                  <RichText
                    className={classes.secondaryRichTextDescription}
                    content={secondaryDescription}
                  />
                  {Array.isArray(secondaryButtons) && (
                    <ul className={classes.secondaryButtons}>
                      {secondaryButtons.map(({ link }, i) => {
                        return (
                          <li key={i}>
                            <CMSLink
                              {...link}
                              appearance="default"
                              buttonProps={{
                                hideHorizontalBorders: true,
                                icon: 'arrow',
                              }}
                              fullWidth
                            />
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
                <div
                  className={[classes.logoWrapper, 'cols-8 start-9 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <LogoShowcase logos={logos} />
                </div>
              </div>
            </Gutter>
          </div>
        </div>
        <div className={classes.paddingBottom}>
          <BackgroundGrid
            className={classes.paddingBottomGrid}
            gridLineStyles={{
              0: {
                background: 'var(--grid-line-dark)',
              },
              1: {
                background: 'var(--grid-line-dark)',
              },
              2: {
                background: 'var(--grid-line-dark)',
              },
              3: {
                background: 'var(--grid-line-dark)',
              },
              4: {
                background: 'var(--grid-line-dark)',
              },
            }}
            zIndex={1}
          />
        </div>
      </BlockWrapper>
    </ChangeHeaderTheme>
  )
}
