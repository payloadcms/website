import React, { forwardRef } from 'react'
import { useFormProcessing } from '@forms/Form/context'

import { GithubIcon } from '@root/graphics/GithubIcon'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { FolderIcon } from '@root/icons/FolderIcon'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const DeployProgress = forwardRef<
  HTMLDivElement,
  {
    repositoryFullName?: Project['repositoryFullName']
    destination?: string
    id?: string
  }
>((props, ref) => {
  const { id, repositoryFullName } = props
  const formProcessing = useFormProcessing()

  return (
    <div
      className={[classes.deployProgress, formProcessing && classes.active]
        .filter(Boolean)
        .join(' ')}
    >
      <div ref={ref} className={classes.scrollTarget} id={id} />
      <div className={classes.header}>
        <div className={classes.icons}>
          <div className={classes.headerIcon}>
            <GithubIcon />
          </div>
          <div className={classes.dots}>
            <div>
              <div />
            </div>
            <div>
              <div />
            </div>
            <div>
              <div />
            </div>
          </div>
          <div className={classes.headerIcon}>
            <PayloadIcon />
          </div>
        </div>
        <div>{`Deploying ${repositoryFullName}`}</div>
      </div>
    </div>
  )
})
