import type { PaddingProps } from '@components/BlockWrapper/index'
import type { ReusableContent } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { RichText } from '@components/RichText/index'
import React from 'react'

import classes from './index.module.scss'

type Props = {
  disableGrid?: boolean
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<ReusableContent['layout'][0], { blockType: 'mediaBlock' }>

export const MediaBlock: React.FC<{ disableGutter?: boolean; marginAdjustment?: any } & Props> = ({
  disableGrid = false,
  disableGutter,
  hideBackground,
  marginAdjustment = {},
  mediaBlockFields,
  padding,
}) => {
  const { caption, media, position, settings } = mediaBlockFields

  if (typeof media === 'string') {
    return null
  }

  return (
    <BlockWrapper hideBackground={hideBackground} padding={padding} settings={settings}>
      <div
        className={classes.mediaBlock}
        style={{
          marginLeft: marginAdjustment.marginLeft,
          marginRight: marginAdjustment.marginRight,
        }}
      >
        {!disableGrid && <BackgroundGrid zIndex={0} />}
        {disableGutter ? (
          <Media
            className={[classes.mediaResource, classes[`position--${position}`]]
              .filter(Boolean)
              .join(' ')}
            resource={media}
          />
        ) : (
          <Gutter className={classes.mediaWrapper}>
            <Media
              className={[classes.mediaResource, classes[`position--${position}`]]
                .filter(Boolean)
                .join(' ')}
              resource={media}
            />

            {caption && (
              <div className={['grid'].filter(Boolean).join(' ')}>
                <div
                  className={[classes.caption, 'cols-8 start-5 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <small>
                    <RichText content={caption} />
                  </small>
                </div>
              </div>
            )}
          </Gutter>
        )}
      </div>
    </BlockWrapper>
  )
}
