'use client'

import React, { Fragment, useEffect } from 'react'
import { Install } from '@cloud/_api/fetchInstalls.js'
import { useForm, useFormProcessing } from '@forms/Form/context.js'

import { GithubIcon } from '@root/graphics/GithubIcon/index.js'
import { PayloadIcon } from '@root/graphics/PayloadIcon/index.js'
import { FolderIcon } from '@root/icons/FolderIcon/index.js'
import { Project, Template } from '@root/payload-cloud-types.js'

import classes from './index.module.scss'

export const CloneOrDeployProgress: React.FC<
  {
    id?: string
  } & (
    | {
        type: 'clone'
        template: Template | undefined
        selectedInstall: Install | undefined
      }
    | {
        type: 'deploy'
        repositoryFullName: Project['repositoryFullName']
        destination: string | undefined
      }
  )
> = props => {
  const { type, id } = props

  const { fields } = useForm()

  const formProcessing = useFormProcessing()
  const ref = React.useRef<HTMLDivElement>(null)

  // this is the time is takes, in seconds
  // cloning large templates can take upwards of 20 seconds
  // so we display helpful messages to the user to ensure they remain patient
  const [progress, setProgress] = React.useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (ref.current && formProcessing) {
      ref.current.scrollIntoView({ behavior: 'smooth' })

      interval = setInterval(() => {
        setProgress(progress => progress + 1)
      }, 1000)
    }

    return () => {
      clearInterval(interval)
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
            {type === 'deploy' && <GithubIcon />}
            {type === 'clone' && <FolderIcon size="full" />}
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
            <div>
              <div />
            </div>
            <div>
              <div />
            </div>
          </div>
          <div className={classes.headerIcon}>
            {type === 'deploy' && <PayloadIcon />}
            {type === 'clone' && <GithubIcon />}
          </div>
        </div>
        <div className={classes.label}>
          {type === 'clone' && (
            <Fragment>
              {'Cloning '}
              <b>{`${props?.template?.templateOwner}/${props?.template?.templateRepo}${
                props?.template?.templatePath ? `/${props?.template?.templatePath}` : ''
              }`}</b>
              {' into '}
              <b>{`${(props?.selectedInstall?.account as { login: string })?.login}/${
                fields?.repositoryName?.value
              }`}</b>
            </Fragment>
          )}
          {type === 'deploy' && (
            <Fragment>
              {'Deploying '}
              <b>{props?.repositoryFullName}</b>
            </Fragment>
          )}
        </div>
        {progress >= 10 && (
          <p className={classes.progress}>
            <Fragment>
              {progress >= 10 && progress < 20 && 'Almost there, please wait...'}
              {progress >= 20 && progress < 30 && 'Still working, please wait...'}
              {progress >= 30 && 'This is taking longer than expected, please wait...'}
            </Fragment>
          </p>
        )}
      </div>
    </div>
  )
}
