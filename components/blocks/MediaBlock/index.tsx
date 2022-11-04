import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { ReusableContent } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import { Media } from '../../Media'
import { RichText } from '../../RichText'

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
        <Grid>
          <Cell className={classes.caption}>
            <small>
              <RichText content={caption} />
            </small>
          </Cell>
        </Grid>
      )}
    </Gutter>
  )
}
