'use client'

import * as React from 'react'
import { fetchProjectClient } from '@cloud/_api/fetchProjects.js'
import Link from 'next/link'

import { Banner } from '@components/Banner/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { Label } from '@components/Label/index.js'
import { ExtendedBackground } from '@components/ExtendedBackground/index.js'
import { Indicator } from '@components/Indicator/index.js'
import { Message } from '@components/Message/index.js'
import { Project, Team } from '@root/payload-cloud-types.js'
import { RequireField } from '@root/ts-helpers/requireField.js'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api.js'
import { DeploymentLogs } from '../DeploymentLogs/index.js'

import classes from './index.module.scss'

type DeploymentPhases = RequireField<Project, 'infraStatus'>['infraStatus']
type DeploymentStates = {
  [key in DeploymentPhases]: {
    status: 'SUCCESS' | 'ERROR' | 'SUSPENDED'
    label: string
    timeframe?: string
    step?: number
  }
}

const deploymentStates: DeploymentStates = {
  notStarted: {
    step: 0,
    status: 'SUCCESS',
    label: 'Setting up your project',
  },
  reinstating: {
    step: 0,
    status: 'SUCCESS',
    label: 'Reinstating your project',
  },
  awaitingDatabase: {
    step: 1,
    status: 'SUCCESS',
    label: 'Deploying project database',
    timeframe: '1 to 3 min',
  },
  deploying: {
    step: 2,
    status: 'SUCCESS',
    label: 'Deploying your project',
    timeframe: '5 to 10 min',
  },
  done: {
    step: 4,
    status: 'SUCCESS',
    label: 'Deployment complete, reloading page',
  },
  suspended: {
    step: 0,
    status: 'SUSPENDED',
    label: 'Suspended. Contact info@payloadcms.com if you think this was a mistake.',
  },
  error: {
    step: 0,
    status: 'ERROR',
    label: 'Deployment failed',
  },
  deployError: {
    step: 0,
    status: 'ERROR',
    label: 'Deployment failed',
  },
  appCreationError: {
    step: 0,
    status: 'ERROR',
    label: 'Failed to create application',
  },
  infraCreationError: {
    step: 0,
    status: 'ERROR',
    label: 'Failed to create infrastructure',
  },
  reinstatingError: {
    step: 0,
    status: 'ERROR',
    label: 'Failed to reinstate project',
  },
  suspendingError: {
    step: 0,
    status: 'ERROR',
    label: 'Failed to suspend project',
  },
}

const initialDeploymentPhases: DeploymentPhases[] = [
  'notStarted',
  'awaitingDatabase',
  'deploying',
  'reinstating',
]

export const InfraOffline: React.FC<{
  project: Project
  team: Team
}> = props => {
  const { project: initialProject, team } = props
  const [project, setProject] = React.useState(initialProject)

  const reloadProject = React.useCallback(async () => {
    const newProject = await fetchProjectClient({
      teamID: team.id,
      projectSlug: initialProject.slug,
    })

    setProject(newProject)

    if (newProject.infraStatus === 'done') {
      // reload the page because the layout conditionally renders tabs based on `infraStatus`
      // there is no state in server components, so we have to reload so that Next.js will recompile
      window.location.reload()
    }
  }, [initialProject, team])

  const infraStatus = project?.infraStatus || 'notStarted'
  const failedDeployment = [
    'error',
    'deployError',
    'appCreationError',
    'infraCreationError',
  ].includes(infraStatus)
  const deploymentStep = deploymentStates[infraStatus]

  const {
    result: deployments,
    reqStatus,
    reload: reloadDeployments,
  } = useGetProjectDeployments({
    projectID: project?.id,
  })

  const latestDeployment = deployments?.[0]

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

  const unsuccessfulDeployment =
    latestDeployment &&
    (latestDeployment.deploymentStatus === 'DEPLOYING' ||
      latestDeployment.deploymentStatus === 'CANCELED' ||
      latestDeployment.deploymentStatus === 'ERROR')

  const hasDeployedBefore =
    latestDeployment &&
    (latestDeployment.deploymentStatus === 'ACTIVE' ||
      latestDeployment.deploymentStatus === 'SUPERSEDED')

  let label = ''
  if (infraStatus === 'suspended') {
    label = 'Project has been suspended'
  } else if (infraStatus === 'reinstating') {
    label = 'Reinstating in progress'
  } else {
    label = `Initial Deployment ${failedDeployment ? 'failed' : 'in progress'}`
  }

  return (
    <>
      <Gutter>
        <ExtendedBackground
          borderHighlight={!failedDeployment && infraStatus !== 'suspended'}
          pixels
          upperChildren={
            <div className={classes.content}>
              <div className={classes.indication}>
                <div className={classes.indicationLine}>
                  <Indicator
                    status={deploymentStep?.status}
                    spinner={initialDeploymentPhases.includes(infraStatus)}
                  />
                  <Label>{label}</Label>
                </div>
                <div
                  className={[
                    classes.progressBar,
                    classes[`step--${deploymentStep.step}`],
                    classes[`status--${deploymentStep?.status?.toLocaleLowerCase()}`],
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                {failedDeployment ? (
                  <Message
                    error={
                      <React.Fragment>
                        {`There was an error deploying your app. Push another commit `}
                        <Link
                          href={`https://github.com/${project?.repositoryFullName}`}
                          rel="noopener"
                          target="_blank"
                        >
                          to your repository
                        </Link>
                        {` to re-trigger a deployment.${
                          unsuccessfulDeployment || hasDeployedBefore
                            ? ' Check the logs below for more information.'
                            : ''
                        }`}
                      </React.Fragment>
                    }
                  />
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
              {failedDeployment && (!unsuccessfulDeployment || !hasDeployedBefore) && (
                <React.Fragment>
                  <div className={classes.tips}>
                    <Heading element="h4" marginTop={false}>
                      Troubleshooting help
                    </Heading>
                    {!unsuccessfulDeployment && (
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
                    {unsuccessfulDeployment && !hasDeployedBefore && (
                      <>
                        <h6>Ensure Local Build</h6>
                        <p className={classes.helpText}>Ensure that your project builds locally.</p>

                        <h6>Check Run Script</h6>
                        <p className={classes.helpText}>
                          Check that your Project's Run Script is the correct command for the script
                          in your package.json
                        </p>

                        <h6>Required ENV variables</h6>
                        <p className={classes.helpText}>
                          Your Payload config must use <code>MONGODB_URI/DATABASE_URI</code> and{' '}
                          <code>PAYLOAD_SECRET</code> variables. Payload Cloud provides these for
                          you. Ensure your spelling is correct.
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
                    We would love to help! Please provide your issue and Project ID from Settings
                    -&gt; Billing.
                  </Banner>
                </React.Fragment>
              )}
            </div>
          }
        />
      </Gutter>

      {latestDeployment && infraStatus !== 'suspended' && (
        <DeploymentLogs key={latestDeployment?.id} deployment={latestDeployment} />
      )}
    </>
  )
}
