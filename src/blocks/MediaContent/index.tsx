import * as React from 'react'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type MediaContentProps = Extract<Page['layout'][0], { blockType: 'mediaContent' }>
export const MediaContentBlock: React.FC<MediaContentProps> = ({ mediaContentFields }) => {
  const { link, media, richText, alignment, enableLink } = mediaContentFields

  return (
    <Gutter>
      <div className={['grid'].filter(Boolean).join(' ')}>
        {alignment === 'mediaContent' ? (
          // media-content
          <React.Fragment>
            <div
              className={[classes.media, classes.left, 'cols-6 cols-m-12 start-1']
                .filter(Boolean)
                .join(' ')}
            >
              <Media resource={typeof media !== 'string' ? media : undefined} />
            </div>
            <div
              className={[classes.content, classes.right, 'cols-5 start-8 start-m-1 cols-m-12']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button {...link} labelStyle="mono" icon="arrow" el="link" />
                </div>
              )}
            </div>
          </React.Fragment>
        ) : (
          // content-media
          <React.Fragment>
            <div
              className={[classes.content, classes.left, 'cols-5 start-1 cols-m-12']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button {...link} labelStyle="mono" icon="arrow" el="link" />
                </div>
              )}
            </div>
            <div
              className={[classes.media, classes.right, 'cols-6 start-7 cols-m-12 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              <Media resource={typeof media !== 'string' ? media : undefined} />
            </div>
          </React.Fragment>
        )}
      </div>
    </Gutter>
  )
}

export const MediaContent: React.FC<MediaContentProps> = props => {
  const { container } = props.mediaContentFields

  if (container) {
    return (
      <div data-theme="dark" className={classes.withContainer}>
        <MediaContentBlock {...props} />
        <div className={classes.background} />
      </div>
    )
  }

  return <MediaContentBlock {...props} />
}
