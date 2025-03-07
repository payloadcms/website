import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { BlockSpacing } from '@components/BlockSpacing/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import MediaParallax from '@components/MediaParallax/index'
import { RichText } from '@components/RichText/index'
import { ArrowIcon } from '@icons/ArrowIcon/index'
import { QuoteIconAlt } from '@root/icons/QuoteIconAlt/index'
import React, { Fragment } from 'react'

import classes from './index.module.scss'

export type CalloutProps = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'callout' }>

export const Callout: React.FC<CalloutProps> = (props) => {
  const {
    calloutFields: { author, images, logo, richText, role, settings },
    hideBackground,
    padding,
  } = props
  const hasImages = images?.length && images.length > 0

  return (
    <BlockWrapper hideBackground={hideBackground} padding={padding} settings={settings}>
      <BackgroundGrid className={classes.backgroundGrid} zIndex={0} />
      <div className={classes.wrapper}>
        <Gutter>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <BackgroundScanline className={classes.scanline} crosshairs={'all'} enableBorders />
            <div
              className={[
                classes.contentWrapper,
                hasImages
                  ? 'cols-7 start-2 cols-m-8 start-m-1'
                  : 'cols-14 start-2 cols-m-8 start-m-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <QuoteIconAlt className={classes.quoteIcon} />
              <RichText
                className={[classes.content].filter(Boolean).join(' ')}
                content={richText}
              />
              <div className={[classes.authorWrapper, 'cols-12'].filter(Boolean).join(' ')}>
                <div className={classes.logo}>
                  {logo && typeof logo !== 'string' && <Media resource={logo} />}
                </div>
                <div className={classes.author}>
                  <span className={classes.name}>{author}</span>
                  {role ? <span className={classes.role}>{', ' + role}</span> : ''}
                </div>
              </div>
            </div>

            <div
              className={[classes.media, 'cols-6 start-11 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {hasImages ? <MediaParallax media={images} /> : null}
            </div>
          </div>
        </Gutter>
      </div>
    </BlockWrapper>
  )
}
