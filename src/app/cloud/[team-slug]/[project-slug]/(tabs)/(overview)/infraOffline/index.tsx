'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import Link from 'next/link'

import { Banner } from '@components/Banner'
import { Heading } from '@components/Heading'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { Indicator } from '@root/app/_components/Indicator'
import { formatLogData, SimpleLogs } from '@root/app/_components/SimpleLogs'
import { Project } from '@root/payload-cloud-types'
import { RequireField } from '@root/ts-helpers/requireField'
import { useWebSocket } from '@root/utilities/use-websocket'

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

const loggingStates: DeploymentPhases[] = ['deploying', 'deployError']
const buildingStates: DeploymentPhases[] = ['awaitingDatabase', 'deploying']

export const InfraOffline: React.FC = () => {
  const { project, reloadProject, team } = useRouteData()
  const { infraStatus = 'notStarted' } = project
  const failedDeployment = ['error', 'deployError', 'appCreationError'].includes(infraStatus)
  const deploymentStep = deploymentStates[infraStatus]
  const [latestDeployment, setLatestDeployment] = React.useState<any>(null)
  const [logs, setLogs] = React.useState<any>([])
  const [attemptedDeploymentFetch, setAttemptedDeploymentFetch] = React.useState(false)

  const onMessage = React.useCallback(event => {
    const message = event?.data

    try {
      const parsedMessage = JSON.parse(message)
      const incomingLogData = parsedMessage?.data

      if (incomingLogData) {
        const formattedLogs = formatLogData(incomingLogData)

        if (parsedMessage?.logType === 'historic') {
          // historic logs - replace
          setLogs(formattedLogs)
        } else {
          // live log - append
          setLogs(existingLogs => [...existingLogs, ...formattedLogs])
        }
      }
    } catch (e) {
      // fail silently
    }
  }, [])

  const preventSocket =
    latestDeployment?.deploymentStatus &&
    ['PENDING_BUILD'].includes(latestDeployment.deploymentStatus)
  useWebSocket({
    url:
      !preventSocket && latestDeployment?.id
        ? `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deployments/${latestDeployment.id}/logs?${latestDeployment.deploymentStatus}`.replace(
            'http',
            'ws',
          )
        : '',
    onMessage,
  })

  const fetchLatestDeployment = React.useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deployments?where[project][equals]=${project.id}&limit=1&depth=0`,
        {
          credentials: 'include',
        },
      )
      const data = await res.json()
      if (data?.docs?.[0]) {
        setLatestDeployment(data.docs[0])
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }, [project.id])

  React.useEffect(() => {
    let timerId

    if (!['done'].includes(infraStatus)) {
      timerId = setInterval(() => {
        reloadProject()
      }, 5_000) // Poll every 5 seconds
    }

    return () => {
      clearInterval(timerId)
    }
  }, [reloadProject, infraStatus])

  React.useEffect(() => {
    let interval
    if (loggingStates.includes(infraStatus)) {
      interval = setInterval(
        () => {
          fetchLatestDeployment()
          setAttemptedDeploymentFetch(true)
        },
        !attemptedDeploymentFetch ? 0 : 10_000, // fetch immediately, then poll every 10 seconds
      )
    }

    return () => {
      clearInterval(interval)
    }
  }, [infraStatus, fetchLatestDeployment, attemptedDeploymentFetch])

  return (
    <>
      <ExtendedBackground
        pixels
        upperChildren={
          <React.Fragment>
            <div className={classes.details}>
              <div className={classes.indicationLine}>
                <Indicator
                  status={deploymentStep.status}
                  spinner={buildingStates.includes(infraStatus)}
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
                <h6>
                  Does the branch <code>{project.deploymentBranch}</code> exist?
                </h6>
                <p className={classes.helpText}>
                  Validate that your branch exists. If it doesn't, go to{' '}
                  <Link href={`/cloud/${team.slug}/${project.slug}/settings`}>Settings</Link> and
                  change your branch to a valid branch that exists.
                </p>
                <h6>Can you build your project locally?</h6>
                <p className={classes.helpText}>
                  If you're importing a project, make sure it can build on your local machine. If
                  you can't build locally, fix the errors and then push a commit to restart this
                  process.
                </p>
                <h6>Are you specifying a port correctly?</h6>
                <p className={classes.helpText}>
                  By default, Payload Cloud listens on port 3000. Make sure that your app is set up
                  to listen on port 3000, or go to{' '}
                  <Link href={`/cloud/${team.slug}/${project.slug}/settings`}>Settings</Link> and
                  specify a <code>PORT</code> environment variable to manually set the port to
                  listen on.
                </p>

                <Banner type="default" margin={false}>
                  Running into trouble? Connect with us on{' '}
                  <a href="https://discord.com/invite/r6sCXqVk3v" target="_blank">
                    discord
                  </a>
                  , we would love to help!
                </Banner>
              </React.Fragment>
            )}
          </React.Fragment>
        }
      />

      {latestDeployment && (
        <React.Fragment>
          <Heading element="h5" className={classes.consoleHeading}>
            Build logs
          </Heading>

          <ExtendedBackground upperChildren={<SimpleLogs logs={logs} />} />
        </React.Fragment>
      )}
    </>
  )
}
