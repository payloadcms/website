'use client'

import React, { useEffect, useRef } from 'react'
import { useForm, useFormProcessing } from '@forms/Form/context'

import { GithubIcon } from '@root/graphics/GithubIcon'
import { FolderIcon } from '@root/icons/FolderIcon'
import { Template } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const CloneProgress: React.FC<{
  template?: Template
  destination?: string
  id?: string
}> = props => {
  const { template, destination, id } = props
  const formProcessing = useFormProcessing()
  const { templateOwner, templateRepo, templatePath } = template || {}

  const { fields } = useForm()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && formProcessing) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [ref, formProcessing])

  return (
    <div
      className={[classes.cloneProgress, formProcessing && classes.active]
        .filter(Boolean)
        .join(' ')}
    >
      <div ref={ref} className={classes.scrollTarget} id={id} />
      <div className={classes.header}>
        <div className={classes.icons}>
          <div className={classes.headerIcon}>
            <FolderIcon size="full" />
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
            <GithubIcon />
          </div>
        </div>
        <div>
          {`Cloning ${templateOwner}/${templateRepo}${
            templatePath ? `/${templatePath}` : ''
          } into ${destination}/${fields?.repositoryName?.value}`}
        </div>
      </div>
    </div>
  )
}
