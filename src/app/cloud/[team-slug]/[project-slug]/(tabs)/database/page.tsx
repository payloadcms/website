'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Secret } from '@forms/fields/Secret'

import { Heading } from '@components/Heading'
import { Label } from '@components/Label'
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
          lowerChildren={
            <div className={classes.dbActions}>
              <div>Export</div>
              <div>Import</div>
              <div>Create Backup</div>
            </div>
          }
        />

        <div className={classes.backupHeader}>
          <Heading marginTop={false} element="h5" className={classes.backupHeading}>
            Backups
          </Heading>

          <Label className={classes.backupCount}>3 of 10</Label>
        </div>

        <div className={classes.backupsList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <ExtendedBackground
              className={classes.backup}
              key={i}
              upperChildren={
                <div className={classes.backupActions}>
                  <div>February 27rd, 2023, 3:54pm</div>

                  <div className={classes.actionsContainer}>
                    <div>Download</div>
                    <div>Restore</div>
                    <div>Delete</div>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </Cell>
    </Grid>
  )
}
