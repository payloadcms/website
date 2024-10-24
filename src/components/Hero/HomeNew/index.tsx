'use client'

import React, { useEffect, useRef, useState } from 'react'

import BackgroundGradient from '@components/BackgroundGradient'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { ChangeHeaderTheme } from '@components/ChangeHeaderTheme/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { LogoShowcase } from '@components/Hero/HomeNew/LogoShowcase/index.js'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding.js'
import { Media } from '@components/Media/index.js'
import { BlocksProp } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'
import CreatePayloadApp from '@components/CreatePayloadApp'

export const HomeNewHero: React.FC<
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

  return (
    <ChangeHeaderTheme theme="dark">
      <BlockWrapper
        settings={{ theme: 'dark' }}
        padding={{ top: 'large', bottom: 'large' }}
        className={classes.heroWrapper}
      >
        <Gutter className={[classes.heroContent, 'grid'].join(' ')}>
          <div className="cols-8">
            {/* {enableAnnouncement && (
              <div className={classes.announcementLink}>
                <CMSLink {...announcementLink} />
              </div>
            )} */}
            <RichText content={richText} />
          </div>
          <div className="cols-4 start-13 cols-m-8 start-m-1">
            <RichText content={description} />
            <CreatePayloadApp />
          </div>
        </Gutter>
        <Gutter>
          {featureVideo && typeof featureVideo !== 'string' && (
            <Media resource={featureVideo} className={classes.featureVideo} />
          )}
        </Gutter>
        <Gutter className={[classes.secondaryContent, 'grid'].join(' ')}>
          <div className="cols-6 cols-m-8">
            {secondaryHeading && <RichText content={secondaryHeading} />}
            {secondaryDescription && <RichText content={secondaryDescription} />}
            {secondaryButtons && (
              <div className={classes.secondaryButtons}>
                {secondaryButtons.map((button, index) => (
                  <CMSLink key={index} {...button} />
                ))}
              </div>
            )}
          </div>
          <div className="cols-8 start-9 start-m-1">
            <LogoShowcase logos={logos} />
          </div>
        </Gutter>
      </BlockWrapper>
      <BackgroundGradient className={classes.backgroundGradient} />
    </ChangeHeaderTheme>
  )
}
