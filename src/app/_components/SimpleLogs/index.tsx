import React from 'react'

import classes from './index.module.scss'

type Logs = {
  logs: {
    service: string
    timestamp: string
    message: string
  }[]
}
export const SimpleLogs: React.FC<Logs> = ({ logs }) => {
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
