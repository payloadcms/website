'use client'
import { Tooltip } from '@components/Tooltip/index'
import { CopyIcon } from '@root/icons/CopyIcon/index'
import React, { useCallback, useRef, useState } from 'react'

import classes from './index.module.scss'

type CopyToClipboardProps = {
  className?: string
  hoverText?: string
  value: (() => Promise<null | string>) | null | string
}
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  className,
  hoverText,
  value,
}) => {
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const ref = useRef<any>(null)

  const copy = useCallback(async () => {
    if (ref && ref.current && value) {
      const copyValue = typeof value === 'string' ? value : await value()
      if (!copyValue) {
        return
      }

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
      className={className}
      isVisible={showTooltip || copied}
      onClick={copy}
      setIsVisible={setShowTooltip}
      text={copied ? 'Copied!' : hoverText || 'Copy'}
    >
      <CopyIcon size="large" />
      <textarea className={classes.copyTextarea} readOnly ref={ref} tabIndex={-1} />
    </Tooltip>
  )
}
