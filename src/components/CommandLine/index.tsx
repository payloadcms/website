'use client'

import { CheckIcon, CopyIcon } from '@payloadcms/ui'
import React from 'react'

import classes from './index.module.scss'

export const CommandLine = ({ command }: { command: string }) => {
  const [copied, setCopied] = React.useState(false)
  const CopyToClipboard = async (command: string) => {
    await navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    })
  }

  return (
    <button
      aria-label={`Copy command: ${command}`}
      aria-live="polite"
      className={[classes.commandLine, copied && classes.copied].filter(Boolean).join(' ')}
      onClick={() => CopyToClipboard(command)}
      type="button"
    >
      <span aria-hidden="true" className={classes.commandText}>
        {copied ? `$  Copied to clipboard` : `$  ${command}`}
      </span>
      <div className={classes.icon}>
        {copied ? <CheckIcon aria-label="Copied" /> : <CopyIcon aria-label="Copy to clipboard" />}
      </div>
    </button>
  )
}
