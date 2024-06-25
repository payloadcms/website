'use client'

import React, { useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { LogoShowcase } from '@components/Hero/Home/LogoShowcase/index.js'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding.js'
import { Media } from '@components/Media/index.js'
import { BlocksProp } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

export const HomeHero: React.FC<
  Page['hero'] & {
    firstContentBlock?: BlocksProp
  }
> = ({
  enableAnnouncement,
  announcementLink,
  richText,
  description,
  primaryButtons,
  secondaryHeading,
  secondaryDescription,
  secondaryButtons,
  media,
  secondaryMedia,
  featureVideo,
  logos,
  firstContentBlock,
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
      <BlockWrapper setPadding={false} settings={{ theme: 'dark' }} padding={padding}>
        <div className={classes.bgFull}>
          <Media
            className={classes.desktopBg}
            src="/images/hero-shapes.jpg"
            alt=""
            width={1920}
            height={1644}
            priority
          />
          <Media
            className={classes.mobileBg}
            src="/images/mobile-hero-shapes.jpg"
            alt=""
            width={390}
            height={800}
            priority
          />
        </div>
        <div className={classes.homeHero}>
          <div className={classes.background}>
            <div className={classes.imagesContainerWrapper}>
              {typeof media === 'object' && media !== null && (
                <Media
                  ref={laptopMediaRef}
                  resource={media}
                  className={classes.laptopMedia}
                  priority
                  width={2560}
                  height={1971}
                />
              )}
              {typeof secondaryMedia === 'object' && secondaryMedia !== null && (
                <div className={classes.pedestalMaskedImage}>
                  <BackgroundGrid
                    zIndex={1}
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
                  />
                  <Media
                    resource={secondaryMedia}
                    className={classes.pedestalImage}
                    priority
                    width={2560}
                    height={1199}
                  />
                </div>
              )}
              {typeof featureVideo === 'object' && featureVideo !== null && (
                <div className={classes.featureVideoMask} style={{ height: laptopMediaHeight }}>
                  <Media resource={featureVideo} className={classes.featureVideo} priority />
                </div>
              )}
            </div>
          </div>
          <div className={classes.contentWrapper} style={contentWrapperHeight}>
            <Gutter className={classes.content}>
              <div className={classes.primaryContentWrap} data-theme="dark">
                <BackgroundGrid zIndex={0} gridLineStyles={gridLineStyles} />
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
                                fullWidth
                                buttonProps={{
                                  icon: 'arrow',
                                  hideHorizontalBorders: true,
                                }}
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
                          ref={mobileLaptopMediaRef}
                          resource={media}
                          className={classes.laptopMedia}
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
                          <Media resource={secondaryMedia} className={classes.pedestalImage} />
                        </div>
                      )}
                      {typeof featureVideo === 'object' && featureVideo !== null && (
                        <div
                          className={classes.featureVideoMask}
                          style={{ height: mobileMediaWrapperHeight }}
                        >
                          <Media
                            resource={featureVideo}
                            className={classes.featureVideo}
                            priority
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-theme="dark"
                className={[classes.secondaryContentWrap, 'grid'].filter(Boolean).join(' ')}
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
                              fullWidth
                              buttonProps={{
                                icon: 'arrow',
                                hideHorizontalBorders: true,
                              }}
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
