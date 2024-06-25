'use client'
import React, { useState, useRef, useCallback } from 'react'

import { Tooltip } from '@components/Tooltip/index.js'
import { CopyIcon } from '@root/icons/CopyIcon/index.js'

import classes from './index.module.scss'

type CopyToClipboardProps = {
  value: (() => Promise<string | null>) | string | null
  className?: string
  hoverText?: string
}
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  className,
  hoverText,
}) => {
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const ref = useRef<any>(null)

  const copy = useCallback(async () => {
    if (ref && ref.current && value) {
      const copyValue = typeof value === 'string' ? value : await value()
      if (!copyValue) return

      ref.current.value = copyValue
      ref.current.select()
      ref.current.setSelectionRange(0, copyValue.length + 1)
      document.execCommand('copy')

      setCopied(true)
    }
  }, [value])

  React.useEffect(() => {
    if (copied && !showTooltip) {
      setTimeout(() => {
        setCopied(false)
      }, 500)
    }
  }, [copied, showTooltip])

  return (
    <Tooltip
      onClick={copy}
      text={copied ? 'Copied!' : hoverText || 'Copy'}
      setIsVisible={setShowTooltip}
      isVisible={showTooltip || copied}
      className={className}
    >
      <CopyIcon size="large" />
      <textarea className={classes.copyTextarea} tabIndex={-1} readOnly ref={ref} />
    </Tooltip>
  )
}
