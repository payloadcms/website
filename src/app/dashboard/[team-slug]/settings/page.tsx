'use client'

import * as React from 'react'

import { Gutter } from '@components/Gutter'

import classes from './page.module.scss'

export default () => {
  return (
    <div className={classes.settings}>
      <Gutter>
        <div className={classes.content}>
          <h1>Settings</h1>
          <p>Coming soon...</p>
        </div>
      </Gutter>
    </div>
  )
}
