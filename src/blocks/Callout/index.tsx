import React, { Fragment } from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockSpacing } from '@components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import MediaParallax from '@components/MediaParallax'
import { RichText } from '@components/RichText'
import { QuoteIconAlt } from '@root/icons/QuoteIconAlt'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type CalloutProps = Extract<Page['layout'][0], { blockType: 'callout' }> & {
  padding: PaddingProps
}

export const Callout: React.FC<CalloutProps> = props => {
  const {
    calloutFields: { richText, role, author, logo, images, settings },
    padding,
  } = props

  return (
    <BlockWrapper settings={settings} padding={padding}>
      <div className={classes.wrapper}>
        <Gutter>
          <BackgroundGrid className={classes.backgroundGrid} />
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <BackgroundScanline enableBorders crosshairs={'all'} />
            <div
              className={[classes.contentWrapper, 'cols-7 start-2 cols-m-8 start-m-1']
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
                  <span className={classes.name}>{author}</span>{' '}
                  {role ? <span className={classes.role}>{', ' + role}</span> : ''}
                </div>
              </div>
            </div>

            <div
              className={[classes.media, 'cols-6 start-11 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
          </div>
        </Gutter>
      </div>
    </BlockWrapper>
  )
}
