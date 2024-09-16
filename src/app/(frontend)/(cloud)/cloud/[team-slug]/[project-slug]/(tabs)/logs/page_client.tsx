'use client'

import * as React from 'react'

import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { LogLine, SimpleLogs, styleLogLine } from '@components/SimpleLogs/index.js'
import { Project, Team } from '@root/payload-cloud-types.js'
import { useWebSocket } from '@root/utilities/use-websocket.js'

export const ProjectLogsPage: React.FC<{
  project: Project
  team: Team
}> = ({ project }) => {
  const [runtimeLogs, setRuntimeLogs] = React.useState<LogLine[]>([])
  const previousLogs = React.useRef<LogLine[]>([])

  const hasSuccessfullyDeployed = project?.infraStatus === 'done'

  const onMessage = React.useCallback(event => {
    const message = event?.data
    try {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage?.data) {
        const styledLogLine = styleLogLine(parsedMessage.data)
        setRuntimeLogs(logs => {
          const newLogs = [...logs, styledLogLine]
          previousLogs.current =
            previousLogs.current?.length > newLogs.length ? previousLogs.current : newLogs
          return newLogs
        })
      }
    } catch (e) {
      // fail silently
    }
  }, [])

  useWebSocket({
    url: hasSuccessfullyDeployed
      ? `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/logs`.replace(
          'http',
          'ws',
        )
      : '',
    onOpen: () => setRuntimeLogs([]),
    onMessage,
    retryOnClose: true,
  })

  const logsToShow =
    previousLogs.current.length > runtimeLogs.length ? previousLogs.current : runtimeLogs

  return (
    <Gutter>
      <Heading element="h4" marginTop={false}>
        Runtime logs
        {!hasSuccessfullyDeployed && ' will be available after a successful deploy - hang tight!'}
      </Heading>

      {hasSuccessfullyDeployed && <SimpleLogs logs={logsToShow} />}
    </Gutter>
  )
}
