'use client'

import { useState } from 'react'

import { Button } from '@components/Button/index.js'
import { CMSLink, CMSLinkType } from '@components/CMSLink/index.js'

import classes from '../index.module.scss'

export const Highlights: React.FC<{
  beforeHighlights?: string | null
  afterHighlights?: string | null
  button?: CMSLinkType | null
  children: React.ReactNode[] | React.ReactNode
}> = props => {
  const [active, setActive] = useState(0)

  const { beforeHighlights, afterHighlights, button, children } = props

  // get index of child on hover
  const handleHover = index => {
    setActive(index)
  }

  return (
    <div className={['cols-8 cols-m-4 cols-s-8', classes.highlightWrap].join(' ')}>
      <span>{beforeHighlights}</span>
      <div className={classes.highlightList}>
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <div
              key={index}
              className={[
                classes.highlightText,
                index < active ? classes.beforeActive : '',
                index === active ? classes.activeHighlight : '',
                index > active ? classes.afterActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseOver={() => handleHover(index)}
            >
              {child}
            </div>
          ))
        ) : (
          <div className="highlight" onMouseEnter={() => handleHover(0)}>
            {children}
          </div>
        )}
      </div>
      <span>{afterHighlights}</span>
      {props.button && (
        <CMSLink
          {...button}
          className={classes.button}
          appearance={'default'}
          buttonProps={{ hideHorizontalBorders: true, icon: 'arrow' }}
        />
      )}
    </div>
  )
}
