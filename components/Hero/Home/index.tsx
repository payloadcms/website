import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import Marquee from 'react-fast-marquee'
import { Page } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import { ThemeProvider } from '../../providers/Theme'
import RichText from '../../RichText'

import classes from './index.module.scss'

export const HomeHero: React.FC<Page['hero']> = ({ richText }) => {
  return (
    <ThemeProvider theme="dark" className={classes.homeHero}>
      <div className={classes.bg}>
        <Marquee gradient={false}>
          <img style={{ height: '100vh' }} src="/images/home-bg.png" alt="Screenshots of Payload" />
        </Marquee>
      </div>
      <div className={classes.wrap}>
        <Gutter left="half" right="half">
          <div className={classes.content}>
            <RichText className={classes.richText} content={richText} />
          </div>
          <hr className={classes.hr} />
        </Gutter>
      </div>
    </ThemeProvider>
  )
}
