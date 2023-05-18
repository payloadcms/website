import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

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
      <Grid>
        {alignment === 'mediaContent' ? (
          // media-content
          <React.Fragment>
            <Cell
              start={1}
              cols={6}
              colsM={12}
              className={[classes.media, classes.left].filter(Boolean).join(' ')}
            >
              <Media resource={typeof media !== 'string' ? media : undefined} />
            </Cell>
            <Cell
              start={8}
              cols={5}
              startM={1}
              colsM={12}
              className={[classes.content, classes.right].filter(Boolean).join(' ')}
            >
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button {...link} labelStyle="mono" icon="arrow" el="link" />
                </div>
              )}
            </Cell>
          </React.Fragment>
        ) : (
          // content-media
          <React.Fragment>
            <Cell
              start={1}
              cols={5}
              colsM={12}
              className={[classes.content, classes.left].filter(Boolean).join(' ')}
            >
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button {...link} labelStyle="mono" icon="arrow" el="link" />
                </div>
              )}
            </Cell>
            <Cell
              start={7}
              cols={6}
              startM={1}
              colsM={12}
              className={[classes.media, classes.right].filter(Boolean).join(' ')}
            >
              <Media resource={typeof media !== 'string' ? media : undefined} />
            </Cell>
          </React.Fragment>
        )}
      </Grid>
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
