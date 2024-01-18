import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { ReusableContent } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'mediaBlock' }>

export const MediaBlock: React.FC<Props> = ({ mediaBlockFields }) => {
  const { media, caption, position } = mediaBlockFields

  if (typeof media === 'string') return null

  return (
    <Gutter>
      <Media
        resource={media}
        className={[classes.mediaResource, classes[`position--${position}`]]
          .filter(Boolean)
          .join(' ')}
      />

      {caption && (
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={[classes.caption, 'cols-4 cols-m-8'].filter(Boolean).join(' ')}>
            <small>
              <RichText content={caption} />
            </small>
          </div>
        </div>
      )}
    </Gutter>
  )
}
