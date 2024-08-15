import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import { RichText } from '@components/RichText/index.js'
import { ReusableContent } from '@root/payload-types.js'

import classes from './index.module.scss'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'mediaBlock' }> & {
  padding: PaddingProps
  disableGrid?: boolean
  hideBackground?: boolean
}

export const MediaBlock: React.FC<Props & { disableGutter?: boolean; marginAdjustment?: any }> = ({
  mediaBlockFields,
  disableGutter,
  marginAdjustment = {},
  padding,
  disableGrid = false,
  hideBackground,
}) => {
  const { media, caption, position, settings } = mediaBlockFields

  if (typeof media === 'string') return null

  return (
    <BlockWrapper settings={settings} padding={padding} hideBackground={hideBackground}>
      <div
        className={classes.mediaBlock}
        style={{
          marginRight: marginAdjustment.marginRight,
          marginLeft: marginAdjustment.marginLeft,
        }}
      >
        {!disableGrid && <BackgroundGrid zIndex={0} />}
        {disableGutter ? (
          <Media
            resource={media}
            className={[classes.mediaResource, classes[`position--${position}`]]
              .filter(Boolean)
              .join(' ')}
          />
        ) : (
          <Gutter className={classes.mediaWrapper}>
            <Media
              resource={media}
              className={[classes.mediaResource, classes[`position--${position}`]]
                .filter(Boolean)
                .join(' ')}
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
