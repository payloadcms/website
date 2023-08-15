import React, { forwardRef } from 'react'
import { useForm, useFormProcessing } from '@forms/Form/context'

import { GithubIcon } from '@root/graphics/GithubIcon'
import { FolderIcon } from '@root/icons/FolderIcon'
import { Project, Template } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const CloneProgress = forwardRef<
  HTMLDivElement,
  {
    template?: Template
    destination?: string
    id?: string
  }
>((props, ref) => {
  const { template, destination, id } = props
  const formProcessing = useFormProcessing()
  const { templateOwner, templateRepo, templatePath } = template || {}

  const { fields } = useForm()

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
})
