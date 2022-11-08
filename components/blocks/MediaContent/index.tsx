import * as React from 'react'
import { Gutter } from '@components/Gutter'
import { ThemeProvider } from '@components/providers/Theme'
import { Page } from '@root/payload-types'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { RichText } from '@components/RichText'
import { Media } from '@components/Media'
import { Button } from '@components/Button'
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
              <Media resource={typeof media !== 'string' && media} />
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
                <Button {...link} className={classes.buttonLink} labelStyle="mono" icon="arrow" />
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
                <Button {...link} className={classes.buttonLink} labelStyle="mono" icon="arrow" />
              )}
            </Cell>
            <Cell
              start={7}
              cols={6}
              startM={1}
              colsM={12}
              className={[classes.media, classes.right].filter(Boolean).join(' ')}
            >
              <Media resource={typeof media !== 'string' && media} />
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
      <ThemeProvider theme="dark" className={classes.withContainer}>
        <MediaContentBlock {...props} />
        <div className={classes.background} />
      </ThemeProvider>
    )
  }

  return <MediaContentBlock {...props} />
}
