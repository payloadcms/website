import React from 'react'
import { Page } from '@root/payload-types'
import { Gutter } from '@components/Gutter'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { RichText } from '@components/RichText'
import { PixelBackground } from '@components/PixelBackground'
import classes from './index.module.scss'
import { HoverHighlight } from './HoverHighlight'

export type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

export const HoverHighlights: React.FC<HoverHighlightProps> = props => {
  const {
    hoverHighlightsFields: { richText, addRowNumbers, highlights },
  } = props

  const hasHighlights = highlights && highlights.length > 0

  return (
    <Gutter className={classes.hoverHighlights}>
      <Grid className={classes.richTextGrid}>
        <Cell cols={8}>
          <RichText content={richText} />
        </Cell>
      </Grid>
      <div className={classes.content}>
        <div className={classes.pixelBG}>
          <PixelBackground />
        </div>
        <Grid>
          <Cell
            cols={addRowNumbers ? 12 : 11}
            start={addRowNumbers ? 2 : undefined}
            colsM={8}
            startM={1}
          >
            <hr className={classes.hr} />
          </Cell>
        </Grid>
        {hasHighlights &&
          highlights.map((highlight, index) => {
            return (
              <HoverHighlight
                key={index}
                index={index}
                addRowNumbers={addRowNumbers}
                isLast={index < highlights.length - 1}
                {...highlight}
              />
            )
          })}
        <Grid>
          <Cell
            cols={addRowNumbers ? 12 : 11}
            start={addRowNumbers ? 2 : undefined}
            colsM={8}
            startM={1}
          >
            <hr className={classes.hr} />
          </Cell>
        </Grid>
      </div>
    </Gutter>
  )
}
