'use client'

import useIntersection from '@utilities/useIntersection'
import React, { Fragment, useRef } from 'react'

import classes from './index.module.scss'

export const Highlight: React.FC<{
  appearance?: 'danger' | 'success'
  bold?: boolean
  className?: string
  highlight?: boolean
  highlightOnHover?: boolean
  inlineIcon?: React.ReactElement
  reverseIcon?: boolean
  text?: string
}> = (props) => {
  const {
    appearance = 'success',
    bold,
    className,
    inlineIcon: InlineIcon,
    reverseIcon,
    text,
  } = props

  const ref = useRef(null)

  const { hasIntersected } = useIntersection({
    ref,
    rootMargin: '-75px',
  })

  if (text) {
    const words = text.trim().split(' ')

    if (Array.isArray(words) && words.length > 0) {
      return (
        <span
          className={[classes.highlightWrapper, className, classes[appearance]]
            .filter(Boolean)
            .join(' ')}
          ref={ref}
        >
          {words.map((word, index) => {
            const isFirstWord = index === 0
            const isLastWord = index === words.length - 1

            return (
              <span
                className={[
                  classes.highlightNode,
                  hasIntersected && classes.doHighlight,
                  bold && classes.bold,
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={index}
              >
                <span className={classes.label}>
                  {InlineIcon && reverseIcon && isFirstWord && (
                    <span className={classes.iconWrapper}>
                      {InlineIcon}
                      &nbsp;
                    </span>
                  )}
                  {!isLastWord && (
                    <Fragment>
                      {word}
                      &nbsp;
                    </Fragment>
                  )}
                  {isLastWord && (!InlineIcon || reverseIcon) && word}
                  {isLastWord &&
                    InlineIcon &&
                    !reverseIcon && ( // the icon and the last word need to render together, to prevent the icon from widowing
                      <span className={classes.iconWrapper}>
                        {word}
                        &nbsp;
                        {InlineIcon}
                      </span>
                    )}
                </span>
              </span>
            )
          })}
        </span>
      )
    }
  }

  return null
}
