'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'

import { Heading } from '@components/Heading'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { SimpleLogs } from '@root/app/_components/SimpleLogs'
import { useWebSocket } from '@root/utilities/use-websocket'

type Log = {
  service: string
  timestamp: string
  message: string
}

export default () => {
  const { project } = useRouteData()
  const [runtimeLogs, setRuntimeLogs] = React.useState<Log[]>([])
  useWebSocket({
    url: `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}/logs`.replace(
      'http',
      'ws',
    ),
    onMessage: event => {
      const message = event?.data
      try {
        const parsedMessage = JSON.parse(message)
        if (parsedMessage?.data) {
          const [service, timestamp, ...rest] = parsedMessage.data.split(' ')
          setRuntimeLogs(messages => [
            ...messages,
            {
              service,
              timestamp,
              message: rest.join(' ').trim(),
            },
          ])
        }
      } catch (e) {
        // fail silently
      }
    },
    onClose: () => {
      setRuntimeLogs([])
    },
  })

  return (
    <div>
      <Heading element="h5" marginTop={false}>
        Project Runtime logs
      </Heading>

      <ExtendedBackground pixels upperChildren={<SimpleLogs logs={runtimeLogs} />} />
    </div>
  )
}
