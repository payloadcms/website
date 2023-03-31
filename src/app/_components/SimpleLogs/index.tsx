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
        {logs.map((message, index) => {
          if (message) {
            return (
              <div key={index} className={classes.logLine}>
                <p className={classes.lineInfo}>[{message.service}]</p>
                <p className={classes.lineInfo}>[{message.timestamp}]</p>
                <p className={classes.lineMessage}>{message.message}</p>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
