'use client'

import React, { useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding'
import { LogoShowcase } from '@components/LogoShowcase'
import { Media } from '@components/Media'
import { BlocksProp } from '@components/RenderBlocks'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const HomeHero: React.FC<
  Page['hero'] & {
    firstContentBlock?: BlocksProp
  }
> = ({
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
  const padding = useGetHeroPadding('light', firstContentBlock)

  useEffect(() => {
    const updateLaptopMediaHeight = () => {
      const newVideoHeight = laptopMediaRef.current ? laptopMediaRef.current.offsetHeight : 0
      setLaptopMediaHeight(newVideoHeight)
    }
    updateLaptopMediaHeight()
    window.addEventListener('resize', updateLaptopMediaHeight)

    return () => window.removeEventListener('resize', updateLaptopMediaHeight)
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

  return (
    <ChangeHeaderTheme theme="light">
      <BlockWrapper settings={{ theme: 'light' }} padding={padding} className={classes.homeHero}>
        <div className={classes.background}>
          <div className={classes.imagesContainerWrapper}>
            {typeof media === 'object' && media !== null && (
              <Media
                ref={laptopMediaRef}
                resource={media}
                className={classes.laptopMedia}
                priority
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
                <Media resource={secondaryMedia} className={classes.pedestalImage} priority />
              </div>
            )}
            {typeof featureVideo === 'object' && featureVideo !== null && (
              <div className={classes.featureVideoMask} style={{ height: laptopMediaHeight }}>
                <Media resource={featureVideo} className={classes.featureVideo} priority />
              </div>
            )}
          </div>
        </div>
        <Gutter className={classes.contentWrapper}>
          <div className={classes.primaryContentWrap} data-theme="light">
            <BackgroundGrid zIndex={0} />
            <div className={[classes.primaryContent, 'grid'].filter(Boolean).join(' ')}>
              <div className={['cols-8 stthemeart-1'].filter(Boolean).join(' ')}>
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
                      <Media resource={featureVideo} className={classes.featureVideo} priority />
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
            <div className={[classes.secondaryContent, 'cols-8 start-1'].filter(Boolean).join(' ')}>
              <RichText className={classes.secondaryRichTextHeading} content={secondaryHeading} />
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
      </BlockWrapper>
    </ChangeHeaderTheme>
  )
}
