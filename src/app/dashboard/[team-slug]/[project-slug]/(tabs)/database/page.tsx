'use client'

import * as React from 'react'
import { Secret } from '@forms/fields/Secret'

import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

export default () => {
  return (
    <div>
      <ExtendedBackground
        pixels
        upperChildren={
          <Secret
            label="Mongo Connection String"
            loadSecret={() => Promise.resolve('some-secret')}
          />
        }
        lowerChildren={
          <div className={classes.dbActions}>
            <div>Export</div>
            <div>Import</div>
            <div>Create Backup</div>
          </div>
        }
      />
    </div>
  )
}
