'use client'

import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { Gutter } from '../../../../../components/Gutter'
import { Topic } from '../types'
import classes from './index.module.scss'

export const DocsTemplate: React.FC<{ topics: Topic[]; children: React.ReactNode }> = ({
  // topics,
  children,
}) => {
  return (
    <Gutter left="half" right="half" className={classes.wrap}>
      <nav className={classes.nav}></nav>
      <Grid className={classes.grid}>
        <Cell start={2} cols={8}>
          {children}
        </Cell>
      </Grid>
    </Gutter>
  )
}
