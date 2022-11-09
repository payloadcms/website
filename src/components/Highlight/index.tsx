import React, { Fragment, useRef } from 'react'
import { useTheme } from '@providers/Theme'
import useIntersection from '@utilities/useIntersection'
import classes from './index.module.scss'

export const Highlight: React.FC<{
  text?: string
  bold?: boolean
  className?: string
  inlineIcon?: React.ReactElement
  highlightOnHover?: boolean
  highlight?: boolean
  reverseIcon?: boolean
}> = props => {
  const { bold, className, text, inlineIcon: InlineIcon, reverseIcon } = props

  const ref = useRef(null)

  const { hasIntersected } = useIntersection({
    ref,
    rootMargin: '-75px',
  })

  const theme = useTheme()

  if (text) {
    const words = text.trim().split(' ')

    if (Array.isArray(words) && words.length > 0) {
      return (
        <span
          ref={ref}
          className={[classes.highlightWrapper, className, theme === 'dark' && classes.darkMode]
            .filter(Boolean)
            .join(' ')}
        >
          {words.map((word, index) => {
            const isFirstWord = index === 0
            const isLastWord = index === words.length - 1

            return (
              <span
                key={index}
                className={[
                  classes.highlightNode,
                  hasIntersected && classes.doHighlight,
                  bold && classes.bold,
                ]
                  .filter(Boolean)
                  .join(' ')}
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
