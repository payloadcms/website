'use client'

import React, { useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { LogoShowcase } from '@components/LogoShowcase'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const HomeHero: React.FC<Page['hero']> = ({
  richText,
  description,
  primaryButtons,
  secondaryHeading,
  secondaryDescription,
  secondaryButtons,
  media,
  logos,
}) => {
  const mediaRef = useRef<HTMLDivElement>(null)
  const [maskStyle, setMaskStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const updateMaskStyle = () => {
      const screenWidth = window.innerWidth
      if (screenWidth <= 1024) {
        setMaskStyle({ maskImage: 'none' })
        return
      }

      if (mediaRef.current && mediaRef.current.parentElement) {
        const mediaRect = mediaRef.current.getBoundingClientRect()
        const containerRect = mediaRef.current.parentElement.getBoundingClientRect()
        let startPercentage = 0

        let endPercentage
        if (screenWidth <= 1200) {
          endPercentage = ((mediaRect.bottom - containerRect.top) / containerRect.height) * 100 + 30
        } else if (screenWidth <= 1600) {
          endPercentage = ((mediaRect.bottom - containerRect.top) / containerRect.height) * 100 + 20
        } else {
          endPercentage = ((mediaRect.bottom - containerRect.top) / containerRect.height) * 100
        }

        setMaskStyle({
          maskImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${startPercentage}%, rgba(0,0,0,0) ${endPercentage}%, rgba(0,0,0,0) 100%)`,
        })
      }
    }

    updateMaskStyle()
    window.addEventListener('resize', updateMaskStyle)
    return () => window.removeEventListener('resize', updateMaskStyle)
  }, [])

  return (
    <div className={classes.homeHero}>
      {typeof media === 'object' && media !== null && (
        <div className={classes.bg}>
          <div ref={mediaRef}>
            <Media resource={media} className={classes.media} />
          </div>
          <div className={classes.blackBg} />
        </div>
      )}
      <Gutter>
        <BackgroundGrid className={classes.backgroundGrid} style={maskStyle} />
        <div className={[classes.contentWrap, 'grid'].filter(Boolean).join(' ')}>
          <div className={['cols-8 start-1'].filter(Boolean).join(' ')}>
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
                        }}
                      />
                    </li>
                  )
                })}
              </ul>
            )}
            {typeof media === 'object' && media !== null && (
              <Gutter className={classes.mediaGutter}>
                <Media resource={media} className={classes.mobileMedia} />
              </Gutter>
            )}
          </div>
        </div>
        <div className={[classes.secondaryContentWrap, 'grid'].filter(Boolean).join(' ')}>
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
            className={[classes.logoWrapper, 'cols-8 start-9 start-m-1'].filter(Boolean).join(' ')}
          >
            <LogoShowcase logos={logos} />
          </div>
        </div>
      </Gutter>
    </div>
  )
}
