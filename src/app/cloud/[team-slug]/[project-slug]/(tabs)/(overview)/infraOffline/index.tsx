'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import Link from 'next/link'

import { Banner } from '@components/Banner'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { Indicator } from '@root/app/_components/Indicator'
import { Project } from '@root/payload-cloud-types'
import { RequireField } from '@root/ts-helpers/requireField'

import classes from './index.module.scss'

type DeploymentStates = {
  [key in RequireField<Project, 'infraStatus'>['infraStatus']]: {
    status: 'success' | 'error' | 'warning'
    label: string
    timeframe?: string
    step?: number
  }
}

const deploymentStates: DeploymentStates = {
  notStarted: {
    step: 0,
    status: 'success',
    label: 'Setting up your project',
  },
  awaitingDatabase: {
    step: 1,
    status: 'success',
    label: 'Deploying project database',
    timeframe: '1 to 3 min',
  },
  deploying: {
    step: 2,
    status: 'success',
    label: 'Deploying your project',
    timeframe: '5 to 10 min',
  },
  done: {
    step: 4,
    status: 'success',
    label: 'Deployment complete!',
  },
  error: {
    step: 0,
    status: 'error',
    label: 'Deployment failed',
  },
  deployError: {
    step: 0,
    status: 'error',
    label: 'Deployment failed',
  },
  appCreationError: {
    step: 0,
    status: 'error',
    label: 'Failed to create the application',
  },
}

export const InfraOffline: React.FC = () => {
  const { project, reloadProject, team } = useRouteData()
  const { infraStatus = 'notStarted' } = project
  const failedDeployment = ['error', 'deployError'].includes(infraStatus)
  const deploymentStep = deploymentStates[infraStatus]

  React.useEffect(() => {
    let timerId

    if (!['done'].includes(infraStatus)) {
      timerId = setInterval(() => {
        reloadProject()
      }, 5000) // Poll every 5 seconds
    }

    return () => {
      clearInterval(timerId)
    }
  }, [reloadProject, infraStatus])

  return (
    <ExtendedBackground
      pixels
      upperChildren={
        <React.Fragment>
          <div className={classes.details}>
            <div className={classes.indicationLine}>
              <Indicator status={deploymentStep.status} />
              <Label>initial Deployment {failedDeployment ? 'failed' : 'in progress'}</Label>
            </div>

            <div
              className={[
                classes.progressBar,
                classes[`step--${deploymentStep.step}`],
                classes[`status--${deploymentStep.status}`],
              ]
                .filter(Boolean)
                .join(' ')}
            />

            {failedDeployment ? (
              <div>
                <Banner type="error" margin={false}>
                  There was an error deploying your app. Make sure you are able to build your
                  project locally, and then push another commit to your repository to re-trigger a
                  deployment.
                </Banner>
              </div>
            ) : (
              <div className={classes.statusLine}>
                <p>Status:</p>
                <p>
                  <b>{deploymentStep.label}</b>{' '}
                  {deploymentStep.timeframe ? `— (${deploymentStep.timeframe})` : ''}
                </p>
              </div>
            )}
          </div>
          {failedDeployment && (
            <React.Fragment>
              <h4>Troubleshooting help</h4>
              <h6>Does the branch "{project.deploymentBranch}" exist?</h6>
              <p>
                Validate that your branch exists. If it doesn't, go to{' '}
                <Link href={`/cloud/${team.slug}/${project.slug}/settings`}>Settings</Link> and
                change your branch to a valid branch that exists.
              </p>
              <h6>Can you build your project locally?</h6>
              <p>
                If you're importing a project, make sure it can build on your local machine. If you
                can't build locally, fix the errors and then push a commit to restart this process.
              </p>
              <h6>Are you specifying a port correctly?</h6>
              <p>
                By default, Payload Cloud listens on port 3000. Make sure that your app is set up to
                listen on port 3000, or go to{' '}
                <Link href={`/cloud/${team.slug}/${project.slug}/settings`}>Settings</Link>
                and specify a <code>PORT</code> environment variable to manually set the port to
                listen on.
              </p>
            </React.Fragment>
          )}
        </React.Fragment>
      }
    />
  )
}
