import * as React from 'react'
import { Tab, Tabs } from '@cloud/_components/Tabs'

import { Gutter } from '@components/Gutter'
import { Indicator } from '@root/app/_components/Indicator'
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

const defaultBuildLogs = (): Log[] => {
  return [
    {
      message: 'Waiting for build logs...',
      timestamp: new Date().toISOString(),
      service: 'Info',
    },
  ]
}

const defaultDeployLogs = (): Log[] => {
  return [
    {
      message: 'Waiting for deploy logs...',
      timestamp: new Date().toISOString(),
      service: 'Info',
    },
  ]
}

type Props = {
  deployment: Deployment
  setBuilt?: React.Dispatch<React.SetStateAction<boolean>>
  setDeployed?: React.Dispatch<React.SetStateAction<boolean>>
}
export const DeploymentLogs: React.FC<Props> = ({ deployment, setBuilt, setDeployed }) => {
  const [buildLogs, setBuildLogs] = React.useState<Log[] | undefined>(defaultBuildLogs())
  const [deployLogs, setDeployLogs] = React.useState<Log[] | undefined>(defaultDeployLogs())
  const [activeTab, setActiveTab] = React.useState<'build' | 'deploy'>('build')
  const lastDeploymentID = React.useRef<string>()

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

  React.useEffect(() => {
    if (hasDeployLog) {
      setBuilt?.(true)

      if (
        deployment.deploymentStatus === 'ACTIVE' ||
        deployment.deploymentStatus === 'SUPERSEDED'
      ) {
        setDeployed?.(true)
      } else {
        setDeployed?.(false)
      }
    } else {
      setBuilt?.(false)
      setDeployed?.(false)
    }

    // automatically switch to deploy logs if both are available
    if (hasBuildLog && hasDeployLog) {
      setActiveTab('deploy')
    }

    return () => {
      setActiveTab('build')
    }
  }, [deployment.deploymentStatus, setBuilt, setDeployed, hasBuildLog, hasDeployLog])

  React.useEffect(() => {
    if (!lastDeploymentID.current || lastDeploymentID.current !== deployment.id) {
      setBuildLogs(defaultBuildLogs())
      setDeployLogs(defaultDeployLogs())
      lastDeploymentID.current = deployment.id
    }
  }, [deployment.id])

  return (
    <div className={classes.deploymentLogs}>
      <Tabs
        className={classes.logTabs}
        tabs={
          [
            hasBuildLog &&
              buildLogs && {
                label: (
                  <div className={classes.tabLabel}>
                    <Indicator
                      className={[activeTab !== 'build' ? classes.inactiveIndicator : '']
                        .filter(Boolean)
                        .join(' ')}
                      status={
                        hasDeployLog || deployment.deploymentStatus !== 'ERROR'
                          ? 'success'
                          : 'error'
                      }
                      spinner={deployment.deploymentStatus === 'BUILDING'}
                    />
                    Build Logs
                  </div>
                ),
                isActive: activeTab === 'build',
                onClick: () => {
                  setActiveTab('build')
                },
              },
            hasDeployLog &&
              deployLogs && {
                label: (
                  <div className={classes.tabLabel}>
                    <Indicator
                      className={[activeTab !== 'deploy' ? classes.inactiveIndicator : '']
                        .filter(Boolean)
                        .join(' ')}
                      status={deployment.deploymentStatus !== 'ERROR' ? 'success' : 'error'}
                      spinner={deployment.deploymentStatus === 'DEPLOYING'}
                    />
                    Deploy Logs
                  </div>
                ),
                isActive: activeTab === 'deploy',
                onClick: () => {
                  setActiveTab('deploy')
                },
              },
          ].filter(Boolean) as Tab[]
        }
      />

      {(hasBuildLog || hasDeployLog) && (
        <Gutter rightGutter={false}>
          {buildLogs && activeTab === 'build' && <SimpleLogs logs={buildLogs} />}
          {deployLogs && activeTab === 'deploy' && <SimpleLogs logs={deployLogs} />}
        </Gutter>
      )}
    </div>
  )
}
