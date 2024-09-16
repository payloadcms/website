'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Indicator } from '@components/Indicator/index.js'
import { CommitIcon } from '@root/graphics/CommitIcon/index.js'
import { GitHubIcon } from '@root/graphics/GitHub/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { BranchIcon } from '@root/icons/BranchIcon/index.js'
import { Deployment, Project } from '@root/payload-cloud-types.js'
import { formatDate } from '@root/utilities/format-date-time.js'
import { qs } from '@root/utilities/qs.js'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api.js'
import { DeploymentLogs } from '../DeploymentLogs/index.js'

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
  const [redeployTriggered, setRedeployTriggered] = React.useState(false)

  const triggerDeployment = React.useCallback(() => {
    setRedeployTriggered(true)
    fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/deploy`, {
      method: 'POST',
      credentials: 'include',
    }).then(res => {
      setRedeployTriggered(false)

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
        <div className={classes.deploymentWrapper}>
          <div className={[classes.domainAndDetails, 'grid'].join(' ')}>
            <div className={[classes.domains, 'cols-12 cols-l-10 cols-m-8'].join(' ')}>
              <h6>Live Deployment</h6>
              {projectDomains.map((domain, index) => (
                <a
                  key={`${domain}-${index}`}
                  title={domain}
                  className={[classes.domainLink].filter(Boolean).join(' ')}
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={classes.ellipseText}>{domain}</span>
                  <ArrowIcon size={index === 0 ? 'medium' : 'small'} />
                </a>
              ))}
            </div>
            <div className={[classes.deploymentDetails, 'cols-4 cols-l-6 cols-m-8'].join(' ')}>
              <h6>Deployment Details</h6>
              {liveDeployment && (
                <p>
                  {formatDate({
                    date: liveDeployment.createdAt,
                    format: 'dateAndTimeWithMinutes',
                  })}
                </p>
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
          </div>
          <div className={[classes.statusWrapper, 'grid'].join(' ')}>
            <BackgroundScanline />
            <div className={[classes.status, 'cols-12 cols-l-8 cols-m-4 cols-s-8'].join(' ')}>
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
              <button
                onClick={triggerDeployment}
                className={classes.reTriggerButton}
                disabled={redeployTriggered}
              >
                {redeployTriggered ? 'Redploying...' : 'Trigger Redeploy'}
              </button>
            </div>
          </div>
        </div>
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
