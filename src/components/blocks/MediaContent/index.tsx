import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import MediaParallax from '@components/MediaParallax/index'
import { RichText } from '@components/RichText/index'
import * as React from 'react'

import classes from './index.module.scss'

export type MediaContentProps = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'mediaContent' }>
export const MediaContentBlock: React.FC<MediaContentProps> = ({ mediaContentFields, padding }) => {
  const { alignment, enableLink, images, link, mediaWidth, richText, settings } = mediaContentFields

  return (
    <Gutter>
      <div className={['grid'].filter(Boolean).join(' ')}>
        {alignment === 'mediaContent' ? (
          // media-content
          <React.Fragment>
            <div
              className={[
                classes.media,
                mediaWidth !== 'fit' ? classes.stretchRight : '',
                'cols-10 cols-m-8 start-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
            <div
              className={[classes.content, 'cols-4 start-13 start-m-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button
                    {...link}
                    appearance={'default'}
                    el="link"
                    hideHorizontalBorders
                    icon="arrow"
                    labelStyle="mono"
                  />
                </div>
              )}
            </div>
          </React.Fragment>
        ) : (
          // content-media
          <React.Fragment>
            <div className={[classes.content, 'cols-4 start-1 cols-m-8'].filter(Boolean).join(' ')}>
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button
                    {...link}
                    appearance={'default'}
                    el="link"
                    hideHorizontalBorders
                    icon="arrow"
                    labelStyle="mono"
                  />
                </div>
              )}
            </div>
            <div
              className={[
                classes.media,
                mediaWidth !== 'fit' ? classes.stretchLeft : '',
                'cols-10 start-7 cols-m-8 start-m-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
          </React.Fragment>
        )}
      </div>
    </Gutter>
  )
}

export const MediaContent: React.FC<MediaContentProps> = (props) => {
  const { settings } = props.mediaContentFields

  return (
    <BlockWrapper hideBackground={props.hideBackground} padding={props.padding} settings={settings}>
      <BackgroundGrid zIndex={0} />
      <MediaContentBlock {...props} />
      <div className={classes.background} />
    </BlockWrapper>
  )
}
