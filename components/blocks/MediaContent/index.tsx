import * as React from 'react'
import { Gutter } from '@components/Gutter'
import { useTheme } from '@components/providers/Theme'
import { Page } from '@root/payload-types'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { RichText } from '@components/RichText'
import { Media } from '@components/Media'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'mediaContent' }>
export const MediaContent: React.FC<Props> = ({ mediaContentFields }) => {
  const { link, media, richText, alignment, container } = mediaContentFields
  const theme = useTheme()

  return (
    <Gutter
      className={[classes.mediaContent, classes[`theme--${theme}`]].filter(Boolean).join(' ')}
    >
      <Grid>
        {alignment === 'mediaContent' ? (
          // media-content
          <React.Fragment>
            <Cell
              start={1}
              cols={6}
              className={[classes.media, classes.left].filter(Boolean).join(' ')}
            >
              <Media resource={typeof media !== 'string' && media} />
            </Cell>
            <Cell
              start={8}
              cols={5}
              className={[classes.content, classes.right].filter(Boolean).join(' ')}
            >
              <RichText content={richText} />
            </Cell>
          </React.Fragment>
        ) : (
          // content-media
          <React.Fragment>
            <Cell
              start={1}
              cols={5}
              className={[classes.content, classes.left].filter(Boolean).join(' ')}
            >
              <RichText content={richText} />
            </Cell>
            <Cell
              start={7}
              cols={6}
              className={[classes.media, classes.right].filter(Boolean).join(' ')}
            >
              <Media resource={typeof media !== 'string' && media} />
            </Cell>
          </React.Fragment>
        )}

        <div>link here</div>
      </Grid>
      <div className={classes.background}></div>
    </Gutter>
  )
}
