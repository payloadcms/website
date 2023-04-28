'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import Error from '@forms/Error'
import Link from 'next/link'

import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { Indicator } from '@root/app/_components/Indicator'
import { Project } from '@root/payload-cloud-types'
import { RequireField } from '@root/ts-helpers/requireField'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api'
import { DeploymentLogs } from '../DeploymentLogs'

import classes from './index.module.scss'

type DeploymentPhases = RequireField<Project, 'infraStatus'>['infraStatus']
type DeploymentStates = {
  [key in DeploymentPhases]: {
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

const initialDeploymentPhases: DeploymentPhases[] = ['notStarted', 'awaitingDatabase', 'deploying']

export const InfraOffline: React.FC = () => {
  const { project, reloadProject, team } = useRouteData()
  const infraStatus = project?.infraStatus || 'notStarted'
  const failedDeployment = ['error', 'deployError', 'appCreationError'].includes(infraStatus)
  const deploymentStep = deploymentStates[infraStatus]

  const [buildSuccess, setBuilt] = React.useState(false)
  const [deploySuccess, setDeployed] = React.useState(false)

  const {
    result: deployments,
    reqStatus,
    reload: reloadDeployments,
  } = useGetProjectDeployments({
    projectID: project?.id,
  })
  const latestDeployment = deployments?.[0]

  //
  // poll project for updates every 10 seconds
  React.useEffect(() => {
    let projectInterval

    if (!['done'].includes(infraStatus)) {
      projectInterval = setInterval(() => {
        reloadProject()
      }, 10_000)
    }

    return () => {
      clearInterval(projectInterval)
    }
  }, [reloadProject, infraStatus])

  //
  // poll deployments every 10 seconds
  React.useEffect(() => {
    let deploymentInterval
    if (reqStatus && reqStatus < 400) {
      deploymentInterval = setInterval(() => {
        reloadDeployments()
      }, 10_000)
    }

    return () => {
      deploymentInterval && clearInterval(deploymentInterval)
    }
  }, [reqStatus, reloadDeployments])

  return (
    <>
      <Gutter>
        <ExtendedBackground
          pixels
          upperChildren={
            <React.Fragment>
              <div className={classes.details}>
                <div className={classes.indicationLine}>
                  <Indicator
                    status={deploymentStep.status}
                    spinner={initialDeploymentPhases.includes(infraStatus)}
                  />
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
                    <Error
                      showError
                      message={`There was an error deploying your app. Push another commit to your repository to re-trigger a deployment.${
                        (buildSuccess || deploySuccess) &&
                        ' Check the logs below for more information.'
                      }`}
                    ></Error>
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

              {failedDeployment && (!buildSuccess || !deploySuccess) && (
                <React.Fragment>
                  <div className={classes.tips}>
                    <h4>Troubleshooting help</h4>
                    {!buildSuccess && (
                      <>
                        <h6>
                          Does the branch <code>{project?.deploymentBranch}</code> exist?
                        </h6>
                        <p className={classes.helpText}>
                          Validate that your branch exists. If it doesn't, go to{' '}
                          <Link href={`/cloud/${team?.slug}/${project?.slug}/settings`}>
                            Settings
                          </Link>{' '}
                          and change your branch to a valid branch that exists.
                        </p>
                        <h6>Can you build your project locally?</h6>
                        <p className={classes.helpText}>
                          If you're importing a project, make sure it can build on your local
                          machine. If you can't build locally, fix the errors and then push a commit
                          to restart this process.
                        </p>
                      </>
                    )}

                    {buildSuccess && !deploySuccess && (
                      <>
                        <h6>Required ENV variables</h6>
                        <p className={classes.helpText}>
                          Your <code>payload.init()</code> function must use{' '}
                          <code>MONGODB_URI</code> and <code>PAYLOAD_SECRET</code> variables.
                          Payload Cloud provides these for you. Ensure your spelling is correct.
                        </p>

                        <h6>Are you specifying a port correctly?</h6>
                        <p className={classes.helpText}>
                          By default, Payload Cloud listens on port 3000. Make sure that your app is
                          set up to listen on port 3000, or go to{' '}
                          <Link href={`/cloud/${team?.slug}/${project?.slug}/settings`}>
                            Settings
                          </Link>{' '}
                          and specify a <code>PORT</code> environment variable to manually set the
                          port to listen on.
                        </p>
                      </>
                    )}
                  </div>

                  <Banner type="default" margin={false}>
                    Still running into trouble? Connect with us on{' '}
                    <a href="https://discord.com/invite/r6sCXqVk3v" target="_blank">
                      discord.
                    </a>{' '}
                    We would love to help!
                  </Banner>
                </React.Fragment>
              )}
            </React.Fragment>
          }
        />
      </Gutter>

      {latestDeployment && (
        <DeploymentLogs
          deployment={latestDeployment}
          setBuilt={setBuilt}
          setDeployed={setDeployed}
        />
      )}
    </>
  )
}
