import React, { Fragment } from 'react'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { BlockSpacing } from '@components/BlockSpacing/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import MediaParallax from '@components/MediaParallax/index.js'
import { RichText } from '@components/RichText/index.js'
import { QuoteIconAlt } from '@root/icons/QuoteIconAlt/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

export type CalloutProps = Extract<Page['layout'][0], { blockType: 'callout' }> & {
  padding: PaddingProps
  hideBackground?: boolean
}

export const Callout: React.FC<CalloutProps> = props => {
  const {
    calloutFields: { richText, role, author, logo, images, settings },
    padding,
    hideBackground,
  } = props
  const hasImages = images?.length && images.length > 0

  return (
    <BlockWrapper settings={settings} padding={padding} hideBackground={hideBackground}>
      <BackgroundGrid className={classes.backgroundGrid} zIndex={0} />
      <div className={classes.wrapper}>
        <Gutter>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <BackgroundScanline className={classes.scanline} enableBorders crosshairs={'all'} />
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
                content={richText}
                className={[classes.content].filter(Boolean).join(' ')}
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
