'use client'

import React, { CSSProperties, Fragment } from 'react'
import { useMouseInfo } from '@faceless-ui/mouse-info'

import { CMSLink } from '@components/CMSLink'
import { LineDraw } from '@components/LineDraw'
import { Media } from '@components/Media'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

type Highlight = Exclude<
  HoverHighlightProps['hoverHighlightsFields']['highlights'],
  undefined | null
>[number]

export const HoverHighlight: React.FC<
  Highlight & {
    index: number
    addRowNumbers?: boolean | null
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
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              classes.blipCell,
              `cols-${addRowNumbers ? 16 : 15}`,
              `start-${addRowNumbers ? 2 : 1}`,
              'cols-m-8 start-m-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <LineDraw active={isHovered} />
          </div>
        </div>
        <div className={[classes.highlight, 'grid'].filter(Boolean).join(' ')}>
          {addRowNumbers && (
            <div className={[classes.rowNumber, 'cols-1'].filter(Boolean).join(' ')}>
              {(index + 1).toString().padStart(2, '0')}
            </div>
          )}
          <div className={['cols-5 cols-m-8'].filter(Boolean).join(' ')}>
            <h3 className={classes.title}>{title}</h3>
          </div>
          <div className={[`cols-${addRowNumbers ? 7 : 8}`, 'cols-m-8'].filter(Boolean).join(' ')}>
            <p className={classes.description}>{description}</p>
          </div>
        </div>
      </CMSLink>
      {typeof media === 'object' && media !== null && (
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
