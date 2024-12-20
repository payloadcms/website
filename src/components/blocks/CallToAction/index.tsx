'use client'
import type { PaddingProps } from '@components/BlockWrapper/index.js';
import type { Page } from '@root/payload-types.js'

import BackgroundGradient from '@components/BackgroundGradient'
import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { CommandLine } from '@components/CommandLine'
import CreatePayloadApp from '@components/CreatePayloadApp/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import { RichText } from '@components/RichText/index.js'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'
import { ArrowRightIcon } from '@icons/ArrowRightIcon'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index.js'
import React from 'react'

import classes from './index.module.scss'

export type CallToActionProps = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToAction: React.FC<CallToActionProps> = props => {
  const {
    ctaFields: {
      bannerImage,
      bannerLink,
      commandLine,
      gradientBackground,
      links,
      richText,
      settings,
      style = 'buttons',
    },
    hideBackground,
    padding,
  } = props

  const hasLinks = links && links.length > 0

  return (
    <BlockWrapper
      hideBackground={hideBackground}
      padding={style === 'banner' ? { bottom: 'large', top: 'large' } : padding}
      settings={settings}
    >
      <BackgroundGrid zIndex={0} />
      <Gutter className={classes.callToAction}>
        {style === 'buttons' && (
          <div className={[classes.wrapper].filter(Boolean).join(' ')}>
            <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
              <div
                className={[classes.contentWrapper, 'cols-6 cols-m-8'].filter(Boolean).join(' ')}
              >
                <RichText className={classes.content} content={richText} />
                {commandLine && <CommandLine command={commandLine} />}
              </div>
              <div
                className={[classes.linksContainer, 'cols-8 start-9 cols-m-8 start-m-1 grid']
                  .filter(Boolean)
                  .join(' ')}
              >
                <BackgroundScanline
                  className={[classes.scanline, 'cols-16 start-5 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                  crosshairs={['top-left', 'bottom-left']}
                />

                <CrosshairIcon className={[classes.crosshairTopLeft].filter(Boolean).join(' ')} />
                <CrosshairIcon
                  className={[classes.crosshairBottomRight].filter(Boolean).join(' ')}
                />

                {hasLinks && (
                  <div className={[classes.links, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}>
                    {links.map(({ type: ctaType, link, npmCta }, index) => {
                      const type = ctaType ?? 'link'

                      if (type === 'npmCta') {
                        return (
                          <CreatePayloadApp
                            background={false}
                            className={classes.npmCta}
                            key={index}
                            label={npmCta?.label}
                            style="cta"
                          />
                        )
                      }

                      return (
                        <CMSLink
                          {...link}
                          appearance={'default'}
                          buttonProps={{
                            appearance: 'default',
                            forceBackground: true,
                            hideBottomBorderExceptLast: true,
                            hideHorizontalBorders: true,
                            size: 'large',
                          }}
                          className={[classes.button].filter(Boolean).join(' ')}
                          key={index}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {style === 'banner' && (
          <CMSLink
            {...bannerLink}
            className={[classes.bannerWrapper, 'grid'].filter(Boolean).join(' ')}
            label={null}
          >
            <div className={[classes.bannerContent, 'cols-8'].filter(Boolean).join(' ')}>
              <RichText content={richText} />
              <span className={classes.bannerLink}>
                {bannerLink?.label}
                <ArrowRightIcon />
              </span>
            </div>
            {bannerImage && typeof bannerImage !== 'string' && (
              <div className={[classes.bannerImage, 'cols-8'].filter(Boolean).join(' ')}>
                <Media resource={bannerImage} />
              </div>
            )}
            {gradientBackground ? (
              <BackgroundGradient className={classes.bannerGradient} />
            ) : (
              <BackgroundScanline className={classes.bannerScanline} />
            )}
          </CMSLink>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
