'use client'

import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { Gutter } from '../../../../../components/Gutter'
import { Doc } from '../data'
import classes from './index.module.scss'

export const RenderDoc: React.FC<Doc> = ({ data }) => {
  const { title } = data

  return (
    <Gutter left="half" right="half" className={classes.wrap}>
      <nav className={classes.nav}></nav>
      <Grid className={classes.grid}>
        <Cell start={2} cols={8}>
          <h1 className={classes.title}>{title}</h1>
        </Cell>
      </Grid>
    </Gutter>
  )
}
