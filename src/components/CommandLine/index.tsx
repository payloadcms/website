'use client'

import { Button } from '@components/Button'
import { CheckIcon } from '@icons/CheckIcon'
import { CopyIcon } from '@icons/CopyIcon'
import React from 'react'

import classes from './index.module.scss'

export const CommandLine = ({
  command,
  inLinkGroup,
  lexical,
}: {
  command: string
  inLinkGroup?: boolean
  lexical?: boolean
}) => {
  const [copied, setCopied] = React.useState(false)
  const CopyToClipboard = async (command: string) => {
    await navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    })
  }

  return lexical ? (
    <div className={classes.lexicalCommandLineWrap}>
      <span className={classes.lexicalCommandLine}>
        <span className={classes.commandText}>{command}</span>
        <button
          className={classes.copyButton}
          onClick={() => CopyToClipboard(command)}
          type="button"
        >
          {copied ? <CheckIcon aria-label="Copied" /> : <CopyIcon aria-label="Copy to clipboard" />}
        </button>
      </span>
    </div>
  ) : (
    <Button
      aria-label={`Copy command: ${command}`}
      aria-live="polite"
      arrowClassName={classes.icon}
      className={[classes.commandLineButton].filter(Boolean).join(' ')}
      hideHorizontalBorders
      hideVerticalBorders={inLinkGroup}
      icon="copy"
      iconSize="medium"
      label={copied ? 'Copied!' : command}
      labelClassName={classes.commandText}
      onClick={() => CopyToClipboard(command)}
    >
      <span aria-hidden="true" className={classes.commandText}>
        {copied ? `$  Copied to clipboard` : `$  ${command}`}
      </span>
      <div className={classes.icon}>
        {copied ? <CheckIcon aria-label="Copied" /> : <CopyIcon aria-label="Copy to clipboard" />}
      </div>
    </Button>
  )
}
