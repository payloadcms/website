import * as React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { Button } from '@components/Button/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import MediaParallax from '@components/MediaParallax/index.js'
import { RichText } from '@components/RichText/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

export type MediaContentProps = Extract<Page['layout'][0], { blockType: 'mediaContent' }> & {
  padding: PaddingProps
}
export const MediaContentBlock: React.FC<MediaContentProps> = ({ mediaContentFields, padding }) => {
  const { link, images, richText, alignment, enableLink, settings } = mediaContentFields

  return (
    <Gutter>
      <div className={['grid'].filter(Boolean).join(' ')}>
        {alignment === 'mediaContent' ? (
          // media-content
          <React.Fragment>
            <div
              className={[classes.media, classes.left, 'cols-8 cols-m-8 start-1']
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
            <div
              className={[classes.content, classes.right, 'cols-6 start-11 start-m-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button
                    {...link}
                    appearance={'default'}
                    labelStyle="mono"
                    hideHorizontalBorders
                    icon="arrow"
                    el="link"
                  />
                </div>
              )}
            </div>
          </React.Fragment>
        ) : (
          // content-media
          <React.Fragment>
            <div
              className={[classes.content, classes.left, 'cols-6 start-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button
                    {...link}
                    appearance={'default'}
                    hideHorizontalBorders
                    labelStyle="mono"
                    icon="arrow"
                    el="link"
                  />
                </div>
              )}
            </div>
            <div
              className={[classes.media, classes.right, 'cols-8 start-9 cols-m-8 start-m-1']
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

export const MediaContent: React.FC<MediaContentProps> = props => {
  const { settings } = props.mediaContentFields

  return (
    <BlockWrapper padding={props.padding} settings={settings}>
      <BackgroundGrid zIndex={0} />
      <MediaContentBlock {...props} />
      <div className={classes.background} />
    </BlockWrapper>
  )
}
