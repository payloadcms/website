import React from 'react'

import classes from './index.module.scss'

type MessageChunk = {
  appearance: 'style' | 'text'
  text: string
}
export type LogLine = {
  lineType?: 'default' | 'error' | 'info' | 'success' | 'warning'
  messageChunks: MessageChunk[]
  service: string
  timestamp: string
}

const LogLine = ({ logLine }: { logLine: LogLine }) => {
  const { lineType, messageChunks, timestamp } = logLine || {}

  return (
    <tr className={[classes.logLine, classes[`lineType--${lineType}`]].join(' ')}>
      {timestamp && <td className={classes.logTimestamp}>{`[${timestamp.split('.')[0]}]`}</td>}
      {messageChunks.length > 0 && (
        <td>
          {messageChunks.map((chunk, i) => (
            <span
              className={[classes.logText, classes[`logTextAppearance--${chunk.appearance}`]].join(
                ' ',
              )}
              key={i}
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
  const scrollContainer = React.useRef<HTMLDivElement>(null)
  const scrollContent = React.useRef<HTMLTableSectionElement>(null)
  const pinnedScroll = React.useRef(true)

  const scrollToBottom = React.useCallback(() => {
    if (!scrollContainer.current || !pinnedScroll.current) {
      return
    }
    scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight
  }, [])

  React.useEffect(() => {
    if (!scrollContainer.current || !scrollContent.current) {
      return
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      const containerHeightChanged = mutationsList.some((mutation) => {
        return mutation.type === 'childList' && mutation.target === scrollContent.current
      })

      if (containerHeightChanged) {
        scrollToBottom()
      }
    })
    observer.observe(scrollContent.current, { childList: true, subtree: true })
    scrollToBottom()
  }, [scrollToBottom])

  React.useEffect(() => {
    if (!scrollContainer.current) {
      return
    }

    const onScroll = (e) => {
      const scrollBottom = e.target.scrollTop + e.target.clientHeight
      const scrollHeight = Math.ceil(e.target.scrollHeight - 1)

      if (scrollBottom < scrollHeight) {
        pinnedScroll.current = false
      } else if (scrollBottom >= scrollHeight) {
        pinnedScroll.current = true
      }
    }

    scrollContainer.current.addEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={classes.console} ref={scrollContainer}>
      <div className={classes.logLines}>
        <table>
          <tbody ref={scrollContent}>
            {logs.map((logLine, index) => {
              if (logLine) {
                return <LogLine key={index} logLine={logLine} />
              }

              return null
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const microTimestampPattern = /\x1B\[[0-9;]*[a-z]/gi
export function styleLogLine(logLine: string): LogLine {
  const [service, timestamp, ...rest] = logLine.split(' ')
  let message = rest.join(' ').trim().replace(microTimestampPattern, '')
  const lowerCaseMessage = message.toLowerCase()

  let lineType: LogLine['lineType'] = 'default'

  const keyword = '(payload):'
  const payloadLogIndex = message.indexOf(keyword)

  if (payloadLogIndex > -1) {
    message = message.substring(payloadLogIndex, message.length)
    lineType = 'info'
  }

  if (lowerCaseMessage.startsWith('│  ✔') || lowerCaseMessage.trim().startsWith('✔')) {
    lineType = 'success'
  } else if (
    lowerCaseMessage.startsWith('│  ✘') ||
    lowerCaseMessage.trim().startsWith('✘') ||
    lowerCaseMessage.startsWith('error') ||
    lowerCaseMessage.startsWith('│ error') ||
    lowerCaseMessage.indexOf('error:') > -1
  ) {
    lineType = 'error'
  } else if (
    message.startsWith('│ Done') ||
    message.trim().startsWith('›') ||
    message.trim().startsWith('$') ||
    message.startsWith('│ $')
  ) {
    lineType = 'info'
  } else if (message.startsWith('│ warning') || message.startsWith('warning')) {
    lineType = 'warning'
  }

  let messageChunks: MessageChunk[] = []
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
    ] as MessageChunk[]
  } else {
    messageChunks = [
      {
        appearance: message.startsWith('╰') || message.startsWith('╭') ? 'style' : 'text',
        text: message,
      },
    ]
  }

  return {
    lineType,
    messageChunks,
    service,
    timestamp,
  }
}

export function styleLogs(logData: string): LogLine[] {
  const logLines: string[] = logData.split('\n')
  const styledLogs = logLines?.map((line) => styleLogLine(line))

  return styledLogs
}
