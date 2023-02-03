'use client'

import React, { CSSProperties, Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { useMouseInfo } from '@faceless-ui/mouse-info'

import { CMSLink } from '@components/CMSLink'
import { LineDraw } from '@components/LineDraw'
import { Media } from '@components/Media'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

export const HoverHighlight: React.FC<
  HoverHighlightProps['hoverHighlightsFields']['highlights'][0] & {
    index: number
    addRowNumbers: boolean
    isLast?: boolean
  }
> = props => {
  const { index, addRowNumbers, description, title, link, media } = props
  const [init, setInit] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState<boolean | null>(null)
  const { xPercentage, yPercentage } = useMouseInfo()

  React.useEffect(() => {
    setInit(true)
  }, [])

  const mediaStyle: CSSProperties = {}

  if (init && yPercentage > 0 && xPercentage > 0) {
    mediaStyle.left = `${xPercentage}%`
    mediaStyle.top = `${yPercentage}%`
  }

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
        <Grid>
          <Cell
            cols={addRowNumbers ? 12 : 11}
            start={addRowNumbers ? 2 : undefined}
            colsM={8}
            startM={1}
            className={classes.blipCell}
          >
            <LineDraw active={isHovered} />
          </Cell>
        </Grid>
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
      {typeof media === 'object' && (
        <div
          className={[classes.mediaWrapper, isHovered && classes.wrapperHovered]
            .filter(Boolean)
            .join(' ')}
          style={mediaStyle}
        >
          <div className={classes.revealBox}>
            <Media resource={media} className={classes.media} />
          </div>
        </div>
      )}
    </Fragment>
  )
}
