import { useWindowInfo } from '@faceless-ui/window-info';
import React, { Fragment, useState } from 'react';
import { useTheme } from '../providers/Theme';
import classes from './index.module.scss';

export const Highlight: React.FC<{
  text?: string
  textColor?: string
  backgroundColor?: string
  bold?: boolean
  className?: string
  inlineIcon?: React.ReactElement
  highlightOnHover?: boolean
  highlight?: boolean
  reverseIcon?: boolean
}> = (props) => {
  const {
    backgroundColor: backgroundColorFromProps,
    textColor: textColorFromProps,
    bold,
    className,
    text,
    inlineIcon: InlineIcon,
    highlightOnHover,
    highlight,
    reverseIcon,
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const theme = useTheme();
  const isInverted = theme === 'dark';

  const doHighlight = highlight !== false || (highlightOnHover && isHovered);

  let textColor = ''

  if (doHighlight) {
    textColor = textColorFromProps || `dark-${colorTheme}`;

    if (isInverted) {
      if (!textColorFromProps) textColor = 'white'
    }
  }

  const {
    breakpoints: {
      m: midBreak
    } = {}
  } = useWindowInfo();

  if (text) {
    const words = text.trim().split(' ');

    if (Array.isArray(words) && words.length > 0) {
      return (
        <span
          className={[
            classes.highlightWrapper,
            className
          ].filter(Boolean).join(' ')}
          onMouseEnter={() => {
            if (highlightOnHover && !midBreak) {
              setIsHovered(true)
            }
          }}
          onMouseLeave={() => {
            if (highlightOnHover && !midBreak) {
              setIsHovered(false)
            }
          }}
        >
          {words.map((word, index) => {
            const isFirstWord = index === 0;
            const isLastWord = index === words.length - 1;

            return (
              <span
                key={index}
                className={[
                  classes.highlightNode,
                  textColor && classes[`textColor--${textColor}`],
                  doHighlight && classes.doHighlight,
                  bold && classes.bold,
                ].filter(Boolean).join(' ')}
              >
                <span className={classes.label}>
                  {(InlineIcon && reverseIcon && isFirstWord) && (
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
                  {isLastWord && InlineIcon && !reverseIcon && ( // the icon and the last word need to render together, to prevent the icon from widowing
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
