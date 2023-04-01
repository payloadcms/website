'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Secret } from '@forms/fields/Secret'

import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

export default () => {
  return (
    <Grid>
      <Cell start={1} colsXL={12} colsL={12}>
        <ExtendedBackground
          pixels
          upperChildren={
            <Secret
              label="Mongo Connection String"
              loadSecret={() => Promise.resolve('some-secret')}
            />
          }
        />
      </Cell>
    </Grid>
  )
}
