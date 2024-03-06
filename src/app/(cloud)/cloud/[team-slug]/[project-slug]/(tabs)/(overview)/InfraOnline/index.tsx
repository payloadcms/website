'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { Indicator } from '@root/app/_components/Indicator'
import { ClockIcon } from '@root/graphics/ClockIcon'
import { CommitIcon } from '@root/graphics/CommitIcon'
import { GitHubIcon } from '@root/graphics/GitHub'
import { BranchIcon } from '@root/icons/BranchIcon'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon'
import { Deployment, Project } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'
import { qs } from '@root/utilities/qs'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api'
import { DeploymentLogs } from '../DeploymentLogs'

import classes from './index.module.scss'

type FinalDeploymentStages = Extract<Deployment['deploymentStatus'], 'ACTIVE' | 'SUPERSEDED'>
const finalDeploymentStages: FinalDeploymentStages[] = ['ACTIVE', 'SUPERSEDED']

export const InfraOnline: React.FC<{
  project: Project
}> = props => {
  const { project } = props

  const {
    result: deployments,
    reqStatus,
    reload: reloadDeployments,
  } = useGetProjectDeployments({
    projectID: project?.id,
  })

  const latestDeployment = deployments?.[0]

  const [liveDeployment, setLiveDeployment] = React.useState<Deployment | null | undefined>()

  const triggerDeployment = React.useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/deploy`, {
      method: 'POST',
      credentials: 'include',
    }).then(res => {
      if (res.status === 200) {
        reloadDeployments()
        return toast.success('New deployment triggered successfully.')
      }

      if (res.status === 429) {
        return toast.error(
          'You can only manually deploy once per minute. Please wait and try again.',
        )
      }

      return toast.error('Failed to deploy')
    })
  }, [project?.id, reloadDeployments])

  // Poll deployments every 10 seconds
  React.useEffect(() => {
    let interval
    if (reqStatus && reqStatus < 400) {
      interval = setInterval(() => {
        reloadDeployments()
      }, 10_000)
    }

    return () => {
      interval && clearInterval(interval)
    }
  }, [reqStatus, reloadDeployments])

  // Set/fetch last successful deployment (for top banner card rendering)
  React.useEffect(() => {
    const fetchLiveDeployment = async () => {
      const query = qs.stringify({
        where: {
          and: [
            {
              project: {
                equals: project?.id,
              },
            },
            {
              deploymentStatus: {
                in: ['ACTIVE'],
              },
            },
          ],
        },
      })

      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deployments?${query}&limit=1`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const json = await req.json()

      if (json.docs?.[0]) {
        setLiveDeployment(json.docs[0])
      }
    }

    if (latestDeployment?.deploymentStatus === 'ACTIVE') {
      setLiveDeployment(latestDeployment)
    } else {
      const liveDeployment = deployments?.find(deployment => {
        return finalDeploymentStages.includes(deployment.deploymentStatus as FinalDeploymentStages)
      })

      if (liveDeployment) {
        setLiveDeployment(liveDeployment)
      } else {
        fetchLiveDeployment()
      }
    }
  }, [latestDeployment, deployments, project?.id])

  const projectDomains = [
    ...(project?.domains || []).map(domain => domain.domain),
    project?.defaultDomain,
  ]

  return (
    <React.Fragment>
      <Gutter>
        <ExtendedBackground
          pixels
          upperChildren={
            <Grid>
              <Cell start={1} cols={4} colsM={8}>
                <Label>URL</Label>
                {projectDomains.map((domain, index) => (
                  <a
                    key={`${domain}-${index}`}
                    title={domain}
                    className={[classes.detail, classes.domainLink].filter(Boolean).join(' ')}
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={classes.ellipseText}>{domain}</span>

                    <ExternalLinkIcon className={classes.externalLinkIcon} />
                  </a>
                ))}
              </Cell>
              <Cell start={5} cols={3} startM={1} colsM={8}>
                <Label>Deployment Details</Label>
                <div className={classes.deployDetails}>
                  {liveDeployment && (
                    <div className={classes.iconAndLabel}>
                      <ClockIcon />
                      <p>
                        {formatDate({
                          date: liveDeployment.createdAt,
                          format: 'dateAndTimeWithMinutes',
                        })}
                      </p>
                    </div>
                  )}
                  {!project?.repositoryFullName && (
                    <div className={classes.iconAndLabel}>
                      <GitHubIcon />
                      <p>No repository connected</p>
                    </div>
                  )}
                  {project?.repositoryFullName && !project?.deploymentBranch && (
                    <a
                      className={classes.iconAndLabel}
                      href={`https://github.com/${project?.repositoryFullName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={project?.repositoryFullName}
                    >
                      <GitHubIcon />
                      <p>{project?.repositoryFullName}</p>
                    </a>
                  )}
                  {project?.repositoryFullName && project?.deploymentBranch && (
                    <a
                      className={classes.iconAndLabel}
                      href={`https://github.com/${project?.repositoryFullName}/tree/${project?.deploymentBranch}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={project?.deploymentBranch}
                    >
                      <BranchIcon />
                      <p className={classes.ellipseText}>{project?.deploymentBranch}</p>
                    </a>
                  )}
                  {project?.repositoryFullName && liveDeployment?.commitSha ? (
                    <a
                      className={classes.iconAndLabel}
                      href={`https://github.com/${project?.repositoryFullName}/commit/${liveDeployment?.commitSha}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={liveDeployment?.commitMessage || 'No commit message'}
                    >
                      <CommitIcon />
                      <p className={classes.ellipseText}>
                        {liveDeployment?.commitMessage || 'No commit message'}
                      </p>
                    </a>
                  ) : (
                    <div className={classes.iconAndLabel}>
                      <CommitIcon />
                      <p className={classes.ellipseText}>
                        {liveDeployment?.commitMessage || 'No commit message'}
                      </p>
                    </div>
                  )}
                </div>
              </Cell>
              <Cell start={9} cols={4} startM={1} colsM={8}>
                <Label>Status</Label>
                <div className={classes.statusDetail}>
                  <Indicator
                    status={
                      liveDeployment === undefined
                        ? undefined
                        : finalDeploymentStages.includes(
                            liveDeployment?.deploymentStatus as FinalDeploymentStages,
                          )
                        ? 'SUCCESS'
                        : 'ERROR'
                    }
                  />
                  <p className={classes.detail}>
                    {liveDeployment === undefined
                      ? 'No status'
                      : finalDeploymentStages.includes(
                          liveDeployment?.deploymentStatus as FinalDeploymentStages,
                        )
                      ? 'Online'
                      : 'Offline'}
                  </p>
                </div>
              </Cell>
            </Grid>
          }
          lowerChildren={
            <div className={classes.reTriggerBackground}>
              <Grid className={classes.reTriggerGrid}>
                <Cell start={1} cols={4} colsM={8}>
                  <div>
                    <Button
                      appearance="secondary"
                      onClick={triggerDeployment}
                      label="Trigger Redeploy"
                    />
                  </div>
                </Cell>
                <Cell start={5} cols={3} startM={1} colsM={8}>
                  {!finalDeploymentStages.includes(
                    latestDeployment?.deploymentStatus as FinalDeploymentStages,
                  ) &&
                    project?.repositoryFullName && (
                      <div className={classes.deployDetails}>
                        {project?.deploymentBranch && (
                          <a
                            className={[classes.iconAndLabel, classes.deploymentIndicator].join(
                              ' ',
                            )}
                            href={`https://github.com/${project?.repositoryFullName}/tree/${project?.deploymentBranch}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DeploymentIndicator deployment={latestDeployment} />
                          </a>
                        )}
                        {project?.deploymentBranch && (
                          <a
                            className={classes.iconAndLabel}
                            href={`https://github.com/${project?.repositoryFullName}/tree/${project?.deploymentBranch}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={project?.deploymentBranch}
                          >
                            <BranchIcon />
                            <p className={classes.ellipseText}>{project?.deploymentBranch}</p>
                          </a>
                        )}
                        {latestDeployment?.commitSha ? (
                          <a
                            className={classes.iconAndLabel}
                            href={`https://github.com/${project?.repositoryFullName}/commit/${latestDeployment?.commitSha}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={latestDeployment?.commitMessage || 'No commit message'}
                          >
                            <CommitIcon />
                            <p className={classes.ellipseText}>
                              {latestDeployment?.commitMessage || 'No commit message'}
                            </p>
                          </a>
                        ) : (
                          <div className={classes.iconAndLabel}>
                            <CommitIcon />
                            <p className={classes.ellipseText}>
                              {latestDeployment?.commitMessage || 'No commit message'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                </Cell>
              </Grid>
            </div>
          }
        />
      </Gutter>

      {deployments?.length > 0 && (
        <DeploymentLogs key={latestDeployment.id} deployment={latestDeployment} />
      )}
    </React.Fragment>
  )
}

const DeploymentIndicator: React.FC<{ deployment: Deployment }> = ({ deployment }) => {
  let status: React.ComponentProps<typeof Indicator>['status'] = 'UNKNOWN'
  let spinner = false

  if (finalDeploymentStages.includes(deployment?.deploymentStatus as FinalDeploymentStages)) {
    status = 'SUCCESS'
  } else if (
    deployment?.deploymentStatus === 'CANCELED' ||
    deployment?.deploymentStatus === 'ERROR'
  ) {
    status = 'ERROR'
  } else if (
    deployment?.deploymentStatus === 'PENDING_BUILD' ||
    deployment?.deploymentStatus === 'PENDING_DEPLOY'
  ) {
    status = 'UNKNOWN'
    spinner = true
  } else if (
    deployment?.deploymentStatus === 'BUILDING' ||
    deployment?.deploymentStatus === 'DEPLOYING'
  ) {
    status = 'SUCCESS'
    spinner = true
  } else {
    status = 'UNKNOWN'
  }

  const titleCase = (str: Deployment['deploymentStatus']) => {
    return (
      str
        ?.toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || ''
    )
  }

  return (
    <>
      <Indicator status={status} spinner={spinner} />
      <p>{titleCase(deployment?.deploymentStatus)}</p>
    </>
  )
}
