import React from 'react'
import Marquee from 'react-fast-marquee'
import { Page } from '../../../payload-types'
import { Button } from '../../Button'
import { CMSLink } from '../../CMSLink'
import { Gutter } from '../../Gutter'
import { ArrowIcon } from '../../icons/ArrowIcon'
import { Media } from '../../Media'
import { ThemeProvider, useTheme } from '../../providers/Theme'
import RichText from '../../RichText'

import classes from './index.module.scss'

export const HomeHero: React.FC<Page['hero']> = ({ richText, adjectives, actions, buttons, media }) => {
  const theme = useTheme();

  return (
    <ThemeProvider theme="dark" className={classes.homeHero}>
      <div className={classes.bg}>
        <Marquee gradient={false}>
          <img className={classes.bgImage} style={{ height: '100vh' }} src="/images/home-bg.png" alt="Screenshots of Payload" />
        </Marquee>
      </div>
      <div className={classes.wrap}>
        <Gutter left="half" right="half">
          <div className={classes.content}>
            <RichText className={classes.richText} content={richText} />
            <div className={classes.sidebar}>
              {Array.isArray(actions) && (
                <ul className={classes.actions}>
                  {actions.map(({ link }, i) => {
                    return (
                      <li key={i}>
                        <CMSLink {...link}>
                          <ArrowIcon />
                        </CMSLink>
                      </li>
                    )
                  })}
                </ul>
              )}
              {Array.isArray(buttons) && (
                <ul className={classes.buttons}>
                  {buttons.map(({ link }, i) => {
                    return (
                      <li key={i}>
                        <Button {...link} />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
          <hr />
        </Gutter>
        {Array.isArray(adjectives) && (
          <Marquee gradient={false} speed={70} className={classes.adjectives}>
            {adjectives.map(({ adjective }, i) => (
              <span key={i} className={classes.adjective}>{adjective}</span>
            ))}
          </Marquee>
        )}
        {typeof media === 'object' && (
          <Gutter className={`${classes.mediaGutter} ${classes[`mediaGutter--${theme}`]}`}>
            <Media resource={media} className={classes.media} />
          </Gutter>
        )}
      </div>
    </ThemeProvider>
  )
}
