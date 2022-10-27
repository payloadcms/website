import React from 'react'
import Marquee from 'react-fast-marquee'
import { Page } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import { ThemeProvider } from '../../providers/Theme'

import classes from './index.module.scss'

export const HomeHero: React.FC<Page['hero']> = () => {
  return (
    <ThemeProvider theme="dark" className={classes.homeHero}>
      <div className={classes.bg}>
        <Marquee gradient={false}>
          <img style={{ height: '100vh' }} src="/images/home-bg.png" alt="Screenshots of Payload" />
        </Marquee>
      </div>
      <Gutter left="half" right="half" className={classes.content}>
        Homepage hero
      </Gutter>
    </ThemeProvider>
  )
}
