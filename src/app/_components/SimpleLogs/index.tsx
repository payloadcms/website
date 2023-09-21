import React from 'react'

import classes from './index.module.scss'

export type LogLine = {
  service: string
  timestamp: string
  message: string
}

const LogLine = ({ logLine }: { logLine: LogLine }) => {
  const { service, timestamp, message } = logLine || {}
  let lineType = 'default'
  let messageChunks = [
    {
      appearance: 'text',
      text: message,
    },
  ]

  if (message.startsWith('╰') || message.startsWith('╭')) {
    messageChunks[0].appearance = 'style'
  }

  if (message.startsWith('│')) {
    const text = message.substring(1)
    messageChunks = [
      {
        appearance: 'style',
        text: '│',
      },
      {
        appearance: 'text',
        text,
      },
    ]
  }

  if (message.startsWith('│  ✔')) {
    lineType = 'success'
  } else if (message.startsWith('│  ✖') || message.startsWith('error')) {
    lineType = 'error'
  } else if (message.startsWith(' ›') || message.startsWith('│ Done')) {
    lineType = 'info'
  } else if (message.startsWith('│ warning') || message.startsWith('warning')) {
    lineType = 'warning'
  }

  return (
    <tr className={[classes.logLine, classes[`lineType--${lineType}`]].join(' ')}>
      {timestamp && <td className={classes.logTimestamp}>[{timestamp}]</td>}
      {messageChunks.length > 0 && (
        <td>
          {messageChunks.map((chunk, i) => (
            <span
              key={i}
              className={[classes.logText, classes[`logTextAppearance--${chunk.appearance}`]].join(
                ' ',
              )}
            >
              {chunk.text}
            </span>
          ))}
        </td>
      )}
    </tr>
  )
}

type Props = {
  logs: LogLine[]
}
export const SimpleLogs: React.FC<Props> = ({ logs }) => {
  return (
    <div className={classes.console}>
      <div className={classes.logLines}>
        <table>
          <tbody>
            {logs.map((logLine, index) => {
              if (logLine) {
                let timestamp = logLine?.timestamp
                try {
                  const date = new Date(`${timestamp}`)
                  timestamp = date.toISOString().slice(0, -5)
                } catch (error) {
                  // ignore
                }

                return (
                  <LogLine key={index} logLine={logLine} />
                  // <tr key={index} className={classes.logLine}>
                  //   {timestamp && <td className={classes.lineInfo}>[{timestamp}]</td>}
                  //   {message && (
                  //     <td className={messageClasses.filter(Boolean).join(' ')}>{message}</td>
                  //   )}
                  // </tr>
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

export function formatLogData(logData: string): LogLine[] {
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
