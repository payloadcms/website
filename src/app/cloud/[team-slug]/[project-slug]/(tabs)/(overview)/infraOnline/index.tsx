'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { useRouteData } from '@cloud/context'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { Indicator } from '@root/app/_components/Indicator'
import { CommitIcon } from '@root/graphics/CommitIcon'
import { GitHubIcon } from '@root/graphics/GitHub'
import { BranchIcon } from '@root/icons/BranchIcon'
import { ExternalLinkIcon } from '@root/icons/ExternalLinkIcon'
import { Deployment } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'
import { qs } from '@root/utilities/qs'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api'
import { DeploymentLogs } from '../DeploymentLogs'

import classes from './index.module.scss'

const finalDeploymentStages: Deployment['deploymentStatus'][] = ['ACTIVE', 'SUPERSEDED']

export const InfraOnline: React.FC = () => {
  const { project } = useRouteData()

  const {
    result: deployments,
    reqStatus,
    reload: reloadDeployments,
  } = useGetProjectDeployments({
    projectID: project?.id,
  })

  const latestDeployment = deployments?.[0]

  const [activeDeployment, setActiveDeployment] = React.useState<Deployment | null | undefined>()

  const triggerDeployment = React.useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/deploy`, {
      method: 'POST',
      credentials: 'include',
    }).then(res => {
      if (res.status === 200) {
        reloadDeployments()
        return toast.success('New deployment triggered successfully')
      }
      if (res.status === 429) {
        return toast.error(
          'You can only manually deploy once per minute. Please wait and try again.',
        )
      }

      return toast.error('Failed to deploy')
    })
  }, [project?.id, reloadDeployments])

  //
  // poll deployments every 10 seconds
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

  //
  // set/fetch last active deployment (for top banner card rendering)
  React.useEffect(() => {
    const fetchLastActiveDeployment = async () => {
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
        setActiveDeployment(json.docs[0])
      }
    }

    if (latestDeployment?.deploymentStatus === 'ACTIVE') {
      setActiveDeployment(latestDeployment)
    } else {
      const lastActiveDeployment = deployments?.find(deployment => {
        return finalDeploymentStages.includes(deployment.deploymentStatus)
      })

      if (lastActiveDeployment) {
        setActiveDeployment(lastActiveDeployment)
      } else {
        fetchLastActiveDeployment()
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
                  <div key={`${domain}-${index}`} className={classes.textMask} title={domain}>
                    <a
                      className={[classes.detail, classes.domainLink].filter(Boolean).join(' ')}
                      href={`https://${domain}`}
                      target="_blank"
                    >
                      <span>{domain}</span>

                      <ExternalLinkIcon className={classes.externalLinkIcon} />
                    </a>
                  </div>
                ))}
              </Cell>
              <Cell start={5} cols={3} startM={1} colsM={8}>
                <Label>Deployment Created At</Label>
                <p className={classes.detail}>
                  {activeDeployment
                    ? formatDate({ date: activeDeployment.createdAt, format: 'dateAndTime' })
                    : 'No deployments'}
                </p>
              </Cell>
              <Cell start={9} cols={4} startM={1} colsM={8}>
                <Label>Status</Label>
                <div className={classes.statusDetail}>
                  <Indicator
                    status={
                      activeDeployment === undefined
                        ? 'info'
                        : finalDeploymentStages.includes(activeDeployment?.deploymentStatus)
                        ? 'success'
                        : 'error'
                    }
                  />
                  <p className={classes.detail}>
                    {activeDeployment === undefined
                      ? 'No status'
                      : finalDeploymentStages.includes(activeDeployment?.deploymentStatus)
                      ? 'Online'
                      : 'Offline'}
                  </p>
                </div>
              </Cell>
            </Grid>
          }
          lowerChildren={
            <div className={classes.reTriggerBackground}>
              <div>
                <Button
                  appearance="secondary"
                  onClick={triggerDeployment}
                  label="Trigger Redeploy"
                />
              </div>
              <div className={classes.deployDetails}>
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
                  >
                    <BranchIcon />
                    <p>{project?.deploymentBranch}</p>
                  </a>
                )}
                {project?.repositoryFullName && activeDeployment?.commitSha ? (
                  <a
                    className={classes.iconAndLabel}
                    href={`https://github.com/${project?.repositoryFullName}/commit/${activeDeployment?.commitSha}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CommitIcon />
                    <p>{activeDeployment?.commitMessage || 'No commit message'}</p>
                  </a>
                ) : (
                  <div className={classes.iconAndLabel}>
                    <CommitIcon />
                    <p>{activeDeployment?.commitMessage || 'No commit message'}</p>
                  </div>
                )}
              </div>
            </div>
          }
        />
      </Gutter>
      {deployments?.length > 0 && <DeploymentLogs deployment={latestDeployment} />}
    </React.Fragment>
  )
}
