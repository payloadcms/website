'use client'

import type { Deployment, Project } from '@root/payload-cloud-types.js'

import { Tabs } from '@cloud/_components/Tabs/index.js'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { Button } from '@components/Button/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Indicator } from '@components/Indicator/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { useModal } from '@faceless-ui/modal'
import Submit from '@forms/Submit/index.js'
import { CloseIcon } from '@icons/CloseIcon/index.js'
import { CommitIcon } from '@root/graphics/CommitIcon/index.js'
import { GitHubIcon } from '@root/graphics/GitHub/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { BranchIcon } from '@root/icons/BranchIcon/index.js'
import { formatDate } from '@root/utilities/format-date-time.js'
import { qs } from '@root/utilities/qs.js'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api.js'
import * as React from 'react'
import { toast } from 'sonner'

import { DeploymentLogs } from '../DeploymentLogs/index.js'
import classes from './index.module.scss'

type FinalDeploymentStages = Extract<Deployment['deploymentStatus'], 'ACTIVE' | 'SUPERSEDED'>
const finalDeploymentStages: FinalDeploymentStages[] = ['ACTIVE', 'SUPERSEDED']

export const InfraOnline: React.FC<{
  environmentSlug: string
  project: Project
}> = (props) => {
  const { environmentSlug, project } = props

  const {
    reload: reloadDeployments,
    reqStatus,
    result: deployments,
  } = useGetProjectDeployments({
    environmentSlug,
    projectID: project?.id,
  })

  const latestDeployment = deployments?.[0]

  const [liveDeployment, setLiveDeployment] = React.useState<Deployment | null | undefined>()
  const [redeployTriggered, setRedeployTriggered] = React.useState(false)
  const [redeployModalTabIndex, setRedeployModalTabIndex] = React.useState(0)

  const { closeModal, openModal } = useModal()

  const handleModalClose = React.useCallback(
    (slug: string) => {
      closeModal(slug)
      setRedeployModalTabIndex(0)
    },
    [closeModal],
  )

  const triggerDeployment = React.useCallback(
    (
      type: 'deploy' | 'force-rebuild' | 'restart',
      options: {
        clearBuildCache?: boolean
      },
    ) => {
      setRedeployTriggered(true)

      const body = {
        type,
        options,
      }

      const query = qs.stringify({
        env: environmentSlug,
      })

      fetch(
        `
        ${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/deploy${
          query ? `?${query}` : ''
        }`,
        {
          body: JSON.stringify(body),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      )
        .then((res) => {
          setRedeployTriggered(false)

          if (res.status === 200) {
            handleModalClose('redeploy-modal')
            reloadDeployments()
            return toast.success('New deployment triggered successfully.')
          }

          if (res.status === 429) {
            return toast.error(
              'You can only manually deploy once per minute. Please wait and try again.',
            )
          }

          handleModalClose('redeploy-modal')
          return toast.error('Failed to deploy')
        })
        .catch(() => {
          setRedeployTriggered(false)
          handleModalClose('redeploy-modal')
          toast.error('Failed to deploy')
        })
    },
    [environmentSlug, handleModalClose, project?.id, reloadDeployments],
  )

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
              environmentSlug: {
                equals: environmentSlug,
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
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
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
      const liveDeployment = deployments?.find((deployment) => {
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
    ...(project?.domains || []).map((domain) => domain.domain),
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
                  className={[classes.domainLink].filter(Boolean).join(' ')}
                  href={`https://${domain}`}
                  key={`${domain}-${index}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={domain}
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
                  rel="noopener noreferrer"
                  target="_blank"
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
                  rel="noopener noreferrer"
                  target="_blank"
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
                  rel="noopener noreferrer"
                  target="_blank"
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
                className={classes.reTriggerButton}
                disabled={redeployTriggered}
                onClick={() => openModal('redeploy-modal')}
                type="button"
              >
                {redeployTriggered ? 'Redeploying...' : 'Trigger Redeploy'}
              </button>
            </div>
          </div>
        </div>
        <ModalWindow className={classes.redeployModal} slug="redeploy-modal">
          <header className={classes.modalHeader}>
            <h4>Redeploy</h4>
            <button
              className={classes.modalCloseButton}
              onClick={() => handleModalClose('redeploy-modal')}
              type="button"
            >
              <CloseIcon size="large" />
            </button>
          </header>
          <Tabs
            className={classes.modalTabs}
            tabs={[
              {
                isActive: redeployModalTabIndex === 0,
                label: 'Deploy',
                onClick: () => setRedeployModalTabIndex(0),
              },
              {
                isActive: redeployModalTabIndex === 1,
                label: 'Force rebuild and deploy',
                onClick: () => setRedeployModalTabIndex(1),
              },
              {
                isActive: redeployModalTabIndex === 2,
                label: 'Restart',
                onClick: () => setRedeployModalTabIndex(2),
              },
            ]}
          />
          {redeployModalTabIndex === 0 ? (
            // Deploy
            <form
              className={classes.modalContent}
              id="deploy-form"
              onSubmit={(e) => {
                e.preventDefault()
                triggerDeployment('deploy', {})
              }}
            >
              <p>Deploying your app will:</p>
              <ul>
                <li>Fetch any updates from your source repository and rebuild if needed</li>
                <li>Not result in any down time</li>
              </ul>
              <hr />
              <div className={classes.modalActions}>
                <Button
                  appearance={'secondary'}
                  label={'Cancel'}
                  onClick={() => handleModalClose('redeploy-modal')}
                />
                <Submit appearance={'primary'} label={'Deploy'} />
              </div>
            </form>
          ) : redeployModalTabIndex === 1 ? (
            // Force rebuild and deploy
            <form
              className={classes.modalContent}
              id="force-rebuild-form"
              onSubmit={(e) => {
                e.preventDefault()
                triggerDeployment('force-rebuild', {
                  clearBuildCache: e.target['clear-build-cache'].checked,
                })
              }}
            >
              <p>Force rebuild and deploy will:</p>
              <ul>
                <li>
                  Rebuild your entire app from the source repository with the latest updates, even
                  if the source code has not changed
                </li>
                <li>Not result in any down time</li>
              </ul>
              <label htmlFor="clear-build-cache" id="clear-build-cache-label">
                <input
                  aria-labelledby="clear-build-cache-label"
                  id="clear-build-cache"
                  type="checkbox"
                />
                <p>
                  <strong>Clear build cache</strong>
                  <br />
                  <span>
                    Clear the build cache and start with a fresh build environment. Note that this
                    will slow down the build.
                  </span>
                </p>
              </label>
              <hr />
              <div className={classes.modalActions}>
                <Button
                  appearance={'secondary'}
                  label={'Cancel'}
                  onClick={() => handleModalClose('redeploy-modal')}
                />
                <Submit appearance={'primary'} label={'Force rebuild'} />
              </div>
            </form>
          ) : (
            // Restart
            <form
              className={classes.modalContent}
              id="restart-form"
              onSubmit={(e) => {
                e.preventDefault()
                triggerDeployment('restart', {})
              }}
            >
              <p>Restarting your app will:</p>
              <ul>
                <li>Help fix an app that is stuck in a connection loop or a deadlock</li>
                <li>Not fetch any updates from your source repository</li>
                <li>Not result in any down time</li>
              </ul>
              <hr />
              <div className={classes.modalActions}>
                <Button
                  appearance={'secondary'}
                  label={'Cancel'}
                  onClick={() => handleModalClose('redeploy-modal')}
                />
                <Submit appearance={'primary'} label={'Restart'} />
              </div>
            </form>
          )}
        </ModalWindow>
      </Gutter>

      {deployments?.length > 0 && (
        <DeploymentLogs
          deployment={latestDeployment}
          environmentSlug={environmentSlug}
          key={latestDeployment.id}
        />
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
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || ''
    )
  }

  return (
    <>
      <Indicator spinner={spinner} status={status} />
      <p>{titleCase(deployment?.deploymentStatus)}</p>
    </>
  )
}
