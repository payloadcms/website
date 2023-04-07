'use client'

import * as React from 'react'
import { toast } from 'react-toastify'
import { useRouteData } from '@cloud/context'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { Indicator } from '@root/app/_components/Indicator'
import { formatLogData, SimpleLogs } from '@root/app/_components/SimpleLogs'
import { BranchIcon } from '@root/graphics/BranchIcon'
import { CommitIcon } from '@root/graphics/CommitIcon'
import { Deployment } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'
import { qs } from '@root/utilities/qs'
import { useGetProjectDeployments } from '@root/utilities/use-cloud-api'
import { useWebSocket } from '@root/utilities/use-websocket'

import classes from './index.module.scss'

type Log = {
  service: string
  timestamp: string
  message: string
}

const finalDeploymentStages: Deployment['deploymentStatus'][] = ['ACTIVE', 'SUPERSEDED']

export const InfraOnline: React.FC = () => {
  const [interval, setInterval] = React.useState<number | undefined>(10_000)
  const [logs, setLogs] = React.useState<Log[]>([
    {
      service: 'cloud',
      timestamp: new Date().toISOString(),
      message: 'Loading logs...',
    },
  ])

  const { project } = useRouteData()
  const {
    isLoading,
    error,
    result: deployments,
    reqStatus,
    reload: reloadDeployments,
  } = useGetProjectDeployments({
    projectID: project.id,
    interval,
  })

  const [activeDeployment, setActiveDeployment] = React.useState<Deployment | null | undefined>()

  const latestDeployment = deployments?.[0]
  const latestDeploymentStatus = latestDeployment?.deploymentStatus

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

  const getOneDeploymentByStatus = React.useCallback(
    async (status: Deployment['deploymentStatus']) => {
      const query = qs.stringify({
        where: {
          and: [
            {
              project: {
                equals: project.id,
              },
            },
            {
              deploymentStatus: {
                equals: status,
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
        return json.docs[0]
      }

      return null
    },
    [project.id],
  )

  const triggerDeploy = React.useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}/deploy`, {
      method: 'POST',
      credentials: 'include',
    }).then(res => {
      if (res.status === 200) {
        setLogs([
          {
            service: 'cloud-cms',
            timestamp: new Date().toISOString(),
            message: 'Deployment triggered...',
          },
        ])
        return toast.success('New deployment triggered successfully')
      }
      if (res.status === 429) {
        return toast.error(
          'You can only manually deploy once per minute. Please wait and try again.',
        )
      }

      return toast.error('Failed to deploy')
    })
  }, [project.id, setLogs])

  React.useEffect(() => {
    const getActiveDeployment = async () => {
      if (!activeDeployment) {
        const newDeployment = await getOneDeploymentByStatus('ACTIVE')
        setActiveDeployment(newDeployment)
      }
    }

    getActiveDeployment()
  }, [getOneDeploymentByStatus, activeDeployment])

  React.useEffect(() => {
    const activeDeployment = deployments?.find(deployment => {
      return finalDeploymentStages.includes(deployment.deploymentStatus)
    })

    if (activeDeployment) {
      setActiveDeployment(activeDeployment)
    }
  }, [deployments])

  React.useEffect(() => {
    if (latestDeploymentStatus === 'BUILDING') {
      setLogs([])
    }
  }, [latestDeploymentStatus])

  React.useEffect(() => {
    if (reqStatus && reqStatus > 400) {
      setInterval(undefined)
    } else {
      setInterval(10_000)
    }
  }, [reqStatus])

  const projectDomains = [
    ...(project?.domains || []).map(domain => domain.domain),
    project.defaultDomain,
  ]

  return (
    <React.Fragment>
      <ExtendedBackground
        pixels
        upperChildren={
          <Grid>
            <Cell start={1} cols={4} colsM={8}>
              <Label>URL</Label>
              <ul>
                {projectDomains.map(domain => (
                  <li key={domain} title={domain}>
                    <a
                      className={[classes.detail, classes.domainLink].filter(Boolean).join(' ')}
                      href={`https://${domain}`}
                      target="_blank"
                    >
                      {domain}
                    </a>
                  </li>
                ))}
              </ul>
            </Cell>

            <Cell start={5} cols={3} startM={1} colsM={8}>
              <Label>Deployment Created At</Label>
              <p className={classes.detail}>
                {activeDeployment
                  ? formatDate({ date: activeDeployment.createdAt, format: 'dateAndTime' })
                  : ''}
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
                    ? ''
                    : finalDeploymentStages.includes(activeDeployment?.deploymentStatus)
                    ? 'Online'
                    : 'Offline'}
                </p>
              </div>
            </Cell>
          </Grid>
        }
        lowerChildren={
          <Grid>
            <Cell className={classes.reTriggerBackground} start={1}>
              <div>
                <Button appearance="text" onClick={triggerDeploy} label="Trigger Redeploy" />
              </div>

              {activeDeployment?.commitMessage && (
                <div className={classes.deployDetails}>
                  <div className={classes.iconAndLabel}>
                    <BranchIcon />
                    <p>{project.deploymentBranch}</p>
                  </div>
                  <div className={classes.iconAndLabel}>
                    <CommitIcon />
                    <p>{activeDeployment?.commitMessage}</p>
                  </div>
                </div>
              )}
            </Cell>
          </Grid>
        }
      />

      {deployments?.length > 0 && (
        <React.Fragment>
          <Heading element="h5" className={classes.consoleHeading}>
            Latest build logs
          </Heading>

          <ExtendedBackground upperChildren={<SimpleLogs logs={logs} />} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
