'use client'
import React from 'react'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import CreatePayloadApp from '@components/CreatePayloadApp/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

export type CallToActionProps = Extract<Page['layout'][0], { blockType: 'cta' }> & {
  padding?: PaddingProps
  hideBackground?: boolean
}

export const CallToAction: React.FC<CallToActionProps> = props => {
  const {
    ctaFields: { richText, links, settings },
    padding,
    hideBackground,
  } = props

  const hasLinks = links && links.length > 0

  return (
    <BlockWrapper settings={settings} padding={padding} hideBackground={hideBackground}>
      <BackgroundGrid zIndex={0} />
      <Gutter className={classes.callToAction}>
        <div className={[classes.wrapper].filter(Boolean).join(' ')}>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.contentWrapper, 'cols-7 cols-m-8'].filter(Boolean).join(' ')}>
              <RichText content={richText} className={classes.content} />
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
              <CrosshairIcon className={[classes.crosshairBottomRight].filter(Boolean).join(' ')} />

              {hasLinks && (
                <div className={[classes.links, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}>
                  {links.map(({ link, type: ctaType, npmCta }, index) => {
                    const type = ctaType ?? 'link'

                    if (type === 'npmCta') {
                      return (
                        <CreatePayloadApp
                          key={index}
                          style="cta"
                          label={npmCta?.label}
                          className={classes.npmCta}
                          background={false}
                        />
                      )
                    }

                    return (
                      <CMSLink
                        {...link}
                        key={index}
                        appearance={'default'}
                        buttonProps={{
                          appearance: 'default',
                          size: 'large',
                          hideHorizontalBorders: true,
                          hideBottomBorderExceptLast: true,
                          forceBackground: true,
                        }}
                        className={[classes.button].filter(Boolean).join(' ')}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
