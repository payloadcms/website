import * as React from 'react'
import { Accordion } from '@cloud/_components/Accordion'
import { Collapsible } from '@faceless-ui/collapsibles'

import { formatLogData, Log, SimpleLogs } from '@root/app/_components/SimpleLogs'
import { Deployment } from '@root/payload-cloud-types'
import { useWebSocket } from '@root/utilities/use-websocket'

import classes from './index.module.scss'

const buildLogStates = [
  'BUILDING',
  'PENDING_DEPLOY',
  'DEPLOYING',
  'ACTIVE',
  'SUPERSEDED',
  'ERROR',
  'CANCELLED',
]

const deployLogStates = ['DEPLOYING', 'ACTIVE', 'SUPERSEDED', 'ERROR', 'CANCELLED']

type Props = {
  deployment: Deployment
}
export const DeploymentLogs: React.FC<Props> = ({ deployment }) => {
  const [buildLogs, setBuildLogs] = React.useState<Log[]>()
  const [deployLogs, setDeployLogs] = React.useState<Log[]>()

  const onLogMessage = React.useCallback((event: MessageEvent, type: 'build' | 'deploy') => {
    const message = event?.data

    try {
      const parsedMessage = JSON.parse(message)
      const incomingLogData = parsedMessage?.data

      if (incomingLogData) {
        const formattedLogs = formatLogData(incomingLogData)

        if (parsedMessage?.logType === 'historic') {
          // historic logs - replace
          switch (type) {
            case 'build':
              setBuildLogs(formattedLogs)
              break
            case 'deploy':
              setDeployLogs(formattedLogs)
              break
          }
        } else {
          // live log - append
          switch (type) {
            case 'build':
              setBuildLogs(existingLogs => [...(existingLogs || []), ...formattedLogs])
              break
            case 'deploy':
              setDeployLogs(existingLogs => [...(existingLogs || []), ...formattedLogs])
              break
          }
        }
      }
    } catch (e) {
      // fail silently
    }
  }, [])

  const hasBuildLog = deployment?.deploymentStatus
    ? buildLogStates.includes(deployment.deploymentStatus)
    : false
  useWebSocket({
    url: hasBuildLog
      ? `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deployments/${deployment.id}/logs?logType=BUILD`.replace(
          'http',
          'ws',
        )
      : '',
    onMessage: e => onLogMessage(e, 'build'),
  })

  const hasDeployLog = deployment?.deploymentStatus
    ? deployLogStates.includes(deployment.deploymentStatus)
    : false
  useWebSocket({
    url: hasDeployLog
      ? `${(process.env.NEXT_PUBLIC_CLOUD_CMS_URL || '').replace('http', 'ws')}/api/deployments/${
          deployment.id
        }/logs?logType=DEPLOY`
      : '',
    onMessage: e => onLogMessage(e, 'deploy'),
  })

  return (
    <div className={classes.deploymentLogs}>
      {buildLogs && (
        <Collapsible openOnInit={!hasDeployLog}>
          <Accordion label="Build" toggleIcon="chevron">
            <SimpleLogs logs={buildLogs} />
          </Accordion>
        </Collapsible>
      )}
      {deployLogs && (
        <Collapsible openOnInit>
          <Accordion label="Deployment" toggleIcon="chevron">
            <SimpleLogs logs={deployLogs} />
          </Accordion>
        </Collapsible>
      )}
    </div>
  )
}
