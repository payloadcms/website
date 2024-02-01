'use client'

import React from 'react'

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
  return (
    <div className={classes.homeHero}>
      {typeof media === 'object' && media !== null && (
        <div className={classes.bg}>
          <Media resource={media} className={classes.media} />
          <div className={classes.blackBg} />
        </div>
      )}
      <Gutter>
        <BackgroundGrid className={classes.backgroundGrid} />
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
                          hideHorizontalBorders: true,
                        }}
                      />
                    </li>
                  )
                })}
              </ul>
            )}
            {typeof media === 'object' && media !== null && (
              <Gutter className={classes.mediaGutter}>
                <Media resource={media} className={classes.media} />
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
