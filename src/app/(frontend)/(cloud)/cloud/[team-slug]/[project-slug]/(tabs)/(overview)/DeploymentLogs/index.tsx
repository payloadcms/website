import type { Tab } from '@cloud/_components/Tabs/index'
import type { LogLine } from '@components/SimpleLogs/index'
import type { Deployment } from '@root/payload-cloud-types'

import { Tabs } from '@cloud/_components/Tabs/index'
import { Gutter } from '@components/Gutter/index'
import { Indicator } from '@components/Indicator/index'
import { SimpleLogs, styleLogs } from '@components/SimpleLogs/index'
import { useWebSocket } from '@root/utilities/use-websocket'
import * as React from 'react'

import classes from './index.module.scss'

const defaultBuildLogs: LogLine[] = [
  {
    messageChunks: [
      {
        appearance: 'text',
        text: 'Waiting for build logs...',
      },
    ],
    service: 'Info',
    timestamp: new Date().toISOString(),
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
    service: 'Info',
    timestamp: new Date().toISOString(),
  },
]

const LiveLogs = ({
  type,
  active,
  deploymentID,
  environmentSlug,
}: {
  active: boolean
  deploymentID: string
  environmentSlug?: string
  type: 'BUILD' | 'DEPLOY'
}) => {
  const [logs, setLogs] = React.useState<LogLine[] | undefined>(
    type === 'BUILD' ? defaultBuildLogs : defaultDeployLogs,
  )
  const [wsStatus, setWsStatus] = React.useState<'CLOSED' | 'CONNECTING' | 'OPEN'>('CLOSED')

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
          setLogs((existingLogs) => [...(existingLogs || []), ...styledLogs])
        }
      }
    } catch (e) {
      // fail silently
    }
  }, [])

  useWebSocket({
    onClose: () => {
      setWsStatus('CLOSED')
    },
    onError: () => {
      setWsStatus('CLOSED')
    },
    onMessage: (e) => onLogMessage(e),
    url:
      wsStatus === 'CONNECTING'
        ? `${`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}`.replace(
            'http',
            'ws',
          )}/api/deployments/${deploymentID}/logs?logType=${type}${
            environmentSlug ? `&env=${environmentSlug}` : ''
          }`
        : '',
  })

  React.useEffect(() => {
    if (active && wsStatus === 'CLOSED') {
      setWsStatus('CONNECTING')
    }
  }, [active, wsStatus])

  if (!logs || !active) {
    return null
  }

  return <SimpleLogs logs={logs} />
}

type Props = {
  deployment?: Deployment
  environmentSlug?: string
}
export const DeploymentLogs: React.FC<Props> = ({ deployment, environmentSlug }) => {
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
                disabled: !deployment?.id,
                isActive: activeTab === 'build',
                label: (
                  <div className={classes.tabLabel}>
                    <Indicator
                      className={[activeTab !== 'build' ? classes.inactiveIndicator : '']
                        .filter(Boolean)
                        .join(' ')}
                      spinner={deployment?.buildStepStatus === 'RUNNING'}
                      status={deployment?.buildStepStatus}
                    />
                    Build Logs
                  </div>
                ),
                onClick: () => {
                  setActiveTab('build')
                },
              },
              {
                disabled: !deployment?.id,
                isActive: activeTab === 'deploy',
                label: (
                  <div className={classes.tabLabel}>
                    <Indicator
                      className={[activeTab !== 'deploy' ? classes.inactiveIndicator : '']
                        .filter(Boolean)
                        .join(' ')}
                      spinner={deployment?.deployStepStatus === 'RUNNING'}
                      status={deployment?.deployStepStatus}
                    />
                    Deploy Logs
                  </div>
                ),
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
          <LiveLogs
            active={activeTab === 'build'}
            deploymentID={deployment.id}
            environmentSlug={environmentSlug}
            type="BUILD"
          />
          <LiveLogs
            active={activeTab === 'deploy'}
            deploymentID={deployment.id}
            environmentSlug={environmentSlug}
            type="DEPLOY"
          />
        </Gutter>
      )}
    </div>
  )
}
