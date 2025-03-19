'use client'

import type { LogLine } from '@components/SimpleLogs/index'
import type { Project, Team } from '@root/payload-cloud-types'

import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { SimpleLogs, styleLogLine } from '@components/SimpleLogs/index'
import { useWebSocket } from '@root/utilities/use-websocket'
import * as React from 'react'

export const ProjectLogsPage: React.FC<{
  environmentSlug: string
  project: Project
  team: Team
}> = ({ environmentSlug, project }) => {
  const [runtimeLogs, setRuntimeLogs] = React.useState<LogLine[]>([])
  const previousLogs = React.useRef<LogLine[]>([])

  const hasSuccessfullyDeployed = project?.infraStatus === 'done'

  const onMessage = React.useCallback((event) => {
    const message = event?.data
    try {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage?.data) {
        const styledLogLine = styleLogLine(parsedMessage.data)
        setRuntimeLogs((logs) => {
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
    onMessage,
    onOpen: () => setRuntimeLogs([]),
    retryOnClose: true,
    url: hasSuccessfullyDeployed
      ? `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/logs${
          environmentSlug ? `?env=${environmentSlug}` : ''
        }`.replace('http', 'ws')
      : '',
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
