import * as React from 'react'
import { Tab, Tabs } from '@cloud/_components/Tabs/index.js'

import { Gutter } from '@components/Gutter/index.js'
import { Indicator } from '@components/Indicator/index.js'
import { LogLine, SimpleLogs, styleLogs } from '@components/SimpleLogs/index.js'
import { Deployment } from '@root/payload-cloud-types.js'
import { useWebSocket } from '@root/utilities/use-websocket.js'

import classes from './index.module.scss'

const defaultBuildLogs: LogLine[] = [
  {
    messageChunks: [
      {
        appearance: 'text',
        text: 'Waiting for build logs...',
      },
    ],
    timestamp: new Date().toISOString(),
    service: 'Info',
  },
]

const defaultDeployLogs: LogLine[] = [
  {
    messageChunks: [
      {
        appearance: 'text',
        text: 'Waiting for deploy logs...',
      },
    ],
    timestamp: new Date().toISOString(),
    service: 'Info',
  },
]

const LiveLogs = ({
  active,
  deploymentID,
  type,
}: {
  active: boolean
  deploymentID: string
  type: 'BUILD' | 'DEPLOY'
}) => {
  const [logs, setLogs] = React.useState<LogLine[] | undefined>(
    type === 'BUILD' ? defaultBuildLogs : defaultDeployLogs,
  )
  const [wsStatus, setWsStatus] = React.useState<'CONNECTING' | 'OPEN' | 'CLOSED'>('CLOSED')

  const onLogMessage = React.useCallback((event: MessageEvent) => {
    const message = event?.data

    try {
      const { data, logType } = JSON.parse(message) || {}
      if (data) {
        const styledLogs = styleLogs(data)
        if (logType === 'historic') {
          // historic logs - replace
          setLogs(styledLogs)
        } else {
          // live log - append
          setLogs(existingLogs => [...(existingLogs || []), ...styledLogs])
        }
      }
    } catch (e) {
      // fail silently
    }
  }, [])

  useWebSocket({
    url:
      wsStatus === 'CONNECTING'
        ? `${`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}`.replace(
            'http',
            'ws',
          )}/api/deployments/${deploymentID}/logs?logType=${type}`
        : '',
    onMessage: e => onLogMessage(e),
    onClose: () => {
      setWsStatus('CLOSED')
    },
    onError: () => {
      setWsStatus('CLOSED')
    },
  })

  React.useEffect(() => {
    if (active && wsStatus === 'CLOSED') {
      setWsStatus('CONNECTING')
    }
  }, [active, wsStatus])

  if (!logs || !active) return null

  return <SimpleLogs logs={logs} />
}

type Props = {
  deployment?: Deployment
}
export const DeploymentLogs: React.FC<Props> = ({ deployment }) => {
  const [activeTab, setActiveTab] = React.useState<'build' | 'deploy'>('build')
  const prevBuildStep = React.useRef('')

  const enableDeployTab = deployment && deployment.buildStepStatus === 'SUCCESS'

  React.useEffect(() => {
    const buildStepStatus = deployment?.buildStepStatus
    if (buildStepStatus) {
      if (buildStepStatus === 'SUCCESS' && prevBuildStep.current === 'RUNNING') {
        setActiveTab('deploy')
      }

      prevBuildStep.current = buildStepStatus
    }
  }, [deployment?.buildStepStatus])

  return (
    <div className={classes.deploymentLogs}>
      <Gutter>
        <Tabs
          className={classes.logTabs}
          tabs={
            [
              {
                label: (
                  <div className={classes.tabLabel}>
                    <Indicator
                      className={[activeTab !== 'build' ? classes.inactiveIndicator : '']
                        .filter(Boolean)
                        .join(' ')}
                      status={deployment?.buildStepStatus}
                      spinner={deployment?.buildStepStatus === 'RUNNING'}
                    />
                    Build Logs
                  </div>
                ),
                disabled: !deployment?.id,
                isActive: activeTab === 'build',
                onClick: () => {
                  setActiveTab('build')
                },
              },
              {
                label: (
                  <div className={classes.tabLabel}>
                    <Indicator
                      className={[activeTab !== 'deploy' ? classes.inactiveIndicator : '']
                        .filter(Boolean)
                        .join(' ')}
                      status={deployment?.deployStepStatus}
                      spinner={deployment?.deployStepStatus === 'RUNNING'}
                    />
                    Deploy Logs
                  </div>
                ),
                disabled: !deployment?.id,
                isActive: activeTab === 'deploy',
                onClick: () => {
                  if (enableDeployTab) {
                    setActiveTab('deploy')
                  }
                },
              },
            ].filter(Boolean) as Tab[]
          }
        />
      </Gutter>

      {deployment?.id && (
        <Gutter key={deployment.id}>
          <LiveLogs type="BUILD" active={activeTab === 'build'} deploymentID={deployment.id} />
          <LiveLogs type="DEPLOY" active={activeTab === 'deploy'} deploymentID={deployment.id} />
        </Gutter>
      )}
    </div>
  )
}
