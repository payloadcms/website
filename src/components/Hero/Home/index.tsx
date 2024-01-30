'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { LogoGrid } from '@components/LogoGrid'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const HomeHero: React.FC<Page['hero']> = ({
  richText,
  primaryButtons,
  secondaryContent,
  secondaryButtons,
  media,
  logos,
}) => {
  return (
    <div className={classes.homeHero}>
      <div data-theme="dark" className={[classes.wrap].filter(Boolean).join(' ')}>
        {typeof media === 'object' && media !== null && (
          <div className={classes.bg}>
            <div className={classes.bgImage}>
              <Media resource={media} className={classes.media} />
            </div>
            <div className={classes.blackBg} />
          </div>
        )}
        <Gutter>
          <BackgroundGrid className={classes.backgroundGrid} />
          <div className={[classes.contentWrap, 'grid'].filter(Boolean).join(' ')}>
            <div className={['cols-6 start-1'].filter(Boolean).join(' ')}>
              <RichText className={classes.richText} content={richText} />
            </div>
            {Array.isArray(primaryButtons) && (
              <ul className={[classes.primaryButtons, 'cols-4 start-1'].filter(Boolean).join(' ')}>
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
          </div>
          <div className={[classes.secondaryContentWrap, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.secondaryContent, 'cols-6 start-1'].filter(Boolean).join(' ')}>
              <RichText className={classes.richText} content={secondaryContent} />
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
            <div className={[classes.logoWrapper, 'cols-8 start-9'].filter(Boolean).join(' ')}>
              <LogoGrid logos={logos} />
            </div>
          </div>

          {typeof media === 'object' && media !== null && (
            <Gutter>
              <div className={classes.padForMedia} />
            </Gutter>
          )}
        </Gutter>
      </div>
    </div>
  )
}
