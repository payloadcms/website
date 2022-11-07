'use client'

import React, { Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { CMSLink } from '@components/CMSLink'
import { Media } from '@components/Media'
import { Page } from '@root/payload-types'
import { useMouseInfo } from '@faceless-ui/mouse-info'
import classes from './index.module.scss'

type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

export const HoverHighlight: React.FC<
  HoverHighlightProps['hoverHighlightsFields']['highlights'][0] & {
    index: number
    addRowNumbers: boolean
    isLast?: boolean
  }
> = props => {
  const { index, addRowNumbers, description, title, isLast, link, media } = props

  const [isHovered, setIsHovered] = React.useState<boolean | null>(null)

  const { xPercentage, yPercentage } = useMouseInfo()

  return (
    <Fragment>
      <CMSLink
        {...link}
        className={classes.highlightLink}
        onMouseEnter={() => {
          setIsHovered(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
        }}
      >
        <Grid className={classes.highlight}>
          {addRowNumbers && (
            <Cell cols={1} className={classes.rowNumber}>
              {(index + 1).toString().padStart(2, '0')}
            </Cell>
          )}
          <Cell cols={3} colsM={8}>
            <h3 className={classes.title}>{title}</h3>
          </Cell>
          <Cell cols={addRowNumbers ? 5 : 6} colsM={8}>
            <p className={classes.description}>{description}</p>
          </Cell>
        </Grid>
      </CMSLink>
      {isLast && (
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
      )}
      {isHovered && typeof media === 'object' && (
        <div
          className={classes.media}
          style={{
            left: `${xPercentage}%`,
            top: `${yPercentage}%`,
          }}
        >
          <Media resource={media} />
        </div>
      )}
    </Fragment>
  )
}
