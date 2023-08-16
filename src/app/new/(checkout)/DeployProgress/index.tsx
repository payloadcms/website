'use client'

import React, { useEffect } from 'react'
import { useFormProcessing } from '@forms/Form/context'

import { GithubIcon } from '@root/graphics/GithubIcon'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const DeployProgress: React.FC<{
  repositoryFullName?: Project['repositoryFullName']
  destination?: string
  id?: string
}> = props => {
  const { id, repositoryFullName } = props
  const formProcessing = useFormProcessing()
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && formProcessing) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [ref, formProcessing])

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
}
