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
import { SimpleLogs } from '@root/app/_components/SimpleLogs'
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
  const [logsWebSocketURL, setLogsWebSocketURL] = React.useState<string>('')
  const [deploymentLogs, setDeploymentLogs] = React.useState<Log[]>([])
  const lastHistoricDeploymentID = React.useRef<string>()

  const { project } = useRouteData()
  const {
    isLoading,
    error,
    result: deployments,
  } = useGetProjectDeployments({
    projectID: project.id,
    interval: 10_000,
  })

  const [activeDeployment, setActiveDeployment] = React.useState<Deployment | null | undefined>()

  // the most recent build log - either ACTIVE or another state

  const latestDeployment = deployments?.[0]

  useWebSocket({
    url: logsWebSocketURL,
    onMessage: event => {
      const message = event?.data
      try {
        const parsedMessage = JSON.parse(message)
        if (parsedMessage?.data) {
          const [service, timestamp, ...rest] = parsedMessage.data.split(' ')
          setDeploymentLogs(current => [
            ...current,
            {
              service,
              timestamp,
              message: rest.join(' '),
            },
          ])
        }
      } catch (e) {
        // fail silently
      }
    },
    onClose: () => {
      setDeploymentLogs([])
    },
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
    const getLatestHistoricLog = async () => {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deployments/${latestDeployment.id}/logs`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const historicLogs = await req.json()
      if (Array.isArray(historicLogs)) {
        const [firstLogString] = historicLogs

        const logLines = firstLogString.split('\n')
        const newLogs = logLines.map(line => {
          const [service, timestamp, ...rest] = line.split(' ')
          const microTimestampPattern = /\x1B\[[0-9;]*[a-zA-Z]/g
          const message = rest.join(' ').trim().replace(microTimestampPattern, '')

          return {
            service,
            timestamp,
            message,
          }
        })

        setDeploymentLogs(newLogs)
      }
    }

    // if BUILDING, we will stream in live build logs
    // otherwise, we will fetch the last historic logs
    if (latestDeployment?.deploymentStatus === 'BUILDING') {
      // stream in live logs
      setLogsWebSocketURL(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deployments/${latestDeployment.id}/logs`.replace(
          'http',
          'ws',
        ),
      )
    } else if (latestDeployment?.id && lastHistoricDeploymentID.current !== latestDeployment.id) {
      getLatestHistoricLog()
      lastHistoricDeploymentID.current = latestDeployment.id
    }
  }, [getOneDeploymentByStatus, latestDeployment])

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
                <Button
                  appearance="text"
                  onClick={() => {
                    toast.success('New deployment triggered successfully')
                  }}
                  label="Trigger Redeploy"
                />
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

          <ExtendedBackground upperChildren={<SimpleLogs logs={deploymentLogs} />} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
