import React from 'react'

import { Heading } from '@components/Heading'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'

import classes from './index.module.scss'

export const DatabaseBackups: React.FC = () => {
  return (
    <>
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
    </>
  )
}
