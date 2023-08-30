'use client'

import * as React from 'react'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { SimpleLogs } from '@root/app/_components/SimpleLogs'
import { Project, Team } from '@root/payload-cloud-types'
import { useWebSocket } from '@root/utilities/use-websocket'

type Log = {
  service: string
  timestamp: string
  message: string
}

export const ProjectLogsPage: React.FC<{
  project: Project
  team: Team
}> = ({ project }) => {
  const [runtimeLogs, setRuntimeLogs] = React.useState<Log[]>([])
  const previousLogs = React.useRef<Log[]>([])

  const onMessage = React.useCallback(event => {
    const message = event?.data
    try {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage?.data) {
        const [service, timestamp, ...rest] = parsedMessage.data.split(' ')
        setRuntimeLogs(messages => {
          const newLogs = [
            ...messages,
            {
              service,
              timestamp,
              message: rest.join(' ').trim(),
            },
          ]
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
    url: `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}/logs`.replace(
      'http',
      'ws',
    ),
    onOpen: () => setRuntimeLogs([]),
    onMessage,
    retryOnClose: true,
  })

  const logsToShow =
    previousLogs.current.length > runtimeLogs.length ? previousLogs.current : runtimeLogs

  return (
    <Gutter>
      <Heading element="h5" marginTop={false}>
        Project Runtime logs
      </Heading>

      <ExtendedBackground pixels upperChildren={<SimpleLogs logs={logsToShow} />} />
    </Gutter>
  )
}
