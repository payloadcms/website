import React from 'react'

import classes from './index.module.scss'

export type Log = {
  service: string
  timestamp: string
  message: string
}
type Props = {
  logs: Log[]
}
export const SimpleLogs: React.FC<Props> = ({ logs }) => {
  return (
    <div className={classes.console}>
      <div className={classes.logLines}>
        <table>
          <tbody>
            {logs.map((message, index) => {
              if (message) {
                let timestamp = message?.timestamp
                try {
                  const date = new Date(`${timestamp}`)
                  timestamp = date.toISOString().slice(0, -5)
                } catch (error) {
                  // ignore
                }
                return (
                  <tr key={index} className={classes.logLine}>
                    {timestamp && <td className={classes.lineInfo}>[{timestamp}]</td>}
                    {message?.message && <td className={classes.lineMessage}>{message.message}</td>}
                  </tr>
                )
              }

              return null
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function formatLogData(logData: string): Log[] {
  const microTimestampPattern = /\x1B\[[0-9;]*[a-zA-Z]/g
  const logLines: string[] = logData.split('\n')
  const formattedLogs = logLines?.map(line => {
    const [service, timestamp, ...rest] = line.split(' ')

    return {
      service,
      timestamp,
      message: rest.join(' ').trim().replace(microTimestampPattern, ''),
    }
  })

  return formattedLogs
}
